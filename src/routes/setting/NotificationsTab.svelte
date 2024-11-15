<script lang="ts">
    import * as m from '$lib/paraglide/messages';
</script>

<div class="space-y-6">
    <h2 class="text-xl font-bold text-gray-800 dark:text-white">{m.notification_preferences()}</h2>
    
    <div class="space-y-4">
        <div class="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
            <div>
                <h3 class="font-medium text-gray-800 dark:text-white">{m.email_notifications()}</h3>
                <p class="text-sm text-gray-500">{m.email_notifications_desc()}</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" class="peer sr-only" checked>
                <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
        </div>

        <div class="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
            <div>
                <h3 class="font-medium text-gray-800 dark:text-white">{m.push_notifications()}</h3>
                <p class="text-sm text-gray-500">{m.push_notifications_desc()}</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" class="peer sr-only">
                <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
        </div>
    </div>
</div> 