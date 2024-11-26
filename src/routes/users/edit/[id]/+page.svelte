<script lang="ts">
	import { roleStore } from '$lib/Store/Role';
	import { Button, Input, Label, Img, Spinner, Select } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/Store/Toast';
	import { storageStore } from '$lib/Store/Storage';
	import { userStore } from '$lib/Store/User';
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import type { UpdateUser } from '$lib/Supabase/Types/database.types';
	import type { RoleEntity } from '$lib/Model/Entity/Role';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/Store/Auth';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { Action } from '$lib/Model/Action/Action';
	import { validateIraqiPhone } from '$lib/Utils/CheckPhone';

	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			console.log('Upload completed');
		},
		onUploadError: (error) => {
			console.error('Upload error:', error);
		}
	});

	let isLoading = $state(false);
	let roles = $state<RoleEntity[]>([]);

	let updateUser = $state<UpdateUser>({
		id: 0,
		name: '',
		email: '',
		phone: '',
		role: null,
		image: null
	});

	let imageFile = $state<{
		file?: File;
		preview?: string;
	}>({
		file: undefined,
		preview: undefined
	});

	onMount(async () => {
		const userId = Number($page.params.id);

		// Fetch roles for dropdown
		roles =
			(await roleStore.fetchForDropdown({
				select: 'id,name',
				limit: 100
			})) ?? [];

		// Fetch current user data
		const user = await userStore.fetch(userId);
		if (user) {
			updateUser = {
				id: user.id,
				name: user.name ?? '',
				email: user.email,
				phone: user.phone,
				role: user.role?.id,
				image: user.image
			};

			if (user.image) {
				imageFile.preview = user.image;
			}
		}
	});

	async function handleUpdateUser() {
		if (isLoading) return;
		isLoading = true;

		try {
			const phoneValidation = validateIraqiPhone(updateUser.phone ?? '');
			if (!phoneValidation.isValid) {
				throw new Error(m.invalid_iraqi_phone_number());
			}

			updateUser.phone = phoneValidation.formattedNumber;

			if (imageFile.file) {
				updateUser.image = await storageStore.uploadFile(imageFile.file, startUpload);
			}

			await userStore.put(updateUser);
			toastStore.success(m.update_success());
			goto('/users/1');
		} catch (error) {
			if (error instanceof Error) {
				toastStore.error(error.message);
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto p-8">
	<div class="mb-6 flex flex-col items-start justify-center gap-12">
		<Button color="alternative" class="mr-4" on:click={() => goto('/users/1')}>
			<i class="fas fa-arrow-left mr-2"></i>
			{m.back()}
		</Button>
		<h1
			class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.edit()}
			{m.user()}
		</h1>
	</div>

	<form
		onsubmit={(event) => {
			event.preventDefault();
			event.stopPropagation();
			handleUpdateUser();
		}}
		class="w-full space-y-6 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-grey-secondary"
	>
		<!-- Name -->
		<div class="space-y-2">
			<Label for="name" class="text-lg font-medium">{m.name()}</Label>
			<Input
				id="name"
				type="text"
				required
				bind:value={updateUser.name}
				class="w-full border-0 transition-all duration-300 dark:bg-grey-dark"
			/>
		</div>

		<!-- Email -->
		<div class="space-y-2">
			<Label for="email" class="text-lg font-medium">{m.email()}</Label>
			<Input
				id="email"
				type="email"
				required
				bind:value={updateUser.email}
				class="w-full border-0 transition-all duration-300 dark:bg-grey-dark"
			/>
		</div>

		<!-- Phone -->
		<div class="space-y-2">
			<Label for="phone" class="text-lg font-medium">{m.phone()}</Label>
			<Input
				id="phone"
				type="tel"
				required
				bind:value={updateUser.phone}
				class="w-full border-0 transition-all duration-300 dark:bg-grey-dark"
			/>
		</div>

		{#if checkPremissionOnRoute($authStore!, [Action.READ_ROLE], $authStore?.role?.name)}
			<!-- Role Selection -->
			<div class="space-y-2">
				<Label for="role" class="text-lg font-medium">{m.role()}</Label>
				<Select
					id="role"
					class="border-0 transition-all duration-300 dark:bg-grey-dark"
					bind:value={updateUser.role}
					items={roles.map((role) => ({
						value: role.id,
						name: role.name ?? ''
					}))}
				/>
			</div>
		{/if}

		<!-- Image Upload -->
		<div class="space-y-2">
			<Label class="text-lg font-medium">{m.image()}</Label>
			<div class="flex justify-center">
				<div
					class="relative h-64 w-64 overflow-hidden rounded-full bg-gray-100 transition-all duration-300 hover:shadow-lg"
				>
					{#if imageFile.preview}
						<Img src={imageFile.preview} alt="Preview" class="h-full w-full object-cover" />
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button
							type="button"
							class="absolute bottom-4 right-4 rounded-full bg-red-500 p-2 text-white transition-all duration-300 hover:bg-red-600"
							onclick={() => {
								if (imageFile.preview) {
									URL.revokeObjectURL(imageFile.preview);
								}
								imageFile = { file: undefined, preview: undefined };
								updateUser.image = null;
							}}
						>
							<i class="fas fa-trash"></i>
						</button>
					{:else}
						<div class="flex h-full w-full flex-col items-center justify-center">
							<span class="mb-2 text-gray-500">{m.no_image()}</span>
							<Button>
								<span class="mr-2">+</span>
								{m.add_image()}
							</Button>
						</div>
					{/if}
					<input
						type="file"
						accept="image/*"
						onchange={(e) => {
							const input = e.target as HTMLInputElement;
							const file = input.files?.[0];
							if (file) {
								const url = URL.createObjectURL(file);
								imageFile = {
									file,
									preview: url
								};
							}
						}}
						class="absolute inset-0 cursor-pointer opacity-0"
					/>
				</div>
			</div>
		</div>

		<!-- Submit Buttons -->
		<div class="flex gap-3 pt-4">
			{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_USER], $authStore?.role?.name)}
				<Button
					type="submit"
					class="flex-1 bg-blue-light text-white transition-all duration-300 hover:scale-105 hover:bg-blue-light/90"
					disabled={isLoading}
				>
					{#if isLoading}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
			{/if}
			<Button
				color="alternative"
				class="flex-1 transition-all duration-300 hover:scale-105 hover:bg-gray-200"
				on:click={() => goto('/users/1')}
			>
				{m.cancel()}
			</Button>
		</div>
	</form>
</div>
