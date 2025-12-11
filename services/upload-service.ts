import { SERVER_BASE_URL } from './api';

export interface UploadAvatarResponse {
    message: string;
    avatarUrl: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        phone?: string;
    };
}

/**
 * Servicio para subir avatares al backend
 */
export const uploadService = {
    /**
     * Subir o actualizar avatar del usuario
     * @param imageUri - URI local de la imagen (ej: file://...)
     * @param token - Token JWT del usuario
     * @returns Response con usuario actualizado
     */
    async uploadAvatar(imageUri: string, token: string): Promise<UploadAvatarResponse> {
        if (!imageUri) {
            throw new Error('URI de imagen inválida');
        }

        if (!token) {
            throw new Error('Token de autenticación requerido');
        }

        try {
            console.log('\n📤 === INICIANDO UPLOAD DE AVATAR ===');
            console.log('🖼️ Imagen URI:', imageUri);
            console.log('🔑 Token disponible:', !!token);
            console.log('📍 URL Base:', SERVER_BASE_URL);

            // PASO 1: Preparar el archivo en formato React Native/Expo
            console.log('\n📥 PASO 1: Preparando archivo...');
            const filename = imageUri.split('/').pop() || 'avatar.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const fileType = match ? `image/${match[1]}` : 'image/jpeg';

            console.log('✅ Archivo preparado:', {
                filename,
                type: fileType,
                uri: imageUri,
            });

            // PASO 2: Crear FormData con la imagen
            console.log('\n📦 PASO 2: Preparando FormData...');
            const formData = new FormData();

            // Usar el formato que funciona en React Native/Expo (uri, name, type)
            // @ts-ignore
            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: fileType,
            });
            console.log('✅ FormData preparado con archivo:', filename);

            // PASO 3: Enviar al backend
            console.log('\n🚀 PASO 3: Enviando a backend...');
            const uploadUrl = `${SERVER_BASE_URL}/api/upload/avatar`;
            console.log('📍 URL:', uploadUrl);
            console.log('🔐 Auth: Bearer [token]');

            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            console.log('✅ Respuesta recibida:', uploadResponse.status);

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('❌ Error HTTP:', {
                    status: uploadResponse.status,
                    statusText: uploadResponse.statusText,
                    body: errorText,
                });
                throw new Error(`Error al subir avatar: ${uploadResponse.status} ${errorText}`);
            }

            // PASO 4: Procesar respuesta
            console.log('\n✅ PASO 4: Procesando respuesta...');
            const data = await uploadResponse.json();
            console.log('📥 Respuesta completa:', JSON.stringify(data, null, 2));

            // Validar estructura de respuesta
            if (!data) {
                throw new Error('La respuesta del servidor está vacía');
            }

            if (!data.user) {
                console.error('❌ Error: data.user es undefined');
                console.error('📥 Estructura de data:', Object.keys(data));
                throw new Error('El servidor no retornó el usuario: ' + JSON.stringify(data));
            }

            if (!data.user.email) {
                console.error('❌ Error: data.user.email es undefined');
                console.error('📥 Estructura de user:', Object.keys(data.user));
                throw new Error('El usuario no tiene email: ' + JSON.stringify(data.user));
            }

            console.log('✅ Respuesta parseada:', {
                message: data.message,
                avatarUrl: data.avatarUrl,
                user: data.user.email,
            });

            console.log('✅ === UPLOAD COMPLETADO EXITOSAMENTE ===\n');
            return data;
        } catch (error: any) {
            console.error('\n❌ ERROR EN UPLOAD:', {
                message: error.message,
                name: error.name,
            });
            throw error;
        }
    },
};
