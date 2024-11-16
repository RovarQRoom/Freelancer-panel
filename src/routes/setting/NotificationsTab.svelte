<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Button
    } from 'flowbite-svelte';
    import { PenSolid, TrashBinSolid, CirclePlusSolid } from 'flowbite-svelte-icons';
    import * as m from '$lib/paraglide/messages';

    // Sample data structure
    interface TableItem {
        id: number;
        title: string;
        content: string;
        status: string;
        date: string;
    }

    // Sample data
    let items: TableItem[] = [];
</script>

<div class="p-6">
    <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-transparent">
            {m.notifications()}
        </h1>
        <!-- <Button
            class="flex items-center gap-2 transform bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
            transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
            <CirclePlusSolid class="h-5 w-5" />
            Add New
        </Button> -->
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <Table hoverable={true} class="w-full">
            <TableHead class="bg-gray-50 dark:bg-gray-700 text-center">
                <TableHeadCell class="font-semibold">Title</TableHeadCell>
                <TableHeadCell class="font-semibold">Content</TableHeadCell>
                <TableHeadCell class="font-semibold">Status</TableHeadCell>
                <TableHeadCell class="font-semibold">Date</TableHeadCell>
                <!-- <TableHeadCell class="font-semibold">Actions</TableHeadCell> -->
            </TableHead>
            <TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
                {#each items as item}
                    <TableBodyRow class="text-center">
                        <TableBodyCell>{item.title}</TableBodyCell>
                        <TableBodyCell>{item.content}</TableBodyCell>
                        <TableBodyCell>{item.status}</TableBodyCell>
                        <TableBodyCell>{item.date}</TableBodyCell>
                        <!-- <TableBodyCell>
                            <div class="flex justify-center gap-2">
                                <button
                                    class="p-2 hover:scale-110 transition-transform duration-200"
                                >
                                    <PenSolid class="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <button
                                    class="p-2 hover:scale-110 transition-transform duration-200"
                                >
                                    <TrashBinSolid class="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        </TableBodyCell> -->
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </div>
</div>