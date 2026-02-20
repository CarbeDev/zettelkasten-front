<script lang="ts">
	import { cn } from '$lib/utils';
	import { BookOpen, Video, FileText, File } from '@lucide/svelte';
	import type { SourceFilterType } from '$lib/types/api';

	interface Props {
		activeFilter: SourceFilterType;
		onFilterChange: (filter: SourceFilterType) => void;
		class?: string;
	}

	let { activeFilter, onFilterChange, class: className }: Props = $props();

	const filters: { type: SourceFilterType; label: string; icon?: typeof BookOpen }[] = [
		{ type: 'ALL', label: 'All' },
		{ type: 'BOOK', label: 'Books', icon: BookOpen },
		{ type: 'ARTICLE', label: 'Articles', icon: FileText },
		{ type: 'VIDEO', label: 'Videos', icon: Video },
		{ type: 'OTHER', label: 'Others', icon: File }
	];
</script>

<div class={cn('flex flex-wrap items-center gap-2', className)}>
	{#each filters as filter (filter.type)}
		{@const isActive = activeFilter === filter.type}
		{@const FilterIcon = filter.icon}
		<button
			type="button"
			onclick={() => onFilterChange(filter.type)}
			class={cn(
				'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
				isActive
					? 'bg-blue-600 text-white'
					: 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
			)}
		>
			{#if FilterIcon}
				<FilterIcon class="h-4 w-4" />
			{/if}
			{filter.label}
		</button>
	{/each}
</div>
