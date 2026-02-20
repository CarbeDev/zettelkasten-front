<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Source } from '$lib/types/api';
	import SourceCard from './SourceCard.svelte';
	import { infiniteScroll } from '$lib/actions/infiniteScroll';

	interface Props {
		sources: Source[];
		onView: (id: string) => void;
		onDelete: (id: string) => void;
		onLoadMore?: () => void;
		isLoadingMore?: boolean;
		hasMore?: boolean;
		class?: string;
	}

	let {
		sources,
		onView,
		onDelete,
		onLoadMore,
		isLoadingMore = false,
		hasMore = true,
		class: className
	}: Props = $props();
</script>

<div class={cn(className)}>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each sources as source (source.id)}
			<SourceCard {source} viewMode="grid" {onView} {onDelete} />
		{/each}
	</div>

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
