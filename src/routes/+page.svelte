<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';
	import { orderStore } from '$lib/Store/Order';
	import { authStore } from '$lib/Store/Auth';
	import { userStore } from '$lib/Store/User';
	import { serviceStore } from '$lib/Store/Service';
	import type { OrderEntity } from '$lib/Model/Entity/Order';
	import type { UserEntity } from '$lib/Model/Entity/User';
	import { supabase } from '$lib/Supabase/supabase';

	let revenueChart: HTMLCanvasElement;
	let trafficChart: HTMLCanvasElement;
	let orders: OrderEntity[] = [];
	let users: UserEntity[] = [];
	let totalIncome = 0;
	let dailyIncome = 0;
	let totalServices = 0;
	let recentActivity: any[] = [];

	// Function to format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IQ', {
			style: 'currency',
			currency: 'IQD'
		}).format(amount);
	};

	// Function to get monthly revenue data
	async function getMonthlyRevenue() {
		const { data, error } = await supabase
			.from('Order')
			.select('created_at, overhaul_price')
			.gte(
				'created_at',
				new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1).toISOString()
			)
			.is('deleted_at', null);

		if (error) {
			console.error('Error fetching revenue data:', error);
			return [];
		}

		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		const monthlyData = new Array(12).fill(0);

		data?.forEach((order) => {
			const monthIndex = new Date(order.created_at).getMonth();
			const currentMonthIndex = new Date().getMonth();
			const arrayIndex = (monthIndex - (currentMonthIndex - 11) + 12) % 12;
			if (arrayIndex >= 0 && arrayIndex < 12) {
				monthlyData[arrayIndex] += order.overhaul_price;
			}
		});

		return monthlyData;
	}

	// Function to get traffic sources
	async function getTrafficSources() {
		// This would ideally come from analytics data
		// For now using placeholder percentages
		return {
			direct: 50.5,
			referral: 30.5,
			organic: 19
		};
	}

	async function loadDashboardData() {
		try {
			// Fetch all users
			const usersResponse = await userStore.fetchAll({ limit: 1000 });
			if (usersResponse) {
				users = usersResponse;
			}

			// Fetch all orders
			const ordersResponse = await orderStore.fetchAll({ limit: 1000 });
			if (ordersResponse) {
				orders = ordersResponse;

				// Calculate total income
				totalIncome = orders.reduce((sum, order) => sum + (order.overhaul_price || 0), 0);

				// Calculate daily income (orders from today)
				const today = new Date().toISOString().split('T')[0];
				dailyIncome = orders
					.filter((order) => order.created_at?.startsWith(today))
					.reduce((sum, order) => sum + (order.overhaul_price || 0), 0);

				// Get recent activity
				recentActivity = orders.slice(0, 3).map((order) => ({
					name: order.user?.name || 'Anonymous',
					email: order.user?.email || 'N/A',
					status: order.status,
					id: `#${order.id}`,
					time: new Date(order.created_at || '').toLocaleTimeString(),
					amount: formatCurrency(order.overhaul_price || 0)
				}));
			}

			// Get total services count
			const servicesResponse = await serviceStore.fetchAll({ limit: 1000 });
			if (servicesResponse) {
				totalServices = servicesResponse.length;
			}

			// Initialize charts
			const monthlyRevenue = await getMonthlyRevenue();
			const trafficSources = await getTrafficSources();

			// Revenue Chart
			new Chart(revenueChart, {
				type: 'bar',
				data: {
					labels: [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					],
					datasets: [
						{
							label: 'Revenue',
							data: monthlyRevenue,
							backgroundColor: '#4F46E5',
							borderRadius: 4
						}
					]
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
							grid: {
								color: '#333'
							},
							ticks: {
								color: '#999',
								callback: function (value) {
									return formatCurrency(value as number);
								}
							}
						},
						x: {
							grid: {
								display: false
							},
							ticks: {
								color: '#999'
							}
						}
					},
					plugins: {
						legend: {
							labels: {
								color: '#999'
							}
						}
					}
				}
			});

			// Traffic Chart
			new Chart(trafficChart, {
				type: 'doughnut',
				data: {
					labels: ['Direct', 'Referral', 'Organic'],
					datasets: [
						{
							data: [trafficSources.direct, trafficSources.referral, trafficSources.organic],
							backgroundColor: ['#4F46E5', '#A5B4FC', '#1F2937']
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: '#999'
							}
						}
					}
				}
			});
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		}
	}

	onMount(() => {
		loadDashboardData();
	});
</script>

<div
	class="min-h-screen bg-white dark:bg-grey-dark p-4 md:p-6 lg:p-8 text-black dark:text-gray-100">
	<!-- Header -->
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-2xl font-bold">Dashboard</h1>
			<p class="text-gray-400">Here's your analytic details</p>
		</div>
		<div class="flex gap-4">
			<button
				class="bg-grey-light dark:bg-grey-secondary px-4 py-2 rounded-lg flex items-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0
						00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
				Filter by
			</button>
			<button
				class="bg-grey-light dark:bg-grey-secondary px-4 py-2 rounded-lg flex items-center gap-2">
				Exports
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
			<div class="flex justify-between items-start mb-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-indigo-500/20 rounded-lg">
						<svg
							class="w-6 h-6 text-indigo-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13
								7a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
					</div>
					<span class="text-gray-400">Total Users</span>
				</div>
				<button class="text-gray-400">•••</button>
			</div>
			<div>
				<p class="text-2xl font-bold">{users.length}</p>
				<p class="text-green-400 text-sm mt-1">Active users in your platform</p>
			</div>
		</div>

		<div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
			<div class="flex justify-between items-start mb-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-indigo-500/20 rounded-lg">
						<svg
							class="w-6 h-6 text-indigo-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0
								00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2
								2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<span class="text-gray-400">Total Services</span>
				</div>
				<button class="text-gray-400">•••</button>
			</div>
			<div>
				<p class="text-2xl font-bold">{totalServices}</p>
				<p class="text-green-400 text-sm mt-1">Available services</p>
			</div>
		</div>

		<div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
			<div class="flex justify-between items-start mb-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-indigo-500/20 rounded-lg">
						<svg
							class="w-6 h-6 text-indigo-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402
								2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0
								0118 0z" />
						</svg>
					</div>
					<span class="text-gray-400">Daily Income</span>
				</div>
				<button class="text-gray-400">•••</button>
			</div>
			<div>
				<p class="text-2xl font-bold">{formatCurrency(dailyIncome)}</p>
				<p class="text-green-400 text-sm mt-1">Income today</p>
			</div>
		</div>

		<div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
			<div class="flex justify-between items-start mb-4">
				<div class="flex items-center gap-2">
					<div class="p-2 bg-indigo-500/20 rounded-lg">
						<svg
							class="w-6 h-6 text-indigo-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402
								2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0
								0118 0z" />
						</svg>
					</div>
					<span class="text-gray-400">Total Income</span>
				</div>
				<button class="text-gray-400">•••</button>
			</div>
			<div>
				<p class="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
				<p class="text-green-400 text-sm mt-1">All time income</p>
			</div>
		</div>
	</div>

	<!-- Charts Section -->
	<div class="mt-8 grid gap-4 lg:grid-cols-3">
		<div class="lg:col-span-2 bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
			<div class="flex justify-between items-center mb-6">
				<div>
					<h3 class="text-xl font-bold">Revenue</h3>
					<p class="text-green-400 text-sm">Last 6 months</p>
				</div>
				<select class="dark:bg-grey-dark bg-white border-0 px-3 py-1 rounded-lg text-sm">
					<option>Month</option>
				</select>
			</div>
			<canvas bind:this={revenueChart} />
		</div>

		<div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-xl font-bold">Traffic Channel</h3>
				<select class="dark:bg-grey-dark bg-white border-0 px-3 py-1 rounded-lg text-sm">
					<option>All time</option>
				</select>
			</div>
			<canvas bind:this={trafficChart} />
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="mt-8 bg-grey-light dark:bg-grey-secondary rounded-xl p-6">
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-xl font-bold">Recent Activity</h3>
			<select class="px-3 py-1 rounded-lg text-sm dark:bg-grey-dark border-0">
				<option>Last 24h</option>
			</select>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="text-gray-400 text-sm">
						<th class="text-left pb-4">Customer</th>
						<th class="text-left pb-4">Status</th>
						<th class="text-left pb-4">Order ID</th>
						<th class="text-left pb-4">Time</th>
						<th class="text-left pb-4">Amount</th>
					</tr>
				</thead>
				<tbody>
					{#each recentActivity as activity}
						<tr class="border-t border-gray-700">
							<td class="py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-gray-700 rounded-full" />
									<div>
										<p class="font-medium">{activity.name}</p>
										<p class="text-gray-400 text-sm">{activity.email}</p>
									</div>
								</div>
							</td>
							<td>
								<span
									class="px-3 py-1 rounded-full text-sm {activity.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}">
									{activity.status}
								</span>
							</td>
							<td>{activity.id}</td>
							<td>{activity.time}</td>
							<td>{activity.amount}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
