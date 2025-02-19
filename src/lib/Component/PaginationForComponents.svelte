<script lang="ts">
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import * as m from '$lib/paraglide/messages';

	let {
		store,
		filter = $bindable<GenericListOptions>(),
	}: {
		store: any;
		filter: GenericListOptions;
	} = $props();

	const previous = async () => {
		if (filter.page === 1) {
			return;
		}
		filter.page = $store.currentPage - 1;
	};

	const next = async () => {
		if (filter.page == $store.pages!) {
			return;
		}
		filter.page = $store.currentPage + 1;
	};

	const setPage = async (page: number) => {
		if (page === $store.currentPage) return;
		filter.page = page;
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
	<nav class="pagination" aria-label="Pagination">
		<button
			class="pagination-button"
			onclick={() => previous()}
			disabled={filter.page === 1}
			aria-label={m.previous_page()}
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
					aria-label={m.go_to_page({page})}
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
			aria-label={m.next_page()}
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
		min-height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		font-family: system-ui, -apple-system, sans-serif;
		padding: 1rem;
		background: var(--pagination-bg, #ffffff);
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
		min-width: 2.75rem;
		height: 2.75rem;
		padding: 0.5rem;
		border: none;
		border-radius: 0.75rem;
		background: var(--button-bg, #f3f4f6);
		color: var(--text-color, #374151);
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 0.95rem;
		font-weight: 500;
		position: relative;
		overflow: hidden;
	}

	.pagination-button {
		background: var(--nav-button-bg, #f3f4f6);
	}

	.pagination-button:hover:not(:disabled),
	.page-number:hover:not(.active) {
		background: var(--hover-bg, #e5e7eb);
		transform: translateY(-1px);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.pagination-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.page-number.active {
		background: var(--active-bg, #3b82f6);
		color: white;
		font-weight: 600;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
	}

	.page-number.active:hover {
		transform: none;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.pagination {
			--pagination-bg: #1f2937;
			--button-bg: #374151;
			--nav-button-bg: #374151;
			--text-color: #e5e7eb;
			--hover-bg: #4b5563;
			--active-bg: #3b82f6;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
		}
	}

	@media (max-width: 640px) {
		.pagination {
			gap: 0.75rem;
			padding: 0.75rem;
		}

		.pagination-button,
		.page-number {
			min-width: 2.25rem;
			height: 2.25rem;
			padding: 0.25rem;
			font-size: 0.875rem;
			border-radius: 0.5rem;
		}
	}
</style>
