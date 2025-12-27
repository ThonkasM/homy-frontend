import { apiService } from '@/services/api';
import { useCallback, useState } from 'react';

export interface Favorite {
    id: string;
    userId: string;
    propertyId: string;
    createdAt: string;
    property: {
        id: string;
        title: string;
        price: number;
        address: string;
        city: string;
        images?: Array<{ url: string; order: number }>;
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            avatar?: string;
        };
    };
}

interface FavoritesState {
    favorites: Favorite[];
    loading: boolean;
    error: string | null;
}

export const useFavorites = () => {
    const [state, setState] = useState<FavoritesState>({
        favorites: [],
        loading: false,
        error: null,
    });

    /**
     * Obtener todas las propiedades favoritas del usuario
     */
    const fetchFavorites = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await apiService.getFavorites();
            setState(prev => ({
                ...prev,
                favorites: response.favorites || [],
                loading: false,
            }));
            return response.favorites || [];
        } catch (err: any) {
            const errorMessage = err.message || 'Error al obtener favoritos';
            console.error('Error fetchFavorites:', errorMessage);
            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
            }));
            throw err;
        }
    }, []);

    /**
     * Agregar una propiedad a favoritos
     */
    const addFavorite = useCallback(async (propertyId: string) => {
        try {
            const response = await apiService.addFavorite(propertyId);
            console.log('✅ Propiedad agregada a favoritos:', propertyId);

            // Actualizar estado con el nuevo favorito
            if (response.favorite) {
                setState(prev => ({
                    ...prev,
                    favorites: [response.favorite, ...prev.favorites],
                }));
            }

            return response;
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Error al agregar a favoritos';
            console.error('Error addFavorite:', errorMessage);
            setState(prev => ({ ...prev, error: errorMessage }));

            // Crear un error con mensaje para propagar
            const error = new Error(errorMessage);
            (error as any).statusCode = err?.statusCode;
            throw error;
        }
    }, []);

    /**
     * Remover una propiedad de favoritos
     */
    const removeFavorite = useCallback(async (propertyId: string) => {
        try {
            const response = await apiService.removeFavorite(propertyId);
            console.log('✅ Propiedad removida de favoritos:', propertyId);

            // Actualizar estado
            setState(prev => ({
                ...prev,
                favorites: prev.favorites.filter(fav => fav.propertyId !== propertyId),
            }));

            return response;
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Error al remover de favoritos';
            console.error('Error removeFavorite:', errorMessage);
            setState(prev => ({ ...prev, error: errorMessage }));

            // Crear un error con mensaje para propagar
            const error = new Error(errorMessage);
            (error as any).statusCode = err?.statusCode;
            throw error;
        }
    }, []);

    /**
     * Verificar si una propiedad está en favoritos
     */
    const isFavorite = useCallback(async (propertyId: string): Promise<boolean> => {
        try {
            const response = await apiService.isFavorite(propertyId);
            return response.isFavorite || false;
        } catch (err: any) {
            console.error('Error isFavorite:', err.message);
            return false;
        }
    }, []);

    /**
     * Obtener si una propiedad está en favoritos del estado local
     * (más eficiente que hacer request)
     */
    const isPropertyFavorited = useCallback((propertyId: string): boolean => {
        return state.favorites.some(fav => fav.propertyId === propertyId);
    }, [state.favorites]);

    return {
        favorites: state.favorites,
        loading: state.loading,
        error: state.error,
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        isPropertyFavorited,
    };
};
