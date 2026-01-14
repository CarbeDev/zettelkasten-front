<script lang="ts">
	import { cn } from '$lib/utils';
	import { Search, Plus, Settings, Share2 } from '@lucide/svelte';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<header
	class={cn(
		'flex h-14 w-full items-center justify-between border-b border-slate-700/50 bg-slate-900 px-4',
		className
	)}
>
	<!-- Left side: Logo and brand -->
	<div class="flex items-center gap-3">
		<!-- Logo icon (blue squares/blocks) -->
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

	<!-- Center: Search input -->
	<div class="flex flex-1 justify-center px-8">
		<div class="relative w-full max-w-md">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search class="h-4 w-4 text-slate-400" />
			</div>
			<input
				type="text"
				placeholder="Search notes..."
				class="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-16 text-sm text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			/>
			<div class="absolute inset-y-0 right-0 flex items-center pr-3">
				<kbd
					class="flex h-6 items-center gap-0.5 rounded border border-slate-600 bg-slate-700 px-1.5 text-xs font-medium text-slate-300"
				>
					<span class="text-sm">⌘</span>K
				</kbd>
			</div>
		</div>
	</div>

	<!-- Right side: Actions -->
	<div class="flex items-center gap-3">
		<!-- Graph View link -->
		<a href="/graph" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">
			Graph View
		</a>

		<!-- Capture button -->
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
		>
			<Plus class="h-4 w-4" />
			Capture
		</button>

		<!-- + New Note button (primary) -->
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
		>
			<Plus class="h-4 w-4" />
			New Note
		</button>

		<!-- Settings gear icon -->
		<button
			type="button"
			class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
			aria-label="Settings"
		>
			<Settings class="h-5 w-5" />
		</button>

		<!-- Share/export icon -->
		<button
			type="button"
			class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
			aria-label="Share or export"
		>
			<Share2 class="h-5 w-5" />
		</button>

		<!-- User avatar (circular) -->
		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white"
			aria-label="User menu"
		>
			<span>JD</span>
		</button>
	</div>
</header>
