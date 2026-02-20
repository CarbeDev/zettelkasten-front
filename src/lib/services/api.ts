const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

function devLog(...args: unknown[]) {
	if (import.meta.env.DEV) {
		console.log(...args);
	}
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
	body?: unknown;
}

export async function apiFetch<T>(
	endpoint: string,
	options: ApiRequestOptions = {},
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;
	const method = options.method ?? 'GET';

	devLog(`[API] ${method} ${url}`);
	if (options.body) {
		devLog('[API] Body:', JSON.stringify(options.body, null, 2));
	}

	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		body: options.body ? JSON.stringify(options.body) : undefined
	});

	devLog(`[API] Response: ${response.status} ${response.statusText}`);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		devLog('[API] Error:', errorData);
		throw new Error(errorData.message || `API error: ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	const result = await response.json();
	return result;
}
