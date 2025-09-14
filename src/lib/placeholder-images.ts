
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Function to get wallpapers from localStorage to persist them across page loads
export const getStoredWallpapers = (): ImagePlaceholder[] => {
    if (typeof window === 'undefined') {
        return data.placeholderImages;
    }
    try {
        const savedWallpapers = window.localStorage.getItem('divisionalWallpapers');
        // Make sure to parse and return, or fallback to the default JSON.
        return savedWallpapers ? JSON.parse(savedWallpapers) : data.placeholderImages;
    } catch (error) {
        console.error("Failed to parse wallpapers from localStorage", error);
        return data.placeholderImages;
    }
};
