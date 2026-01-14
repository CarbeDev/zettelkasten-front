<script lang="ts">
	import { cn } from '$lib/utils';
	import { Sprout, Check } from '@lucide/svelte';
	import type { HarvestItem } from '$lib/types/api';

	interface Props {
		items: HarvestItem[];
		newCount?: number;
		totalCount?: number;
		class?: string;
	}

	let { items, newCount = 0, totalCount = 0, class: className }: Props = $props();

	const statusBadgeClasses = {
		Seedling: 'bg-emerald-500/20 text-emerald-400',
		Sapling: 'bg-amber-500/20 text-amber-400',
		Evergreen: 'bg-blue-500/20 text-blue-400'
	};
</script>

<div
	class={cn('flex flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-5', className)}
>
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="rounded-lg bg-slate-600/50 p-2">
				<Sprout class="h-5 w-5 text-slate-300" />
			</div>
			<h3 class="text-lg font-semibold text-white">Notes to Harvest</h3>
		</div>
		{#if newCount > 0}
			<span class="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
				{newCount} New
			</span>
		{/if}
	</div>

	<!-- Items list -->
	<div class="flex-1 space-y-3">
		{#if items.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center py-8 text-center">
				<div class="rounded-full bg-emerald-500/10 p-4">
					<Check class="h-8 w-8 text-emerald-400" />
				</div>
				<p class="mt-4 text-sm font-medium text-slate-300">All caught up!</p>
				<p class="mt-1 text-xs text-slate-500">No notes to harvest right now</p>
			</div>
		{:else}
			{#each items as item (item.id)}
				<div class="flex items-start gap-3 rounded-lg bg-slate-900/50 p-3">
					<input
						type="checkbox"
						checked={item.checked}
						class="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
					/>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-white">{item.title}</p>
						<div class="mt-1 flex flex-wrap items-center gap-2">
							{#each item.tags as tag (tag)}
								<span class="text-xs text-slate-400">{tag}</span>
							{/each}
						</div>
					</div>
					<span
						class={cn('rounded px-2 py-0.5 text-xs font-medium', statusBadgeClasses[item.status])}
					>
						{item.status}
					</span>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Footer -->
	{#if totalCount > 0}
		<div class="mt-4 border-t border-slate-700/50 pt-4">
			<a href="/harvest" class="text-sm font-medium text-slate-400 hover:text-white">
				View all {totalCount} items
			</a>
		</div>
	{/if}
</div>
