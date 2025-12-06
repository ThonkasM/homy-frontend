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

        console.log('🔍 [handleResponse] Status:', response.status);
        console.log('🔍 [handleResponse] OK?', response.ok);
        console.log('🔍 [handleResponse] Data COMPLETA (raw):', JSON.stringify(data, null, 2));

        // Extraer datos si está envuelto en { success, data, timestamp }
        if (data?.success === true && data?.data !== undefined) {
            console.log('✅ Respuesta envuelta detectada, extrayendo data...');
            data = data.data;
            console.log('✅ Data extraída:', JSON.stringify(data, null, 2));
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
            console.log('=== INICIANDO LOGIN ===');
            console.log('URL:', `${API_BASE_URL}/auth/login`);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            });

            console.log('Fetch completado, recibiendo respuesta...');
            const data = await this.handleResponse(response);

            console.log('Datos finales recibidos en login():', JSON.stringify(data, null, 2));
            console.log('accessToken existe?', !!data.accessToken);
            console.log('user existe?', !!data.user);

            return data;
        } catch (error: any) {
            console.error('❌ Login Error capturado:', error);
            const errorMessage = error?.message || 'Error de conexión. Verifica que el servidor esté corriendo en http://localhost:3000';
            console.error('Mensaje final:', errorMessage);
            throw {
                message: errorMessage,
                statusCode: error?.statusCode || 0,
            };
        }
    }

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        try {
            console.log('=== INICIANDO REGISTRO ===');
            console.log('URL:', `${API_BASE_URL}/auth/register`);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            });

            console.log('Fetch completado, recibiendo respuesta...');
            const data = await this.handleResponse(response);

            console.log('Datos finales recibidos en register():', JSON.stringify(data, null, 2));
            console.log('accessToken existe?', !!data.accessToken);
            console.log('user existe?', !!data.user);

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
     * Obtener todas las propiedades con paginación y filtros
     */
    async getProperties(filters?: {
        page?: number;
        limit?: number;
        propertyType?: string;
        operationType?: string;
        minPrice?: number;
        maxPrice?: number;
    }) {
        try {
            const params = new URLSearchParams();
            if (filters?.page) params.append('page', filters.page.toString());
            if (filters?.limit) params.append('limit', filters.limit.toString());
            if (filters?.propertyType) params.append('propertyType', filters.propertyType);
            if (filters?.operationType) params.append('operationType', filters.operationType);
            if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
            if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

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
    async getUserProperties(filters?: { page?: number; limit?: number }) {
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
}

export const apiService = new ApiService();
