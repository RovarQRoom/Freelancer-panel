<script lang="ts">
  export let totalPages: number = 1;
  export let currentPage: number = 1;
  export let maxVisiblePages: number = 5;

  $: pages = generatePageNumbers(currentPage, totalPages, maxVisiblePages);

  function generatePageNumbers(current: number, total: number, maxVisible: number): (number | '...')[] {
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let pages: (number | '...')[] = [1];
    
    const leftBound = Math.max(2, current - Math.floor(maxVisible / 2));
    const rightBound = Math.min(total - 1, current + Math.floor(maxVisible / 2));

    if (leftBound > 2) pages.push('...');
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }
    if (rightBound < total - 1) pages.push('...');
    if (total > 1) pages.push(total);

    return pages;
  }

  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      dispatch('pageChange', { page });
    }
  }

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<nav class="pagination bg-[#F9FAFB] dark:bg-[#191919]" aria-label="Pagination">
  <button
    class="pagination-button"
    on:click={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    aria-label="Previous page"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>

  <div class="pagination-numbers">
    {#each pages as page}
      {#if page === '...'}
        <span class="ellipsis">...</span>
      {:else}
        <button
          class="page-number"
          class:active={page === currentPage}
          on:click={() => handlePageChange(page)}
          aria-label="Go to page {page}"
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      {/if}
    {/each}
  </div>

  <button
    class="pagination-button"
    on:click={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    aria-label="Next page"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
</nav>

<style>
  .pagination {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    font-family: system-ui, -apple-system, sans-serif;
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
