export interface InfiniteScrollParams {
	onLoadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
}

export function infiniteScroll(node: HTMLElement, params: InfiniteScrollParams) {
	let { onLoadMore, hasMore, isLoading } = params;

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting && hasMore && !isLoading) {
				onLoadMore();
			}
		},
		{ rootMargin: '100px' }
	);

	if (hasMore) {
		observer.observe(node);
	}

	return {
		update(newParams: InfiniteScrollParams) {
			onLoadMore = newParams.onLoadMore;
			hasMore = newParams.hasMore;
			isLoading = newParams.isLoading;

			observer.unobserve(node);
			if (hasMore) {
				observer.observe(node);
			}
		},
		destroy() {
			observer.disconnect();
		}
	};
}
