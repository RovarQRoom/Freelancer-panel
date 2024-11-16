<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Modal,
		MultiSelect,
		Label
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { PenSolid, TrashBinSolid, CirclePlusSolid } from 'flowbite-svelte-icons';
	import { toastStore } from '$lib/Store/Toast';
	import type { RoleEntity } from '$lib/Model/Entity/Role';
	import { Action } from '$lib/Model/Action/Action';
	import type { UpdateRole } from '$lib/Supabase/Types/database.types';
	import { roleStore } from '$lib/Store/Role';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';

	// States
	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
    let selectedPolicies = $state<number[]>([]);
	let selectedRole = $state<RoleEntity | null>(null);
    let updateRole = $state<UpdateRole>({id: 0, name: ''});
	let newRoleName = $state('');
    let filter = $state<GenericListOptions>({
        page: 1,
        limit: 10,
        select:"id,name,policies:RolePolicy(policy:Policy(id,name))"
    });

    onMount(async () => {
        await roleStore.fetchAll(filter);
    });


	function canEditRole(roleId: number): boolean {
		return roleId >= 3;
	}

	function canDeleteRole(roleId: number): boolean {
		return roleId >= 5;
	}

	async function handleAddRole() {
		try {
			// Implement role creation logic here
			showAddModal = false;
			newRoleName = '';
			selectedPolicies = [];
			toastStore.success(m.success());
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}

	async function handleEditRole() {
		try {
			// Implement role update logic here
			showEditModal = false;
			selectedRole = null;
			selectedPolicies = [];
			toastStore.success(m.success());
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}

	async function handleDeleteRole() {
		try {
			// Implement role deletion logic here
			showDeleteModal = false;
			selectedRole = null;
			toastStore.success(m.success());
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}
</script>

<div class="p-6">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-transparent">
			{m.roles()}
		</h1>
		<Button
			class="flex items-center gap-2 transform bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
			transition-all duration-300 hover:scale-105 hover:shadow-lg"
			on:click={() => (showAddModal = true)}
		>
			<CirclePlusSolid class="h-5 w-5" />
			{m.addRole()}
		</Button>
	</div>

	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
		<Table hoverable={true} class="w-full">
			<TableHead class="bg-gray-50 dark:bg-gray-700 text-center">
				<TableHeadCell class="font-semibold">{m.id()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.name()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.policies()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.action()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
				{#each $roleStore.data as role}
					<TableBodyRow class="text-center">
						<TableBodyCell>{role.id}</TableBodyCell>
						<TableBodyCell>{role.name}</TableBodyCell>
						<TableBodyCell>{role.policies?.length ?? 0}</TableBodyCell>
						<TableBodyCell>
							<div class="flex justify-center gap-2">
								{#if canEditRole(role.id)}
									<button
										class="p-2 hover:scale-110 transition-transform duration-200"
										onclick={() => {
											selectedRole = role;
											selectedPolicies = role.policies?.map(p => p.policy.id) ?? [];
											showEditModal = true;
										}}
									>
										<PenSolid class="h-4 w-4 text-gray-600 dark:text-gray-300" />
									</button>
								{/if}
								{#if canDeleteRole(role.id)}
									<button
										class="p-2 hover:scale-110 transition-transform duration-200"
										onclick={() => {
											selectedRole = role;
											showDeleteModal = true;
										}}
									>
										<TrashBinSolid class="h-4 w-4 text-red-500" />
									</button>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

<!-- Add Role Modal -->
<Modal
	bind:open={showAddModal}
	size="md"
	autoclose={false}
	class="rounded-xl overflow-hidden shadow-xl"
>
	<div class="p-6">
		<h3 class="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-200">
			{m.addRole()}
		</h3>
		<div class="space-y-4">
			<div>
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="name">
					{m.name()}
				</label>
				<input
					type="text"
					id="name"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
					focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
					dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					bind:value={newRoleName}
					placeholder={m.enterName()}
				/>
			</div>
			<div>
				<Label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					{m.policies()}
				</Label>
				<MultiSelect
					items={Object.values(Action).map(action => ({
						value: action,
						name: action
					}))}
					bind:value={selectedPolicies}
					placeholder={m.selectPolicies()}
				/>
			</div>
		</div>
		<div class="flex justify-end gap-4 mt-6">
			<Button color="alternative" on:click={() => (showAddModal = false)}>
				{m.cancel()}
			</Button>
			<Button onclick={handleAddRole}>
				{m.save()}
			</Button>
		</div>
	</div>
</Modal>

<!-- Edit Role Modal -->
<Modal
	bind:open={showEditModal}
	size="md"
	autoclose={false}
	class="rounded-xl overflow-hidden shadow-xl"
>
	<div class="p-6">
		<h3 class="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-200">
			{m.editRole()}
		</h3>
		<div class="space-y-4">
			<div>
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="edit-name">
					{m.name()}
				</label>
				<input
					type="text"
					id="edit-name"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
					focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
					dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					bind:value={updateRole.name}
					placeholder={m.enterName()}
				/>
			</div>
			<div>
				<Label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					{m.policies()}
				</Label>
				<MultiSelect
					items={Object.values(Action).map(action => ({
						value: action,
						name: action
					}))}
					bind:value={selectedPolicies}
					placeholder={m.selectPolicies()}
				/>
			</div>
		</div>
		<div class="flex justify-end gap-4 mt-6">
			<Button color="alternative" on:click={() => (showEditModal = false)}>
				{m.cancel()}
			</Button>
			<Button on:click={handleEditRole}>
				{m.save()}
			</Button>
		</div>
	</div>
</Modal>

<!-- Delete Confirmation Modal -->
<Modal
	bind:open={showDeleteModal}
	size="xs"
	autoclose={false}
	class="rounded-xl overflow-hidden shadow-xl"
>
	<div class="p-6 text-center">
		<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
			<TrashBinSolid class="h-6 w-6 text-red-600" />
		</div>
		<h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-200">
			{m.deleteConfirmation()}
		</h3>
		<div class="flex justify-center gap-4">
			<Button
				color="red"
				class="px-6 py-2 transition-all duration-200 hover:scale-105"
				on:click={handleDeleteRole}
			>
				{m.yes()}
			</Button>
			<Button
				color="alternative"
				class="px-6 py-2 transition-all duration-200 hover:scale-105"
				on:click={() => (showDeleteModal = false)}
			>
				{m.no()}
			</Button>
		</div>
	</div>
</Modal>
