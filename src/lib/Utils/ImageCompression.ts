import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

export const compressImage = async (
  file: File,
  options?: CompressionOptions
): Promise<File> => {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 0.5, // Default max file size is 1MB
    maxWidthOrHeight: 1920, // Default max width/height is 1920px
    useWebWorker: true, // Use web worker for better performance
    quality: 0.8, // Default quality is 0.8 (80%)
  };

  const compressionOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

/**
 * Utility function to check if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};
