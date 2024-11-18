<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Avatar,
		Select,
		Button
	} from 'flowbite-svelte';
	import {
		setLanguageTag,
		languageTag,
		type AvailableLanguageTag,
		availableLanguageTags
	} from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n.js';
	import { authStore } from '$lib/Store/Auth';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { DarkMode } from 'flowbite-svelte';
	import { Action } from '$lib/Model/Action/Action';
	import { filterNavItemsByPermission } from '$lib/Utils/CheckPremission';

	let selectedLanguage = $state(languageTag());

	const navItems = [
		{ href: '/', label: m.dashboard(), policies: [Action.READ_CATEGORY] },
		{ href: '/categories/1', label: m.categories(), policies: [Action.READ_CATEGORY] },
		{ href: '/services/1', label: m.services(), policies: [Action.READ_SERVICE] },
		{ href: '/users/1', label: m.users(), policies: [Action.READ_USER] },
		{ href: '/conversations/1', label: m.conversations(), policies: [Action.READ_CONVERSATION] },
		{ href: '/setting', label: m.settings() }
	];

	async function handleLogout() {
		await authStore.logout();
	}

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		setLanguageTag(newLanguage);
		localStorage.setItem('selectedLanguage', newLanguage);
		goto(localisedPath);
	}
</script>

<Navbar class="border-b border-main-light-200 dark:border-main-dark-200">
	<NavBrand href="/">
		<img src="/images/logo.png" class="mr-3 h-8" alt="Logo" />
		<!-- <span class="self-center whitespace-nowrap text-xl font-semibold text-main-light-900 dark:text-main-dark-900">
            Task Home
        </span> -->
	</NavBrand>

	<NavHamburger />

	{#if $authStore}
		<div class="hello ml-auto flex items-center gap-4">
			<Select
				class="w-auto transition-all duration-200 ease-in-out"
				items={availableLanguageTags.map((lang) => ({
					name: m[`language_${lang}`](),
					value: lang
				}))}
				bind:value={selectedLanguage}
				on:change={() => switchToLanguage(selectedLanguage)}
			/>

			<Button pill color="light" id="avatar_with_name" class="px-2 py-1 gap-2">
				<Avatar
					src={$authStore.image || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
				/>
				{$authStore.name || $authStore.email}
			</Button>
			<Dropdown triggeredBy="#avatar_with_name">
				<div slot="header" class="px-4 py-2">
					<span class="block truncate text-sm font-medium"
						>{$authStore.name || $authStore.email}</span
					>
				</div>
				<!-- <DropdownItem href="/profile">{m.profile()}</DropdownItem> -->
				<DropdownItem href="/setting">{m.settings()}</DropdownItem>
				<DropdownItem slot="footer" on:click={handleLogout}>{m.logout()}</DropdownItem>
			</Dropdown>
		</div>
	{/if}
	<DarkMode class="text-lg">
		<img src="/images/sun.png" alt="Light Mode" slot="lightIcon" class="h-6 w-6 object-contain" />
		<img src="/images/moon.png" alt="Dark Mode" slot="darkIcon" class="h-6 w-6 object-contain" />
	</DarkMode>

	<NavUl
		divClass="w-full md:flex justify-center md:w-full"
		ulClass="flex flex-col p-4 mt-4 md:flex-row md:items-center md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium"
		activeClass="text-blue-700 dark:text-blue-500"
		nonActiveClass="text-main-light-900 dark:text-main-dark-900"
	>
		{#each filterNavItemsByPermission($authStore!, navItems) as item}
			<NavLi
				href={item.href}
				activeClass="text-blue-700 dark:text-blue-500"
				class={`transition-all duration-200 ease-in-out hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 ${$page.url.pathname === item.href ? "text-blue-700 dark:text-blue-500" : ""} `}
			>
				{item.label}
			</NavLi>
		{/each}
	</NavUl>
</Navbar>
