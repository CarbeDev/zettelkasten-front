import { apiFetch } from './api';
import type { SearchResult } from '../types/api';

export async function search(q: string, limit = 10, signal?: AbortSignal): Promise<SearchResult[]> {
	const params = new URLSearchParams({ q, limit: String(limit) });
	return apiFetch<SearchResult[]>(`/search?${params}`, { signal });
}
