<script lang="ts">
	import { roleStore } from '$lib/Store/Role';
	import { Button, Input, Label, Img, Spinner, Select } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/Store/Toast';
	import { storageStore } from '$lib/Store/Storage';
	import { userStore } from '$lib/Store/User';
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import type { UserRequest } from '$lib/Model/Request/User';
	import type { RoleEntity } from '$lib/Model/Entity/Role';
	import { onMount } from 'svelte';

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

	let createUser = $state<UserRequest>({
		name: '',
		email: '',
		phone: '',
		password: '',
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
		roles =
			(await roleStore.fetchForDropdown({
				select: 'id,name',
				limit: 100
			})) ?? [];
	});

	async function handleAddUser() {
		if (isLoading) return;
		isLoading = true;

		try {
			if (imageFile.file) {
				createUser.image = await storageStore.uploadFile(imageFile.file, startUpload);
			}
			await userStore.insert(createUser);
			toastStore.success(m.create_success());
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
	<div class="mb-6 flex items-center">
		<Button color="alternative" class="mr-4" on:click={() => goto('/users/1')}>
			<i class="fas fa-arrow-left mr-2"></i>
			{m.back()}
		</Button>
		<h1
			class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.add()}
			{m.user()}
		</h1>
	</div>

	<form
		onsubmit={handleAddUser}
		class="max-w-3xl space-y-6 rounded-xl bg-white dark:bg-grey-secondary p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<!-- Name -->
		<div class="space-y-2">
			<Label for="name" class="text-lg font-medium">{m.name()}</Label>
			<Input
				id="name"
				type="text"
				required
				bind:value={createUser.name}
				class="w-full transition-all  dark:bg-grey-dark border-0 duration-300 hover:border-primary-light-500"
			/>
		</div>

		<!-- Email -->
		<div class="space-y-2">
			<Label for="email" class="text-lg font-medium">{m.email()}</Label>
			<Input
				id="email"
				type="email"
				required
				bind:value={createUser.email}
				class="w-full transition-all dark:bg-grey-dark border-0 duration-300 hover:border-primary-light-500"
			/>
		</div>

		<!-- Phone -->
		<div class="space-y-2">
			<Label for="phone" class="text-lg font-medium">{m.phone()}</Label>
			<Input
				id="phone"
				type="tel"
				required
				bind:value={createUser.phone}
				class="w-full transition-all dark:bg-grey-dark border-0 duration-300 hover:border-primary-light-500"
			/>
		</div>

		<!-- Password -->
		<div class="space-y-2">
			<Label for="password" class="text-lg font-medium">{m.password()}</Label>
			<Input
				id="password"
				type="password"
				required
				bind:value={createUser.password}
				class="w-full transition-all dark:bg-grey-dark border-0 duration-300 hover:border-primary-light-500"
			/>
		</div>

		<!-- Role Selection -->
		<div class="space-y-2">
			<Label for="role" class="text-lg font-medium">{m.role()}</Label>
			<Select
				id="role"
				class="transition-all dark:bg-grey-dark border-0 duration-300 hover:border-primary-light-500"
				bind:value={createUser.role}
				items={roles.map((role) => ({
					value: role.id,
					name: role.name ?? ''
				}))}
			/>
		</div>

		<!-- Image Upload -->
		<div class="space-y-2">
			<Label class="text-lg font-medium">{m.image()}</Label>
			<div class="flex justify-center">
				<div
					class="relative h-64 w-64 overflow-hidden rounded-full bg-gray-100 dark:bg-grey-dark transition-all duration-300 hover:shadow-lg"
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
			<Button
				type="submit"
				class="flex-1 bg-primary-light-500 text-white transition-all duration-300 hover:scale-105 hover:bg-primary-light-600"
				disabled={isLoading}
			>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />
				{/if}
				{m.save()}
			</Button>
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
