<script lang="ts">
	import { messageStore } from '$lib/Store/Message';
	import { Modal, Avatar } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import type { ConversationEntity } from '$lib/Model/Entity/Conversation';

	let {
		show = $bindable(false),
		currentUserId,
		conversation
	}: {
		show: boolean;
		currentUserId: number;
		conversation: ConversationEntity | null;
	} = $props();

	const isGroup = $derived(conversation?.is_group ?? false);

	function isImageFile(fileType: string | undefined): boolean {
		return fileType?.startsWith('image/') ?? false;
	}

	function isVideoFile(fileType: string | undefined): boolean {
		return fileType?.startsWith('video/') ?? false;
	}

	let messageContainer: HTMLDivElement;

	// Enhanced scroll behavior
	$effect(() => {
		if (messageContainer && $messageStore.data) {
			// Ensure we're at the bottom even with new messages
			requestAnimationFrame(() => {
				messageContainer.scrollTop = messageContainer.scrollHeight;
			});
		}
	});

</script>

<Modal bind:open={show} size="md" class="message-modal">
	<div class="flex h-[600px] flex-col bg-gray-50 dark:bg-gray-800 rounded-lg">
		<!-- Enhanced Header -->
		<div class="border-b p-4 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg backdrop-blur-lg backdrop-filter">
			<h3 class="text-xl font-semibold text-gray-800 dark:text-white">
				{conversation?.name ?? m.conversation()}
			</h3>
		</div>

		<!-- Fixed message container -->
		<div 
			bind:this={messageContainer}
			class="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
		>
			<!-- Wrapper to maintain spacing -->
			<div class="flex flex-col space-y-4 min-h-full">
				<!-- Auto margin top to push messages to bottom when there's few messages -->
				<div class="mt-auto space-y-4">
					{#each $messageStore.data as message}
						{@const isCurrentUser = message.sender?.id === currentUserId}

						<div class="flex {isCurrentUser ? 'justify-end' : 'justify-start'} gap-2 animate-fade-in">
							{#if !isCurrentUser}
								<Avatar src={message.sender?.image ?? ''} alt={message.sender?.name} size="sm" class="ring-2 ring-gray-200 dark:ring-gray-700" />
							{/if}

							<div class="max-w-[70%]">
								{#if !isCurrentUser && isGroup}
									<p class="mb-1 text-xs font-medium text-gray-500">{message.sender?.name}</p>
								{/if}

								<div
									class="rounded-2xl p-3.5 {isCurrentUser
										? 'ml-auto bg-blue-600 text-white shadow-blue-100 dark:shadow-none'
										: 'bg-white dark:bg-gray-700'} shadow-lg transition-all hover:shadow-xl"
								>
									{#if message.content}
										<p class="whitespace-pre-wrap break-words text-sm {isCurrentUser ? 'text-white' : 'text-gray-800 dark:text-white'}">{message.content}</p>
									{/if}

									{#if message.file}
										{#if isImageFile(message.file_type)}
											<img 
												src={message.file} 
												alt="Message attachment" 
												class="mt-2 rounded-lg w-auto h-auto transition-transform hover:scale-105"
												style="max-height: 200px; max-width: 280px; object-fit: contain;"
												loading="lazy"
											/>
										{:else if isVideoFile(message.file_type)}
											<!-- svelte-ignore a11y_media_has_caption -->
											<video 
												controls 
												class="mt-2 rounded-lg w-auto h-auto"
												style="max-height: 200px; max-width: 280px; object-fit: contain;"
											>
												<source src={message.file} type={message.file_type}>
												Your browser does not support the video tag.
											</video>
										{:else}
											<div class="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-600 p-2">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {isCurrentUser ? 'text-white' : 'text-gray-500'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												<a 
													href={message.file} 
													target="_blank" 
													rel="noopener noreferrer" 
													class="text-sm font-medium {isCurrentUser ? 'text-white hover:text-blue-100' : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'}"
												>
													Download File
												</a>
											</div>
										{/if}
									{/if}

									<p class="mt-1.5 text-[10px] {isCurrentUser ? 'text-blue-100' : 'text-gray-400'}">
										{new Date(message.created_at).toLocaleString()}
									</p>
								</div>
							</div>

							{#if isCurrentUser}
								<Avatar src={message.sender?.image ?? ''} alt={message.sender?.name} size="sm" class="ring-2 ring-gray-200 dark:ring-gray-700" />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</Modal>

<style>
	/* Custom scrollbar styles */
	.scrollbar-thin::-webkit-scrollbar {
		width: 6px;
	}

	.scrollbar-thin::-webkit-scrollbar-track {
		background: transparent;
	}

	.scrollbar-thin::-webkit-scrollbar-thumb {
		background: #CBD5E0;
		border-radius: 3px;
	}

	.dark .scrollbar-thin::-webkit-scrollbar-thumb {
		background: #4B5563;
	}

	/* Animation for new messages */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.3s ease-out;
	}

	/* Modal backdrop enhancement */
	:global(.message-modal) {
		backdrop-filter: blur(8px);
		background-color: rgba(0, 0, 0, 0.5);
	}

	/* Add smooth scrolling to the container */
	.overflow-y-auto {
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}
</style>
