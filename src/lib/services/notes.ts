import type { PaginatedResponse, NoteResponse } from '$lib/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export interface FetchNotesToHarvestOptions {
	page?: number;
	perPage?: number;
}

export async function fetchNotesToHarvest(
	options: FetchNotesToHarvestOptions = {},
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<PaginatedResponse<NoteResponse>> {
	const { page = 1, perPage = 3 } = options;

	const params = new URLSearchParams({
		page: page.toString(),
		per_page: perPage.toString(),
		order_by: 'updated_at:asc',
		status: 'SEEDLING,SAPLING'
	});

	const response = await fetch(`${API_BASE_URL}/notes?${params.toString()}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
