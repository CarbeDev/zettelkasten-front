<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		draft: string;
		onDraftChange: (content: string) => void;
		isSaving?: boolean;
		class?: string;
	}

	let { draft, onDraftChange, isSaving = false, class: className }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		onDraftChange(target.value);
	}
</script>

<div class={cn('flex flex-col', className)}>
	<h2 class="mb-4 text-lg font-semibold text-white">Drafting & Annotation</h2>

	<div class="relative">
		<textarea
			value={draft}
			oninput={handleInput}
			rows={20}
			class="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			placeholder="Your reflections on this source..."
		></textarea>

		{#if isSaving}
			<div class="absolute right-3 top-3 text-xs text-slate-500">Saving...</div>
		{/if}
	</div>
</div>
