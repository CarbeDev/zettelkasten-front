<script lang="ts">
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import GardenStatusCard from '$lib/components/dashboard/GardenStatusCard.svelte';
	import HarvestCard from '$lib/components/dashboard/HarvestCard.svelte';
	import RecentActivityTable from '$lib/components/dashboard/RecentActivityTable.svelte';
	import { AlertTriangle } from '@lucide/svelte';

	let { data } = $props();

	const hasHarvestError = $derived(!!data.error);

	const recentActivityItems = [
		{
			id: '1',
			title: 'Complexity vs Complication',
			linkedNotes: ['Systems Thinking'],
			status: 'sapling' as const,
			lastEdited: '2 hours ago'
		},
		{
			id: '2',
			title: 'Designing for Dark Mode',
			linkedNotes: ['UI Design', 'Accessibility'],
			status: 'evergreen' as const,
			lastEdited: 'Yesterday'
		},
		{
			id: '3',
			title: 'Meeting Notes: Q3 Roadmap',
			linkedNotes: ['Work', 'Projects'],
			status: 'seedling' as const,
			lastEdited: '2 days ago'
		},
		{
			id: '4',
			title: 'Zettelkasten Principles',
			linkedNotes: ['PKM', 'Learning'],
			status: 'evergreen' as const,
			lastEdited: '3 days ago'
		}
	];
</script>

<div class="space-y-6">
	<!-- Error banner -->
	{#if hasHarvestError}
		<div class="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
			<AlertTriangle class="h-5 w-5 flex-shrink-0 text-red-400" />
			<div>
				<p class="text-sm font-medium text-red-400">Failed to load some data</p>
				<p class="mt-1 text-xs text-red-400/70">
					Please check your connection or try refreshing the page.
				</p>
			</div>
		</div>
	{/if}

	<!-- Top row: 4 stat cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard title="Total Notes" value="1,240" icon="document" iconColor="blue" />
		<StatCard
			title="Inbox"
			value="5"
			subtitle="Need processing"
			icon="chat"
			iconColor="yellow"
			accentBorder={true}
		/>
		<StatCard title="Links Today" value="450" icon="link" iconColor="green" />
		<StatCard title="Daily Streak" value="12 Days" icon="fire" iconColor="orange" />
	</div>

	<!-- Second row: Garden Status and Notes to Harvest -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
		<GardenStatusCard class="lg:col-span-3" />
		<HarvestCard
			items={data.harvestItems}
			newCount={data.harvestNewCount}
			totalCount={data.harvestTotalCount}
			class="lg:col-span-2"
		/>
	</div>

	<!-- Third row: Recent Activity -->
	<RecentActivityTable items={recentActivityItems} />
</div>
