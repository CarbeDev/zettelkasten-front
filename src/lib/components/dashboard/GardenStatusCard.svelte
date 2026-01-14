<script lang="ts">
	import { cn } from '$lib/utils';
	import { Sparkles } from '@lucide/svelte';
	import DonutChart from './DonutChart.svelte';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	const gardenSegments = [
		{ label: 'Seedlings', emoji: '🌱', percentage: 20, color: '#64748b' },
		{ label: 'Saplings', emoji: '🌿', percentage: 50, color: '#22c55e' },
		{ label: 'Evergreen', emoji: '🌳', percentage: 30, color: '#3b82f6' }
	];
</script>

<div
	class={cn('flex flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-5', className)}
>
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="rounded-lg bg-emerald-500/20 p-2">
				<Sparkles class="h-5 w-5 text-emerald-400" />
			</div>
			<h3 class="text-lg font-semibold text-white">Garden Status</h3>
		</div>
		<a href="/analytics" class="text-sm font-medium text-blue-400 hover:text-blue-300">
			View Analytics
		</a>
	</div>

	<!-- Chart -->
	<div class="flex flex-1 items-center justify-center py-4">
		<DonutChart segments={gardenSegments} centerValue="1.2k" centerLabel="Zettels" />
	</div>
</div>
