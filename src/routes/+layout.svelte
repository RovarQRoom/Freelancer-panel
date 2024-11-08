<script lang="ts">
	import '../app.css';
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import { authStore } from '$lib/Store/Auth';
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n.js';
	import NavbarComponent from '$lib/Component/Navbar.svelte';
	import {
		setLanguageTag,
		type AvailableLanguageTag,
		availableLanguageTags
	} from '$lib/paraglide/runtime';

	let { children } = $props();

	onMount(() => {
		authStore.fetch();
		const savedLanguage = localStorage.getItem('selectedLanguage') as AvailableLanguageTag;
		if (savedLanguage && availableLanguageTags.includes(savedLanguage)) {
			setLanguageTag(savedLanguage);
		}
	});
</script>

<ParaglideJS {i18n}>
	<div class="flex min-h-screen flex-col bg-main-light-50 dark:bg-main-dark-50">
		<NavbarComponent />

		<main class="flex-1">
			{@render children()}
		</main>

		<Footer class="border-t border-main-light-200 dark:border-main-dark-200">
			<div class="mx-auto w-full max-w-7xl p-4 md:py-8">
				<div class="sm:flex sm:items-center sm:justify-between">
					<FooterLinkGroup class="flex-wrap justify-center">
						<FooterLink href="/about">{m.about()}</FooterLink>
						<FooterLink href="/privacy">{m.privacy_policy()}</FooterLink>
						<FooterLink href="/terms">{m.terms()}</FooterLink>
						<FooterLink href="/contact">{m.contact()}</FooterLink>
					</FooterLinkGroup>
				</div>
				<hr class="my-6 border-main-light-200 sm:mx-auto lg:my-8 dark:border-main-dark-200" />
				<FooterCopyright
					href="/"
					by="Your Company™"
					class="text-center text-main-light-500 dark:text-main-dark-500"
				/>
			</div>
		</Footer>
	</div>
</ParaglideJS>
