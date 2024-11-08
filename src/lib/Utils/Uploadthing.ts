import type { OurFileRouter } from '$lib/Uploadthing/Uploadthing';
import { generateSvelteHelpers } from '@uploadthing/svelte';

export const { createUploader, createUploadThing } = generateSvelteHelpers<OurFileRouter>();
