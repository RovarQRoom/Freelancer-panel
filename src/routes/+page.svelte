<script lang="ts">
	import {
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	export let data;

	let lineCanvas: HTMLCanvasElement;
	let barCanvas: HTMLCanvasElement;
	let pieCanvas: HTMLCanvasElement;

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
	const lineData = months.map(() => Math.floor(Math.random() * 1000));
	const barData = months.map(() => Math.floor(Math.random() * 1000));

	onMount(() => {
		// Line Chart
		new Chart(lineCanvas, {
			type: 'line',
			data: {
				labels: months,
				datasets: [
					{
						label: m.monthly_revenue(),
						data: lineData,
						borderColor: '#FE795D',
						tension: 0.4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});

		// Bar Chart
		new Chart(barCanvas, {
			type: 'bar',
			data: {
				labels: months,
				datasets: [
					{
						label: m.monthly_users(),
						data: barData,
						backgroundColor: '#3b82f6'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});

		// Pie Chart
		new Chart(pieCanvas, {
			type: 'pie',
			data: {
				labels: [m.active_users(), m.inactive_users()],
				datasets: [
					{
						data: [65, 35],
						backgroundColor: ['#FE795D', '#9ca3af']
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});
	});
</script>

<div class="min-h-screen bg-main-light-50 p-4 dark:bg-main-dark-50">
	<!-- Stats Cards -->
	<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<!-- <Card>
			<div class="flex flex-col">
				<span class="text-main-light-500 dark:text-main-dark-500">{m.total_users()}</span>
				<span class="text-2xl font-bold">{data.stats.users}</span>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col">
				<span class="text-main-light-500 dark:text-main-dark-500">{m.total_revenue()}</span>
				<span class="text-2xl font-bold">${data.stats.revenue}</span>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col">
				<span class="text-main-light-500 dark:text-main-dark-500">{m.total_orders()}</span>
				<span class="text-2xl font-bold">{data.stats.orders}</span>
			</div>
		</Card> -->
		<!-- <Card>
			<div class="flex flex-col">
				<span class="text-main-light-500 dark:text-main-dark-500">{m.conversion_rate()}</span>
				<span class="text-2xl font-bold">{data.stats.conversion}%</span>
			</div>
		</Card> -->
	</div>

	<!-- Charts -->
	<div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card>
			<h5 class="mb-4 text-xl font-bold">{m.revenue_over_time()}</h5>
			<div class="h-80">
				<canvas bind:this={lineCanvas}></canvas>
			</div>
		</Card>
		<Card>
			<h5 class="mb-4 text-xl font-bold">{m.users_over_time()}</h5>
			<div class="h-80">
				<canvas bind:this={barCanvas}></canvas>
			</div>
		</Card>
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card>
			<h5 class="mb-4 text-xl font-bold">{m.user_distribution()}</h5>
			<div class="h-80">
				<canvas bind:this={pieCanvas}></canvas>
			</div>
		</Card>
		<Card>
			<h5 class="mb-4 text-xl font-bold">{m.recent_activities()}</h5>
			<Table>
				<TableHead>
					<TableHeadCell>{m.user()}</TableHeadCell>
					<TableHeadCell>{m.action()}</TableHeadCell>
					<TableHeadCell>{m.date()}</TableHeadCell>
				</TableHead>
				<TableBody>
					<TableBodyRow>
						<TableBodyCell>John Doe</TableBodyCell>
						<TableBodyCell>{m.logged_in()}</TableBodyCell>
						<TableBodyCell>2024-03-20</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>Jane Smith</TableBodyCell>
						<TableBodyCell>{m.updated_profile()}</TableBodyCell>
						<TableBodyCell>2024-03-19</TableBodyCell>
					</TableBodyRow>
				</TableBody>
			</Table>
		</Card>
	</div>
</div>
