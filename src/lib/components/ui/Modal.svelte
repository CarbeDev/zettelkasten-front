<script lang="ts">
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title?: string;
		children?: Snippet;
	}

	let { isOpen, onClose, title, children }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		role="presentation"
	>
		<div
			class="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			{#if title}
				<div class="flex items-center justify-between border-b border-slate-700 px-6 py-4">
					<h2 id="modal-title" class="text-lg font-semibold text-white">{title}</h2>
					<button
						type="button"
						onclick={onClose}
						class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
			{/if}

			<div class="px-6 py-4">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
