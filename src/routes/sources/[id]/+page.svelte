<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from '@lucide/svelte';
	import type { SourceDetailResponse, SourceType, UpdateSourceRequest } from '$lib/types/api';
	import { updateSource } from '$lib/services/sources';
	import SourceHeader from '$lib/components/sources/SourceHeader.svelte';
	import SourceDraftEditor from '$lib/components/sources/SourceDraftEditor.svelte';
	import SourceNotesSection from '$lib/components/sources/SourceNotesSection.svelte';
	import EditMetadataModal from '$lib/components/sources/EditMetadataModal.svelte';

	interface Props {
		data: {
			source: SourceDetailResponse | null;
			error: string | null;
		};
	}

	interface MetadataUpdates {
		title: string;
		author: string;
		type: SourceType;
		url: string;
		tags: string[];
	}

	let { data }: Props = $props();

	let source = $state(data.source);
	let originalDraft = source?.draft ?? '';
	let draft = $state(source?.draft || '');
	let isSaving = $state(false);
	let isEditModalOpen = $state(false);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		return () => {
			if (saveTimeout) clearTimeout(saveTimeout);
		};
	});

	// Debounced auto-save for draft (3 seconds)
	function handleDraftChange(content: string) {
		draft = content;

		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		saveTimeout = setTimeout(async () => {
			if (source && content !== originalDraft) {
				isSaving = true;
				try {
					const draftValue = content === '' ? null : content;
					const updated = await updateSource(source.id, { draft: draftValue });
					originalDraft = content;
					source = updated;
				} catch (error) {
					console.error('Failed to save draft:', error);
				} finally {
					isSaving = false;
				}
			}
		}, 3000);
	}

	function handleBack() {
		goto('/sources');
	}

	function handleEditMetadata() {
		isEditModalOpen = true;
	}

	function arraysEqual(a: string[], b: string[]): boolean {
		if (a.length !== b.length) return false;
		const sortedA = [...a].sort();
		const sortedB = [...b].sort();
		return sortedA.every((val, idx) => val === sortedB[idx]);
	}

	async function handleSaveMetadata(updates: MetadataUpdates): Promise<void> {
		if (!source) return;

		const changes: UpdateSourceRequest = {};

		if (updates.title !== source.title) {
			changes.title = updates.title;
		}
		if (updates.author !== source.author) {
			changes.author = updates.author;
		}
		if (updates.type !== source.type) {
			changes.type = updates.type;
		}
		if (updates.url !== (source.url ?? '')) {
			changes.url = updates.url === '' ? null : updates.url;
		}
		if (!arraysEqual(updates.tags, source.tags)) {
			changes.tags = updates.tags;
		}

		if (Object.keys(changes).length > 0) {
			const updated = await updateSource(source.id, changes);
			source = updated;
		}
	}

	function handleCreateNote() {
		// TODO: Navigate to create note page or open modal
		console.log('Create atomic note for source:', source?.id);
	}

	function handleNoteClick(noteId: string) {
		// TODO: Navigate to note detail page
		console.log('View note:', noteId);
		goto(`/notes/${noteId}`);
	}
</script>

<svelte:head>
	<title>{source?.title || 'Source'} - Zettelkasten</title>
</svelte:head>

<div class="min-h-screen p-6">
	<!-- Back Button -->
	<button
		type="button"
		onclick={handleBack}
		class="mb-6 flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
	>
		<ArrowLeft class="h-4 w-4" />
		Back to Sources
	</button>

	{#if data.error}
		<div class="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
			<p class="text-red-400">{data.error}</p>
			<button
				type="button"
				onclick={handleBack}
				class="mt-4 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
			>
				Return to Sources
			</button>
		</div>
	{:else if source}
		<!-- Main Content: Two Columns -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column: Header + Draft Editor (2/3) -->
			<div class="lg:col-span-2">
				<SourceHeader
					source={source}
					onEditMetadata={handleEditMetadata}
					class="mb-8"
				/>
				<SourceDraftEditor {draft} onDraftChange={handleDraftChange} {isSaving} />
			</div>

			<!-- Right Column: Notes (1/3) -->
			<div>
				<SourceNotesSection
					notes={source.notes}
					onCreateNote={handleCreateNote}
					onNoteClick={handleNoteClick}
				/>
			</div>
		</div>

		<!-- Edit Metadata Modal -->
		<EditMetadataModal
			isOpen={isEditModalOpen}
			source={source}
			onClose={() => (isEditModalOpen = false)}
			onSave={handleSaveMetadata}
		/>
	{/if}
</div>
