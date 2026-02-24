<script lang="ts">
	import DOMPurify from 'dompurify';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { Search, X } from '@lucide/svelte';
	import { search } from '$lib/services/search';
	import type { SearchResult } from '$lib/types/api';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	let inputEl: HTMLInputElement | undefined = $state();
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let isLoading = $state(false);
	let hasSearched = $state(false);
	let errorMessage = $state<string | null>(null);
	let isDropdownOpen = $state(false);
	let focusedIndex = $state(-1);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let abortController: AbortController | undefined;
	let isMac = $state(false);

	$effect(() => {
		isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
	});

	// Nettoyage du timer au démontage du composant
	$effect(() => {
		return () => {
			clearTimeout(debounceTimer);
			abortController?.abort();
		};
	});

	// Scroll vers l'item actif lors de la navigation clavier
	$effect(() => {
		if (focusedIndex >= 0 && isDropdownOpen) {
			document
				.getElementById(`search-result-${focusedIndex}`)
				?.scrollIntoView({ block: 'nearest' });
		}
	});

	export function focus() {
		inputEl?.focus();
	}

	function sanitize(html: string): string {
		if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
		return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['em'], ALLOWED_ATTR: [] });
	}

	function resetSearch() {
		query = '';
		results = [];
		hasSearched = false;
		errorMessage = null;
		isDropdownOpen = false;
		focusedIndex = -1;
	}

	function handleInput() {
		clearTimeout(debounceTimer);
		focusedIndex = -1;
		errorMessage = null;
		const trimmed = query.trim();
		if (!trimmed) {
			results = [];
			hasSearched = false;
			isDropdownOpen = false;
			return;
		}
		if (trimmed.length < 2) {
			results = [];
			hasSearched = false;
			isDropdownOpen = false;
			return;
		}
		isDropdownOpen = true;
		debounceTimer = setTimeout(async () => {
			abortController?.abort();
			abortController = new AbortController();
			isLoading = true;
			try {
				results = await search(trimmed, 10, abortController.signal);
				hasSearched = true;
				focusedIndex = -1;
			} catch (e) {
				if (e instanceof DOMException && e.name === 'AbortError') return;
				errorMessage = 'Search failed. Please try again.';
				results = [];
				hasSearched = true;
			} finally {
				isLoading = false;
			}
		}, 300);
	}

	function handleFocus() {
		if (query.trim()) {
			isDropdownOpen = true;
		}
	}

	function handleBlur() {
		setTimeout(() => {
			isDropdownOpen = false;
			focusedIndex = -1;
		}, 150);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			resetSearch();
			inputEl?.blur();
			return;
		}
		if (!isDropdownOpen || results.length === 0) return;
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			focusedIndex = focusedIndex < results.length - 1 ? focusedIndex + 1 : 0;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : results.length - 1;
		} else if (event.key === 'Enter' && focusedIndex >= 0) {
			event.preventDefault();
			handleResultClick(results[focusedIndex].id);
		}
	}

	function handleResultClick(id: string) {
		resetSearch();
		goto(`/sources/${id}`);
	}

	function clearSearch() {
		resetSearch();
		inputEl?.focus();
	}
</script>

<div class={cn('relative w-full max-w-md', className)}>
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<Search class="h-4 w-4 text-slate-400" />
	</div>
	<input
		bind:this={inputEl}
		bind:value={query}
		type="text"
		role="combobox"
		aria-autocomplete="list"
		aria-expanded={isDropdownOpen && (isLoading || hasSearched)}
		aria-controls="search-listbox"
		aria-activedescendant={focusedIndex >= 0 ? `search-result-${focusedIndex}` : undefined}
		placeholder="Search notes..."
		oninput={handleInput}
		onfocus={handleFocus}
		onblur={handleBlur}
		onkeydown={handleKeydown}
		class="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-16 text-sm text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
	/>
	<div class="absolute inset-y-0 right-0 flex items-center pr-3">
		{#if query}
			<button
				type="button"
				onmousedown={(e) => e.preventDefault()}
				onclick={clearSearch}
				class="rounded p-0.5 text-slate-400 transition-colors hover:text-white"
				aria-label="Clear search"
			>
				<X class="h-4 w-4" />
			</button>
		{:else}
			<kbd
				class="flex h-6 items-center gap-0.5 rounded border border-slate-600 bg-slate-700 px-1.5 text-xs font-medium text-slate-300"
			>
				{#if isMac}<span class="text-sm">⌘</span>{:else}<span class="text-xs">Ctrl+</span>{/if}K
			</kbd>
		{/if}
	</div>

	<!-- Dropdown results -->
	{#if isDropdownOpen && (isLoading || hasSearched)}
		<div
			role="presentation"
			class="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
			onmousedown={(e) => e.preventDefault()}
		>
			{#if isLoading}
				<div class="flex items-center justify-center gap-2 px-4 py-4">
					<svg
						class="h-4 w-4 animate-spin text-blue-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						></path>
					</svg>
					<span class="text-sm text-slate-400">Searching...</span>
				</div>
			{:else if errorMessage}
				<div class="px-4 py-4 text-center text-sm text-red-400">
					{errorMessage}
				</div>
			{:else if results.length === 0}
				<div class="px-4 py-4 text-center text-sm text-slate-400">
					No results for "<span class="text-slate-300">{query}</span>"
				</div>
			{:else}
				<ul id="search-listbox" role="listbox" class="max-h-80 overflow-y-auto py-1">
					{#each results as result, i (result.id)}
						<li id="search-result-{i}" role="option" aria-selected={focusedIndex === i}>
							<button
								type="button"
								class={cn(
									'w-full px-4 py-3 text-left transition-colors focus:outline-none [&_em]:font-semibold [&_em]:not-italic [&_em]:text-blue-400',
									focusedIndex === i ? 'bg-slate-700' : 'hover:bg-slate-800'
								)}
								onclick={() => handleResultClick(result.id)}
							>
								<p class="text-sm font-medium text-slate-100">
									{@html sanitize(result.title)}
								</p>
								{#if result.body}
									<p class="mt-0.5 line-clamp-2 text-xs text-slate-400">
										{@html sanitize(result.body)}
									</p>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
