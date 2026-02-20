import type { PageLoad } from './$types';
import { getSourceById } from '$lib/services/sources';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
		if (!ID_PATTERN.test(params.id)) {
			throw new Error('Invalid source ID');
		}

		const source = await getSourceById(params.id, fetch);

		return {
			source,
			error: null
		};
	} catch (error) {
		console.error('Failed to load source:', error);
		return {
			source: null,
			error: 'Unable to load source. Please try again later.'
		};
	}
};
