import type { PageLoad } from './$types';
import { fetchNotesToHarvest } from '$lib/services/notes';
import { mapApiStatusToDisplay, type HarvestItem } from '$lib/types/api';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetchNotesToHarvest({}, fetch);

		const harvestItems: HarvestItem[] = response.content.map((note) => ({
			id: note.id,
			title: note.title,
			tags: [], // Empty for now, will be added to API later
			status: mapApiStatusToDisplay(note.status),
			checked: false
		}));

		return {
			harvestItems,
			harvestTotalCount: response.pagination.totalResults,
			harvestNewCount: response.content.length
		};
	} catch (error) {
		// Log detailed error server-side only
		console.error('Failed to load harvest items:', error);

		// Return empty state with generic error message for client
		return {
			harvestItems: [] as HarvestItem[],
			harvestTotalCount: 0,
			harvestNewCount: 0,
			error: 'Unable to load data. Please try again later.'
		};
	}
};
