<script lang="ts">
    import { UserEntity } from '$lib/Model/Entity/User';
    import {  Img } from 'flowbite-svelte';
    import * as m from '$lib/paraglide/messages';
    
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { PenSolid, TrashBinSolid } from 'flowbite-svelte-icons';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { userStore } from '$lib/Store/User';
    import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import { authStore } from '$lib/Store/Auth';

    //TODO: When the user clicks on the row, this will open a modal to edit users Password if needed

    let filter: GenericListOptions = {
        page: 1,
        limit: 10,
        select: '*,role:Role(name)',
    };

    onMount(async () => {
        await userStore.fetchAll(filter);
    });

    async function handleDelete(user: UserEntity) {
        await userStore.remove(user.id);
    }
</script>

<div class="p-4">
    <div class="mb-4 flex justify-end">
        <a 
            href="/users/add" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
            {m.add()}
        </a>
    </div>

    <div class="overflow-x-auto shadow-lg rounded-lg">
        <Table hoverable={true} class="rounded-lg">
            <TableHead class="bg-gray-50 dark:bg-gray-700">
                <TableHeadCell class="!p-4">{m.id()}</TableHeadCell>
                <TableHeadCell>{m.name()}</TableHeadCell>
                <TableHeadCell>{m.email()}</TableHeadCell>
                <TableHeadCell>{m.phone()}</TableHeadCell>
                <TableHeadCell>{m.image()}</TableHeadCell>
                <TableHeadCell>{m.role()}</TableHeadCell>
                <TableHeadCell>{m.actions()}</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each $userStore.data as user}
                    <TableBodyRow class="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 {user.id === $authStore?.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}">
                        <TableBodyCell class="!p-4">{user.id}</TableBodyCell>
                        <TableBodyCell>{user.name ?? '-'}</TableBodyCell>
                        <TableBodyCell>{user.email ?? '-'}</TableBodyCell>
                        <TableBodyCell>{user.phone ?? '-'}</TableBodyCell>
                        <TableBodyCell>
                            <div class="flex items-center gap-2 justify-center">
                                {#if user.image}
                                    <Img src={user.image} alt="User Image" class="w-10 h-10 rounded-full object-cover shadow-sm" />
                                {:else}
                                    <span class="text-gray-500">{m.no_image()}</span>
                                {/if}
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>{user.role?.name ?? '-'}</TableBodyCell>
                        <TableBodyCell>
                            <div class="flex gap-3">
                                <button 
                                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                    on:click={() => goto(`/users/edit/${user.id}`)}
                                >
                                    <PenSolid class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </button>
                                <button 
                                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                    on:click={() => handleDelete(user)}
                                >
                                    <TrashBinSolid class="h-4 w-4 text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </div>
</div>