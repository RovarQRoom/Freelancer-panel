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
	import { extraServiceStore } from '$lib/Store/ExtraService';
	import AddExtraServiceModal from '../AddExtraServiceModal.svelte';
	import { Modal } from 'flowbite-svelte';
	import { CirclePlusSolid } from 'flowbite-svelte-icons';
	import { toastStore } from '$lib/Store/Toast';
	import EditExtraServiceModal from '../EditExtraServiceModal.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import TableFilter from '$lib/Component/TableFilter.svelte';

	let filter: GenericListOptions = $state({
		page: 1,
		limit: 10,
		select: `*, title(${languageTag()}), description(${languageTag()}), media(${languageTag()}), supervised_by(name), created_by(name)`
	});

	let showExtraServicesModal = $state(false);
	let showCreateExtraServiceModal = $state(false);
	let selectedServiceId = $state<number | null>(null);
	let showEditExtraServiceModal = $state(false);
	let selectedExtraServiceId = $state<number | null>(null);
	let activeTab = $state(0);

	const filterFields = [
		{ name: 'title', type: 'text' },
		{ name: 'price', type: 'number' },
		{ 
			name: 'status', 
			type: 'select',
			options: [
				{ value: 'active', label: m.active() },
				{ value: 'inactive', label: m.inactive() }
			]
		},
		{ name: 'created_at', type: 'date' }
	];

	function handleFilter(filters: any) {
		filter = {
			...filter,
			...filters,
			page: 1
		};
		serviceStore.fetchAll(filter);
	}

	onMount(async () => {
		await serviceStore.fetchAll(filter);
	});

	async function handleDelete(service: ServiceEntity) {
			await serviceStore.remove(service.id);
	}

	async function handleGetExtraServices(serviceId: number) {
		try {
			await extraServiceStore.fetchAll({
				select: `id, title(${languageTag()}), description(${languageTag()}), price, icon, service`,
				fieldOption: 'service',
				isEmpty: true,
				equal: serviceId?.toString()
			});
			selectedServiceId = serviceId;
			showExtraServicesModal = true;
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}

	async function handleRemoveExtraService(id: number) {
		await extraServiceStore.remove(id);
	}
</script>

<div class="p-4">
	<div class="mb-6 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
		<Tabs style="pills" class="!border-b-0">
			<TabItem open activeClasses="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105 transition-all duration-300" 
					inactiveClasses="text-gray-500 hover:text-gray-700  dark:hover:text-white dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
					on:click={() => activeTab = 0}>
				<div slot="title" class="flex items-center gap-2 px-5 py-2.5">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
					</svg>
					<span class="font-medium">{m.services()}</span>
				</div>
				
				<!-- Services Tab Content -->
				<div class="mt-4">
					<div class="mb-4 flex justify-end">
						{#if checkPremissionOnRoute($authStore!, [Action.CREATE_SERVICE], $authStore?.role?.name)}
							<a href="/services/add"
								class="transform rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
								{m.add()}
							</a>
						{/if}
					</div>

					<div class="overflow-x-auto rounded-lg border border-gray-100 shadow-md dark:border-gray-700">
						<TableFilter fields={filterFields} onFilter={handleFilter} />
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
										on:click={() => handleGetExtraServices(service.id)}
									>
										<TableBodyCell class="!p-4">{service.id}</TableBodyCell>
										<TableBodyCell>{service.title[languageTag()] ?? '-'}</TableBodyCell>
										<TableBodyCell>
											{#if service.description?.[languageTag()]}
												{(service.description?.[languageTag()] ?? '').length > 100 
													? (service.description?.[languageTag()] ?? '').slice(0, 100) + '...' 
													: service.description?.[languageTag()] ?? '-'}
											{:else}
												-
											{/if}
										</TableBodyCell>
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
										<TableBodyCell>
											{service.price
												? Intl.NumberFormat(languageTag(), {
														style: 'currency',
														currency: 'IQD'
												  }).format(service.price)
												: '-'}
										</TableBodyCell>
										<TableBodyCell>{service.supervised_by ? service.supervised_by.name : '-'}</TableBodyCell>
										<TableBodyCell>{service.created_by ? service.created_by.name : '-'}</TableBodyCell>
										<TableBodyCell>
											<div class="flex gap-3">
												{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_SERVICE], $authStore?.role?.name)}
													<button
														class="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
														onclick={() => goto(`/services/edit/${service.id}`)}
													>
														<PenSolid class="h-4 w-4 text-blue-600 dark:text-blue-400" />
													</button>
												{/if}
												{#if checkPremissionOnRoute($authStore!, [Action.DELETE_SERVICE], $authStore?.role?.name)}
													<button
														class="rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
														onclick={() => handleDelete(service)}
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
						<div class="flex h-12 w-full justify-center bg-white dark:bg-gray-800">
							<Pagination store={serviceStore} bind:filter name="services" />
						</div>
					</div>
				</div>
			</TabItem>

			<TabItem activeClasses="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105 transition-all duration-300"
					 inactiveClasses="text-gray-500 hover:text-gray-700  dark:hover:text-white dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
					 on:click={() => activeTab = 1}>
				<div slot="title" class="flex items-center gap-2 px-5 py-2.5">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
						<path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
					</svg>
					<span class="font-medium">{m.service_jobs()}</span>
				</div>

				<!-- Service Jobs Tab Content -->
				<div class="mt-4">
					<div class="mb-4 flex justify-end">
						<!-- Add button for service jobs if needed -->
					</div>

					<div class="overflow-x-auto rounded-lg border border-gray-100 shadow-md dark:border-gray-700">
						<Table hoverable={true} class="rounded-lg">
							<TableHead class="bg-gray-50 dark:bg-gray-700">
								<TableHeadCell class="!p-4">{m.id()}</TableHeadCell>
								<TableHeadCell>{m.title()}</TableHeadCell>
								<TableHeadCell>{m.description()}</TableHeadCell>
								<TableHeadCell>{m.status()}</TableHeadCell>
								<TableHeadCell>{m.created_at()}</TableHeadCell>
								<TableHeadCell>{m.actions()}</TableHeadCell>
							</TableHead>
							<TableBody>
								<!-- Add your service jobs data here -->
							</TableBody>
						</Table>
						<!-- Add pagination for service jobs if needed -->
					</div>
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>

<Modal
	bind:open={showExtraServicesModal}
	size="xl"
	autoclose={false}
	class="overflow-hidden rounded-xl shadow-xl"
>
	<div class="p-6">
		<div class="mb-6 flex items-center justify-between">
			<h3
				class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent"
			>
				{m.extra_services()}
			</h3>
			<div class="flex gap-3">
				{#if checkPremissionOnRoute($authStore!, [Action.CREATE_EXTRA_SERVICE], $authStore?.role?.name)}
					<Button
						class="flex transform items-center gap-2 bg-gradient-to-r
					from-primary-light-500 to-purple-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
						on:click={() => (showCreateExtraServiceModal = true)}
					>
						<CirclePlusSolid class="h-5 w-5" />
						{m.addExtraService()}
					</Button>
				{/if}
			</div>
		</div>

		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>{m.title()}</TableHeadCell>
				<TableHeadCell>{m.description()}</TableHeadCell>
				<TableHeadCell>{m.price()}</TableHeadCell>
				<TableHeadCell>{m.icon()}</TableHeadCell>
				<TableHeadCell>{m.action()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				{#each $extraServiceStore.data as extraService}
					<TableBodyRow>
						<TableBodyCell>{extraService.title[languageTag()]}</TableBodyCell>
						<TableBodyCell>{extraService.description?.[languageTag()] ?? ''}</TableBodyCell>
						<TableBodyCell>
							{extraService.price
								? Intl.NumberFormat(languageTag(), {
										style: 'currency',
										currency: 'IQD'
								  }).format(extraService.price)
								: '-'}
						</TableBodyCell>
						<TableBodyCell>
							{#if extraService.icon}
								<Img src={extraService.icon} alt="Extra Service Icon" class="h-10 w-10 rounded-md object-cover shadow-sm" />
							{:else}
								<span class="text-gray-500">{m.no_media()}</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_EXTRA_SERVICE], $authStore?.role?.name)}
									<Button
										size="sm"
										class="p-2"
										color="light"
										onclick={() => {
											selectedExtraServiceId = extraService.id;
											showEditExtraServiceModal = true;
										}}
									>
										<PenSolid class="h-4 w-4" />
									</Button>
								{/if}
								{#if checkPremissionOnRoute($authStore!, [Action.DELETE_EXTRA_SERVICE], $authStore?.role?.name)}
									<Button
										size="sm"
										class="p-2"
										color="red"
										on:click={() => {
											handleRemoveExtraService(extraService.id);
										}}
									>
										<TrashBinSolid class="h-4 w-4" />
									</Button>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</Modal>

<AddExtraServiceModal bind:open={showCreateExtraServiceModal} bind:serviceId={selectedServiceId} />

<EditExtraServiceModal 
	bind:open={showEditExtraServiceModal} 
	bind:extraServiceId={selectedExtraServiceId} 
/>

<style>
	/* Custom styles for modern UI */
	:global(.tab-active) {
		@apply bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md;
	}
	
	:global(.tab-item) {
		@apply rounded-lg transition-all duration-300 ease-in-out;
	}
	
	:global(.tab-item:hover) {
		@apply transform scale-105;
	}
	
	:global(.tabs-group) {
		@apply p-1 bg-gray-50 dark:bg-gray-800 rounded-xl;
	}
	
	:global(.table-container) {
		@apply bg-white dark:bg-gray-800;
	}
</style>
