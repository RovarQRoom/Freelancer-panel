<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';

  let revenueChart: HTMLCanvasElement;
  let trafficChart: HTMLCanvasElement;

  onMount(() => {
    // Revenue Chart
    new Chart(revenueChart, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Profit',
            data: [7000, 11000, 8000, 15000, 12000, 7000],
            backgroundColor: '#4F46E5',
            borderRadius: 4,
          },
          {
            label: 'Loss',
            data: [6000, 9000, 7000, 12000, 10000, 6000],
            backgroundColor: '#A5B4FC',
            borderRadius: 4,
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
              color: '#999'
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
        datasets: [{
          data: [50.5, 30.5, 19],
          backgroundColor: ['#4F46E5', '#A5B4FC', '#1F2937']
        }]
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
  });

  const recentActivity = [
    {
      name: 'Ronald Richards',
      email: 'ronaldcs@mail.com',
      status: 'Member',
      id: '#74568320',
      time: '5 min ago',
      amount: '$12,408.20'
    },
    {
      name: 'Darrell Steward',
      email: 'steward.darall@mail.com',
      status: 'Signed Up',
      id: '#23134855',
      time: '10 min ago',
      amount: '$201.50'
    },
    {
      name: 'Marvin McKinney',
      email: 'mckinney.jr@mail.com',
      status: 'New Customer',
      id: '#54394837',
      time: '15 min ago',
      amount: '$2,856.03'
    }
  ];
</script>

<div class="min-h-screen bg-white dark:bg-grey-dark p-4 md:p-6 lg:p-8 text-black dark:text-gray-100">
  <!-- Header -->
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-gray-400">Here's your analytic details</p>
    </div>
    <div class="flex gap-4">
      <button class=" bg-grey-light dark:bg-grey-secondary px-4 py-2 rounded-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter by
      </button>
      <button class="bg-grey-light dark:bg-grey-secondary px-4 py-2 rounded-lg flex items-center gap-2">
        Exports
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-gray-400">Total Users</span>
        </div>
        <button class="text-gray-400">•••</button>
      </div>
      <div>
        <p class="text-2xl font-bold">$120,784.02</p>
        <p class="text-green-400 text-sm mt-1">↑ 12.3% +$1,453.89 today</p>
      </div>
      <button class="mt-4 text-indigo-400 text-sm flex items-center gap-1">
        View Report
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>



    <div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-indigo-500/20 rounded-lg">
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-gray-400">Total Services</span>
        </div>
        <button class="text-gray-400">•••</button>
      </div>
      <div>
        <p class="text-2xl font-bold">$120,784.02</p>
        <p class="text-green-400 text-sm mt-1">↑ 12.3% +$1,453.89 today</p>
      </div>
      <button class="mt-4 text-indigo-400 text-sm flex items-center gap-1">
        View Report
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>


    <div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-indigo-500/20 rounded-lg">
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-gray-400">Daily Income</span>
        </div>
        <button class="text-gray-400">•••</button>
      </div>
      <div>
        <p class="text-2xl font-bold">$120,784.02</p>
        <p class="text-green-400 text-sm mt-1">↑ 12.3% +$1,453.89 today</p>
      </div>
      <button class="mt-4 text-indigo-400 text-sm flex items-center gap-1">
        View Report
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>


    <div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-indigo-500/20 rounded-lg">
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-gray-400">Total Income</span>
        </div>
        <button class="text-gray-400">•••</button>
      </div>
      <div>
        <p class="text-2xl font-bold">$120,784.02</p>
        <p class="text-green-400 text-sm mt-1">↑ 12.3% +$1,453.89 today</p>
      </div>
      <button class="mt-4 text-indigo-400 text-sm flex items-center gap-1">
        View Report
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Add similar stat cards for Total Orders, Visitor, and Refunded -->
  </div>

  <!-- Charts Section -->
  <div class="mt-8 grid gap-4 lg:grid-cols-3">
    <div class="lg:col-span-2 bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-xl font-bold">Revenue</h3>
          <p class="text-green-400 text-sm">↑ +10%</p>
        </div>
        <select class="dark:bg-grey-dark bg-white border-0 px-3 py-1 rounded-lg text-sm">
          <option>Month</option>
        </select>
      </div>
      <canvas bind:this={revenueChart}></canvas>
    </div>

    <div class="bg-grey-light dark:bg-grey-secondary p-6 rounded-xl">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">Traffic Channel</h3>
        <select class="dark:bg-grey-dark bg-white border-0 px-3 py-1 rounded-lg text-sm">
          <option>All time</option>
        </select>
      </div>
      <canvas bind:this={trafficChart}></canvas>
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="mt-8 bg-grey-light dark:bg-grey-secondary rounded-xl p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold">Recent Activity</h3>
      <select class=" px-3 py-1 rounded-lg text-sm">
        <option>Last 24h</option>
      </select>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-gray-400 text-sm">
            <th class="text-left pb-4">Customer</th>
            <th class="text-left pb-4">Status</th>
            <th class="text-left pb-4">Customer ID</th>
            <th class="text-left pb-4">Retained</th>
            <th class="text-left pb-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {#each recentActivity as activity}
            <tr class="border-t border-gray-700">
              <td class="py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div>
                    <p class="font-medium">{activity.name}</p>
                    <p class="text-gray-400 text-sm">{activity.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="px-3 py-1 rounded-full text-sm">
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
