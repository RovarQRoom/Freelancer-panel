<script lang="ts">
	import { ServiceEntity } from '$lib/Model/Entity/Service';
	import { languageTag } from '$lib/paraglide/runtime';
	import { Button, Img } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import Pagination from '$lib/Component/Pagination.Component.svelte';
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
	import { serviceStore } from '$lib/Store/Service';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { authStore } from '$lib/Store/Auth';
	import { Action } from '$lib/Model/Action/Action';

	let filter: GenericListOptions = {
		page: 1,
		limit: 10,
		select: `*, title(${languageTag()}), description(${languageTag()}), media(${languageTag()}), supervised_by(name), created_by(name)`
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
		{#if checkPremissionOnRoute($authStore!, [Action.CREATE_SERVICE], $authStore?.role?.name)}
			<a
				href="/services/add"
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
					<TableBodyRow
						class="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600"
					>
						<TableBodyCell class="!p-4">{service.id}</TableBodyCell>
						<TableBodyCell>{service.title[languageTag()] ?? '-'}</TableBodyCell>
						<TableBodyCell>{service.description?.[languageTag()] ?? '-'}</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center justify-center gap-2">
								{#if service.media && service.media?.[languageTag()]}
									<Img
										src={service.media?.[languageTag()]}
										alt="Service Media"
										class="h-10 w-10 rounded-md object-cover shadow-sm"
									/>
								{:else}
									<span class="text-gray-500">{m.no_media()}</span>
								{/if}
							</div>
						</TableBodyCell>
						<TableBodyCell>{service.price ?? '-'}</TableBodyCell>
						<TableBodyCell>{service.supervised_by ? service.supervised_by.name : '-'}</TableBodyCell
						>
						<TableBodyCell>{service.created_by ? service.created_by.name : '-'}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-3">
								{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_SERVICE], $authStore?.role?.name)}
									<button
										class="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
										on:click={() => goto(`/services/edit/${service.id}`)}
									>
										<PenSolid class="h-4 w-4 text-blue-600 dark:text-blue-400" />
									</button>
								{/if}
								{#if checkPremissionOnRoute($authStore!, [Action.DELETE_SERVICE], $authStore?.role?.name)}
									<button
										class="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
										on:click={() => handleDelete(service)}
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
			<Pagination store={serviceStore} bind:filter name="services" />
		</div>
	</div>
</div>
