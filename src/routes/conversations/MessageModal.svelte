<script lang="ts">
	import { messageStore } from '$lib/Store/Message';
	import { Modal, Avatar } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import type { ConversationEntity } from '$lib/Model/Entity/Conversation';

	export let show = false;
	export let currentUserId: number;
	export let conversation: ConversationEntity | null = null;

	$: isGroup = conversation?.is_group ?? false;
</script>

<Modal bind:open={show} size="md">
	<div class="flex h-[600px] flex-col">
		<!-- Header -->
		<div class="border-b p-4 dark:border-gray-600">
			<h3 class="text-xl font-semibold">
				{conversation?.name ?? m.conversation()}
			</h3>
		</div>

		<!-- Messages -->
		<div class="flex-1 space-y-4 overflow-y-auto p-4">
			{#each $messageStore.data as message}
				{@const isCurrentUser = message.sender?.id === currentUserId}

				<div class="flex {isCurrentUser ? 'justify-end' : 'justify-start'} gap-2">
					{#if !isCurrentUser}
						<Avatar src={message.sender?.image ?? ''} alt={message.sender?.name} size="sm" />
					{/if}

					<div class="max-w-[70%]">
						{#if !isCurrentUser && isGroup}
							<p class="mb-1 text-xs text-gray-500">{message.sender?.name}</p>
						{/if}

						<div
							class="rounded-lg p-3 {isCurrentUser
								? 'ml-auto bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-700'} shadow"
						>
							<p class="whitespace-pre-wrap break-words text-sm {isCurrentUser ? 'text-white' : 'text-black dark:text-white'}">{message.content}</p>
							<p class="mt-1 text-[10px] {isCurrentUser ? 'text-blue-100' : 'text-gray-500'}">
								{new Date(message.created_at).toLocaleString()}
							</p>
						</div>
					</div>

					{#if isCurrentUser}
						<Avatar src={message.sender?.image ?? ''} alt={message.sender?.name} size="sm" />
					{/if}
				</div>
			{/each}
		</div>

		<!-- Message Input (Optional, for future implementation) -->
		<!-- <div class="p-4 border-t dark:border-gray-600">
            <div class="flex gap-2">
                <input 
                    type="text" 
                    class="flex-1 rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2"
                    placeholder={m.type_message()}
                />
                <button 
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {m.send()}
                </button>
            </div>
        </div> -->
	</div>
</Modal>
