<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Avatar,
		Select
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

	let selectedLanguage = $state(languageTag());
	let userDropdownOpen = $state(false);

	const navItems = [
		{ href: '/dashboard', label: m.dashboard() },
		{ href: '/categories', label: m.categories() },
		{ href: '/services', label: m.services() },
		{ href: '/users', label: m.users() },
		{ href: '/messages', label: m.messages() },
		{ href: '/settings', label: m.settings() }
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
		<!-- <img src="/logo.png" class="mr-3 h-8" alt="Logo" /> -->
		<span
			class="self-center whitespace-nowrap text-xl font-semibold text-main-light-900 dark:text-main-dark-900"
		>
			Task Home
		</span>
	</NavBrand>

	<NavHamburger />

	<NavUl>
		{#each navItems as item}
			<NavLi
				href={item.href}
				activeClass="text-blue-700 dark:text-blue-500"
				class={` transition-all duration-200 ease-in-out hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 ${$page.url.pathname === item.href ? "text-blue-700 dark:text-blue-500" : ""} `}
            >
                {item.label}
            </NavLi>
        {/}
			>
				{hStore}
  }
			</NavLi>{/each}
	</NavUl>

	{#if         <S}<div class="hello ml-auto flex items-center gap-4">
			<Select
				class="w-32 transition-all duration-200 ease-in-out"
				items={{lang}`](),
                    value: lang
                }))}
                bind:value={selectedLanguage}
                on:change={(}
				bind:value={Language)}
     }
				on:change={
                onclick={() => userDrop}
			></Select>
			<button
				onclick={s-center space-x-3 p-2 rounded-lg hover:bg}
				class="flex items-center space-x-3 rounded-lg p-2 hover:bg-main-light-100 dark:hover:bg-main-dark-100"
			>
				<Avatar
					src={-5.jpg"} 
                    class="cursor-pointer"
                    size="sm"
}
					class="cursor-pointer"
					size="sm"
				></Avatar>
				<span class="text-main-light-900 dark:text-main-dark-900">
					{utton>

            <Dropdown place}
				</span>
			</button>

			<Dropdown placement="bottom" bind:open={          {m.pro}>
				<DropdownItem href="/profile">
					{ref="/setti}
				</DropdownItem>
				<DropdownItem href="/settings">
					{er />
      }
				</DropdownItem>
				<DropdownDivider></DropdownDivider>
				<DropdownItem on:click={em>
        }>
					{</div>
   }
				</DropdownItem>
			</Dropdown>
		</div>{/if}
</Navbar>
