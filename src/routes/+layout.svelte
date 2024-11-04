<script lang="ts">
	import "../app.css";
	import { 
		Navbar, 
		NavBrand, 
		NavLi, 
		NavUl, 
		NavHamburger,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterLink,
		Avatar
	} from "flowbite-svelte";
	import { authStore } from '$lib/Store/Auth';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';

	// Navigation items
	const navItems = [
		{ href: '/dashboard', label: m.dashboard() },
		{ href: '/services', label: m.services() },
		{ href: '/users', label: m.users() },
		{ href: '/messages', label: m.messages() },
		{ href: '/settings', label: m.settings() }
	];

	let userDropdownOpen = false;

	async function handleLogout() {
		await authStore.logout();
	}
</script>

<div class="flex min-h-screen flex-col bg-main-light-50 dark:bg-main-dark-50">
	<Navbar class="border-b border-main-light-200 dark:border-main-dark-200">
		<NavBrand href="/">
			<img src="/logo.png" class="mr-3 h-8" alt="Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold text-main-light-900 dark:text-main-dark-900">
				Your App
			</span>
		</NavBrand>
		
		<NavHamburger />
		
		<NavUl>
			{#each navItems as item}
				<NavLi 
					href={item.href} 
					activeClass="text-blue-700 dark:text-blue-500"
					class={$page.url.pathname === item.href ? "text-blue-700 dark:text-blue-500" : ""}
				>
					{item.label}
				</NavLi>
			{/each}
		</NavUl>

		{#if $authStore}
			<div class="flex items-center ml-auto">
				<button
					on:click={() => userDropdownOpen = !userDropdownOpen}
					class="flex items-center space-x-3 p-2 rounded-lg hover:bg-main-light-100 dark:hover:bg-main-dark-100"
				>
					<Avatar 
						src={$authStore.image || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
						class="cursor-pointer"
						size="sm"
					/>
					<span class="text-main-light-900 dark:text-main-dark-900">
						{$authStore.name || $authStore.email}
					</span>
				</button>

				<Dropdown placement="bottom" bind:open={userDropdownOpen}>
					<DropdownItem href="/profile">
						{m.profile()}
					</DropdownItem>
					<DropdownItem href="/settings">
						{m.settings()}
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={handleLogout}>
						{m.logout()}
					</DropdownItem>
				</Dropdown>
			</div>
		{/if}
	</Navbar>

	<main class="flex-1">
		<slot />
	</main>

	<Footer class="border-t border-main-light-200 dark:border-main-dark-200">
		<div class="w-full max-w-7xl mx-auto p-4 md:py-8">
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterLinkGroup class="flex-wrap justify-center">
					<FooterLink href="/about">{m.about()}</FooterLink>
					<FooterLink href="/privacy">{m.privacy_policy()}</FooterLink>
					<FooterLink href="/terms">{m.terms()}</FooterLink>
					<FooterLink href="/contact">{m.contact()}</FooterLink>
				</FooterLinkGroup>
			</div>
			<hr class="my-6 border-main-light-200 dark:border-main-dark-200 sm:mx-auto lg:my-8" />
			<FooterCopyright 
				href="/" 
				by="Your Company™" 
				class="text-center text-main-light-500 dark:text-main-dark-500"
			/>
		</div>
	</Footer>
</div>
