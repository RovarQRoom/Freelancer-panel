<script lang="ts">
	import { goto } from '$app/navigation';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';

	let {
		store,
		filter = $bindable<GenericListOptions>(),
		name = $bindable<string>()
	}: {
		store: any;
		filter: GenericListOptions;
		name: string;
	} = $props();

	const previous = async () => {
		if (filter.page === 1) {
			return;
		}
		filter.page = $store.currentPage - 1;
		goto(`/${name}/${filter.page}`);
	};

	const next = async () => {
		if (filter.page == $store.pages!) {
			return;
		}
		filter.page = $store.currentPage + 1;
		goto(`/${name}/${filter.page}`);
	};

	const setPage = async (page: number) => {
		if (page === $store.currentPage) return;
		filter.page = page;
		goto(`/${name}/${page}`);
	};

	function getPageNumbers() {
		const totalPages = $store.pages;
		const pageNumbers = [];

		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}

		return pageNumbers;
	}

	$effect(() => {
		if (filter.page) {
			store.fetchAll(filter);
		}
	});
</script>

{#if $store && $store.pages && $store.pages > 1}
	<nav class="pagination bg-[#F9FAFB] dark:bg-[#191919]" aria-label="Pagination">
		<button
			class="pagination-button"
			onclick={() => previous()}
			disabled={filter.page === 1}
			aria-label="Previous page"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
		</button>

		<div class="pagination-numbers">
			{#each getPageNumbers() as page}
				<button
					class="page-number"
					class:active={page === filter.page}
					onclick={() => setPage(page)}
					aria-label="Go to page {page}"
					aria-current={page === filter.page ? 'page' : undefined}
				>
					{page}
				</button>
			{/each}
		</div>

		<button
			class="pagination-button"
			onclick={() => next()}
			disabled={filter.page === $store.pages!}
			aria-label="Next page"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
	</nav>
{/if}

<style>
	.pagination {
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.pagination-numbers {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.pagination-button,
	.page-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
		height: 2.5rem;
		padding: 0.5rem;
		border: none;
		border-radius: 0.5rem;
		color: #374151;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.875rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.pagination-button {
		background: #c5c5c5;
	}

	.pagination-button:hover:not(:disabled),
	.page-number:hover:not(.active) {
		background: #f3f4f6;
	}

	.pagination-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-number.active {
		background: #3b82f6;
		color: white;
		font-weight: 500;
	}

	.ellipsis {
		color: #6b7280;
		padding: 0 0.25rem;
	}

	@media (max-width: 640px) {
		.pagination {
			gap: 0.5rem;
		}

		.pagination-button,
		.page-number {
			min-width: 2rem;
			height: 2rem;
			padding: 0.25rem;
		}
	}
</style>
