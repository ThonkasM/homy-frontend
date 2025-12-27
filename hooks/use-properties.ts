import { apiService } from '@/services/api';
import { useCallback, useState } from 'react';

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    currency?: string; // BOB, USD, ARS, PEN, CLP, MXN, COP
    propertyType: string;
    operationType: string;
    postStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking: number;
    amenities?: string[];
    specifications?: Record<string, any>; // Características dinámicas
    contactPhone?: string;
    images: Array<{ id: string; url: string; order: number }>;
    owner: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        phone?: string;
        email?: string;
    };
}

export interface PropertiesResponse {
    properties: Property[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const useProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = useCallback(
        async (filters?: { page?: number; limit?: number }) => {
            try {
                setLoading(true);
                setError(null);

                console.log('[useProperties] fetchProperties called with:', filters);
                const data = await apiService.getProperties({
                    page: filters?.page || 1,
                    limit: filters?.limit || 10,
                });

                console.log('[useProperties] API Response:', {
                    success: !!data,
                    hasProperties: !!data?.properties,
                    propertiesCount: data?.properties?.length || 0,
                    pagination: data?.pagination,
                    data: JSON.stringify(data, null, 2),
                });

                if (data?.properties) {
                    console.log('[useProperties] Setting properties:', data.properties.length);
                    setProperties(data.properties);
                    return data as PropertiesResponse;
                } else {
                    console.warn('[useProperties] No properties in response, data:', data);
                    setProperties([]);
                }
            } catch (err: any) {
                const errorMessage = err?.message || 'Error al obtener propiedades';
                setError(errorMessage);
                console.error('Error fetching properties:', errorMessage, err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchPropertyById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const property = await apiService.getPropertyById(id);
            return property as Property;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al obtener propiedad';
            setError(errorMessage);
            console.error('Error fetching property:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserProperties = useCallback(
        async (filters?: { page?: number; limit?: number }) => {
            try {
                setLoading(true);
                setError(null);

                const data = await apiService.getUserProperties({
                    page: filters?.page || 1,
                    limit: filters?.limit || 10,
                });

                if (data?.properties) {
                    setProperties(data.properties);
                    return data as PropertiesResponse;
                }
            } catch (err: any) {
                const errorMessage = err?.message || 'Error al obtener tus propiedades';
                setError(errorMessage);
                console.error('Error fetching user properties:', errorMessage);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const searchByLocation = useCallback(async (lat: number, lon: number, radius: number = 50) => {
        try {
            setLoading(true);
            setError(null);

            const data = await apiService.searchPropertiesByLocation(lat, lon, radius);
            if (Array.isArray(data)) {
                setProperties(data);
                return data;
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al buscar propiedades';
            setError(errorMessage);
            console.error('Error searching by location:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createProperty = useCallback(async (formData: FormData) => {
        try {
            setLoading(true);
            setError(null);

            const property = await apiService.createPropertyWithImages(formData);
            return property;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al crear propiedad';
            setError(errorMessage);
            console.error('Error creating property:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProperty = useCallback(async (id: string, updateData: any) => {
        try {
            setLoading(true);
            setError(null);

            const property = await apiService.updateProperty(id, updateData);
            return property;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al actualizar propiedad';
            setError(errorMessage);
            console.error('Error updating property:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProperty = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.deleteProperty(id);
            return response;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al eliminar propiedad';
            setError(errorMessage);
            console.error('Error deleting property:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const publishProperty = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.publishProperty(id);
            console.log('✅ Propiedad publicada:', id);
            return response;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al publicar propiedad';
            setError(errorMessage);
            console.error('Error publishing property:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const archiveProperty = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.archiveProperty(id);
            console.log('📦 Propiedad archivada:', id);
            return response;
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al archivar propiedad';
            setError(errorMessage);
            console.error('Error archiving property:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        properties,
        loading,
        error,
        fetchProperties,
        fetchPropertyById,
        fetchUserProperties,
        searchByLocation,
        createProperty,
        updateProperty,
        deleteProperty,
        publishProperty,
        archiveProperty,
    };
};
