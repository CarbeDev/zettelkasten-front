<script lang="ts">
	import { cn } from '$lib/utils';
	import { MoreVertical, Eye, Trash2 } from '@lucide/svelte';

	interface Props {
		sourceId: string;
		onView: (id: string) => void;
		onDelete: (id: string) => void;
		class?: string;
	}

	let { sourceId, onView, onDelete, class: className }: Props = $props();

	let isOpen = $state(false);
	let buttonRef = $state<HTMLButtonElement | null>(null);
	let menuPosition = $state({ top: 0, left: 0 });

	function toggleMenu() {
		if (!isOpen && buttonRef) {
			const rect = buttonRef.getBoundingClientRect();
			const menuWidth = 144; // w-36 = 9rem = 144px
			const menuHeight = 120; // approximate menu height
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;

			let top = rect.bottom + 4;
			let left = rect.right - menuWidth;

			// If menu would go below viewport, show it above the button
			if (top + menuHeight > viewportHeight) {
				top = rect.top - menuHeight - 4;
			}

			// If menu would go outside left edge, align to left of button
			if (left < 8) {
				left = rect.left;
			}

			// If menu would go outside right edge
			if (left + menuWidth > viewportWidth - 8) {
				left = viewportWidth - menuWidth - 8;
			}

			menuPosition = { top, left };
		}
		isOpen = !isOpen;
	}

	function handleAction(action: (id: string) => void) {
		action(sourceId);
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container') && !target.closest('.dropdown-menu')) {
			isOpen = false;
		}
	}

	function handleScroll() {
		isOpen = false;
	}

	$effect(() => {
		if (isOpen) {
			window.addEventListener('click', handleClickOutside);
			window.addEventListener('scroll', handleScroll);
			return () => {
				window.removeEventListener('click', handleClickOutside);
				window.removeEventListener('scroll', handleScroll);
			};
		}
	});
</script>

<div class={cn('dropdown-container relative', className)}>
	<button
		bind:this={buttonRef}
		type="button"
		onclick={toggleMenu}
		class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
	>
		<MoreVertical class="h-5 w-5" />
	</button>

	{#if isOpen}
		<div
			class="dropdown-menu fixed z-[9999] w-36 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg"
			style="top: {menuPosition.top}px; left: {menuPosition.left}px;"
		>
			<button
				type="button"
				onclick={() => handleAction(onView)}
				class="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
			>
				<Eye class="h-4 w-4" />
				View
			</button>
			<button
				type="button"
				onclick={() => handleAction(onDelete)}
				class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-slate-700 hover:text-red-300"
			>
				<Trash2 class="h-4 w-4" />
				Delete
			</button>
		</div>
	{/if}
</div>
