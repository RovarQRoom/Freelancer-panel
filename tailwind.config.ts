import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				main: {
					light: {
						50: '#f9fafb',
						100: '#f3f4f6',
						200: '#e5e7eb',
						300: '#d1d5db',
						400: '#9ca3af',
						500: '#6b7280',
						600: '#4b5563',
						700: '#374151',
						800: '#1f2937',
						900: '#111827'
					},
					dark: {
						50: '#151515',
						100: '#202020',
						200: '#374151',
						300: '#4b5563',
						400: '#6b7280',
						500: '#9ca3af',
						600: '#d1d5db',
						700: '#e5e7eb',
						800: '#f3f4f6',
						900: '#f9fafb'
					}
				},
				primary: {
					light: {
						50: '#FFF5F2',
						100: '#FFF1EE',
						200: '#FFE4DE',
						300: '#FFD5CC',
						400: '#FFBCAD',
						500: '#FE795D',
						600: '#EF562F',
						700: '#EB4F27',
						800: '#CC4522',
						900: '#A5371B'
					},
					dark: {
						50: '#A5371B',
						100: '#CC4522',
						200: '#EB4F27',
						300: '#EF562F',
						400: '#FE795D',
						500: '#FFBCAD',
						600: '#FFD5CC',
						700: '#FFE4DE',
						800: '#FFF1EE',
						900: '#FFF5F2'
					}
				},
				secondary: {
					light: {
						50: '#eff6ff',
						100: '#dbeafe',
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a'
					},
					dark: {
						50: '#1e3a8a',
						100: '#1e40af',
						200: '#1d4ed8',
						300: '#2563eb',
						400: '#3b82f6',
						500: '#60a5fa',
						600: '#93c5fd',
						700: '#bfdbfe',
						800: '#dbeafe',
						900: '#eff6ff'
					}
				},

				blue:{
					light: '#4379F2',
				  dark: '#24407e',
				},
				grey:{
					light: '#e5e5e5',
				  dark: '#151515',
				  secondary: '#252525',
				},
				gray: {"50":"#f9fafb","100":"#f3f4f6","200":"#e5e7eb","300":"#d1d5db","400":"#9ca3af","500":"#6b7280","600":"#4b5563","700":"#252525","800":"#191919","900":"#151515"}
			}
		}
	},
	plugins: [typography, forms, containerQueries, aspectRatio, flowbitePlugin]
} satisfies Config;
