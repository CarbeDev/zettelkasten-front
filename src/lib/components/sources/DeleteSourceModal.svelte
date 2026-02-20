<script lang="ts">
	import { Modal } from '$lib/components/ui';
	import { AlertTriangle } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		sourceTitle: string;
		isDeleting?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { isOpen, sourceTitle, isDeleting = false, onConfirm, onCancel }: Props = $props();
</script>

<Modal {isOpen} onClose={onCancel} title="Delete Source">
	<div class="space-y-4">
		<div class="flex items-start gap-3">
			<div class="rounded-full bg-red-500/20 p-2">
				<AlertTriangle class="h-5 w-5 text-red-400" />
			</div>
			<div>
				<p class="text-sm text-slate-300">
					Are you sure you want to delete this source?
				</p>
				<p class="mt-1 text-sm font-medium text-white">
					"{sourceTitle}"
				</p>
				<p class="mt-2 text-xs text-slate-400">
					This action cannot be undone.
				</p>
			</div>
		</div>

		<div class="flex justify-end gap-3 border-t border-slate-700 pt-4">
			<button
				type="button"
				onclick={onCancel}
				disabled={isDeleting}
				class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={onConfirm}
				disabled={isDeleting}
				class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isDeleting ? 'Deleting...' : 'Delete'}
			</button>
		</div>
	</div>
</Modal>
