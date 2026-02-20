<script lang="ts">
	import { cn } from '$lib/utils';
	import { ArrowUpRight } from '@lucide/svelte';
	import type { SourceNote, NoteStatusApi } from '$lib/types/api';

	interface Props {
		note: SourceNote;
		onClick?: (id: string) => void;
		class?: string;
	}

	let { note, onClick, class: className }: Props = $props();

	const statusConfig: Record<NoteStatusApi, { emoji: string; label: string; textClass: string; bgClass: string }> = {
		SEEDLING: { emoji: '🌱', label: 'Seedling', textClass: 'text-amber-400', bgClass: 'bg-amber-500/20' },
		SAPLING: { emoji: '🌿', label: 'Sapling', textClass: 'text-blue-400', bgClass: 'bg-blue-500/20' },
		EVERGREEN: { emoji: '🌳', label: 'Evergreen', textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/20' }
	};

	const config = $derived(statusConfig[note.status]);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleClick() {
		onClick?.(note.id);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.(note.id);
		}
	}
</script>

<button
	type="button"
	onclick={handleClick}
	onkeydown={handleKeyDown}
	class={cn(
		'group flex w-full flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-left transition-colors hover:border-slate-600',
		className
	)}
>
	<div class="flex items-start justify-between gap-2">
		<h4 class="text-sm font-semibold text-white">{note.title}</h4>
		<ArrowUpRight
			class="h-4 w-4 flex-shrink-0 text-slate-500 transition-colors group-hover:text-white"
		/>
	</div>

	<p class="mt-2 line-clamp-2 text-xs text-slate-400">{note.excerpt}</p>

	<div class="mt-3 flex items-center justify-between">
		<span class="text-xs text-slate-500">{formatDate(note.createdAt)}</span>
		<span
			class={cn(
				'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
				config.bgClass,
				config.textClass
			)}
		>
			<span>{config.emoji}</span>
			{config.label}
		</span>
	</div>
</button>
