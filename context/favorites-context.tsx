import { apiService } from '@/services/api';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useAuth } from './auth-context';

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

interface FavoritesContextType {
    favorites: Favorite[];
    loading: boolean;
    error: string | null;
    fetchFavorites: () => Promise<Favorite[]>;
    addFavorite: (propertyId: string) => Promise<any>;
    removeFavorite: (propertyId: string) => Promise<any>;
    isFavorite: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isGuest } = useAuth();

    const fetchFavorites = useCallback(async () => {
        try {
            // Si el usuario es invitado, no intentamos obtener favoritos
            if (isGuest) {
                setFavorites([]);
                return [];
            }

            setLoading(true);
            setError(null);
            const response = await apiService.getFavorites();
            const favs = response.favorites || [];
            setFavorites(favs);
            return favs;
        } catch (err: any) {
            const errorMessage = err.message || 'Error al obtener favoritos';
            console.error('Error fetchFavorites:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [isGuest]);

    const addFavorite = useCallback(async (propertyId: string) => {
        try {
            const response = await apiService.addFavorite(propertyId);

            // Actualizar estado global con el nuevo favorito
            if (response.favorite) {
                setFavorites(prev => [response.favorite, ...prev]);
            }

            return response;
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Error al agregar a favoritos';
            console.error('Error addFavorite:', errorMessage);
            setError(errorMessage);

            // Crear un error con mensaje para propagar
            const error = new Error(errorMessage);
            (error as any).statusCode = err?.statusCode;
            throw error;
        }
    }, []);

    const removeFavorite = useCallback(async (propertyId: string) => {
        try {
            const response = await apiService.removeFavorite(propertyId);

            // Actualizar estado global
            setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));

            return response;
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Error al remover de favoritos';
            console.error('Error removeFavorite:', errorMessage);
            setError(errorMessage);

            // Crear un error con mensaje para propagar
            const error = new Error(errorMessage);
            (error as any).statusCode = err?.statusCode;
            throw error;
        }
    }, []);

    const isFavorite = useCallback((propertyId: string) => {
        return favorites.some(fav => fav.propertyId === propertyId);
    }, [favorites]);

    const value: FavoritesContextType = {
        favorites,
        loading,
        error,
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavoritesContext debe ser usado dentro de FavoritesProvider');
    }
    return context;
};
