<script>
    import { 
        Github, 
        MessageCircle,
        HelpCircle,
        Book,
        Bell,
        Settings,
        User,
        Clock
    } from 'lucide-svelte';

    const currentYear = new Date().getFullYear();
    const version = "v0.0.1";
    const lastDeployment = "2024-03-20 15:30 UTC";
    
    let showAdminMenu = false;

    // Mock admin notifications
    const notifications = [
        { type: 'success', message: 'System update completed' },
        { type: 'warning', message: 'Backup in progress' }
    ];
</script>

<footer class="fixed bottom-0 left-0 right-0 z-20 border-t bg-white dark:border-gray-700 dark:bg-gray-800">
    <!-- Admin Toolbar -->
    <div class="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50">
        <div class="mx-auto flex max-w-7xl items-center justify-between">
           

            <!-- Center - System Status -->
            <div class="hidden items-center space-x-4 sm:flex">
                
                <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span>All systems operational</span>
                </div>
            </div>

            <!-- Right - Admin Info -->
            <div class="flex items-center space-x-3">
                <button 
                    class="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                    on:click={() => showAdminMenu = !showAdminMenu}
                >
                    <User size={16} />
                    <span class="hidden sm:inline">Admin</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Main Footer -->
    <div class="px-4 py-3">
        <div class="mx-auto flex max-w-7xl flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <!-- Left - Copyright and Version -->
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>© {currentYear} AdminPanel</span>
                <div class="hidden h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600 sm:block"></div>
                <span class="hidden rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium dark:bg-gray-700 sm:block">
                    {version}
                </span>
            </div>
           
        </div>
    </div>
</footer>

<style>
    :global(main) {
        margin-bottom: 7rem;
    }

    /* Subtle hover effect for links */
    a {
        position: relative;
    }

    a::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        left: 0;
        background-color: currentColor;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
    }

    a:hover::after {
        transform: scaleX(1);
        transform-origin: left;
    }
</style>