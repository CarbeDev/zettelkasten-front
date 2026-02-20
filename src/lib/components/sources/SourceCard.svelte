<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Source } from '$lib/types/api';
	import SourceDropdownMenu from './SourceDropdownMenu.svelte';
	import { typeConfig, placeholderColors } from './sourceTypeConfig';

	interface Props {
		source: Source;
		viewMode: 'grid' | 'list';
		onView: (id: string) => void;
		onDelete: (id: string) => void;
		class?: string;
	}

	let { source, viewMode, onView, onDelete, class: className }: Props = $props();

	const config = $derived(typeConfig[source.type]);
	const TypeIcon = $derived(config.icon);

	// Tags display logic - grid shows 2, list shows 4
	const maxVisibleTags = $derived(viewMode === 'grid' ? 2 : 4);
	const visibleTags = $derived(source.tags.slice(0, maxVisibleTags));
	const hiddenTags = $derived(source.tags.slice(maxVisibleTags));
	const hiddenCount = $derived(hiddenTags.length);

	// Image error handling
	let imageError = $state(false);

	function handleImageError() {
		imageError = true;
	}

	function handleCardClick(e: MouseEvent) {
		// Don't navigate if clicking on the dropdown menu
		const target = e.target as HTMLElement;
		if (target.closest('.dropdown-container')) return;
		onView(source.id);
	}
</script>

{#if viewMode === 'grid'}
	<div
		onclick={handleCardClick}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && onView(source.id)}
		class={cn(
			'group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 transition-colors hover:border-slate-600',
			className
		)}
	>
		<!-- Cover Image / Placeholder -->
		<div class="relative h-36 overflow-hidden">
			{#if source.coverUrl && !imageError}
				<img
					src={source.coverUrl}
					alt={source.title}
					class="h-full w-full object-cover"
					loading="lazy"
					onerror={handleImageError}
				/>
			{:else}
				<div class={cn('h-full w-full bg-gradient-to-br', placeholderColors[source.type])}></div>
			{/if}

			<!-- Type Badge -->
			<div
				class={cn(
					'absolute left-3 top-3 flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold',
					config.bgClass,
					config.textClass
				)}
			>
				<TypeIcon class="h-3 w-3" />
				{config.label}
			</div>
		</div>

		<!-- Content -->
		<div class="flex flex-1 flex-col p-4">
			<div class="flex items-start justify-between gap-2">
				<h3 class="line-clamp-2 text-sm font-semibold text-white">{source.title}</h3>
				<SourceDropdownMenu {onView} {onDelete} sourceId={source.id} />
			</div>
			<p class="mt-1 text-xs text-slate-400">{source.author}</p>
			<!-- Tags -->
			{#if source.tags.length > 0}
				<div class="mt-2 flex flex-wrap items-center gap-1">
					{#each visibleTags as tag (tag)}
						<span class="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">#{tag}</span>
					{/each}
					{#if hiddenCount > 0}
						<div class="group/tags relative">
							<span class="cursor-pointer rounded bg-slate-600 px-2 py-0.5 text-xs text-slate-400">
								+{hiddenCount}
							</span>
							<div
								class="invisible absolute bottom-full left-0 z-50 mb-2 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-lg group-hover/tags:visible"
							>
								<div class="flex flex-wrap gap-1">
									{#each hiddenTags as tag (tag)}
										<span
											class="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300 whitespace-nowrap"
											>#{tag}</span
										>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
			<div class="mt-auto flex items-center justify-between pt-3">
				<span class="text-xs text-slate-500">{source.dateAdded}</span>
				<span
					class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white"
				>
					{source.noteCount}
				</span>
			</div>
		</div>
	</div>
{:else}
	<!-- List View -->
	<div
		onclick={handleCardClick}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && onView(source.id)}
		class={cn(
			'group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600',
			className
		)}
	>
		<!-- Small Cover / Type Icon -->
		<div
			class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg overflow-hidden"
		>
			{#if source.coverUrl && !imageError}
				<img
					src={source.coverUrl}
					alt={source.title}
					class="h-full w-full object-cover"
					loading="lazy"
					onerror={handleImageError}
				/>
			{:else}
				<div
					class={cn(
						'flex h-full w-full items-center justify-center bg-gradient-to-br',
						placeholderColors[source.type]
					)}
				>
					<TypeIcon class={cn('h-6 w-6', config.textClass)} />
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="flex flex-1 flex-col gap-1">
			<div class="flex items-center gap-2">
				<span
					class={cn(
						'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold',
						config.bgClass,
						config.textClass
					)}
				>
					{config.label}
				</span>
				<h3 class="text-sm font-semibold text-white">{source.title}</h3>
			</div>
			<p class="text-xs text-slate-400">{source.author}</p>
			<span class="text-xs text-slate-500">{source.dateAdded}</span>
		</div>

		<!-- Note Count -->
		<span
			class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white"
		>
			{source.noteCount}
		</span>

		<!-- Actions -->
		<SourceDropdownMenu {onView} {onDelete} sourceId={source.id} />
	</div>
{/if}
