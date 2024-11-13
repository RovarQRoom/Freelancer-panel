<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { 
        Users, 
        DollarSign, 
        ShoppingCart, 
        ChartLine,
        ArrowUpRight,
        ArrowDownRight
    } from 'lucide-svelte';

    const stats = [
        { 
            title: 'Total Revenue', 
            value: '$54,239', 
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'blue'
        },
        { 
            title: 'Active Users', 
            value: '2,345', 
            change: '+8.2%',
            trend: 'up',
            icon: Users,
            color: 'green'
        },
        { 
            title: 'Total Orders', 
            value: '1,235', 
            change: '-3.1%',
            trend: 'down',
            icon: ShoppingCart,
            color: 'purple'
        },
        { 
            title: 'Growth Rate', 
            value: '18.5%', 
            change: '+4.3%',
            trend: 'up',
            icon: ChartLine,
            color: 'orange'
        }
    ];

    const recentTransactions = [
        { user: 'John Doe', type: 'Purchase', amount: '$299', date: '2024-03-20', status: 'Completed' },
        { user: 'Sarah Smith', type: 'Subscription', amount: '$59', date: '2024-03-20', status: 'Pending' },
        { user: 'Mike Johnson', type: 'Purchase', amount: '$199', date: '2024-03-19', status: 'Completed' },
        { user: 'Emily Brown', type: 'Refund', amount: '-$99', date: '2024-03-19', status: 'Processing' }
    ];
</script>

<div class="min-h-screen bg-gray-50 p-6 dark:bg-main-dark-50">
    <!-- Page Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Track your business metrics and performance</p>
    </div>

    <!-- Stats Grid -->
    <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {#each stats as stat}
            <Card class="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div class="flex items-start justify-between">
                    <div>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</span>
                        <h3 class="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                        <span class="mt-1 flex items-center text-sm {stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}">
                            {#if stat.trend === 'up'}
                                <ArrowUpRight size={16} class="mr-1" />
                            {:else}
                                <ArrowDownRight size={16} class="mr-1" />
                            {/if}
                            {stat.change}
                        </span>
                    </div>
                    <div class="rounded-xl bg-{stat.color}-100 p-3 dark:bg-{stat.color}-900/20">
                        <svelte:component 
                            this={stat.icon} 
                            size={24} 
                            class="text-{stat.color}-500 dark:text-{stat.color}-400" 
                        />
                    </div>
                </div>
            </Card>
        {/each}
    </div>

    <!-- Charts Section -->
    <div class="mb-8 grid gap-6 lg:grid-cols-2">
        <Card class="transform transition-all duration-300 hover:shadow-lg">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">Revenue Overview</h2>
                <select class="rounded-lg border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                </select>
            </div>
            <div class="h-80 rounded-lg bg-gray-50 dark:bg-gray-800">
                <!-- Add your chart component here -->
                <div class="flex h-full items-center justify-center text-gray-400">
                    Revenue Chart
                </div>
            </div>
        </Card>

        <Card class="transform transition-all duration-300 hover:shadow-lg">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">User Growth</h2>
                <select class="rounded-lg border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                </select>
            </div>
            <div class="h-80 rounded-lg bg-gray-50 dark:bg-gray-800">
                <!-- Add your chart component here -->
                <div class="flex h-full items-center justify-center text-gray-400">
                    User Growth Chart
                </div>
            </div>
        </Card>
    </div>

    <!-- Recent Transactions -->
    <Card class="transform transition-all duration-300 hover:shadow-lg">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h2>
            <button class="text-sm text-blue-500 hover:underline">View All</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full min-w-full table-auto">
                <thead>
                    <tr class="border-b text-left text-sm font-medium text-gray-500 dark:border-gray-700">
                        <th class="pb-3 pr-6">User</th>
                        <th class="pb-3 pr-6">Type</th>
                        <th class="pb-3 pr-6">Amount</th>
                        <th class="pb-3 pr-6">Date</th>
                        <th class="pb-3">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    {#each recentTransactions as transaction}
                        <tr class="text-sm">
                            <td class="py-4 pr-6 font-medium text-gray-900 dark:text-white">
                                {transaction.user}
                            </td>
                            <td class="py-4 pr-6 text-gray-500 dark:text-gray-400">
                                {transaction.type}
                            </td>
                            <td class="py-4 pr-6 font-medium {transaction.amount.includes('-') ? 'text-red-500' : 'text-green-500'}">
                                {transaction.amount}
                            </td>
                            <td class="py-4 pr-6 text-gray-500 dark:text-gray-400">
                                {transaction.date}
                            </td>
                            <td class="py-4">
                                <span class="rounded-full px-2 py-1 text-xs font-medium
                                    {transaction.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}">
                                    {transaction.status}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </Card>
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
