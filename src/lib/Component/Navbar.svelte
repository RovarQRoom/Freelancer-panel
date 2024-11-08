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
    } from "flowbite-svelte";
    import { setLanguageTag, languageTag, type AvailableLanguageTag, availableLanguageTags } from '$lib/paraglide/runtime';
    import { i18n } from '$lib/i18n.js'
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
        <span class="self-center whitespace-nowrap text-xl font-semibold text-main-light-900 dark:text-main-dark-900">
            Task Home
        </span>
    </NavBrand>
    
    <NavHamburger />
    
    <NavUl>
        {#each navItems as item}
            <NavLi 
                href={item.href}
                activeClass="text-blue-700 dark:text-blue-500"
                class={`
                    transition-all duration-200 ease-in-out
                    hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400
                    ${$page.url.pathname === item.href ? "text-blue-700 dark:text-blue-500" : ""}
                `}
            >
                {item.label}
            </NavLi>
        {/each}
    </NavUl>

    {#if $authStore}
        <div class="flex items-center ml-auto gap-4 hello">
            <Select 
                class="w-32 transition-all duration-200 ease-in-out"
                items={availableLanguageTags.map(lang => ({
                    name: m[`language_${lang}`](),
                    value: lang
                }))}
                bind:value={selectedLanguage}
                on:change={() => switchToLanguage(selectedLanguage)}
            />
            <button
                onclick={() => userDropdownOpen = !userDropdownOpen}
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