<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { BookOpen, Plus } from '@lucide/svelte';
	import type { SourceFilterType, Source, SortDirection } from '$lib/types/api';
	import { fetchSources, deleteSource } from '$lib/services/sources';
	import { mapApiSourceToDisplay, SORT_FIELD_MAP } from '$lib/types/api';
	import {
		SourceGrid,
		SourceList,
		SourceFilters,
		ViewToggle,
		SourceSearchBar,
		CreateSourceModal,
		DeleteSourceModal
	} from '$lib/components/sources';
	import { invalidateAll } from '$app/navigation';
	import type { SortField } from '$lib/components/sources/SourceList.svelte';

	let { data } = $props();

	// Main state
	let viewMode = $state<'grid' | 'list'>('grid');
	let sources = $state<Source[]>(data.sources);
	let currentPage = $state(data.queryParams.page);
	let hasMore = $state(data.pagination.page < data.pagination.totalPages);
	let isLoadingMore = $state(false);
	let isLoading = $state(false);
	let loadMoreError = $state<string | null>(null);

	// Get values from URL/data
	let activeFilter = $state<SourceFilterType>(data.queryParams.type);
	let sortBy = $state<SortField>(data.queryParams.sortField as SortField);
	let sortDirection = $state<SortDirection>(data.queryParams.sortDirection);

	// Search state
	let searchInput = $state('');
	let activeTagSearch = $state('');
	let isCreateModalOpen = $state(false);

	// Delete modal state
	let isDeleteModalOpen = $state(false);
	let sourceToDelete = $state<Source | null>(null);
	let isDeleting = $state(false);

	const isTagSearchMode = $derived(searchInput.startsWith('#'));

	// Build URL with parameters
	function buildUrl(params: Partial<typeof data.queryParams>) {
		const newParams = { ...data.queryParams, ...params };
		const searchParams = new URLSearchParams();

		if (newParams.type !== 'ALL') searchParams.set('type', newParams.type);
		if (newParams.sortField !== 'dateAdded') searchParams.set('sort', newParams.sortField);
		if (newParams.sortDirection !== 'desc') searchParams.set('direction', newParams.sortDirection);
		if (newParams.page > 1) searchParams.set('page', newParams.page.toString());

		const queryString = searchParams.toString();
		return queryString ? `/sources?${queryString}` : '/sources';
	}

	// Filter sources by type (already done server-side, but needed for search)
	const filteredByType = $derived(sources);

	// Filter sources by search
	const filteredSources = $derived.by(() => {
		// Tag search mode
		if (isTagSearchMode) {
			if (!activeTagSearch) return filteredByType;
			const tagQuery = activeTagSearch.slice(1).toLowerCase();
			if (!tagQuery) return filteredByType;
			return filteredByType.filter((s) => s.tags.some((t) => t.toLowerCase() === tagQuery));
		}

		// Regular search on title/author
		const q = searchInput.toLowerCase().trim();
		if (!q) return filteredByType;

		return filteredByType.filter(
			(s) => s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q)
		);
	});

	// No need for client-side sorting anymore, server handles it
	const sortedSources = $derived(filteredSources);

	// Search handlers
	function handleSearchInput(query: string) {
		searchInput = query;
		if (!query.startsWith('#')) {
			activeTagSearch = '';
		}
	}

	function handleTagSearch(query: string) {
		activeTagSearch = query;
	}

	// Load more sources (infinite scroll)
	async function loadMoreSources() {
		if (isLoadingMore || !hasMore || isLoading) return;

		isLoadingMore = true;
		loadMoreError = null;

		try {
			const nextPage = currentPage + 1;
			const apiSortField = SORT_FIELD_MAP[sortBy] || 'created_at';
			const orderBy = `${apiSortField}:${sortDirection}` as const;

			const response = await fetchSources({
				page: nextPage,
				perPage: 25,
				type: activeFilter === 'ALL' ? undefined : activeFilter,
				orderBy
			});

			sources = [...sources, ...response.content.map(mapApiSourceToDisplay)];
			currentPage = nextPage;
			hasMore = nextPage < response.pagination.totalPages;

			// Update URL without navigation
			if (browser) {
				const url = buildUrl({ page: nextPage });
				window.history.replaceState({}, '', url);
			}
		} catch (error) {
			console.error('Failed to load more sources:', error);
			loadMoreError = 'Failed to load more sources. Please try again.';
		} finally {
			isLoadingMore = false;
		}
	}

	// Retry loading more sources
	function retryLoadMore() {
		loadMoreError = null;
		loadMoreSources();
	}

	// Handle filter/sort changes
	async function handleFilterChange(filter: SourceFilterType) {
		isLoading = true;
		await goto(buildUrl({ type: filter, page: 1 }));
	}

	async function handleSort(field: SortField) {
		const newDirection: SortDirection =
			sortBy === field && sortDirection === 'desc' ? 'asc' : 'desc';
		isLoading = true;
		await goto(
			buildUrl({
				sortField: field,
				sortDirection: newDirection,
				page: 1
			})
		);
	}

	// Navigation handlers
	function handleView(id: string) {
		goto(`/sources/${id}`);
	}

	function handleDelete(id: string) {
		const source = sources.find((s) => s.id === id);
		if (source) {
			sourceToDelete = source;
			isDeleteModalOpen = true;
		}
	}

	async function confirmDelete() {
		if (!sourceToDelete) return;

		isDeleting = true;
		try {
			await deleteSource(sourceToDelete.id);
			isDeleteModalOpen = false;
			sourceToDelete = null;
			await invalidateAll();
		} catch (error) {
			console.error('Failed to delete source:', error);
		} finally {
			isDeleting = false;
		}
	}

	function cancelDelete() {
		isDeleteModalOpen = false;
		sourceToDelete = null;
	}

	async function handleSourceCreated() {
		await invalidateAll();
	}

	// React to data changes (after navigation)
	$effect(() => {
		if (data.sources) {
			sources = data.sources;
			currentPage = data.queryParams.page;
			activeFilter = data.queryParams.type;
			sortBy = data.queryParams.sortField as SortField;
			sortDirection = data.queryParams.sortDirection;
			hasMore = data.pagination.page < data.pagination.totalPages;
			isLoading = false;
		}
	});
</script>

<!-- Global loader during filter/sort changes -->
{#if isLoading}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-slate-800 rounded-lg p-6">
			<div
				class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
			></div>
			<p class="mt-3 text-sm text-slate-300">Loading sources...</p>
		</div>
	</div>
{/if}

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Sources</h1>
			<p class="mt-1 text-sm text-slate-400">
				{data.pagination.totalResults} sources in your library
			</p>
		</div>

		<button
			type="button"
			onclick={() => (isCreateModalOpen = true)}
			class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
		>
			<Plus class="h-4 w-4" />
			Add Source
		</button>
	</div>

	<!-- Error Banner -->
	{#if data.error}
		<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
			{data.error}
		</div>
	{/if}

	<!-- Search Bar -->
	<SourceSearchBar value={searchInput} onInput={handleSearchInput} onSearch={handleTagSearch} />

	<!-- Filters and View Toggle Row -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<SourceFilters {activeFilter} onFilterChange={handleFilterChange} />
		<ViewToggle {viewMode} onViewChange={(m) => (viewMode = m)} />
	</div>

	<!-- Sources Display -->
	{#if sortedSources.length === 0 && !isLoadingMore}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<div class="rounded-full bg-slate-700/50 p-4">
				<BookOpen class="h-8 w-8 text-slate-400" />
			</div>
			<p class="mt-4 text-sm font-medium text-slate-300">No sources found</p>
			<p class="mt-1 text-xs text-slate-500">
				{#if activeTagSearch}
					No results for "{activeTagSearch}"
				{:else if searchInput.trim() && !isTagSearchMode}
					No results for "{searchInput}"
				{:else if activeFilter === 'ALL'}
					Add your first source to get started
				{:else}
					No {activeFilter.toLowerCase()}s in your library
				{/if}
			</p>
		</div>
	{:else if viewMode === 'grid'}
		<SourceGrid
			sources={sortedSources}
			onView={handleView}
			onDelete={handleDelete}
			onLoadMore={loadMoreSources}
			{isLoadingMore}
			{hasMore}
		/>
	{:else}
		<SourceList
			sources={sortedSources}
			{sortBy}
			{sortDirection}
			onSort={handleSort}
			onView={handleView}
			onDelete={handleDelete}
			onLoadMore={loadMoreSources}
			{isLoadingMore}
			{hasMore}
		/>
	{/if}

	<!-- Load More Error -->
	{#if loadMoreError}
		<div class="flex flex-col items-center gap-2 py-8">
			<p class="text-sm text-red-400">{loadMoreError}</p>
			<button
				type="button"
				onclick={retryLoadMore}
				class="text-sm text-blue-400 hover:text-blue-300 underline"
			>
				Try again
			</button>
		</div>
	{/if}
</div>

<CreateSourceModal
	isOpen={isCreateModalOpen}
	onClose={() => (isCreateModalOpen = false)}
	onSuccess={handleSourceCreated}
/>

<DeleteSourceModal
	isOpen={isDeleteModalOpen}
	sourceTitle={sourceToDelete?.title ?? ''}
	{isDeleting}
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
/>
