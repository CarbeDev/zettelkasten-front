<script lang="ts">
	import { cn } from '$lib/utils';
	import { FileText, MessageCircle, Link, Flame } from '@lucide/svelte';

	interface Props {
		title: string;
		value: string;
		subtitle?: string;
		iconColor?: 'blue' | 'yellow' | 'green' | 'orange';
		icon: 'document' | 'chat' | 'link' | 'fire';
		accentBorder?: boolean;
		class?: string;
	}

	let {
		title,
		value,
		subtitle,
		iconColor = 'blue',
		icon,
		accentBorder = false,
		class: className
	}: Props = $props();

	const iconColorClasses = {
		blue: 'bg-blue-500/20 text-blue-400',
		yellow: 'bg-amber-500/20 text-amber-400',
		green: 'bg-emerald-500/20 text-emerald-400',
		orange: 'bg-orange-500/20 text-orange-400'
	};

	const icons = {
		document: FileText,
		chat: MessageCircle,
		link: Link,
		fire: Flame
	};

	const Icon = $derived(icons[icon]);
</script>

<div
	class={cn(
		'relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-5',
		accentBorder && 'border-l-4 border-l-orange-500',
		className
	)}
>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm font-medium text-slate-400">{title}</p>
			<p class="mt-2 text-3xl font-bold text-white">{value}</p>
			{#if subtitle}
				<p class="mt-1 text-xs text-slate-500">{subtitle}</p>
			{/if}
		</div>
		<div class={cn('rounded-lg p-2.5', iconColorClasses[iconColor])}>
			<Icon class="h-5 w-5" />
		</div>
	</div>
</div>
