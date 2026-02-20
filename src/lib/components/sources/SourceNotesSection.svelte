<script lang="ts">
	import { cn } from '$lib/utils';
	import { Plus, SlidersHorizontal } from '@lucide/svelte';
	import type { SourceNote } from '$lib/types/api';
	import SourceNoteCard from './SourceNoteCard.svelte';

	interface Props {
		notes: SourceNote[];
		onCreateNote: () => void;
		onNoteClick?: (id: string) => void;
		class?: string;
	}

	let { notes, onCreateNote, onNoteClick, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col', className)}>
	<!-- Create Button -->
	<button
		type="button"
		onclick={onCreateNote}
		class="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
	>
		<Plus class="h-5 w-5" />
		Create Note
	</button>

	<!-- Section Header -->
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-sm font-medium uppercase tracking-wider text-slate-400">
			Notes ({notes.length})
		</h3>
		<button
			type="button"
			class="rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
			aria-label="Filter notes"
		>
			<SlidersHorizontal class="h-4 w-4" />
		</button>
	</div>

	<!-- Notes Grid -->
	{#if notes.length > 0}
		<div class="flex flex-col gap-3">
			{#each notes as note (note.id)}
				<SourceNoteCard {note} onClick={onNoteClick} />
			{/each}
		</div>
	{:else}
		<div class="rounded-xl border border-dashed border-slate-700 p-8 text-center">
			<p class="text-sm text-slate-500">No notes yet</p>
			<p class="mt-1 text-xs text-slate-600">Create your first note from this source</p>
		</div>
	{/if}
</div>
