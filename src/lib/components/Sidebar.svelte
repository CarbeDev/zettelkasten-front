<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/state';

	interface NavItem {
		emoji: string;
		label: string;
		href: string;
		badge?: number;
	}

	interface RecentNote {
		title: string;
		href: string;
	}

	interface HarvestNote {
		emoji: string;
		title: string;
		href: string;
	}

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	const navItems: NavItem[] = [
		{ emoji: '🏠', label: 'Dashboard', href: '/dashboard' },
		{ emoji: '💡', label: 'Notes', href: '/notes' },
		{ emoji: '📝', label: 'Essay', href: '/essay' },
		{ emoji: '📚', label: 'Sources', href: '/sources' },
		{ emoji: '📥', label: 'Inbox', href: '/inbox', badge: 3 }
	];

	const recentNotes: RecentNote[] = [
		{ title: 'The 80/20 Principle', href: '/notes/80-20-principle' },
		{ title: 'React Server Components', href: '/notes/react-server-components' },
		{ title: 'Mental Models 2024', href: '/notes/mental-models-2024' },
		{ title: 'Project Alpha Specs', href: '/notes/project-alpha-specs' },
		{ title: 'Gardening Tips', href: '/notes/gardening-tips' }
	];

	const harvestNotes: HarvestNote[] = [
		{ emoji: '🌱', title: 'Philosophy of Science', href: '/notes/philosophy-of-science' },
		{ emoji: '🌿', title: 'Economics 101 Notes', href: '/notes/economics-101' },
		{ emoji: '🌱', title: 'Coding Interview Prep', href: '/notes/coding-interview-prep' },
		{ emoji: '🌿', title: 'Game Design Ideas', href: '/notes/game-design-ideas' },
		{ emoji: '🌱', title: 'Travel Bucket List', href: '/notes/travel-bucket-list' }
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<aside class={cn('flex h-full w-64 flex-col bg-slate-900 text-slate-100', className)}>
	<!-- Header -->
	<div class="border-b border-slate-700/50 px-5 py-5">
		<h1 class="text-lg font-semibold text-white">My Knowledge Base</h1>
		<p class="mt-1 text-xs text-slate-400">Last sync: Just now</p>
	</div>

	<!-- Main Navigation -->
	<nav class="flex-1 overflow-y-auto px-3 py-4">
		<ul class="space-y-1">
			{#each navItems as item (item.href)}
				<li>
					<a
						href={item.href}
						class={cn(
							'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
							isActive(item.href)
								? 'bg-slate-700/70 text-white'
								: 'text-slate-300 hover:bg-slate-800 hover:text-white'
						)}
					>
						<span class="text-base">{item.emoji}</span>
						<span class="flex-1">{item.label}</span>
						{#if item.badge}
							<span
								class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white"
							>
								{item.badge}
							</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Recent Notes Section -->
		<div class="mt-8">
			<h2 class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
				Recent Notes
			</h2>
			<ul class="space-y-0.5">
				{#each recentNotes as note (note.href)}
					<li>
						<a
							href={note.href}
							class="block truncate rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
						>
							{note.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Notes to Harvest Section -->
		<div class="mt-8">
			<h2 class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
				Notes to Harvest
			</h2>
			<ul class="space-y-0.5">
				{#each harvestNotes as note (note.href)}
					<li>
						<a
							href={note.href}
							class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
						>
							<span>{note.emoji}</span>
							<span class="truncate">{note.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</aside>
