import { CURRENCIES } from '@/config/currencies.config';
import { validateSpecifications } from '@/config/property-types.config';
import { useAuth } from '@/context/auth-context';
import { usePropertyTypeConfig } from '@/hooks/use-property-type-config';
import { apiService, SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Interface para items de media (imágenes y videos)
interface MediaItem {
    uri: string;
    type: 'image' | 'video';
    duration?: number;
    id?: string; // ID del archivo en el backend (si ya existe)
    isExisting?: boolean; // Flag para diferenciar archivos existentes de nuevos
    markedForDeletion?: boolean; // Flag para marcar archivos a eliminar (NO SE ELIMINAN HASTA GUARDAR)
}

const createStyles = (width: number) => {
    const isWeb = width > 768;
    const imageContainerWidth = isWeb ? '18%' : '23%';

    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        container: {
            flex: 1,
            width: '100%',
        },
        headerContainer: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 20,
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            width: '100%',
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '800',
            color: '#5585b5',
            marginBottom: 8,
            letterSpacing: -0.5,
        },
        headerSubtitle: {
            fontSize: 14,
            color: '#64748b',
            fontWeight: '500',
        },
        scrollContainer: {
            flex: 1,
            backgroundColor: '#f9fafb',
        },
        form: {
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: 24,
        },
        section: {
            backgroundColor: '#ffffff',
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#5585b5',
            marginBottom: 16,
        },
        fieldLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: '#5585b5',
            marginBottom: 8,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
        },
        input: {
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 14,
            color: '#0f172a',
            backgroundColor: '#f8fafc',
            marginBottom: 12,
        },
        inputReadOnly: {
            backgroundColor: '#e2e8f0',
            color: '#64748b',
            opacity: 0.7,
        },
        textArea: {
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 14,
            color: '#0f172a',
            backgroundColor: '#f8fafc',
            minHeight: 100,
            textAlignVertical: 'top',
            marginBottom: 12,
        },
        row: {
            flexDirection: 'row',
            gap: 12,
        },
        halfInput: {
            flex: 1,
        },
        pickerContainer: {
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
            marginBottom: 12,
        },
        checkboxContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 12,
        },
        checkboxItem: {
            backgroundColor: '#f0f4ff',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        checkboxItemActive: {
            backgroundColor: '#5585b5',
            borderColor: '#5585b5',
        },
        checkboxText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#5585b5',
        },
        checkboxTextActive: {
            color: '#ffffff',
        },
        mapButton: {
            backgroundColor: '#f0f4ff',
            borderWidth: 1.5,
            borderColor: '#5585b5',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            marginBottom: 12,
        },
        mapButtonText: {
            color: '#5585b5',
            fontSize: 14,
            fontWeight: '600',
        },
        mapContainer: {
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 16,
            backgroundColor: '#f8fafc',
        },
        imagesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 12,
        },
        imageContainer: {
            width: imageContainerWidth,
            aspectRatio: 1,
            borderRadius: 10,
            overflow: 'hidden',
            position: 'relative',
        },
        imageContainerDeleted: {
            opacity: 0.4,
        },
        selectedImage: {
            width: '100%',
            height: '100%',
        },
        mediaOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        deletionOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        deletionText: {
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '700',
            textAlign: 'center',
        },
        playButtonSmall: {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'rgba(255,255,255,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        playButtonText: {
            fontSize: 12,
            color: '#5585b5',
        },
        removeImageButton: {
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(239, 68, 68, 0.95)',
            width: 24,
            height: 24,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        removeImageText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '700',
        },
        existingBadge: {
            position: 'absolute',
            bottom: 4,
            left: 4,
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        existingBadgeText: {
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '600',
        },
        imageCounter: {
            fontSize: 12,
            color: '#64748b',
            marginBottom: 12,
        },
        uploadButton: {
            borderWidth: 2,
            borderColor: '#5585b5',
            borderRadius: 10,
            borderStyle: 'dashed',
            paddingVertical: 14,
            alignItems: 'center',
        },
        uploadText: {
            color: '#5585b5',
            fontWeight: '600',
            fontSize: 14,
        },
        // Modal para seleccionar fotos
        imageOptionsModal: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        imageOptionsContainer: {
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingBottom: 32,
            paddingHorizontal: 20,
        },
        imageOptionsHeader: {
            marginBottom: 20,
        },
        imageOptionsTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: 4,
        },
        imageOptionsSubtitle: {
            fontSize: 14,
            color: '#64748b',
        },
        imageOptionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
        imageOptionIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#5585b5',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        imageOptionText: {
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            color: '#0f172a',
        },
        imageOptionCancel: {
            backgroundColor: '#f1f5f9',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
        },
        imageOptionCancelText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#64748b',
        },
        // Modal de moneda
        currencyModal: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        currencyModalContent: {
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '70%',
            paddingTop: 20,
            paddingBottom: 32,
        },
        currencyModalHeader: {
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
        },
        currencyModalTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: '#0f172a',
        },
        currencyOption: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
        },
        currencyOptionActive: {
            backgroundColor: '#eff6ff',
        },
        currencyOptionText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#0f172a',
        },
        currencyOptionCheck: {
            fontSize: 20,
            color: '#5585b5',
            fontWeight: '700',
        },
        currencyModalClose: {
            backgroundColor: '#f1f5f9',
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
        },
        currencyModalCloseText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#64748b',
        },
        buttonsContainer: {
            gap: 12,
            marginBottom: 30,
        },
        submitButton: {
            backgroundColor: '#5585b5',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            shadowColor: '#5585b5',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
        },
        submitButtonDisabled: {
            backgroundColor: '#94a3b8',
        },
        submitButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        deleteButton: {
            backgroundColor: '#ef4444',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        deleteButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
    });
};

export default function EditPropertyScreen() {
    const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
    const router = useRouter();
    const { user, token } = useAuth();
    const { width } = useWindowDimensions();
    const styles = createStyles(width);

    // Estado
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
    const [showMap, setShowMap] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'BOB',
        propertyType: 'house',
        address: '',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
        contactPhone: '',
        specifications: {} as Record<string, string>,
        amenities: [] as string[],
    });

    const { config: propertyConfig } = usePropertyTypeConfig(formData.propertyType);
    const scrollViewRef = useRef<ScrollView>(null);

    // MapViewComponent para seleccionar ubicación
    const MapViewComponent = require('@/components/posts/map-view-property').default;

    // Cargar datos de la propiedad
    useEffect(() => {
        loadPropertyData();
    }, [propertyId]);

    const loadPropertyData = async () => {
        try {
            setIsLoading(true);
            const property = await apiService.getPropertyById(propertyId);

            // Pre-cargar datos del formulario
            setFormData({
                title: property.title || '',
                description: property.description || '',
                price: property.price?.toString() || '',
                currency: property.currency || 'BOB',
                propertyType: property.propertyType || 'house',
                address: property.address || '',
                city: property.city || '',
                country: property.country || '',
                latitude: property.latitude?.toString() || '',
                longitude: property.longitude?.toString() || '',
                contactPhone: property.contactPhone || '',
                specifications: property.specifications || {},
                amenities: property.amenities || [],
            });

            // Pre-cargar archivos existentes (imágenes primero, luego videos)
            const existingMedia: MediaItem[] = [];

            if (property.images && property.images.length > 0) {
                property.images.forEach((img: any) => {
                    existingMedia.push({
                        uri: `${SERVER_BASE_URL}${img.url}`,
                        type: 'image',
                        id: img.id,
                        isExisting: true,
                        markedForDeletion: false,
                    });
                });
            }

            if (property.videos && property.videos.length > 0) {
                property.videos.forEach((vid: any) => {
                    existingMedia.push({
                        uri: `${SERVER_BASE_URL}${vid.url}`,
                        type: 'video',
                        id: vid.id,
                        isExisting: true,
                        markedForDeletion: false,
                    });
                });
            }

            setSelectedMedia(existingMedia);
        } catch (error: any) {
            console.error('Error cargando propiedad:', error);
            Alert.alert('Error', 'No se pudo cargar la propiedad');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    // Función para actualizar specifications dinámicamente
    const updateSpecification = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [key]: value,
            },
        }));
    };

    // Función para toggle amenities
    const toggleAmenity = (amenityId: string) => {
        setFormData((prev) => {
            const currentAmenities = prev.amenities || [];
            const newAmenities = currentAmenities.includes(amenityId)
                ? currentAmenities.filter((id) => id !== amenityId)
                : [...currentAmenities, amenityId];

            return {
                ...prev,
                amenities: newAmenities,
            };
        });
    };

    // Función para mostrar opciones de agregar archivos
    const showImageOptions = () => {
        const activeMedia = selectedMedia.filter(m => !m.markedForDeletion);
        if (activeMedia.length >= 10) {
            Alert.alert('Límite alcanzado', 'Solo puedes tener hasta 10 archivos');
            return;
        }
        setShowImageModal(true);
    };

    const takePhotoWithCamera = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets) {
                const newMedia: MediaItem = {
                    uri: result.assets[0].uri,
                    type: 'image',
                    isExisting: false,
                    markedForDeletion: false,
                };

                setSelectedMedia((prev) => {
                    const allMedia = [...prev, newMedia];
                    const images = allMedia.filter(m => m.type === 'image' && !m.markedForDeletion);
                    const videos = allMedia.filter(m => m.type === 'video' && !m.markedForDeletion);
                    const deleted = allMedia.filter(m => m.markedForDeletion);
                    return [...images, ...videos, ...deleted];
                });
            }
        } catch (error) {
            console.error('Error tomando foto:', error);
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    };

    const pickImageFromGallery = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets) {
                const activeMedia = selectedMedia.filter(m => !m.markedForDeletion);
                const totalFiles = activeMedia.length + result.assets.length;

                if (totalFiles > 10) {
                    Alert.alert('Límite excedido', `Solo puedes agregar ${10 - activeMedia.length} archivo(s) más`);
                    return;
                }

                const videoCount = activeMedia.filter(m => m.type === 'video').length;
                const newVideos = result.assets.filter(a => a.type === 'video').length;

                if (videoCount + newVideos > 3) {
                    Alert.alert('Límite de videos', 'Solo puedes tener hasta 3 videos');
                    return;
                }

                const newMedia: MediaItem[] = result.assets.map((asset) => ({
                    uri: asset.uri,
                    type: asset.type === 'video' ? 'video' : 'image',
                    duration: asset.duration ?? undefined,
                    isExisting: false,
                    markedForDeletion: false,
                }));

                setSelectedMedia((prev) => {
                    const allMedia = [...prev, ...newMedia];
                    const images = allMedia.filter(m => m.type === 'image' && !m.markedForDeletion);
                    const videos = allMedia.filter(m => m.type === 'video' && !m.markedForDeletion);
                    const deleted = allMedia.filter(m => m.markedForDeletion);
                    return [...images, ...videos, ...deleted];
                });
            }
        } catch (error) {
            console.error('Error picking media:', error);
            Alert.alert('Error', 'No se pudo seleccionar el archivo');
        }
    };

    const removeMedia = (index: number) => {
        const media = selectedMedia[index];

        if (media.isExisting && media.id) {
            // Si es un archivo existente, marcarlo para eliminación (NO eliminar inmediatamente)
            setSelectedMedia((prev) =>
                prev.map((item, i) =>
                    i === index
                        ? { ...item, markedForDeletion: !item.markedForDeletion }
                        : item
                )
            );
        } else {
            // Si es un archivo nuevo, eliminarlo directamente del estado
            setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleUpdateProperty = async () => {
        try {
            // Validaciones
            if (!formData.title.trim()) {
                Alert.alert('Error', 'El título es obligatorio');
                return;
            }

            if (!formData.price || parseFloat(formData.price) <= 0) {
                Alert.alert('Error', 'El precio debe ser mayor a 0');
                return;
            }

            // Validar specifications según el propertyType
            const specsValidation = validateSpecifications(formData.propertyType, formData.specifications);
            if (!specsValidation.valid) {
                Alert.alert('Error', specsValidation.errors.join('\n'));
                return;
            }

            setIsSubmitting(true);

            // 1. Primero eliminar archivos marcados para eliminación
            const filesToDelete = selectedMedia.filter(m => m.markedForDeletion && m.id);
            for (const media of filesToDelete) {
                try {
                    await apiService.deletePropertyMedia(propertyId, media.id!);
                    console.log('✅ Archivo eliminado:', media.id);
                } catch (error) {
                    console.error('❌ Error eliminando archivo:', media.id, error);
                }
            }

            // 2. Preparar FormData para actualización
            const formDataToSend = new FormData();

            // Datos básicos (solo los que acepta UpdatePropertyDto)
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('price', parseFloat(formData.price).toString());
            formDataToSend.append('currency', formData.currency);
            formDataToSend.append('propertyType', formData.propertyType);

            // Contacto
            if (formData.contactPhone) formDataToSend.append('contactPhone', formData.contactPhone.trim());

            // Specifications y Amenities (como JSON strings)
            // NOTA: Los campos de ubicación (address, city, latitude, longitude) 
            // NO están en UpdatePropertyDto, así que no se envían como campos separados
            formDataToSend.append('specifications', JSON.stringify(formData.specifications));
            formDataToSend.append('amenities', JSON.stringify(formData.amenities));

            // 3. Agregar solo archivos NUEVOS
            const newMedia = selectedMedia.filter(m => !m.isExisting && !m.markedForDeletion);
            newMedia.forEach((media, index) => {
                const fileExtension = media.uri.split('.').pop() || (media.type === 'video' ? 'mp4' : 'jpg');
                const fileName = `${media.type}_${Date.now()}_${index}.${fileExtension}`;
                const mimeType = media.type === 'video'
                    ? `video/${fileExtension}`
                    : `image/${fileExtension}`;

                formDataToSend.append('files', {
                    uri: media.uri,
                    name: fileName,
                    type: mimeType,
                } as any);
            });

            // 4. Actualizar en el backend
            const response = await apiService.updatePropertyWithMedia(propertyId, formDataToSend);

            Alert.alert(
                'Éxito',
                'Propiedad actualizada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Error actualizando propiedad:', error);
            Alert.alert('Error', error.message || 'No se pudo actualizar la propiedad');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProperty = () => {
        Alert.alert(
            'Eliminar Propiedad',
            '¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsSubmitting(true);
                            await apiService.deleteProperty(propertyId);
                            Alert.alert(
                                'Éxito',
                                'Propiedad eliminada correctamente',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => router.replace('/(tabs)/profile'),
                                    },
                                ]
                            );
                        } catch (error: any) {
                            console.error('Error eliminando propiedad:', error);
                            Alert.alert('Error', error.message || 'No se pudo eliminar la propiedad');
                        } finally {
                            setIsSubmitting(false);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#5585b5" />
                    <Text style={{ marginTop: 12, color: '#64748b' }}>Cargando propiedad...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Calcular archivos activos (no marcados para eliminación)
    const activeMedia = selectedMedia.filter(m => !m.markedForDeletion);

    return (
        <SafeAreaView style={styles.safeContainer} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Modal para seleccionar fotos o videos */}
            <Modal
                visible={showImageModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowImageModal(false)}
            >
                <View style={styles.imageOptionsModal}>
                    <View style={styles.imageOptionsContainer}>
                        <View style={styles.imageOptionsHeader}>
                            <Text style={styles.imageOptionsTitle}>Agregar Contenido</Text>
                            <Text style={styles.imageOptionsSubtitle}>Fotos o videos de tu propiedad</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.imageOptionButton}
                            onPress={() => {
                                setShowImageModal(false);
                                takePhotoWithCamera();
                            }}
                        >
                            <View style={styles.imageOptionIcon}>
                                <MaterialCommunityIcons name="camera" size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.imageOptionText}>Tomar Foto</Text>
                            <MaterialCommunityIcons name="chevron-right" size={20} color="#5585b5" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.imageOptionButton}
                            onPress={() => {
                                setShowImageModal(false);
                                pickImageFromGallery();
                            }}
                        >
                            <View style={styles.imageOptionIcon}>
                                <MaterialCommunityIcons name="image-multiple" size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.imageOptionText}>Fotos o Videos</Text>
                            <MaterialCommunityIcons name="chevron-right" size={20} color="#5585b5" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.imageOptionCancel}
                            onPress={() => setShowImageModal(false)}
                        >
                            <Text style={styles.imageOptionCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Selección de Moneda */}
            <Modal visible={showCurrencyModal} transparent animationType="slide">
                <View style={styles.currencyModal}>
                    <View style={styles.currencyModalContent}>
                        <View style={styles.currencyModalHeader}>
                            <Text style={styles.currencyModalTitle}>Seleccionar Moneda</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {CURRENCIES.filter((c: any) => c.value === 'BOB' || c.value === 'USD').map((curr: any) => (
                                <TouchableOpacity
                                    key={curr.value}
                                    style={[styles.currencyOption, formData.currency === curr.value && styles.currencyOptionActive]}
                                    onPress={() => {
                                        setFormData({ ...formData, currency: curr.value });
                                        setShowCurrencyModal(false);
                                    }}
                                >
                                    <View>
                                        <Text style={styles.currencyOptionText}>{curr.symbol} {curr.value}</Text>
                                        <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{curr.label}</Text>
                                    </View>
                                    {formData.currency === curr.value && (
                                        <Text style={styles.currencyOptionCheck}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.currencyModalClose}
                            onPress={() => setShowCurrencyModal(false)}
                        >
                            <Text style={styles.currencyModalCloseText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Editar Propiedad</Text>
                    <Text style={styles.headerSubtitle}>Actualiza la información de tu publicación</Text>
                </View>

                {/* Formulario */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollContainer}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.form}>
                            {/* Información Básica */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Información Básica</Text>

                                <Text style={styles.fieldLabel}>Título de la Propiedad *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Casa amplia en zona central"
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                                />
                            </View>

                            {/* Moneda y Precio */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Precio</Text>

                                <View style={styles.row}>
                                    <View style={styles.halfInput}>
                                        <Text style={styles.fieldLabel}>Moneda</Text>
                                        <TouchableOpacity
                                            style={styles.pickerContainer}
                                            onPress={() => setShowCurrencyModal(true)}
                                        >
                                            <View style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                                                <Text style={{ fontSize: 14, color: '#0f172a' }}>
                                                    {CURRENCIES.find(c => c.value === formData.currency)?.symbol} {formData.currency}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.halfInput}>
                                        <Text style={styles.fieldLabel}>Precio *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0.00"
                                            keyboardType="decimal-pad"
                                            value={formData.price}
                                            onChangeText={(text) => setFormData({ ...formData, price: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Tipo de Propiedad */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Tipo de Propiedad</Text>
                                <Text style={styles.fieldLabel}>Tipo Actual</Text>
                                <View style={styles.pickerContainer}>
                                    <View style={[styles.input, styles.inputReadOnly]}>
                                        <Text style={{ fontSize: 14, color: '#64748b' }}>
                                            {propertyConfig?.label || formData.propertyType}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: -8 }}>
                                    El tipo de propiedad no se puede cambiar
                                </Text>
                            </View>

                            {/* Características */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Características de {propertyConfig?.label || 'Propiedad'}</Text>

                                {propertyConfig && propertyConfig.fields && propertyConfig.fields.length > 0 ? (
                                    propertyConfig.fields.map((field: any) => (
                                        <View key={field.key} style={{ marginBottom: 16 }}>
                                            <Text style={styles.fieldLabel}>
                                                {field.label}
                                                {field.required ? ' *' : ''}
                                            </Text>

                                            {field.type === 'number' && (
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={field.placeholder || `Ej: ${field.min || 0}`}
                                                    keyboardType="numeric"
                                                    value={formData.specifications[field.key]?.toString() || ''}
                                                    onChangeText={(text) => updateSpecification(field.key, text ? parseInt(text) : null)}
                                                />
                                            )}

                                            {field.type === 'decimal' && (
                                                <View style={styles.row}>
                                                    <TextInput
                                                        style={[styles.halfInput, styles.input]}
                                                        placeholder={field.placeholder || 'Ej: 120.5'}
                                                        keyboardType="decimal-pad"
                                                        value={formData.specifications[field.key]?.toString() || ''}
                                                        onChangeText={(text) => updateSpecification(field.key, text ? parseFloat(text) : null)}
                                                    />
                                                    {field.unit && (
                                                        <View style={[styles.halfInput, { justifyContent: 'center', paddingLeft: 8 }]}>
                                                            <Text style={styles.fieldLabel}>{field.unit}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            )}

                                            {field.type === 'boolean' && (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.checkboxItem,
                                                        formData.specifications[field.key] && styles.checkboxItemActive,
                                                    ]}
                                                    onPress={() => updateSpecification(field.key, !formData.specifications[field.key])}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.checkboxText,
                                                            formData.specifications[field.key] && styles.checkboxTextActive,
                                                        ]}
                                                    >
                                                        {formData.specifications[field.key] ? '✓' : '○'} {field.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}

                                            {field.type === 'select' && (
                                                <View style={styles.checkboxContainer}>
                                                    {field.options?.map((option: any) => (
                                                        <TouchableOpacity
                                                            key={option.value}
                                                            style={[
                                                                styles.checkboxItem,
                                                                formData.specifications[field.key] === option.value &&
                                                                styles.checkboxItemActive,
                                                            ]}
                                                            onPress={() => updateSpecification(field.key, option.value)}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.checkboxText,
                                                                    formData.specifications[field.key] === option.value &&
                                                                    styles.checkboxTextActive,
                                                                ]}
                                                            >
                                                                {option.label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ color: '#64748b' }}>Este tipo de propiedad no tiene características específicas</Text>
                                )}
                            </View>

                            {/* Descripción */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Descripción</Text>
                                <Text style={styles.fieldLabel}>Detalles de la Propiedad</Text>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Describe tu propiedad..."
                                    multiline
                                    numberOfLines={6}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                />
                            </View>

                            {/* Contacto */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Contacto</Text>

                                <Text style={styles.fieldLabel}>Teléfono de Contacto</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: +591 71234567"
                                    keyboardType="phone-pad"
                                    value={formData.contactPhone}
                                    onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
                                />
                            </View>

                            {/* Amenidades */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Amenidades para {propertyConfig?.label || 'Propiedad'}</Text>

                                {propertyConfig && propertyConfig.amenities && propertyConfig.amenities.length > 0 ? (
                                    <View style={styles.checkboxContainer}>
                                        {propertyConfig.amenities.map((amenity) => (
                                            <TouchableOpacity
                                                key={amenity.id}
                                                style={[
                                                    styles.checkboxItem,
                                                    formData.amenities.includes(amenity.id) && styles.checkboxItemActive,
                                                ]}
                                                onPress={() => toggleAmenity(amenity.id)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.checkboxText,
                                                        formData.amenities.includes(amenity.id) && styles.checkboxTextActive,
                                                    ]}
                                                >
                                                    {formData.amenities.includes(amenity.id) ? '✓' : '○'} {amenity.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={{ color: '#64748b' }}>Este tipo de propiedad no tiene amenidades disponibles</Text>
                                )}
                            </View>

                            {/* Fotos y Videos */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Fotos y Videos</Text>

                                {selectedMedia.length > 0 && (
                                    <View style={styles.imagesGrid}>
                                        {selectedMedia.map((media, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.imageContainer,
                                                    media.markedForDeletion && styles.imageContainerDeleted
                                                ]}
                                            >
                                                <Image source={{ uri: media.uri }} style={styles.selectedImage} />
                                                {media.type === 'video' && !media.markedForDeletion && (
                                                    <View style={styles.mediaOverlay}>
                                                        <View style={styles.playButtonSmall}>
                                                            <Text style={styles.playButtonText}>▶</Text>
                                                        </View>
                                                    </View>
                                                )}
                                                {media.isExisting && !media.markedForDeletion && (
                                                    <View style={styles.existingBadge}>
                                                        <Text style={styles.existingBadgeText}>Actual</Text>
                                                    </View>
                                                )}
                                                {media.markedForDeletion && (
                                                    <View style={styles.deletionOverlay}>
                                                        <Text style={styles.deletionText}>Se eliminará{'\n'}al guardar</Text>
                                                    </View>
                                                )}
                                                <TouchableOpacity
                                                    style={styles.removeImageButton}
                                                    onPress={() => removeMedia(index)}
                                                >
                                                    <Text style={styles.removeImageText}>
                                                        {media.markedForDeletion ? '↺' : '✕'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <Text style={styles.imageCounter}>
                                    {activeMedia.length}/10 archivo{activeMedia.length !== 1 ? 's' : ''} activo{activeMedia.length !== 1 ? 's' : ''}
                                    {activeMedia.length > 0 && (
                                        <Text style={{ color: '#7c3aed' }}>
                                            {' '}({activeMedia.filter(m => m.type === 'image').length} imagen{activeMedia.filter(m => m.type === 'image').length !== 1 ? 'es' : ''}, {activeMedia.filter(m => m.type === 'video').length} video{activeMedia.filter(m => m.type === 'video').length !== 1 ? 's' : ''})
                                        </Text>
                                    )}
                                </Text>

                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={showImageOptions}
                                    disabled={activeMedia.length >= 10}
                                >
                                    <Text style={styles.uploadText}>
                                        {activeMedia.length >= 10 ? '✓ Máximo alcanzado' : '+ Agregar Fotos o Videos'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Botones de Acción */}
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                                    onPress={handleUpdateProperty}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
                                            <Text style={styles.submitButtonText}>Guardando...</Text>
                                        </>
                                    ) : (
                                        <Text style={styles.submitButtonText}>GUARDAR CAMBIOS</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={handleDeleteProperty}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.deleteButtonText}>ELIMINAR PROPIEDAD</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
