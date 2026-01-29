import { apiService } from '@/services/api';
import { useCallback, useState } from 'react';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    createdAt: string;
    propertiesCount?: number;
    reviewsCount?: number;
    averageRating?: number | null;
}

export interface UsersResponse {
    users: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface UserSearchFilters {
    search?: string;
    city?: string;
    page?: number;
    limit?: number;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchUsers = useCallback(
        async (filters?: UserSearchFilters) => {
            try {
                setLoading(true);
                setError(null);

                const data = await apiService.searchUsers(filters || {});

                if (data?.users) {
                    setUsers(data.users);
                    return data as UsersResponse;
                } else {
                    console.warn('[useUsers] No users in response');
                    setUsers([]);
                }
            } catch (err: any) {
                const errorMessage = err?.message || 'Error al buscar usuarios';
                setError(errorMessage);
                console.error('Error searching users:', errorMessage, err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const getUserProfile = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);

            const user = await apiService.getUserProfile(userId);
            return user as User;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al obtener perfil de usuario';
            setError(errorMessage);
            console.error('Error fetching user profile:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserProperties = useCallback(
        async (userId: string, page = 1, limit = 10) => {
            try {
                setLoading(true);
                setError(null);

                const data = await apiService.getUserProperties(userId, page, limit);
                return data;
            } catch (err: any) {
                const errorMessage = err?.message || 'Error al obtener propiedades del usuario';
                setError(errorMessage);
                console.error('Error fetching user properties:', errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        users,
        loading,
        error,
        searchUsers,
        getUserProfile,
        getUserProperties,
    };
};
