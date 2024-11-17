import { writable } from 'svelte/store';
import * as m from '$lib/paraglide/messages.js';
import { toastStore } from './Toast';
import { compressImage } from '$lib/Utils/ImageCompression';

const createStorageStore = () => {
	const { subscribe, set } = writable<{
		isUploading: boolean;
		progress: number;
	}>({
		isUploading: false,
		progress: 0
	});

	return {
		subscribe,
		uploadFile: async (
			file: File,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			startUpload: (files: File[]) => Promise<any>
		): Promise<string> => {
			try {
				if (!file) {
					throw new Error(m['file_is_required']());
				}

				const compressedFile = await compressImage(file);
				const response = await startUpload([compressedFile]);
				if (!response || !response[0]) {
					throw new Error(m['file_upload_failed']());
				}
				return response[0].url;
			} catch (error) {
				set({ isUploading: false, progress: 0 });
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		},

		uploadMultipleFiles: async (
			files: File[],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			startUpload: (files: File[]) => Promise<any>
		): Promise<string[]> => {
			try {
				if (!files.length) {
					throw new Error(m['files_are_required']());
				}

				const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
				const response = await startUpload(compressedFiles);
				if (!response || !response.length) {
					throw new Error(m['file_upload_failed']());
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return response.map((file: any) => file.url);
			} catch (error) {
				set({ isUploading: false, progress: 0 });
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		}
	};
};

export const storageStore = createStorageStore();
