import { toastStore } from '$lib/Store/Toast';
import { createUploadthing } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';
import * as m from '$lib/paraglide/messages';

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: '4MB' },
		video: { maxFileSize: '32MB' }
	}).onUploadComplete(async ({ file }) => {
		toastStore.success(m.file_uploaded());
	})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
