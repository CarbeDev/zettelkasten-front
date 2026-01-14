<script lang="ts">
	import { navigating } from '$app/stores';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

{#if $navigating}
	<div
		class={cn(
			'fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden bg-slate-800',
			className
		)}
	>
		<div
			class="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
		></div>
	</div>
{/if}

<style>
	@keyframes loading {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(400%);
		}
	}
</style>
