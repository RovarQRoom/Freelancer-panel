<script lang="ts">
    import { ServiceEntity } from '$lib/Model/Entity/Service';
	import { languageTag } from '$lib/paraglide/runtime';
    import { Button } from 'flowbite-svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    let services: ServiceEntity[] = [];

    function handleAdd() {
        // TODO: Implement add service functionality
    }

    function handleEdit(service: ServiceEntity) {
        // TODO: Implement edit service functionality
    }

    function handleDelete(service: ServiceEntity) {
        // TODO: Implement delete service functionality
    }
</script>

<div class="p-4">
    <div class="mb-4 flex justify-end">
        <Button color="blue" on:click={handleAdd}>Add Service</Button>
    </div>

    <Table>
        <TableHead>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            <TableHeadCell>Media</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>Language</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each services as service}
                <TableBodyRow>
                    <TableBodyCell>{service.id}</TableBodyCell>
                    <TableBodyCell>{service.title[languageTag()] ?? ''}</TableBodyCell>
                    <TableBodyCell>{service.description?.[languageTag()] ?? ''}</TableBodyCell>
                    <TableBodyCell>{service.media}</TableBodyCell>
                    <TableBodyCell>{service.price}</TableBodyCell>
                    <TableBodyCell>{service.language}</TableBodyCell>
                    <TableBodyCell>
                        <div class="flex gap-2">
                            <Button color="blue" size="xs" on:click={() => handleEdit(service)}>
                                Edit
                            </Button>
                            <Button color="red" size="xs" on:click={() => handleDelete(service)}>
                                Delete
                            </Button>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
