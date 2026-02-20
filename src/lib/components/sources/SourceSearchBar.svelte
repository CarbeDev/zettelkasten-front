<script lang="ts">
	import { cn } from '$lib/utils';
	import { Search } from '@lucide/svelte';

	interface Props {
		value?: string;
		onInput?: (query: string) => void;
		onSearch?: (query: string) => void;
		class?: string;
	}

	let { value = '', onInput, onSearch, class: className }: Props = $props();

	const isTagSearch = $derived(value.startsWith('#'));

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onInput?.(target.value);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && isTagSearch) {
			onSearch?.(value);
		}
	}
</script>

<div class={cn('relative', className)}>
	<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
	<input
		type="text"
		{value}
		oninput={handleInput}
		onkeydown={handleKeydown}
		placeholder="Search by title, author or #tag (press Enter)..."
		class={cn(
			'w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
			isTagSearch ? 'text-blue-400' : 'text-white'
		)}
	/>
</div>
