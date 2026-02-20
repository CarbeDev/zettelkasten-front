<script lang="ts">
	import { cn } from '$lib/utils';
	import { LayoutGrid, List } from '@lucide/svelte';

	interface Props {
		viewMode: 'grid' | 'list';
		onViewChange: (mode: 'grid' | 'list') => void;
		class?: string;
	}

	let { viewMode, onViewChange, class: className }: Props = $props();
</script>

<div class={cn('flex items-center gap-1 rounded-lg bg-slate-800 p-1', className)}>
	<button
		type="button"
		onclick={() => onViewChange('grid')}
		class={cn(
			'rounded-md p-2 transition-colors',
			viewMode === 'grid'
				? 'bg-slate-700 text-white'
				: 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
		)}
		title="Grid view"
	>
		<LayoutGrid class="h-5 w-5" />
	</button>
	<button
		type="button"
		onclick={() => onViewChange('list')}
		class={cn(
			'rounded-md p-2 transition-colors',
			viewMode === 'list'
				? 'bg-slate-700 text-white'
				: 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
		)}
		title="List view"
	>
		<List class="h-5 w-5" />
	</button>
</div>
