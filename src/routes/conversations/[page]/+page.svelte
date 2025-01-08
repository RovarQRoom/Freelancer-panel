<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Avatar
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { conversationStore } from '$lib/Store/Conversation';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import Pagination from '$lib/Component/Pagination.Component.svelte';
	import { messageStore } from '$lib/Store/Message';
	import MessageModal from '../MessageModal.svelte';
	import { authStore } from '$lib/Store/Auth';
	import type { ConversationEntity } from '$lib/Model/Entity/Conversation';

	let filter: GenericListOptions = {
		limit: 10,
		page: 1,
		select: `*,
			users:ConversationParticipant(
				user:User!inner(name,image)
			)`
	};

	let messagesFilter: GenericListOptions = {
		limit: 10,
		page: 1,
		select: `content,is_read,file,file_type,created_at,sender:User!inner(id,name,image)`,
		order: false
	};

	

	let showMessageModal = false;
	let selectedConversation: ConversationEntity | null = null;

	onMount(async () => {
		await conversationStore.fetchAll(filter);
	});

	async function getMessagesForConversation(conversation: ConversationEntity) {
		selectedConversation = conversation;
		messagesFilter.equal = conversation.id.toString();
		// await messageStore.fetchAll(messagesFilter);
		showMessageModal = true;
	}
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-8">
		<h1
			class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.conversations()}
		</h1>
	</div>

	<div class="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
		<Table hoverable={true} class="w-full">
			<TableHead class="bg-gray-50 dark:bg-gray-700">
				<TableHeadCell class="font-semibold">{m.id()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.name()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.type()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.participants()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
				{#each $conversationStore.data as conversation}
					<TableBodyRow
						class="group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
						onclick={() => getMessagesForConversation(conversation)}
					>
						<TableBodyCell>{conversation.id}</TableBodyCell>
						<TableBodyCell>{conversation.name}</TableBodyCell>
						<TableBodyCell>
							{#if conversation.is_group}
								<span
									class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
								>
									{m.group()}
								</span>
							{:else}
								<span
									class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
								>
									{m.direct()}
								</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							<div class="mb-5 flex">
								{#if conversation.users && conversation.users.length > 0}
									{#each conversation.users.slice(0, 4) as user}
										<Avatar src={user.user.image ?? ''} alt={user.user.name} rounded stacked />
									{/each}
									{#if conversation.users.length > 4}
										<Avatar stacked rounded>+{conversation.users.length - 4}</Avatar>
									{/if}
								{:else}
									<span class="text-gray-400 dark:text-gray-500">{m.no_participants()}</span>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex h-12 w-full justify-center">
			<Pagination store={conversationStore} bind:filter name="conversations" />
		</div>
	</div>
	<MessageModal
		bind:show={showMessageModal}
		currentUserId={$authStore?.id ?? 0}
		conversation={selectedConversation}
		filter={messagesFilter}
	/>
</div>
