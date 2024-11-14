<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { 
        User, 
        Bell, 
        Shield, 
        Globe, 
        Palette,
        Mail,
        CreditCard,
        Lock
    } from 'lucide-svelte';

    let activeTab = 'profile';
    
    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];
</script>

<div class="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
        </div>

        <!-- Settings Container -->
        <div class="grid gap-6 lg:grid-cols-[280px,1fr]">
            <!-- Tabs Navigation - Converts to top tabs on mobile -->
            <div class="overflow-x-auto lg:overflow-visible">
                <div class="flex gap-2 lg:flex-col lg:gap-1">
                    {#each tabs as tab}
                        <button
                            class="flex min-w-[140px] items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors
                                {activeTab === tab.id ? 
                                'bg-blue-600 text-white' : 
                                'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
                            on:click={() => activeTab = tab.id}
                        >
                            <svelte:component this={tab.icon} size={20} />
                            <span class="font-medium">{tab.label}</span>
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Content Area -->
            <Card class="h-fit">
                {#if activeTab === 'profile'}
                    <div class="space-y-6">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
                        
                        <div class="space-y-4">
                            <!-- Profile Picture -->
                            <div class="flex items-center gap-4">
                                <div class="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                        alt="Profile"
                                        class="h-full w-full object-cover"
                                    />
                                </div>
                                <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                    Change Photo
                                </button>
                            </div>

                            <!-- Form Fields -->
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                        value="John"
                                    />
                                </div>
                                <div>
                                    <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                        value="Doe"
                                    />
                                </div>
                                <div class="sm:col-span-2">
                                    <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                        value="john.doe@example.com"
                                    />
                                </div>
                                <div class="sm:col-span-2">
                                    <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Bio
                                    </label>
                                    <textarea
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3">
                            <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                            <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </div>

                {:else if activeTab === 'notifications'}
                    <div class="space-y-6">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Notification Preferences</h2>
                        
                        <div class="space-y-4">
                            <div class="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                                <div>
                                    <h3 class="font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                                    <p class="text-sm text-gray-500">Receive email about your account activity</p>
                                </div>
                                <label class="relative inline-flex cursor-pointer items-center">
                                    <input type="checkbox" class="peer sr-only" checked>
                                    <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                                <div>
                                    <h3 class="font-medium text-gray-800 dark:text-white">Push Notifications</h3>
                                    <p class="text-sm text-gray-500">Receive push notifications on your devices</p>
                                </div>
                                <label class="relative inline-flex cursor-pointer items-center">
                                    <input type="checkbox" class="peer sr-only">
                                    <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                {:else if activeTab === 'security'}
                    <div class="space-y-6">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Security Settings</h2>
                        
                        <div class="space-y-4">
                            <div class="rounded-lg border p-4 dark:border-gray-700">
                                <h3 class="mb-3 font-medium text-gray-800 dark:text-white">Change Password</h3>
                                <div class="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div class="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                                <div>
                                    <h3 class="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</h3>
                                    <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                </div>
                                <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                    Enable
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </Card>
        </div>
    </div>
</div>

<style>
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>