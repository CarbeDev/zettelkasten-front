<script lang="ts">
	import { cn } from '$lib/utils';
	import { Clock, Eye, MoreVertical } from '@lucide/svelte';

	interface ActivityItem {
		id: string;
		title: string;
		linkedNotes: string[];
		status: 'seedling' | 'sapling' | 'evergreen';
		lastEdited: string;
	}

	interface Props {
		items: ActivityItem[];
		class?: string;
	}

	let { items, class: className }: Props = $props();

	const statusConfig = {
		seedling: {
			emoji: '🌱',
			label: 'Seedling',
			classes: 'bg-slate-600/50 text-slate-300'
		},
		sapling: {
			emoji: '🌿',
			label: 'Sapling',
			classes: 'bg-emerald-500/20 text-emerald-400'
		},
		evergreen: {
			emoji: '🌳',
			label: 'Evergreen',
			classes: 'bg-blue-500/20 text-blue-400'
		}
	};
</script>

<div class={cn('rounded-xl border border-slate-700/50 bg-slate-800/50 p-5', className)}>
	<!-- Header -->
	<div class="mb-4 flex items-center gap-2">
		<div class="rounded-lg bg-slate-600/50 p-2">
			<Clock class="h-5 w-5 text-slate-300" />
		</div>
		<h3 class="text-lg font-semibold text-white">Recent Activity</h3>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr class="border-b border-slate-700/50">
					<th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
						Note Title
					</th>
					<th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
						Status
					</th>
					<th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
						Last Edited
					</th>
					<th class="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-700/30">
				{#each items as item (item.id)}
					{@const status = statusConfig[item.status]}
					<tr class="group">
						<td class="py-4">
							<div>
								<p class="text-sm font-medium text-white">{item.title}</p>
								<div class="mt-1 flex flex-wrap gap-1.5">
									<span class="text-xs text-slate-500">Linked to:</span>
									{#each item.linkedNotes as note (note)}
										<a
											href="/notes/{note.toLowerCase().replace(/\s+/g, '-')}"
											class="text-xs text-blue-400 hover:text-blue-300"
										>
											[[{note}]]
										</a>
									{/each}
								</div>
							</div>
						</td>
						<td class="py-4">
							<span
								class={cn(
									'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
									status.classes
								)}
							>
								<span>{status.emoji}</span>
								{status.label}
							</span>
						</td>
						<td class="py-4 text-sm text-slate-400">
							{item.lastEdited}
						</td>
						<td class="py-4 text-right">
							<div
								class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<button
									type="button"
									class="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
									aria-label="View note"
								>
									<Eye class="h-4 w-4" />
								</button>
								<button
									type="button"
									class="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
									aria-label="More options"
								>
									<MoreVertical class="h-4 w-4" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
