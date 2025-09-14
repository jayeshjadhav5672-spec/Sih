import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export let PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

// This function allows updating the placeholder images array from other components.
// In a real application, you'd use a more robust state management solution.
export function setPlaceholderImages(newImages: ImagePlaceholder[]) {
  PlaceHolderImages = newImages;
}

// Function to get wallpapers from localStorage to persist them across page loads
export const getStoredWallpapers = (): ImagePlaceholder[] => {
    if (typeof window === 'undefined') {
        return data.placeholderImages;
    }
    try {
        const savedWallpapers = window.localStorage.getItem('divisionalWallpapers');
        return savedWallpapers ? JSON.parse(savedWallpapers) : data.placeholderImages;
    } catch (error) {
        console.error("Failed to parse wallpapers from localStorage", error);
        return data.placeholderImages;
    }
};

if (typeof window !== 'undefined') {
    PlaceHolderImages = getStoredWallpapers();
}
