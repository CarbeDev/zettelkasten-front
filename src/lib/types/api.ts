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
