import type {
	PaginatedResponse,
	SourceResponse,
	CreateSourceRequest,
	UpdateSourceRequest,
	SourceQueryParams,
	SourceDetailResponse
} from '$lib/types/api';
import { apiFetch } from './api';

export async function fetchSources(
	options: SourceQueryParams = {},
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<PaginatedResponse<SourceResponse>> {
	const { page = 1, perPage = 25, type, orderBy = 'created_at:desc' } = options;

	const params = new URLSearchParams();
	params.append('page', page.toString());
	params.append('per_page', perPage.toString());
	params.append('order_by', orderBy);

	if (type) {
		params.append('type', type);
	}

	return apiFetch<PaginatedResponse<SourceResponse>>(`/sources?${params.toString()}`, {}, fetch);
}

export async function createSource(
	data: CreateSourceRequest,
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<SourceResponse> {
	return apiFetch<SourceResponse>('/sources', { method: 'POST', body: data }, fetch);
}

export async function getSourceById(
	id: string,
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<SourceDetailResponse> {
	return apiFetch<SourceDetailResponse>(`/sources/${id}`, {}, fetch);
}

export async function updateSource(
	id: string,
	updates: UpdateSourceRequest,
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<SourceDetailResponse> {
	return apiFetch<SourceDetailResponse>(`/sources/${id}`, { method: 'PATCH', body: updates }, fetch);
}

export async function deleteSource(
	id: string,
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<void> {
	await apiFetch<void>(`/sources/${id}`, { method: 'DELETE' }, fetch);
}
