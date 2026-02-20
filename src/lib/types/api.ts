// API Response Types (matching backend)
export interface PaginatedResponse<T> {
	content: T[];
	pagination: {
		page: number;
		totalResults: number;
		limit: number;
		totalPages: number;
	};
}

export interface NoteResponse {
	id: string;
	title: string;
	content: string;
	status: 'SEEDLING' | 'SAPLING' | 'EVERGREEN';
	createdAt: string;
	updatedAt: string;
}

// Frontend Types (for components)
export type NoteStatus = 'Seedling' | 'Sapling' | 'Evergreen';

export interface HarvestItem {
	id: string;
	title: string;
	tags: string[];
	status: NoteStatus;
	checked?: boolean;
}

// Type mapping helper
export function mapApiStatusToDisplay(status: NoteResponse['status']): NoteStatus {
	const statusMap: Record<NoteResponse['status'], NoteStatus> = {
		SEEDLING: 'Seedling',
		SAPLING: 'Sapling',
		EVERGREEN: 'Evergreen'
	};
	return statusMap[status];
}

// Source Types
export type SourceType = 'BOOK' | 'ARTICLE' | 'VIDEO' | 'OTHER';
export type SourceFilterType = 'ALL' | SourceType;
export type NoteStatusApi = 'SEEDLING' | 'SAPLING' | 'EVERGREEN';

export interface CreateSourceRequest {
	title: string;
	author: string;
	type: SourceType;
	url?: string;
	tags?: string[];
	draft?: string;
}

export interface UpdateSourceRequest {
	title?: string;
	author?: string;
	type?: SourceType;
	url?: string | null;
	tags?: string[];
	draft?: string | null;
}

export interface SourceResponse {
	id: string;
	title: string;
	author: string;
	type: SourceType;
	tags: string[];
	coverUrl?: string;
	createdAt: string;
	updatedAt: string;
	noteCount: number;
}

export interface Source {
	id: string;
	title: string;
	author: string;
	type: SourceType;
	tags: string[];
	coverUrl?: string;
	dateAdded: string;
	noteCount: number;
}

export interface SourceNote {
	id: string;
	title: string;
	excerpt: string;
	status: NoteStatusApi;
	createdAt: string;
	tags: string[];
}

export interface SourceDetailResponse {
	id: string;
	title: string;
	author: string;
	type: SourceType;
	tags: string[];
	coverUrl?: string;
	createdAt: string;
	updatedAt: string;
	draft?: string;
	url?: string;
	notes: SourceNote[];
}

export function mapApiSourceToDisplay(source: SourceResponse): Source {
	return {
		id: source.id,
		title: source.title,
		author: source.author,
		type: source.type,
		tags: source.tags,
		coverUrl: source.coverUrl,
		dateAdded: formatRelativeDate(source.createdAt),
		noteCount: source.noteCount
	};
}

function formatRelativeDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Added today';
	if (diffDays === 1) return 'Added yesterday';
	if (diffDays < 7) return `Added ${diffDays} days ago`;
	if (diffDays < 14) return 'Added 1 week ago';
	if (diffDays < 30) return `Added ${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 60) return 'Added 1 month ago';
	if (diffDays < 365) return `Added ${Math.floor(diffDays / 30)} months ago`;
	return `Added ${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

// Types for sorting and pagination
export type SourceSortField = 'created_at' | 'updated_at' | 'title' | 'author' | 'note_count';
export type SortDirection = 'asc' | 'desc';

export interface SourceQueryParams {
	page?: number;
	perPage?: number;
	type?: SourceType;
	orderBy?: `${SourceSortField}:${SortDirection}`;
}

// Mapping frontend fields to API fields
export const SORT_FIELD_MAP: Record<string, SourceSortField> = {
	dateAdded: 'created_at',
	title: 'title',
	author: 'author',
	noteCount: 'note_count',
	type: 'created_at' // No type sorting, use created_at as fallback
};

// Reverse mapping for converting API to frontend
export const SORT_FIELD_REVERSE_MAP: Record<SourceSortField, string> = {
	created_at: 'dateAdded',
	updated_at: 'dateAdded', // No updated column yet
	title: 'title',
	author: 'author',
	note_count: 'noteCount'
};
