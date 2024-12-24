<script lang="ts">
	import { UserEntity } from '$lib/Model/Entity/User';
	import { Img } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { PenSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/Store/User';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import { authStore } from '$lib/Store/Auth';
	import Pagination from '$lib/Component/Pagination.Component.svelte';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { Action } from '$lib/Model/Action/Action';
	import TableFilter from '$lib/Component/TableFilter.svelte';

	//TODO: When the user clicks on the row, this will open a modal to edit users Password if needed

	let filter: GenericListOptions = {
		page: 1,
		limit: 10,
		select: '*,role:Role(name)'
	};

	const filterFields = [
		{ name: m.name(), type: 'text' },
		{ name: m.email(), type: 'text' },
		{ name: m.phone(), type: 'text' },
		{ 
			name: m.role(),
			type: 'select',
			options: [
				{ value: 'admin', label: 'Admin' },
				{ value: 'user', label: 'User' }
			]
		}
	];

	function handleFilter(filters: any) {
		filter = {
			...filter,
			...filters,
			page: 1
		};
		userStore.fetchAll(filter);
	}

	onMount(async () => {
		await userStore.fetchAll(filter);
	});

	async function handleDelete(user: UserEntity) {
		await userStore.remove(user.id);
	}
</script>

<div class="p-4">
	<div class="mb-4">
		<TableFilter fields={filterFields} onFilter={handleFilter} />
	</div>

	<div class="mb-4 flex justify-end">
		{#if checkPremissionOnRoute($authStore!, [Action.CREATE_USER], $authStore?.role?.name)}
			<a
				href="/users/add"
				class="transform rounded-md bg-blue-500 px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
			>
				{m.add()}
			</a>
		{/if}
	</div>

	<div class="overflow-x-auto rounded-lg shadow-lg">
		<Table hoverable={true} class="rounded-lg">
			<TableHead class="bg-gray-50 dark:bg-gray-700">
				<TableHeadCell class="!p-4">{m.id()}</TableHeadCell>
				<TableHeadCell>{m.name()}</TableHeadCell>
				<TableHeadCell>{m.email()}</TableHeadCell>
				<TableHeadCell>{m.phone()}</TableHeadCell>
				<TableHeadCell>{m.image()}</TableHeadCell>
				{#if checkPremissionOnRoute($authStore!, [Action.READ_ROLE], $authStore?.role?.name)}
					<TableHeadCell>{m.role()}</TableHeadCell>
				{/if}
				<TableHeadCell>{m.actions()}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each $userStore.data as user}
					<TableBodyRow
						class="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 {user.id ===
						$authStore?.id
							? 'bg-blue-50 dark:bg-blue-900/20'
							: ''}"
					>
						<TableBodyCell class="!p-4">{user.id}</TableBodyCell>
						<TableBodyCell>{user.name ?? '-'}</TableBodyCell>
						<TableBodyCell>{user.email ?? '-'}</TableBodyCell>
						<TableBodyCell>{user.phone ?? '-'}</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center justify-start gap-2">
								{#if user.image}
									<Img
										src={user.image}
										alt="User Image"
										class="h-10 w-10 rounded-full object-cover shadow-sm"
									/>
								{:else}
									<span class="text-gray-500">{m.no_image()}</span>
								{/if}
							</div>
						</TableBodyCell>
						{#if checkPremissionOnRoute($authStore!, [Action.READ_ROLE], $authStore?.role?.name)}
							<TableBodyCell>{user.role?.name ?? '-'}</TableBodyCell>
						{/if}
						<TableBodyCell>
							<div class="flex gap-3">
								{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_USER], $authStore?.role?.name)}
									<button
										class="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
										on:click={() => goto(`/users/edit/${user.id}`)}
									>
										<PenSolid class="h-4 w-4 text-blue-600 dark:text-blue-400" />
									</button>
								{/if}
								{#if checkPremissionOnRoute($authStore!, [Action.DELETE_USER], $authStore?.role?.name)}
									<button
										class="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
										on:click={() => handleDelete(user)}
									>
										<TrashBinSolid class="h-4 w-4 text-red-600 dark:text-red-400" />
									</button>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex h-12 w-full justify-center">
			<Pagination store={userStore} bind:filter name="users" />
		</div>
	</div>
</div>
