<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { orderStore } from '$lib/Store/Order';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import Pagination from '$lib/Component/Pagination.Component.svelte';
	import { languageTag } from '$lib/paraglide/runtime';
	import { Status } from '$lib/Supabase/Types/database.types';
	import TableFilter from '$lib/Component/TableFilter.svelte';
	import { userStore } from '$lib/Store/User';

	let filter: GenericListOptions = $state({
		limit: 10,
		page: 1,
		select: `id,
        status,
        overhaul_price,
        fee,
			created_at,
			user:User!inner(name,email),
			services:OrderService!inner(
				service:Service!inner(title(${languageTag()}),price)
			),
			extraServices:OrderExtraService!inner(
				extraService:ExtraService(count)
			)`
	});

	let filterFields: Array<{
			label: string;
			name: string;
			type: 'text' | 'number' | 'select' | 'date' | 'boolean';
			dateRange?: boolean;
			options?: Array<{ value: string | number; label: string }>;
			store?: any;
			fieldsToShow?: { name: string, relation?: string }[];
			select?: string;
			database?: boolean;
		}> = $state([
		{ label:  `Overhaul Price`, name: `overhaul_price`, type: 'number' },
		{ label: 'Fee', name: 'fee', type: 'number' },
		{ label: 'Created At', name: 'created_at', type: 'date' },
		{ label: 'Status', name: 'status', type: 'select', options:Object.values(Status).map(status => ({ value: status, label: status })), database: false },
		{ label: 'User', name: 'user', type: 'select', store: userStore, fieldsToShow: [{ name: 'name' }], select: `id, name`, database: true },
	]);

	async function fetchOrders() {
		await orderStore.fetchAll(filter);
	}

	$effect(() => {
		if(filter){
			fetchOrders();
		}
	});
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-8">
		<h1
			class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.orders()}
		</h1>
	</div>

	<div class="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
		<div class="p-4">
			<TableFilter fields={filterFields} filter={filter} store={orderStore}/>
		</div>

		<Table hoverable={true} class="w-full">
			<TableHead class="bg-gray-50 dark:bg-gray-700">
				<TableHeadCell class="font-semibold">{m.id()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.customer()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.status()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.total_price()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.created_at()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
				{#each $orderStore.data as order}
					<TableBodyRow
						class="group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						<TableBodyCell>{order.id}</TableBodyCell>
						<TableBodyCell>{order.user?.name || order.user?.email}</TableBodyCell>
						<TableBodyCell>
							<span
								class={`rounded-full px-3 py-1 text-xs font-medium 
								${
									order.status === 'PENDING'
										? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
										: order.status === 'COMPLETE'
										? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
										: order.status === 'FAILED'
										? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
										: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
								}`}
							>
								{order.status}
							</span>
						</TableBodyCell>
						<TableBodyCell>
							${(order.overhaul_price + order.fee).toFixed(2)}
						</TableBodyCell>
						<TableBodyCell>
							{new Date(order.created_at).toLocaleDateString()}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex h-12 w-full justify-center">
			<Pagination store={orderStore} bind:filter name="orders" />
		</div>
	</div>
</div>
