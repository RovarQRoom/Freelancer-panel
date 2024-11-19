<script lang="ts">
	import '../app.css';
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink, Spinner } from 'flowbite-svelte';
	import { authStore } from '$lib/Store/Auth';
	import * as m from '$lib/paraglide/messages';
	import { onMount, type Snippet } from 'svelte';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n.js';
	import NavbarComponent from '$lib/Component/Navbar.svelte';
	import FooterComponent from '$lib/Component/Footer.Component.svelte';
	import { page } from '$app/stores';
	import {
		setLanguageTag,
		type AvailableLanguageTag,
		availableLanguageTags
	} from '$lib/paraglide/runtime';
	import type { LayoutData } from './$types';
	import { goto, invalidate } from '$app/navigation';
	import Toast from '$lib/Component/Toast.svelte';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let { session, supabase } = $derived(data);
	// List of routes where navbar and footer should be hidden
	const hideNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
	const showNavbar = $derived(
		!hideNavbarRoutes.some((route) => $page.url.pathname.startsWith(route))
	);
	let isLoading = $state(true);

	onMount(() => {
		try {
			checkAuth();
			const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
				if (newSession?.expires_at !== session?.expires_at) {
					invalidate('supabase:auth');
				}
			});

			const savedLanguage = localStorage.getItem('selectedLanguage') as AvailableLanguageTag;
			if (savedLanguage && availableLanguageTags.includes(savedLanguage)) {
				setLanguageTag(savedLanguage);
			}
			return () => data.subscription.unsubscribe();
		} catch (error) {
		} finally {
			isLoading = false;
		}
	});

	async function checkAuth() {
		const response = await authStore.fetch();
		if (response?.data && !response.data.id) {
			goto('/login');
		}
	}
</script>

<ParaglideJS {i18n}>
	<Toast />
	{#if isLoading}
		<div
			class="flex min-h-screen items-center justify-center bg-main-light-50 dark:bg-main-dark-50"
		>
			<Spinner size="12" />
		</div>
	{:else if !$authStore?.id && !hideNavbarRoutes.some( (route) => $page.url.pathname.startsWith(route) )}
		{@const currentPath = $page.url.pathname}
		{#if currentPath !== '/login'}
			{goto('/login')}
		{/if}
	{:else}
		<div class="flex min-h-screen flex-col bg-main-light-50 dark:bg-main-dark-50">
			{#if showNavbar}
				<NavbarComponent />
			{/if}

			<main class="flex-1">
				{@render children()}
			</main>

			{#if showNavbar}
				<FooterComponent />
			{/if}
		</div>
	{/if}
</ParaglideJS>
