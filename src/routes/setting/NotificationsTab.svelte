<script lang="ts">
	import {
		Avatar,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Modal,
		MultiSelect,
		Label,
		Img
	} from 'flowbite-svelte';
	import MultiSelectUser from '$lib/Component/MultiSelect.Component.svelte';
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import { notificationStore } from '$lib/Store/Notification';
	import { toastStore } from '$lib/Store/Toast';
	import type { InsertNotification } from '$lib/Supabase/Types/database.types';
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import { CirclePlusSolid } from 'flowbite-svelte-icons';
	import { userStore } from '$lib/Store/User';
	import type { UserEntity } from '$lib/Model/Entity/User';
	import type { NotificationEntity } from '$lib/Model/Entity/Notification';
	import { storageStore } from '$lib/Store/Storage';

	let filter: GenericListOptions = $state({
		limit: 10,
		page: 1,
		select: '*,users:NotificationUser(user:User(id,name,image))'
	});

	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			console.log('Upload completed');
		},
		onUploadError: (error) => {
			console.error('Upload error:', error);
		}
	});

	let isLoading = $state(false);
	let createNotification = $state<InsertNotification>({
		title: '',
		message: ''
	});
	let imageFile = $state<{ file?: File; preview?: string }>({
		file: undefined,
		preview: undefined
	});
	let iconFile = $state<{ file?: File; preview?: string }>({
		file: undefined,
		preview: undefined
	});
	let selectedUsers = $state<number[]>([]);
	let showAddModal = $state(false);
	let users: UserEntity[] = $state([]);

	onMount(async () => {
		isLoading = true;
		try {
			await notificationStore.fetchAll(filter);
		} catch (error) {
			if (error instanceof Error) {
				toastStore.error(error.message);
			} else {
				toastStore.error('Something went wrong');
			}
		} finally {
			isLoading = false;
		}
	});

	async function openAddModal() {
		try {
			const response = await userStore.fetchForDropdown({
				limit: 1000, // Adjust as needed
				page: 1,
				select: 'id,name,image'
			});
			if (response) {
				users = response;
			}
			showAddModal = true;
		} catch (error) {
			if (error instanceof Error) {
				toastStore.error(error.message);
			} else {
				toastStore.error('Something went wrong');
			}
		}
	}

	async function handleAddNotification() {
		let notificationResponse: NotificationEntity | undefined;
		try {
			if (imageFile.file) {
				createNotification.image = await storageStore.uploadFile(imageFile.file, startUpload);
			}
			if (iconFile.file) {
				createNotification.icon = await storageStore.uploadFile(iconFile.file, startUpload);
			}
			// Create notification logic here
			notificationResponse = await notificationStore.insert(createNotification);

			if (selectedUsers.length > 0 && notificationResponse) {
				await notificationStore.insertNotificationUser(
					selectedUsers.map((userId) => ({
						notification: notificationResponse?.id,
						user: userId
					})),
					notificationResponse
				);
			} else {
				await notificationStore.insertNotificationUser(
					users.map((user) => ({
						notification: notificationResponse?.id,
						user: user.id
					})),
					notificationResponse
				);
			}

			createNotification = { title: '', message: '' };
			selectedUsers = [];
		} catch (error) {
			if (error instanceof Error) {
				toastStore.error(error.message);
			} else {
				toastStore.error('Something went wrong');
			}
		} finally {
			isLoading = false;
			showAddModal = false;
		}
	}
</script>

<div class="p-4 sm:p-6">
	<div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<h1 class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-2xl sm:text-3xl font-bold text-transparent">
			{m.notifications()}
		</h1>
		<Button
			class="flex transform items-center gap-2 bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
			transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
			onclick={openAddModal}
		>
			<CirclePlusSolid class="h-5 w-5" />
			{m.addNotification()}
		</Button>
	</div>

	<div class=" overflow-x-auto rounded-xl bg-white shadow-lg dark:bg-gray-800">
		<Table hoverable={true}>
			<TableHead class="bg-gray-50 text-center dark:bg-gray-700">
				<TableHeadCell class="font-semibold whitespace-nowrap">{m.title()}</TableHeadCell>
				<TableHeadCell class="font-semibold whitespace-nowrap">{m.message()}</TableHeadCell>
				<TableHeadCell class="font-semibold whitespace-nowrap">{m.image()}</TableHeadCell>
				<TableHeadCell class="font-semibold whitespace-nowrap">{m.icon()}</TableHeadCell>
				<TableHeadCell class="font-semibold whitespace-nowrap">{m.users()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
				{#each $notificationStore.data as notification}
					<TableBodyRow class="text-center">
						<TableBodyCell class="whitespace-nowrap">{notification.title}</TableBodyCell>
						<TableBodyCell class="whitespace-nowrap">{notification.message}</TableBodyCell>
						<TableBodyCell>
							<div class="flex w-full flex-col items-center justify-center">
								{#if notification.image}
									<Img
										src={notification.image}
										alt="category"
										class="h-12 w-12 rounded-lg object-cover shadow-sm transition-all 
									duration-200 group-hover:scale-105 group-hover:shadow-md"
									/>
								{:else}
									<span class="text-gray-400 dark:text-gray-500">{m.not_available()}</span>
								{/if}
							</div>
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex w-full flex-col items-center justify-center">
								{#if notification.icon}
									<Img
										src={notification.icon}
										alt="category"
										class="h-12 w-12 rounded-lg object-cover shadow-sm transition-all 
									duration-200 group-hover:scale-105 group-hover:shadow-md"
									/>
								{/if}
							</div>
						</TableBodyCell>
						<TableBodyCell>
							<div class="mb-5 flex">
								{#if notification.users && notification.users.length > 0}
									{#each notification.users.slice(0, 4) as user}
										<Avatar 
											src={user?.user?.image ?? ''} 
											alt={user?.user?.name ?? 'User'} 
											rounded 
											stacked 
										/>
									{/each}
									{#if notification.users.length > 4}
										<Avatar stacked rounded>+{notification.users.length - 4}</Avatar>
									{/if}
								{:else}
									<span class="text-gray-400 dark:text-gray-500">{m.all_users()}</span>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>

	<Modal
		bind:open={showAddModal}
		size="md"
		autoclose={false}
		class="w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-xl"
	>
		<div class="p-4 sm:p-6">
			<h3 class="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
				{m.addNotification()}
			</h3>
			<div class="space-y-4">
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<Label class="mb-2 block text-sm font-medium" for="title">
							{m.title()}
						</Label>
						<input
							type="text"
							id="title"
							class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm
							focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 
							dark:bg-gray-700 dark:text-white"
							bind:value={createNotification.title}
							placeholder={m.enterTitle()}
						/>
					</div>

					<div class="sm:col-span-2">
						<Label class="mb-2 block text-sm font-medium" for="message">
							{m.message()}
						</Label>
						<textarea
							id="message"
							rows="3"
							class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm
							focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 
							dark:bg-gray-700 dark:text-white"
							bind:value={createNotification.message}
							placeholder={m.enterMessage()}
						/>
					</div>

					<div class="sm:col-span-2">
						<Label class="mb-2 block text-sm font-medium">
							{m.users()}
						</Label>
						<MultiSelectUser
							options={users.map((user) => ({
								id: user.id ?? 0,
								label: user.name ?? '',
								image: user.image ?? ''
							}))}
							bind:values={selectedUsers}
							placeholder={selectedUsers.length === 0 ? m.allSelected() : m.selectUsers()}
							disabled={false}
							loading={false}
							maxSelect={null}
							required={false}
						/>
					</div>

					<div class="sm:col-span-2 space-y-3">
						<Label class="text-lg font-medium">{m.image()}</Label>
						<div class="flex justify-center">
							<div class="relative h-48 sm:h-64 w-full max-w-md overflow-hidden rounded-lg 
								bg-main-light-100 transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100">
								{#if imageFile.preview}
									<Img
										src={imageFile.preview}
										alt="Preview"
										class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full flex-col items-center justify-center">
										<span class="mb-2 text-main-light-400 dark:text-main-dark-400"
											>{m.no_media_selected()}</span
										>
										<Button class="transform transition-all duration-200 hover:scale-105">
											<span class="mr-2">+</span>
											{m.add_image()}
										</Button>
									</div>
								{/if}
								<input
									type="file"
									accept="image/*"
									class="absolute inset-0 cursor-pointer opacity-0"
									onchange={(e) => {
										const file = (e.target as HTMLInputElement).files?.[0];
										if (file) {
											imageFile.file = file;
											imageFile.preview = URL.createObjectURL(file);
										}
									}}
								/>
							</div>
						</div>
					</div>

					<div class="sm:col-span-2 space-y-3">
						<Label class="text-lg font-medium">{m.icon()}</Label>
						<div class="flex justify-start">
							<div class="relative h-20 w-20 overflow-hidden rounded-lg 
								bg-main-light-100 transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100">
								{#if iconFile.preview}
									<img
										src={iconFile.preview}
										alt="Icon Preview"
										class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full flex-col items-center justify-center">
										<span class="text-xl text-main-light-400 dark:text-main-dark-400">+</span>
									</div>
								{/if}
								<input
									type="file"
									accept="image/*"
									class="absolute inset-0 cursor-pointer opacity-0"
									onchange={(e) => {
										const file = (e.target as HTMLInputElement).files?.[0];
										if (file) {
											iconFile.file = file;
											iconFile.preview = URL.createObjectURL(file);
										}
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
					<Button color="red" class="w-full sm:w-auto" onclick={() => (showAddModal = false)}>
						{m.cancel()}
					</Button>
					<Button color="blue" class="w-full sm:w-auto" onclick={handleAddNotification}>
						{m.save()}
					</Button>
				</div>
			</div>
		</div>
	</Modal>
</div>
