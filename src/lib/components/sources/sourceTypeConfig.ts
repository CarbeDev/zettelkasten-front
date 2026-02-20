import { BookOpen, Video, FileText, File } from '@lucide/svelte';
import type { SourceType } from '$lib/types/api';

export const typeConfig: Record<
	SourceType,
	{ label: string; bgClass: string; textClass: string; icon: typeof BookOpen }
> = {
	BOOK: { label: 'BOOK', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400', icon: BookOpen },
	VIDEO: {
		label: 'VIDEO',
		bgClass: 'bg-purple-500/20',
		textClass: 'text-purple-400',
		icon: Video
	},
	ARTICLE: {
		label: 'ARTICLE',
		bgClass: 'bg-emerald-500/20',
		textClass: 'text-emerald-400',
		icon: FileText
	},
	OTHER: { label: 'OTHER', bgClass: 'bg-slate-500/20', textClass: 'text-slate-400', icon: File }
};

export const placeholderColors: Record<SourceType, string> = {
	BOOK: 'from-blue-900/50 to-blue-800/30',
	VIDEO: 'from-purple-900/50 to-purple-800/30',
	ARTICLE: 'from-emerald-900/50 to-emerald-800/30',
	OTHER: 'from-slate-800/50 to-slate-700/30'
};
