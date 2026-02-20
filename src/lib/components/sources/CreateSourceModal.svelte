<script lang="ts">
	import { Modal, TagInput } from '$lib/components/ui';
	import { createSource } from '$lib/services/sources';
	import type { SourceType, SourceResponse } from '$lib/types/api';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onSuccess?: (source: SourceResponse) => void;
	}

	let { isOpen, onClose, onSuccess }: Props = $props();

	let title = $state('');
	let author = $state('');
	let type = $state<SourceType>('BOOK');
	let url = $state('');
	let tags = $state<string[]>([]);
	let draft = $state('');
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	function resetForm() {
		title = '';
		author = '';
		type = 'BOOK';
		url = '';
		tags = [];
		draft = '';
		error = null;
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	async function handleSubmit() {
		if (!title.trim() || !author.trim()) {
			error = 'Title and Author are required';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			const newSource = await createSource({
				title: title.trim(),
				author: author.trim(),
				type,
				url: url.trim() || undefined,
				tags: tags.length > 0 ? tags : undefined,
				draft: draft.trim() || undefined
			});

			onSuccess?.(newSource);
			resetForm();
			onClose();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create source';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Modal {isOpen} onClose={handleClose} title="Add Source">
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
		{#if error}
			<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
				{error}
			</div>
		{/if}

		<label class="block">
			<span class="text-sm font-medium text-slate-300">Title *</span>
			<input
				type="text"
				bind:value={title}
				required
				class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				placeholder="Enter source title"
			/>
		</label>

		<label class="block">
			<span class="text-sm font-medium text-slate-300">Author / Creator *</span>
			<input
				type="text"
				bind:value={author}
				required
				class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				placeholder="Enter author or creator name"
			/>
		</label>

		<label class="block">
			<span class="text-sm font-medium text-slate-300">Type *</span>
			<select
				bind:value={type}
				class="mt-1 h-[42px] w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option value="BOOK">Book</option>
				<option value="ARTICLE">Article</option>
				<option value="VIDEO">Video</option>
				<option value="OTHER">Other</option>
			</select>
		</label>

		<label class="block">
			<span class="text-sm font-medium text-slate-300">URL</span>
			<input
				type="url"
				bind:value={url}
				class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				placeholder="https://example.com/source"
			/>
		</label>

		<TagInput {tags} onTagsChange={(t) => (tags = t)} />

		<label class="block">
			<span class="text-sm font-medium text-slate-300">Draft</span>
			<textarea
				bind:value={draft}
				rows={10}
				placeholder="Your reflections on this source..."
				class="mt-1 w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			></textarea>
		</label>

		<div class="flex justify-end gap-3 border-t border-slate-700 pt-4">
			<button
				type="button"
				onclick={handleClose}
				class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
			>
				Cancel
			</button>
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? 'Creating...' : 'Create Source'}
			</button>
		</div>
	</form>
</Modal>
