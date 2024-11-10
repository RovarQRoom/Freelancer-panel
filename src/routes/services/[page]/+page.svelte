<script lang="ts">
    import { ServiceEntity } from '$lib/Model/Entity/Service';
	import { languageTag } from '$lib/paraglide/runtime';
    import { Button } from 'flowbite-svelte';
    import * as m from '$lib/paraglide/messages';
    
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { PenSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { serviceStore } from '$lib/Store/Service';

    let services: ServiceEntity[] = [];

    onMount(async () => {
        const data = await serviceStore.fetchAll();
        if (data) services = data;
    });

    async function handleDelete(service: ServiceEntity) {
        await serviceStore.remove(service.id);
        services = services.filter(s => s.id !== service.id);
    }
</script>

<div class="p-4">
    <div class="mb-4 flex justify-end">
        <a href="/services/add" class="btn btn-primary">{m.add()}</a>
    </div>

    <Table>
        <TableHead>
            <TableHeadCell>{m.id()}</TableHeadCell>
            <TableHeadCell>{m.title()}</TableHeadCell>
            <TableHeadCell>{m.description()}</TableHeadCell>
            <TableHeadCell>{m.media()}</TableHeadCell>
            <TableHeadCell>{m.price()}</TableHeadCell>
            <TableHeadCell>{m.actions()}</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each services as service}
                <TableBodyRow>
                    <TableBodyCell>{service.id}</TableBodyCell>
                    <TableBodyCell>{service.title[languageTag()] ?? ''}</TableBodyCell>
                    <TableBodyCell>{service.description?.[languageTag()] ?? ''}</TableBodyCell>
                    <TableBodyCell>{service.media}</TableBodyCell>
                    <TableBodyCell>{service.price}</TableBodyCell>
                    <TableBodyCell>
                        <div class="flex gap-2">
                            <button color="primary" on:click={() => goto(`/services/edit/${service.id}`)}>
                                <PenSolid class="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </button>
                            <button color="red" on:click={() => handleDelete(service)}>
                                <TrashBinSolid class="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
