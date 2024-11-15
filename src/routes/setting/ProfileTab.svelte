<script lang="ts">
	import type { UserEntity } from "$lib/Model/Entity/User";
	import { authStore } from "$lib/Store/Auth";
	import { storageStore } from "$lib/Store/Storage";
	import type { UpdateUser } from "$lib/Supabase/Types/database.types";
	import * as m from '$lib/paraglide/messages';
	import { Img, Button, Input, Label, Fileupload } from "flowbite-svelte";
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import { toastStore } from "$lib/Store/Toast";
	import { userStore } from "$lib/Store/User";

	const { startUpload } = createUploadThing('imageUploader');

	let updateUser = $state<UpdateUser>({
		id: $authStore?.id ?? 0,
        name: $authStore?.name ?? "",
        email: $authStore?.email ?? "",
        phone: $authStore?.phone ?? "",
        image: $authStore?.image ?? "",
    });
    let nameAttribute = $state<{
        first_name: string;
        last_name: string;
    }>({
        first_name: $authStore?.name?.split(" ")[0] ?? "",
        last_name: $authStore?.name?.split(" ").slice(1).join(" ") ?? "",
    });

    let userImage = $state<{
        file: File | null;
        preview:string | null;
    }>({
        file: null,
        preview: $authStore?.image ?? "",
    });

    let isLoading = $state(false);
    let isEditing = $state(false);

    function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			userImage.preview = URL.createObjectURL(file);
			userImage.file = file;
		}
	}

    async function handleEditCategory() {
		let backupUser = updateUser;
		let userResponse: UserEntity | undefined;
		try {
			isLoading = true;
			if (userImage.file) {
				updateUser.image = await storageStore.uploadFile(userImage.file, startUpload);
			}
            updateUser.name = `${nameAttribute.first_name} ${nameAttribute.last_name}`;
			userResponse = await userStore.put(updateUser);
		} catch (error) {
			if (userResponse?.id) {
				await userStore.put(backupUser);
			}
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			isLoading = false;
		}
	}

    function toggleEdit() {
        isEditing = !isEditing;
        if (!isEditing) {
            updateUser = {
                id: $authStore?.id ?? 0,
                name: $authStore?.name ?? "",
                email: $authStore?.email ?? "",
                phone: $authStore?.phone ?? "",
                image: $authStore?.image ?? "",
            };
            nameAttribute = {
                first_name: $authStore?.name?.split(" ")[0] ?? "",
                last_name: $authStore?.name?.split(" ").slice(1).join(" ") ?? "",
            };
        }
    }

    async function handleSave() {
        await handleEditCategory();
        if (!isLoading) {
            isEditing = false;
        }
    }
    
</script>

{#if $authStore && $authStore.id}
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">{m.profile_settings()}</h2>
        <Button color={isEditing ? "red" : "blue"} on:click={toggleEdit}>
            {isEditing ? m.cancel() : m.edit()}
        </Button>
    </div>
    
    <div class="space-y-4">
        <!-- Profile Picture -->
        <div class="flex items-center gap-4">
            <div class="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                <Img
                    src={userImage.preview ?? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt="Profile"
                    class="h-full w-full object-cover"
                />
            </div>
            <div class="relative">
                <Button color="blue" disabled={!isEditing}>
                    {m.change_photo()}
                </Button>
                <input
                    accept="image/*"
                    type="file"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={!isEditing}
                    onchange={handleImageUpload}
                />
            </div>
        </div>

        <!-- Form Fields -->
        <div class="grid gap-4 sm:grid-cols-2">
            <div>
                <Label for="first-name">{m.first_name()}</Label>
                <Input
                    id="first-name"
                    type="text"
                    bind:value={nameAttribute.first_name}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <Label for="last-name">{m.last_name()}</Label>
                <Input
                    id="last-name"
                    type="text"
                    bind:value={nameAttribute.last_name}
                    disabled={!isEditing}
                />
            </div>
            <div class="sm:col-span-2">
                <Label for="email">{m.email()}</Label>
                <Input
                    id="email"
                    type="email"
                    bind:value={updateUser.email}
                    disabled={!isEditing}
                />
            </div>
            <div class="sm:col-span-2">
                <Label for="phone">{m.phone()}</Label>
                <Input
                    id="phone"
                    type="tel"
                    bind:value={updateUser.phone}
                    disabled={!isEditing}
                />
            </div>
        </div>
    </div>

    <div class="flex justify-end gap-3">
        {#if isEditing}
            <Button color="blue" disabled={isLoading} on:click={handleSave}>
                {isLoading ? m.saving() : m.save()}
            </Button>
        {/if}
    </div>
</div> 
{/if}