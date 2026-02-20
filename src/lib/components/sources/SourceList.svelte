<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown, ChevronUp } from '@lucide/svelte';
	import type { Source } from '$lib/types/api';
	import SourceDropdownMenu from './SourceDropdownMenu.svelte';
	import { typeConfig } from './sourceTypeConfig';
	import { infiniteScroll } from '$lib/actions/infiniteScroll';

	export type SortField = 'type' | 'title' | 'author' | 'dateAdded' | 'noteCount';
	export type SortDirection = 'asc' | 'desc';

	interface Props {
		sources: Source[];
		sortBy?: SortField;
		sortDirection?: SortDirection;
		onSort?: (field: SortField) => void;
		onView: (id: string) => void;
		onDelete: (id: string) => void;
		onLoadMore?: () => void;
		isLoadingMore?: boolean;
		hasMore?: boolean;
		class?: string;
	}

	let {
		sources,
		sortBy = 'dateAdded',
		sortDirection = 'desc',
		onSort,
		onView,
		onDelete,
		onLoadMore,
		isLoadingMore = false,
		hasMore = true,
		class: className
	}: Props = $props();

	const columns: { field: SortField; label: string; align?: 'left' | 'right' }[] = [
		{ field: 'type', label: 'Type' },
		{ field: 'title', label: 'Title' },
		{ field: 'author', label: 'Author/Creator' }
	];

	const columnsAfterTags: { field: SortField; label: string; align?: 'left' | 'right' }[] = [
		{ field: 'dateAdded', label: 'Date Added' },
		{ field: 'noteCount', label: 'Linked Notes', align: 'right' }
	];

	function handleSort(field: SortField) {
		onSort?.(field);
	}

	function getVisibleTags(tags: string[]) {
		return tags.slice(0, 4);
	}

	function getHiddenTags(tags: string[]) {
		return tags.slice(4);
	}

	function handleRowClick(e: MouseEvent, sourceId: string) {
		// Don't navigate if clicking on the dropdown menu
		const target = e.target as HTMLElement;
		if (target.closest('.dropdown-container')) return;
		onView(sourceId);
	}
</script>

<div class={cn('overflow-x-auto', className)}>
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-700/50">
				{#each columns as column (column.field)}
					<th
						class={cn(
							'pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500',
							column.align === 'right' ? 'text-right' : 'text-left'
						)}
					>
						<button
							type="button"
							onclick={() => handleSort(column.field)}
							class="inline-flex items-center gap-1 hover:text-slate-300"
						>
							{column.label}
							{#if sortBy === column.field}
								{#if sortDirection === 'desc'}
									<ChevronDown class="h-3 w-3" />
								{:else}
									<ChevronUp class="h-3 w-3" />
								{/if}
							{/if}
						</button>
					</th>
				{/each}
				<!-- Tags column - NOT sortable -->
				<th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Tags
				</th>
				{#each columnsAfterTags as column (column.field)}
					<th
						class={cn(
							'pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500',
							column.align === 'right' ? 'text-right' : 'text-left'
						)}
					>
						<button
							type="button"
							onclick={() => handleSort(column.field)}
							class="inline-flex items-center gap-1 hover:text-slate-300"
						>
							{column.label}
							{#if sortBy === column.field}
								{#if sortDirection === 'desc'}
									<ChevronDown class="h-3 w-3" />
								{:else}
									<ChevronUp class="h-3 w-3" />
								{/if}
							{/if}
						</button>
					</th>
				{/each}
				<th class="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
					<span class="sr-only">Actions</span>
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-slate-700/30">
			{#each sources as source (source.id)}
				{@const config = typeConfig[source.type]}
				{@const TypeIcon = config.icon}
				<tr
					onclick={(e) => handleRowClick(e, source.id)}
					class="group cursor-pointer hover:bg-slate-700/30"
				>
					<!-- Type -->
					<td class="py-4">
						<span
							class={cn(
								'inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold',
								config.bgClass,
								config.textClass
							)}
						>
							<TypeIcon class="h-3 w-3" />
							{config.label}
						</span>
					</td>
					<!-- Title -->
					<td class="py-4">
						<span class="text-sm font-medium text-white">{source.title}</span>
					</td>
					<!-- Author -->
					<td class="py-4 text-sm text-slate-400">
						{source.author}
					</td>
					<!-- Tags -->
					<td class="py-4">
						<div class="flex flex-wrap items-center gap-1">
							{#each getVisibleTags(source.tags) as tag (tag)}
								<span class="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">#{tag}</span>
							{/each}
							{#if getHiddenTags(source.tags).length > 0}
								<div class="group/tags relative">
									<span
										class="cursor-pointer rounded bg-slate-600 px-2 py-0.5 text-xs text-slate-400"
									>
										+{getHiddenTags(source.tags).length}
									</span>
									<div
										class="invisible absolute bottom-full left-0 z-50 mb-2 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-lg group-hover/tags:visible"
									>
										<div class="flex flex-wrap gap-1">
											{#each getHiddenTags(source.tags) as tag (tag)}
												<span
													class="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300 whitespace-nowrap"
													>#{tag}</span
												>
											{/each}
										</div>
									</div>
								</div>
							{/if}
						</div>
					</td>
					<!-- Date Added -->
					<td class="py-4 text-sm text-slate-500">
						{source.dateAdded.replace('Added ', '')}
					</td>
					<!-- Linked Notes -->
					<td class="py-4 text-right">
						<span
							class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/50 text-sm font-semibold text-blue-400"
						>
							{source.noteCount}
						</span>
					</td>
					<!-- Actions -->
					<td class="py-4 text-right">
						<div class="opacity-0 transition-opacity group-hover:opacity-100">
							<SourceDropdownMenu sourceId={source.id} {onView} {onDelete} />
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Infinite scroll sentinel and loader -->
	{#if onLoadMore}
		<div use:infiniteScroll={{ onLoadMore: onLoadMore!, hasMore, isLoading: isLoadingMore }} class="h-1"></div>

		{#if isLoadingMore}
			<div class="flex justify-center py-8">
				<div
					class="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full"
				></div>
			</div>
		{:else if !hasMore && sources.length > 0}
			<div class="text-center py-8 text-sm text-slate-500">No more sources to load</div>
		{/if}
	{/if}
</div>
