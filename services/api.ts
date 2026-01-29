// API Configuration
// Para desarrollo local:
// - Android Emulator: usa 10.0.2.2:3000
// - iOS Simulator: usa localhost:3000
// - Dispositivo físico: usa tu IP local (ej: 192.168.1.100:3000)
//const API_BASE_URL = __DEV__ ? 'http://localhost:3000/api' : 'http://localhost:3000/';

// Alternativas para diferentes plataformas (descomenta la que necesites)
//const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android Emulator

// Base URL sin /api (para archivos estáticos)
export const SERVER_BASE_URL = 'http://192.168.26.7:3000'; // Tu IP local (reemplaza con tu IP)

// API URL con /api
const API_BASE_URL = `${SERVER_BASE_URL}/api`;

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        role: string;
        avatar?: string;
        bio?: string;
        createdAt: string;
        updatedAt?: string;
        isVerified?: boolean;
    };
}

export interface AuthError {
    message: string;
    statusCode: number;
}

class ApiService {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    clearToken() {
        this.token = null;
    }

    private getHeaders() {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async handleResponse(response: Response) {
        let data;

        try {
            data = await response.json();
        } catch (e) {
            // Si no es JSON válido
            console.error('Response no es JSON válido:', response.status, response.statusText);
            throw {
                message: `Error del servidor (${response.status}): ${response.statusText}`,
                statusCode: response.status,
            };
        }

        // Extraer datos si está envuelto en { success, data, timestamp }
        if (data?.success === true && data?.data !== undefined) {
            data = data.data;
        }

        if (!response.ok) {
            // Log detallado para debugging
            console.error('❌ API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                data: data,
                message: data?.message,
            });

            const error: AuthError = {
                message: data?.message || data?.error || `Error ${response.status}: ${response.statusText}`,
                statusCode: response.status,
            };
            throw error;
        }

        return data;
    }

    // ==========================================
    // AUTENTICACIÓN
    // ==========================================

    async login(payload: LoginPayload): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            });

            const data = await this.handleResponse(response);
            return data;
        } catch (error: any) {
            const errorMessage = error?.message || 'Error de conexión. Verifica que el servidor esté corriendo en http://localhost:3000';
            throw {
                message: errorMessage,
                statusCode: error?.statusCode || 0,
            };
        }
    }

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            });

            const data = await this.handleResponse(response);
            return data;
        } catch (error: any) {
            console.error('❌ Register Error capturado:', error);
            const errorMessage = error?.message || 'Error de conexión. Verifica que el servidor esté corriendo en http://localhost:3000';
            console.error('Mensaje final:', errorMessage);
            throw {
                message: errorMessage,
                statusCode: error?.statusCode || 0,
            };
        }
    }

    async getProfile(): Promise<AuthResponse['user']> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Get Profile Error:', error);
            throw {
                message: error?.message || 'Error de conexión al obtener perfil',
                statusCode: 0,
            };
        }
    }

    async updateProfile(updateData: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(updateData),
            });

            return this.handleResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            this.setToken(token);
            await this.getProfile();
            return true;
        } catch {
            this.clearToken();
            return false;
        }
    }

    // ==========================================
    // PROPIEDADES
    // ==========================================

    /**
     * Obtener todas las propiedades con paginación y filtros completos
     */
    async getProperties(filters?: PropertyFilters) {
        try {
            const params = new URLSearchParams();

            // Parámetros básicos
            if (filters?.page) params.append('page', filters.page.toString());
            if (filters?.limit) params.append('limit', filters.limit.toString());

            // Filtros de tipo
            if (filters?.propertyType) params.append('propertyType', filters.propertyType);
            if (filters?.operationType) params.append('operationType', filters.operationType);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.postStatus) params.append('postStatus', filters.postStatus);
            if (filters?.currency) params.append('currency', filters.currency);

            // Búsqueda de texto
            if (filters?.search) params.append('search', filters.search);

            // Filtros numéricos de precio
            if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
            if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

            // Filtros de ubicación
            if (filters?.city) params.append('city', filters.city);
            if (filters?.state) params.append('state', filters.state);
            if (filters?.latitude) params.append('latitude', filters.latitude.toString());
            if (filters?.longitude) params.append('longitude', filters.longitude.toString());
            if (filters?.radius) params.append('radius', filters.radius.toString());

            // Amenidades (array)
            if (filters?.amenities && filters.amenities.length > 0) {
                filters.amenities.forEach(amenity => {
                    params.append('amenities[]', amenity);
                });
            }

            // Filtros de specifications (ahora directos, no en objeto anidado)
            // Dormitorios
            if (filters?.dormitorios_min !== undefined) params.append('dormitorios_min', filters.dormitorios_min.toString());
            if (filters?.dormitorios_max !== undefined) params.append('dormitorios_max', filters.dormitorios_max.toString());
            if (filters?.dormitorios !== undefined) params.append('dormitorios', filters.dormitorios.toString());

            // Baños
            if (filters?.baños_min !== undefined) params.append('baños_min', filters.baños_min.toString());
            if (filters?.baños_max !== undefined) params.append('baños_max', filters.baños_max.toString());
            if (filters?.baños !== undefined) params.append('baños', filters.baños.toString());

            // Área
            if (filters?.area_min !== undefined) params.append('area_min', filters.area_min.toString());
            if (filters?.area_max !== undefined) params.append('area_max', filters.area_max.toString());

            // Área construida
            if (filters?.areaBuilt_min !== undefined) params.append('areaBuilt_min', filters.areaBuilt_min.toString());
            if (filters?.areaBuilt_max !== undefined) params.append('areaBuilt_max', filters.areaBuilt_max.toString());

            // Garage/Estacionamiento
            if (filters?.garage_min !== undefined) params.append('garage_min', filters.garage_min.toString());
            if (filters?.estacionamiento_min !== undefined) params.append('estacionamiento_min', filters.estacionamiento_min.toString());

            // Expensas
            if (filters?.expensas_min !== undefined) params.append('expensas_min', filters.expensas_min.toString());
            if (filters?.expensas_max !== undefined) params.append('expensas_max', filters.expensas_max.toString());

            // Piso
            if (filters?.piso_min !== undefined) params.append('piso_min', filters.piso_min.toString());
            if (filters?.piso_max !== undefined) params.append('piso_max', filters.piso_max.toString());

            // Campos booleanos
            if (filters?.jardin !== undefined) params.append('jardin', filters.jardin.toString());
            if (filters?.patio !== undefined) params.append('patio', filters.patio.toString());
            if (filters?.balcon !== undefined) params.append('balcon', filters.balcon.toString());
            if (filters?.esquina !== undefined) params.append('esquina', filters.esquina.toString());

            // Topografía
            if (filters?.topografia) params.append('topografia', filters.topografia);

            // Legacy fields (para compatibilidad)
            if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
            if (filters?.bathrooms) params.append('bathrooms', filters.bathrooms.toString());

            // Ordenamiento
            if (filters?.sortBy) params.append('sortBy', filters.sortBy);
            if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

            const url = `${API_BASE_URL}/properties${params.toString() ? '?' + params.toString() : ''}`;
            console.log('[apiService] getProperties URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            console.log('[apiService] getProperties Response Status:', response.status);
            const result = this.handleResponse(response);
            console.log('[apiService] getProperties Result:', JSON.stringify(result, null, 2));
            return result;
        } catch (error: any) {
            console.error('Error obteniendo propiedades:', error);
            throw error;
        }
    }

    /**
     * Obtener una propiedad por ID
     */
    async getPropertyById(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error obteniendo propiedad:', error);
            throw error;
        }
    }

    /**
     * Obtener propiedades del usuario autenticado
     */
    async getMyProperties(filters?: { page?: number; limit?: number }) {
        try {
            const params = new URLSearchParams();
            if (filters?.page) params.append('page', filters.page.toString());
            if (filters?.limit) params.append('limit', filters.limit.toString());

            const url = `${API_BASE_URL}/properties/my-properties${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error obteniendo mis propiedades:', error);
            throw error;
        }
    }

    /**
     * Buscar propiedades por ubicación
     */
    async searchPropertiesByLocation(latitude: number, longitude: number, radiusKm: number = 50) {
        try {
            const params = new URLSearchParams();
            params.append('latitude', latitude.toString());
            params.append('longitude', longitude.toString());
            params.append('radius', radiusKm.toString());

            const response = await fetch(`${API_BASE_URL}/properties/search/location?${params.toString()}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error buscando propiedades por ubicación:', error);
            throw error;
        }
    }

    /**
     * Crear una propiedad con imágenes
     */
    async createPropertyWithImages(formData: FormData) {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/with-images`, {
                method: 'POST',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : '',
                    // No establecer Content-Type, FormData lo hace automáticamente
                },
                body: formData,
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error creando propiedad con imágenes:', error);
            throw error;
        }
    }

    /**
     * Actualizar una propiedad
     */
    async updateProperty(id: string, updateData: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(updateData),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error actualizando propiedad:', error);
            throw error;
        }
    }

    /**
     * Eliminar una propiedad
     */
    async deleteProperty(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error eliminando propiedad:', error);
            throw error;
        }
    }

    /**
     * Verificar si un archivo existe en el backend
     * @param filePath - Ruta relativa del archivo (ej: /uploads/properties/uuid.jpg)
     */
    async checkFileExists(filePath: string) {
        try {
            const fullUrl = `${SERVER_BASE_URL}${filePath}`;
            console.log('🔍 Checking if file exists:', fullUrl);

            const response = await fetch(fullUrl, { method: 'HEAD' });

            console.log('📊 File check response:', {
                filePath,
                status: response.status,
                statusText: response.statusText,
                exists: response.ok,
            });

            return response.ok;
        } catch (error: any) {
            console.error('❌ Error checking file:', filePath, error);
            return false;
        }
    }

    async debugProperties() {
        try {
            const response = await fetch(`${API_BASE_URL}/properties`, {
                headers: this.getHeaders(),
            });
            const data = await response.json();

            console.log('🔧 DEBUG: Propiedades en BD:');
            console.log(JSON.stringify(data, null, 2));

            // Mostrar info de imágenes
            if (data?.data) {
                data.data.forEach((prop: any, idx: number) => {
                    console.log(`Property ${idx + 1}:`, {
                        id: prop.id,
                        title: prop.title,
                        images: prop.images?.map((img: any) => ({
                            id: img.id,
                            url: img.url,
                            fullUrl: `${SERVER_BASE_URL}${img.url}`,
                        })),
                    });
                });
            }

            return data;
        } catch (error) {
            console.error('❌ Error fetching debug properties:', error);
            return null;
        }
    }

    // ==========================================
    // USUARIOS - Perfil Público
    // ==========================================

    async getUserPublicProfile(userId: string) {
        try {
            console.log('👤 [getUserPublicProfile] Obteniendo perfil del usuario:', userId);
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Perfil del usuario obtenido:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error obteniendo perfil:', error);
            throw error;
        }
    }

    async getUserPublicProperties(userId: string, page: number = 1, limit: number = 10) {
        try {
            console.log('🏠 [getUserPublicProperties] Obteniendo propiedades del usuario:', userId);
            const response = await fetch(`${API_BASE_URL}/users/${userId}/properties?page=${page}&limit=${limit}`, {
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Propiedades del usuario obtenidas:', {
                count: data.properties?.length,
                total: data.pagination?.total,
            });
            return data;
        } catch (error: any) {
            console.error('❌ Error obteniendo propiedades del usuario:', error);
            throw error;
        }
    }

    // ============================================
    // FAVORITOS
    // ============================================

    /**
     * Agregar una propiedad a favoritos
     * POST /api/favorites/:propertyId
     */
    async addFavorite(propertyId: string) {
        try {
            console.log('❤️ [addFavorite] Agregando a favoritos:', propertyId);
            const response = await fetch(`${API_BASE_URL}/favorites/${propertyId}`, {
                method: 'POST',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Propiedad agregada a favoritos');
            return data;
        } catch (error: any) {
            console.error('❌ Error agregando a favoritos:', error);
            throw error;
        }
    }

    /**
     * Remover una propiedad de favoritos
     * DELETE /api/favorites/:propertyId
     */
    async removeFavorite(propertyId: string) {
        try {
            console.log('💔 [removeFavorite] Removiendo de favoritos:', propertyId);
            const response = await fetch(`${API_BASE_URL}/favorites/${propertyId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Propiedad removida de favoritos');
            return data;
        } catch (error: any) {
            console.error('❌ Error removiendo de favoritos:', error);
            throw error;
        }
    }

    /**
     * Obtener todas las propiedades favoritas del usuario
     * GET /api/favorites
     */
    async getFavorites() {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites`, {
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            return data;
        } catch (error: any) {
            console.error('❌ Error obteniendo favoritos:', error);
            throw error;
        }
    }

    /**
     * Verificar si una propiedad está en favoritos
     * GET /api/favorites/check/:propertyId
     */
    async isFavorite(propertyId: string) {
        try {
            console.log('🔍 [isFavorite] Verificando favorito:', propertyId);
            const response = await fetch(`${API_BASE_URL}/favorites/check/${propertyId}`, {
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Verificación completada:', data.isFavorite);
            return data;
        } catch (error: any) {
            console.error('❌ Error verificando favorito:', error);
            throw error;
        }
    }

    async publishProperty(propertyId: string) {
        try {
            console.log('📤 [publishProperty] Publishing property:', propertyId);
            const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/publish`, {
                method: 'PATCH',
                headers: this.getHeaders(),
            });
            const data = await this.handleResponse(response);
            console.log('✅ Propiedad publicada:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error publicando propiedad:', error);
            throw error;
        }
    }

    async archiveProperty(propertyId: string) {
        try {
            console.log('📦 [archiveProperty] Archiving property:', propertyId);
            const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/archive`, {
                method: 'PATCH',
                headers: this.getHeaders(),
            });
            const data = await this.handleResponse(response);
            console.log('✅ Propiedad archivada:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error archivando propiedad:', error);
            throw error;
        }
    }

    // ==========================================
    // EDICIÓN DE PROPIEDADES
    // ==========================================

    /**
     * Actualizar propiedad con nuevos archivos multimedia
     * PATCH /api/properties/:id/with-media
     */
    async updatePropertyWithMedia(propertyId: string, formData: FormData) {
        try {
            console.log('📝 [updatePropertyWithMedia] Actualizando propiedad:', propertyId);
            const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/with-media`, {
                method: 'PATCH',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : '',
                    // No establecer Content-Type, FormData lo hace automáticamente
                },
                body: formData,
            });

            const data = await this.handleResponse(response);
            console.log('✅ Propiedad actualizada con media:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error actualizando propiedad con media:', error);
            throw error;
        }
    }

    /**
     * Eliminar un archivo multimedia específico
     * DELETE /api/properties/:propertyId/media/:mediaId
     */
    async deletePropertyMedia(propertyId: string, mediaId: string) {
        try {
            console.log('🗑️ [deletePropertyMedia] Eliminando archivo:', { propertyId, mediaId });
            const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/media/${mediaId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Archivo eliminado:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error eliminando archivo:', error);
            throw error;
        }
    }

    /**
     * Reordenar archivos multimedia de una propiedad
     * PATCH /api/properties/:id/media/reorder
     */
    async reorderPropertyMedia(propertyId: string, mediaIds: string[]) {
        try {
            console.log('🔄 [reorderPropertyMedia] Reordenando archivos:', { propertyId, mediaIds });
            const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/media/reorder`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({ mediaIds }),
            });

            const data = await this.handleResponse(response);
            console.log('✅ Archivos reordenados:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error reordenando archivos:', error);
            throw error;
        }
    }

    // ==========================================
    // USUARIOS
    // ==========================================

    /**
     * Buscar usuarios por nombre, email o ciudad
     * GET /api/users?search=...&page=1&limit=10
     */
    async searchUsers(filters?: {
        search?: string;
        city?: string;
        page?: number;
        limit?: number;
    }) {
        try {
            const params = new URLSearchParams();

            if (filters?.search) params.append('search', filters.search);
            if (filters?.city) params.append('city', filters.city);
            if (filters?.page) params.append('page', filters.page.toString());
            if (filters?.limit) params.append('limit', filters.limit.toString());

            const url = `${API_BASE_URL}/users${params.toString() ? '?' + params.toString() : ''}`;
            console.log('[apiService] searchUsers URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error buscando usuarios:', error);
            throw error;
        }
    }

    /**
     * Obtener perfil público de un usuario
     * GET /api/users/:id
     */
    async getUserProfile(userId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error obteniendo perfil de usuario:', error);
            throw error;
        }
    }

    /**
     * Obtener propiedades de un usuario
     * GET /api/users/:id/properties?page=1&limit=10
     */
    async getUserProperties(userId: string, page = 1, limit = 10) {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            const url = `${API_BASE_URL}/users/${userId}/properties?${params.toString()}`;
            console.log('[apiService] getUserProperties URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error: any) {
            console.error('Error obteniendo propiedades del usuario:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService();
