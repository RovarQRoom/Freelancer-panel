<script lang="ts">
    import { ServiceEntity } from '$lib/Model/Entity/Service';
	import { languageTag } from '$lib/paraglide/runtime';
    import { Button, Img } from 'flowbite-svelte';
    import * as m from '$lib/paraglide/messages';
    import Pagination from '$lib/Component/Pagination.Component.svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { PenSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { serviceStore } from '$lib/Store/Service';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';

    let filter: GenericListOptions = {
        page: 1,
        limit: 10,
        select: `*, title(${languageTag()}), description(${languageTag()}), media(${languageTag()}), supervised_by(name), created_by(name)`,
    };

    onMount(async () => {
        await serviceStore.fetchAll(filter);
    });

    async function handleDelete(service: ServiceEntity) {
        await serviceStore.remove(service.id);
    }
</script>

<div class="p-4">
    <div class="mb-4 flex justify-end">
        <a 
            href="/services/add" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
            {m.add()}
        </a>
    </div>

    <div class="overflow-x-auto shadow-lg rounded-lg">
        <Table hoverable={true} class="rounded-lg">
            <TableHead class="bg-gray-50 dark:bg-gray-700" >
                <TableHeadCell class="!p-4">{m.id()}</TableHeadCell>
                <TableHeadCell>{m.title()}</TableHeadCell>
                <TableHeadCell>{m.description()}</TableHeadCell>
                <TableHeadCell>{m.media()}</TableHeadCell>
                <TableHeadCell>{m.price()}</TableHeadCell>
                <TableHeadCell>{m.supervisor()}</TableHeadCell>
                <TableHeadCell>{m.created_by()}</TableHeadCell>
                <TableHeadCell>{m.actions()}</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each $serviceStore.data as service}
                    <TableBodyRow class="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <TableBodyCell class="!p-4">{service.id}</TableBodyCell>
                        <TableBodyCell>{service.title[languageTag()] ?? '-'}</TableBodyCell>
                        <TableBodyCell>{service.description?.[languageTag()] ?? '-'}</TableBodyCell>
                        <TableBodyCell>
                            <div class="flex items-center gap-2 justify-center">
                                {#if service.media && service.media?.[languageTag()]}
                                    <Img src={service.media?.[languageTag()]} alt="Service Media" class="w-10 h-10 rounded-md object-cover shadow-sm" />
                                {:else}
                                    <span class="text-gray-500">{m.no_media()}</span>
                                {/if}
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>{service.price ?? '-'}</TableBodyCell>
                        <TableBodyCell>{service.supervised_by ? service.supervised_by.name : '-'}</TableBodyCell>
                        <TableBodyCell>{service.created_by ? service.created_by.name : '-'}</TableBodyCell>
                        <TableBodyCell>
                            <div class="flex gap-3">
                                <button 
                                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                    on:click={() => goto(`/services/edit/${service.id}`)}
                                >
                                    <PenSolid class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </button>
                                <button 
                                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                    on:click={() => handleDelete(service)}
                                >
                                    <TrashBinSolid class="h-4 w-4 text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>    
        </Table>
        <div class="w-full h-12 flex justify-center">
			<Pagination store={serviceStore} bind:filter={filter} name="services" />
		  </div>
    </div>
</div>
