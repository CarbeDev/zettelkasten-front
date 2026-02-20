<script lang="ts">
	import { cn } from '$lib/utils';
	import { Cloud, ExternalLink } from '@lucide/svelte';
	import type { SourceDetailResponse } from '$lib/types/api';
	import { typeConfig, placeholderColors } from './sourceTypeConfig';

	interface Props {
		source: SourceDetailResponse;
		onEditMetadata: () => void;
		class?: string;
	}

	let { source, onEditMetadata, class: className }: Props = $props();

	// Sync status is hardcoded for now - will be implemented later
	const syncStatus = { label: 'Synced', textClass: 'text-emerald-400' };

	const config = $derived(typeConfig[source.type]);
	const TypeIcon = $derived(config.icon);

	let imageError = $state(false);

	function handleImageError() {
		imageError = true;
	}
</script>

<div class={cn('flex gap-6', className)}>
	<!-- Cover Image -->
	<div class="flex-shrink-0">
		<div
			class="flex h-48 w-32 items-center justify-center overflow-hidden rounded-lg border border-slate-700"
		>
			{#if source.coverUrl && !imageError}
				<img
					src={source.coverUrl}
					alt={source.title}
					class="h-full w-full object-cover"
					onerror={handleImageError}
				/>
			{:else}
				<div
					class={cn(
						'flex h-full w-full flex-col items-center justify-center bg-gradient-to-br p-4',
						placeholderColors[source.type]
					)}
				>
					<TypeIcon class={cn('h-8 w-8', config.textClass)} />
					<span class={cn('mt-2 text-center text-xs font-medium uppercase', config.textClass)}>
						{source.title.split(' ').slice(0, 2).join(' ')}
					</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Metadata -->
	<div class="flex flex-1 flex-col">
		<!-- Badges Row -->
		<div class="flex items-center gap-3">
			<span
				class={cn(
					'flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold',
					config.bgClass,
					config.textClass
				)}
			>
				<TypeIcon class="h-3 w-3" />
				{config.label}
			</span>
			<span class={cn('flex items-center gap-1 text-xs', syncStatus.textClass)}>
				<Cloud class="h-3 w-3" />
				{syncStatus.label}
			</span>
		</div>

		<!-- Title -->
		<h1 class="mt-3 text-2xl font-bold text-white">{source.title}</h1>

		<!-- Author -->
		<p class="mt-1 text-slate-400">{source.author}</p>

		<!-- Tags -->
		<div class="mt-4 flex flex-wrap items-center gap-2">
			{#each source.tags as tag (tag)}
				<span class="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-300">
					{tag}
				</span>
			{/each}
		</div>

		<!-- Action Buttons -->
		<div class="mt-auto flex items-center gap-3 pt-4">
			<button
				type="button"
				onclick={onEditMetadata}
				class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
			>
				Edit Metadata
			</button>
			{#if source.url}
				<a
					href={source.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
				>
					<ExternalLink class="h-4 w-4" />
					Open Source
				</a>
			{/if}
		</div>
	</div>
</div>
