<script lang="ts">
	import { X } from '@lucide/svelte';

	interface Props {
		tags: string[];
		onTagsChange: (tags: string[]) => void;
	}

	let { tags, onTagsChange }: Props = $props();

	let tagInput = $state('');

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && tagInput.trim()) {
			event.preventDefault();
			const newTag = tagInput.trim().replace(/^#/, '');
			if (!tags.includes(newTag)) {
				onTagsChange([...tags, newTag]);
			}
			tagInput = '';
		}
		if (event.key === 'Backspace' && !tagInput && tags.length > 0) {
			onTagsChange(tags.slice(0, -1));
		}
	}

	function removeTag(tagToRemove: string) {
		onTagsChange(tags.filter((t) => t !== tagToRemove));
	}
</script>

<div class="block">
	<span class="text-sm font-medium text-slate-300">Tags</span>
	<div
		class="mt-1 flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2"
	>
		{#each tags as tag (tag)}
			<span
				class="flex items-center gap-1 rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300"
			>
				#{tag}
				<button
					type="button"
					onclick={() => removeTag(tag)}
					class="text-slate-400 transition-colors hover:text-white"
				>
					<X class="h-3 w-3" />
				</button>
			</span>
		{/each}
		<input
			type="text"
			bind:value={tagInput}
			onkeydown={handleKeydown}
			placeholder={tags.length === 0 ? 'Add tags (press Enter)' : 'Add more...'}
			class="min-w-[100px] flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
		/>
	</div>
</div>
