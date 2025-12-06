import { apiService, SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const createStyles = (width: number) => {
  const isWeb = width > 768;
  const horizontalPadding = isWeb ? 40 : 24;
  const maxWidth = isWeb ? 1200 : '100%' as any;
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
    // Header - Consistente con home.tsx
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
    // Scroll y Form
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
    uploadButton: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: '#5585b5',
      borderRadius: 10,
      paddingVertical: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: '#f0f4ff',
    },
    uploadText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#5585b5',
    },
    imagesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 12,
    },
    imageContainer: {
      width: imageContainerWidth as any,
      aspectRatio: 1,
      borderRadius: 10,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    selectedImage: {
      width: '100%',
      height: '100%',
    },
    removeImageButton: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#ef4444',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#ef4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    removeImageText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
    imageCounter: {
      fontSize: 12,
      color: '#64748b',
      marginBottom: 12,
      fontWeight: '500',
    },
    submitButton: {
      backgroundColor: '#5585b5',
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32,
      shadowColor: '#5585b5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    submitButtonDisabled: {
      backgroundColor: '#94a3b8',
      shadowColor: '#94a3b8',
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.5,
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
    mapUnavailable: {
      backgroundColor: '#fef3c7',
      borderWidth: 1,
      borderColor: '#fcd34d',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    mapUnavailableText: {
      color: '#92400e',
      fontSize: 14,
      fontWeight: '600',
    },
    // Modal Personalizado para seleccionar fotos
    imageOptionsModal: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    imageOptionsContainer: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 20,
      paddingBottom: 32,
    },
    imageOptionsHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    imageOptionsTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#5585b5',
      marginBottom: 4,
    },
    imageOptionsSubtitle: {
      fontSize: 13,
      color: '#64748b',
      fontWeight: '500',
    },
    imageOptionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: '#f0f4ff',
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: '#e2e8f0',
    },
    imageOptionButtonActive: {
      backgroundColor: '#eff6ff',
      borderColor: '#5585b5',
    },
    imageOptionIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: '#5585b5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    imageOptionText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: '#5585b5',
    },
    imageOptionCancel: {
      marginTop: 8,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#e2e8f0',
    },
    imageOptionCancelText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#64748b',
    },
  });
};

export default function CreatePostScreen() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'APARTMENT',
    operationType: 'SALE',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    contactPhone: '',
    amenities: [] as string[],
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // MapViewComponent para seleccionar ubicación
  const MapViewComponent = require('@/components/map-view-property').default;

  const propertyTypes = [
    { label: 'Casa', value: 'HOUSE' },
    { label: 'Departamento', value: 'APARTMENT' },
    { label: 'Terreno', value: 'LAND' },
    { label: 'Oficina', value: 'OFFICE' },
    { label: 'Comercial', value: 'COMMERCIAL' },
    { label: 'Almacén', value: 'WAREHOUSE' },
    { label: 'Habitación', value: 'ROOM' },
  ];

  const operationTypes = [
    { label: 'Venta', value: 'SALE' },
    { label: 'Alquiler Temporal', value: 'RENT_TEMPORARY' },
    { label: 'Alquiler Permanente', value: 'RENT_PERMANENT' },
    { label: 'Anticrético', value: 'ANTICRETICO' },
  ];

  const amenitiesList = [
    'WiFi',
    'Aire acondicionado',
    'Piscina',
    'Gym',
    'Estacionamiento',
    'Seguridad 24/7',
    'Ascensor',
    'Balcón',
    'Jardín',
    'Terraza',
  ];

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar imágenes.');
      return false;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara para tomar fotos.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      // Calcular límite restante de imágenes
      const remainingSlots = 5 - selectedImages.length;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        selectionLimit: remainingSlots > 0 ? remainingSlots : 1,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);

        // Validar que no exceda el límite
        if (selectedImages.length + newImages.length > 5) {
          const excessCount = (selectedImages.length + newImages.length) - 5;
          Alert.alert(
            'Límite alcanzado',
            `Solo puedes agregar ${remainingSlots} más imagen${remainingSlots !== 1 ? 's' : ''}. Seleccionaste ${newImages.length}.`
          );
          // Agregar solo las que caben
          const allowedImages = newImages.slice(0, remainingSlots);
          if (allowedImages.length > 0) {
            setSelectedImages(prev => [...prev, ...allowedImages]);
          }
          return;
        }

        setSelectedImages(prev => [...prev, ...newImages]);
        console.log(`✅ ${newImages.length} imagen(es) agregada(s)`);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const takePhotoWithCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImage = result.assets[0].uri;
        if (selectedImages.length >= 5) {
          Alert.alert('Límite alcanzado', 'Puedes seleccionar máximo 5 imágenes');
          return;
        }
        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    if (Platform.OS === 'web') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      setShowImageModal(true);
    }
  };

  const handleWebFileSelect = (event: any) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const uri = e.target.result;
        newImages.push(uri);

        if (newImages.length === i + 1) {
          if (selectedImages.length + newImages.length > 5) {
            Alert.alert('Límite alcanzado', 'Puedes seleccionar máximo 5 imágenes');
            return;
          }
          setSelectedImages(prev => [...prev, ...newImages]);
          console.log('✅ Imágenes agregadas desde web:', newImages.length);
        }
      };

      reader.readAsDataURL(file);
    }

    event.target.value = '';
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos una imagen');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('propertyType', formData.propertyType);
      data.append('operationType', formData.operationType);

      if (formData.bedrooms) data.append('bedrooms', formData.bedrooms);
      if (formData.bathrooms) data.append('bathrooms', formData.bathrooms);
      if (formData.area) data.append('area', formData.area);

      data.append('address', formData.address || 'No especificado');
      data.append('city', formData.city || 'No especificado');
      data.append('latitude', formData.latitude || '0');
      data.append('longitude', formData.longitude || '0');
      data.append('contactPhone', formData.contactPhone || '');

      if (formData.amenities.length > 0) {
        formData.amenities.forEach(amenity => {
          data.append('amenities', amenity);
        });
      } else {
        data.append('amenities', '');
      }

      console.log('📸 [handleSubmit] Preparando', selectedImages.length, 'imágenes...');
      selectedImages.forEach((imageUri, index) => {
        const filename = imageUri.split('/').pop() || `image_${index}`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        console.log(`   Imagen ${index + 1}:`, { filename, type, uri: imageUri });

        // @ts-ignore
        data.append('images', {
          uri: imageUri,
          name: filename,
          type: type,
        });
      });
      console.log('✅ [handleSubmit] Imágenes agregadas a FormData');

      const response = await apiService.createPropertyWithImages(data);

      console.log('📸 [handleSubmit] Respuesta del API:');
      console.log('   ID Propiedad:', response?.id);
      console.log('   Imágenes:', JSON.stringify(response?.images, null, 2));
      if (response?.images && response.images.length > 0) {
        console.log('   Primera imagen URL:', response.images[0].url);
        console.log('   Full URL:', `${SERVER_BASE_URL}${response.images[0].url}`);
      }

      Alert.alert('Éxito', 'Tu propiedad ha sido publicada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              title: '',
              description: '',
              price: '',
              propertyType: 'APARTMENT',
              operationType: 'SALE',
              bedrooms: '',
              bathrooms: '',
              area: '',
              address: '',
              city: '',
              latitude: '',
              longitude: '',
              contactPhone: '',
              amenities: [],
            });
            setSelectedImages([]);
            // Redirigir a perfil con refresh automático
            router.push('/(tabs)/profile?refresh=true');
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error publicando propiedad:', error);
      Alert.alert('Error', error.message || 'No se pudo publicar la propiedad');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleWebFileSelect}
        />
      )}

      {/* Modal para seleccionar fotos */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageOptionsModal}>
          <View style={styles.imageOptionsContainer}>
            {/* Header */}
            <View style={styles.imageOptionsHeader}>
              <Text style={styles.imageOptionsTitle}>Agregar Fotos</Text>
              <Text style={styles.imageOptionsSubtitle}>Elige cómo deseas agregar una foto</Text>
            </View>

            {/* Opciones */}
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
              <Text style={styles.imageOptionText}>Seleccionar de Galería</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#5585b5" />
            </TouchableOpacity>

            {/* Cancelar */}
            <TouchableOpacity
              style={styles.imageOptionCancel}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.imageOptionCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Crear Publicación</Text>
          <Text style={styles.headerSubtitle}>Comparte tu propiedad con miles de usuarios</Text>
        </View>

        {/* Scroll Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Básica</Text>

              <Text style={styles.fieldLabel}>Título de la Publicación *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Departamento moderno en Zona Sur"
                placeholderTextColor="#cbd5e1"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <Text style={styles.fieldLabel}>Descripción *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe tu propiedad en detalle..."
                placeholderTextColor="#cbd5e1"
                multiline
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />

              <Text style={styles.fieldLabel}>Precio *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 150000"
                placeholderTextColor="#cbd5e1"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de Propiedad</Text>

              <Text style={styles.fieldLabel}>Tipo de Inmueble</Text>
              <ScrollView horizontal style={{ marginBottom: 16 }} showsHorizontalScrollIndicator={false}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[styles.checkboxItem, formData.propertyType === type.value && styles.checkboxItemActive]}
                    onPress={() => setFormData({ ...formData, propertyType: type.value as any })}
                  >
                    <Text
                      style={[styles.checkboxText, formData.propertyType === type.value && styles.checkboxTextActive]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.fieldLabel}>Tipo de Operación</Text>
              <ScrollView horizontal style={{ marginBottom: 16 }} showsHorizontalScrollIndicator={false}>
                {operationTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[styles.checkboxItem, formData.operationType === type.value && styles.checkboxItemActive]}
                    onPress={() => setFormData({ ...formData, operationType: type.value as any })}
                  >
                    <Text
                      style={[styles.checkboxText, formData.operationType === type.value && styles.checkboxTextActive]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Características</Text>

              <View style={styles.row}>
                <View style={[styles.halfInput, { marginBottom: 16 }]}>
                  <Text style={styles.fieldLabel}>Dormitorios</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 3"
                    keyboardType="numeric"
                    value={formData.bedrooms}
                    onChangeText={(text) => setFormData({ ...formData, bedrooms: text })}
                  />
                </View>

                <View style={[styles.halfInput, { marginBottom: 16 }]}>
                  <Text style={styles.fieldLabel}>Baños</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 2"
                    keyboardType="numeric"
                    value={formData.bathrooms}
                    onChangeText={(text) => setFormData({ ...formData, bathrooms: text })}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Área (m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 120"
                keyboardType="numeric"
                value={formData.area}
                onChangeText={(text) => setFormData({ ...formData, area: text })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Ubicación y Contacto</Text>

              <Text style={styles.fieldLabel}>Dirección *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Calle Principal 123, Apt 5"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
              />

              <Text style={styles.fieldLabel}>Ciudad *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: La Paz"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
              />

              {/* Botón para mostrar/ocultar mapa - SOLO EN MOBILE */}
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => setShowMap(!showMap)}
              >
                <Text style={styles.mapButtonText}>
                  {showMap ? '🗺️ Ocultar Mapa' : '🗺️ Seleccionar Ubicación en Mapa'}
                </Text>
              </TouchableOpacity>

              {/* MapView para seleccionar ubicación */}
              {showMap && MapViewComponent && (
                <View style={styles.mapContainer}>
                  <MapViewComponent
                    selectedLocation={
                      formData.latitude && formData.longitude
                        ? {
                          latitude: parseFloat(formData.latitude),
                          longitude: parseFloat(formData.longitude),
                        }
                        : {
                          latitude: -17.8,
                          longitude: -63.18,
                        }
                    }
                    onLocationSelect={(lat: number, lon: number) => {
                      setFormData({
                        ...formData,
                        latitude: lat.toFixed(6),
                        longitude: lon.toFixed(6),
                      });
                    }}
                    style={{ height: 350 }}
                  />
                </View>
              )}

              <View style={styles.row}>
                <View style={[styles.halfInput, { marginBottom: 16 }]}>
                  <Text style={styles.fieldLabel}>Latitud</Text>
                  <TextInput
                    style={[styles.input, showMap && styles.inputReadOnly]}
                    placeholder="Ej: -16.5"
                    keyboardType="decimal-pad"
                    value={formData.latitude}
                    onChangeText={(text) => !showMap && setFormData({ ...formData, latitude: text })}
                    editable={!showMap}
                  />
                </View>

                <View style={[styles.halfInput, { marginBottom: 16 }]}>
                  <Text style={styles.fieldLabel}>Longitud</Text>
                  <TextInput
                    style={[styles.input, showMap && styles.inputReadOnly]}
                    placeholder="Ej: -68.1"
                    keyboardType="decimal-pad"
                    value={formData.longitude}
                    onChangeText={(text) => !showMap && setFormData({ ...formData, longitude: text })}
                    editable={!showMap}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Teléfono de Contacto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: +591 71234567"
                keyboardType="phone-pad"
                value={formData.contactPhone}
                onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenidades</Text>

              <View style={styles.checkboxContainer}>
                {amenitiesList.map((amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    style={[styles.checkboxItem, formData.amenities.includes(amenity) && styles.checkboxItemActive]}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    <Text
                      style={[styles.checkboxText, formData.amenities.includes(amenity) && styles.checkboxTextActive]}
                    >
                      {formData.amenities.includes(amenity) ? '✓' : '○'} {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fotos</Text>

              {selectedImages.length > 0 && (
                <View style={styles.imagesGrid}>
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Text style={styles.removeImageText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.imageCounter}>
                {selectedImages.length}/5 imágenes seleccionadas
              </Text>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={showImageOptions}
                disabled={selectedImages.length >= 5}
              >
                <Text style={styles.uploadText}>
                  {selectedImages.length >= 5 ? '✓ Máximo alcanzado' : '+ Agregar Fotos'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Publicando...</Text>
                </>
              ) : (
                <Text style={styles.submitButtonText}>PUBLICAR PROPIEDAD</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
