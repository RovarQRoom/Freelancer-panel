<script lang="ts">
  import { Button, Input, Select, Modal } from 'flowbite-svelte';
  import { SearchOutline, FilterSolid, ArrowDownOutline } from 'flowbite-svelte-icons';
  import * as m from '$lib/paraglide/messages';
  
  export let onFilter: (filters: any) => void;
  export let fields: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'date';
    options?: Array<{ value: string; label: string }>;
  }>;

  let showFiltersModal = false;
  let filterValues: Record<string, any> = {};

  function handleFilter() {
    onFilter(filterValues);
  }

  function resetFilters() {
    filterValues = {};
    onFilter({});
    showFiltersModal = false;
  }

  function applyFilters() {
    handleFilter();
    showFiltersModal = false;
  }
</script>

<div class="mb-4 w-full">
  <div class="flex flex-col gap-4 sm:flex-row">
    <!-- Search Bar -->
    <div class="relative flex-1">
      <Input
        class="rounded-lg pl-10 pr-4 shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        placeholder={m.search()}
        bind:value={filterValues.search}
        on:input={handleFilter}
      >
        <SearchOutline slot="left" class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </Input>
    </div>

    <!-- Filter Button -->
    <Button
      class="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
      on:click={() => (showFiltersModal = true)}
    >
      <FilterSolid class="h-4 w-4" />
      <span>{m.filters()}</span>
    </Button>
  </div>
</div>

<!-- Filter Modal -->
<Modal
  bind:open={showFiltersModal}
  size="md"
  class="rounded-xl"
  autoclose={false}
>
  <div class="p-6">
    <h3 class="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
      {m.filters()}
    </h3>

    <div class="space-y-4">
      {#each fields as field}
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.name}
          </label>
          
          {#if field.type === 'select' && field.options}
            <Select 
              class="rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              bind:value={filterValues[field.name]}
            >
              <option value="">{m.all()}</option>
              {#each field.options as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </Select>
          {:else if field.type === 'date'}
            <Input
              type="date"
              class="rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              bind:value={filterValues[field.name]}
            />
          {:else}
            <Input
              type={field.type}
              class="rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              bind:value={filterValues[field.name]}
            />
          {/if}
        </div>
      {/each}
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <Button
        color="alternative"
        class="px-6 transition-all duration-300 hover:scale-105"
        on:click={resetFilters}
      >
        {m.reset()}
      </Button>
      <Button
        class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
        on:click={applyFilters}
      >
        {m.apply()}
      </Button>
    </div>
  </div>
</Modal>

<style>
  :global(.modal-content) {
    @apply shadow-xl;
  }
  
  :global(.input-field:focus) {
    @apply ring-2 ring-blue-500;
  }
</style> 