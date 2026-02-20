import type { PageLoad } from './$types';
import { fetchSources } from '$lib/services/sources';
import {
	mapApiSourceToDisplay,
	SORT_FIELD_MAP,
	type Source,
	type SourceFilterType,
	type SortDirection
} from '$lib/types/api';

export const load: PageLoad = async ({ url, fetch }) => {
	try {
		// Get and validate URL parameters
		const VALID_TYPES: SourceFilterType[] = ['ALL', 'BOOK', 'ARTICLE', 'VIDEO', 'OTHER'];
		const VALID_DIRECTIONS: SortDirection[] = ['asc', 'desc'];

		const rawType = url.searchParams.get('type') || 'ALL';
		const type = VALID_TYPES.includes(rawType as SourceFilterType)
			? (rawType as SourceFilterType)
			: 'ALL';

		const sortField = url.searchParams.get('sort') || 'dateAdded';

		const rawDirection = url.searchParams.get('direction') || 'desc';
		const sortDirection = VALID_DIRECTIONS.includes(rawDirection as SortDirection)
			? (rawDirection as SortDirection)
			: 'desc';

		const page = parseInt(url.searchParams.get('page') || '1', 10);
		if (isNaN(page) || page < 1) {
			throw new Error('Invalid page parameter');
		}

		// Map frontend field to API field
		const apiSortField = SORT_FIELD_MAP[sortField] || 'created_at';
		const orderBy = `${apiSortField}:${sortDirection}` as const;

		const response = await fetchSources(
			{
				page,
				perPage: 25,
				type: type === 'ALL' ? undefined : type,
				orderBy
			},
			fetch
		);

		const sources: Source[] = response.content.map(mapApiSourceToDisplay);

		return {
			sources,
			pagination: response.pagination,
			queryParams: {
				type,
				sortField,
				sortDirection,
				page
			}
		};
	} catch (error) {
		console.error('Failed to load sources:', error);
		return {
			sources: [] as Source[],
			pagination: {
				page: 1,
				totalResults: 0,
				limit: 25,
				totalPages: 0
			},
			queryParams: {
				type: 'ALL' as SourceFilterType,
				sortField: 'dateAdded',
				sortDirection: 'desc' as SortDirection,
				page: 1
			},
			error: 'Unable to load sources. Please try again later.'
		};
	}
};
