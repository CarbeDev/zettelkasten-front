<script lang="ts">
	import { cn } from '$lib/utils';
	import { Plus, Settings, Share2 } from '@lucide/svelte';
	import SearchBar from './SearchBar.svelte';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	let searchBar: { focus(): void } | undefined = $state();

	export function focus() {
		searchBar?.focus();
	}
</script>

<header
	class={cn(
		'flex h-14 w-full items-center justify-between border-b border-slate-700/50 bg-slate-900 px-4',
		className
	)}
>
	<!-- Left side: Logo and brand -->
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-0.5">
			<div class="grid grid-cols-2 gap-0.5">
				<div class="h-2.5 w-2.5 rounded-sm bg-blue-500"></div>
				<div class="h-2.5 w-2.5 rounded-sm bg-blue-400"></div>
				<div class="h-2.5 w-2.5 rounded-sm bg-blue-400"></div>
				<div class="h-2.5 w-2.5 rounded-sm bg-blue-500"></div>
			</div>
		</div>
		<span class="text-lg font-bold text-white">Zettelkasten</span>
	</div>

	<!-- Center: Search -->
	<div class="flex flex-1 justify-center px-8">
		<SearchBar bind:this={searchBar} />
	</div>

	<!-- Right side: Actions -->
	<div class="flex items-center gap-3">
		<a href="/graph" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">
			Graph View
		</a>

		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
		>
			<Plus class="h-4 w-4" />
			Capture
		</button>

		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
		>
			<Plus class="h-4 w-4" />
			New Note
		</button>

		<button
			type="button"
			class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
			aria-label="Settings"
		>
			<Settings class="h-5 w-5" />
		</button>

		<button
			type="button"
			class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
			aria-label="Share or export"
		>
			<Share2 class="h-5 w-5" />
		</button>

		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-sm font-medium text-white"
			aria-label="User menu"
		>
			<span>JD</span>
		</button>
	</div>
</header>
