import AmenitiesSelector from '@/components/posts/amenities-selector';
import CurrencyModal from '@/components/posts/currency-modal';
import FormSection from '@/components/posts/form-section';
import ImageOptionsModal from '@/components/posts/image-options-modal';
import LocationForm from '@/components/posts/location-form';
import MapViewProperty from '@/components/posts/map-view-property';
import MediaUploader, { MediaItem } from '@/components/posts/media-uploader';
import OperationTypeSelector from '@/components/posts/operation-type-selector';
import PriceInput from '@/components/posts/price-input';
import PropertyTypeSelector from '@/components/posts/property-type-selector';
import SpecificationsForm from '@/components/posts/specifications-form';
import { validateAmenities, validateSpecifications } from '@/config/property-types.config';
import { useAuth } from '@/context/auth-context';
import { usePropertyTypeConfig } from '@/hooks/use-property-type-config';
import { apiService } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const alertShownRef = useRef(false);

  // Proteger ruta si es invitado
  useFocusEffect(
    useCallback(() => {
      if (isGuest && !alertShownRef.current) {
        alertShownRef.current = true;

        if (Platform.OS === 'web') {
          const shouldLogin = window.confirm('Debes iniciar sesión para crear publicaciones. ¿Deseas ir a iniciar sesión?');
          if (shouldLogin) {
            router.push('/login');
          } else {
            alertShownRef.current = false;
            router.back();
          }
        } else {
          Alert.alert(
            'Acceso Restringido',
            'Debes iniciar sesión para crear publicaciones',
            [
              {
                text: 'Iniciar Sesión',
                onPress: () => router.push('/login'),
                style: 'default',
              },
              {
                text: 'Cancelar',
                onPress: () => {
                  alertShownRef.current = false;
                  router.back();
                },
                style: 'cancel',
              },
            ]
          );
        }
      }
    }, [isGuest, router])
  );

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'BOB',
    propertyType: 'APARTMENT',
    operationType: 'SALE',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    contactPhone: '',
    amenities: [] as string[],
    specifications: {} as Record<string, any>,
  });

  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // Cargar configuración dinámica del tipo de propiedad
  const { config: propertyConfig } = usePropertyTypeConfig(formData.propertyType);

  // Función helper para ordenar medios: imágenes primero, videos al final
  const sortMediaItems = (media: MediaItem[]): MediaItem[] => {
    return [...media].sort((a, b) => {
      if (a.type === 'image' && b.type === 'video') return -1;
      if (a.type === 'video' && b.type === 'image') return 1;
      return 0;
    });
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const updateSpecification = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
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
      const remainingSlots = 10 - selectedMedia.length;
      const videoCount = selectedMedia.filter(m => m.type === 'video').length;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots > 0 ? remainingSlots : 1,
        aspect: [4, 3],
        quality: 0.8,
        videoMaxDuration: 300,
      });

      if (!result.canceled) {
        let newMedia: MediaItem[] = [];
        let videoCountInSelection = 0;

        for (const asset of result.assets) {
          const isVideo = asset.type === 'video';
          if (isVideo) videoCountInSelection++;

          newMedia.push({
            uri: asset.uri,
            type: isVideo ? 'video' : 'image',
            duration: asset.duration || undefined,
          });
        }

        if (videoCountInSelection + videoCount > 3) {
          Alert.alert(
            'Límite de videos',
            `Máximo 3 videos permitidos. Ya tienes ${videoCount} video${videoCount !== 1 ? 's' : ''}.`
          );
          newMedia = newMedia.filter(m => m.type !== 'video' || videoCount < 3);
        }

        if (selectedMedia.length + newMedia.length > 10) {
          Alert.alert(
            'Límite alcanzado',
            `Solo puedes agregar ${remainingSlots} más archivo${remainingSlots !== 1 ? 's' : ''}. Seleccionaste ${result.assets.length}.`
          );
          const allowedMedia = newMedia.slice(0, remainingSlots);
          if (allowedMedia.length > 0) {
            setSelectedMedia(prev => sortMediaItems([...prev, ...allowedMedia]));
          }
          return;
        }

        if (newMedia.length > 0) {
          setSelectedMedia(prev => sortMediaItems([...prev, ...newMedia]));
          const imageCount = newMedia.filter(m => m.type === 'image').length;
          const vCount = newMedia.filter(m => m.type === 'video').length;
          console.log(`✅ Agregados: ${imageCount} imagen(es) y ${vCount} video(s)`);
        }
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'No se pudo seleccionar el contenido');
    }
  };

  const takePhotoWithCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImage = result.assets[0].uri;
        if (selectedMedia.length >= 10) {
          Alert.alert('Límite alcanzado', 'Máximo 10 archivos permitidos');
          return;
        }
        setSelectedMedia(prev => sortMediaItems([...prev, { uri: newImage, type: 'image' }]));
        console.log('✅ Foto capturada');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
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

    const newMedia: MediaItem[] = [];
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const uri = e.target.result;
        newMedia.push({
          uri,
          type: isVideo ? 'video' : 'image',
        });

        if (newMedia.length === i + 1) {
          if (selectedMedia.length + newMedia.length > 10) {
            Alert.alert('Límite alcanzado', 'Máximo 10 archivos permitidos');
            return;
          }
          setSelectedMedia(prev => sortMediaItems([...prev, ...newMedia]));
          const imageCount = newMedia.filter(m => m.type === 'image').length;
          const videoCount = newMedia.filter(m => m.type === 'video').length;
          console.log(`✅ Agregados desde web: ${imageCount} imagen(es) y ${videoCount} video(s)`);
        }
      };

      reader.readAsDataURL(file);
    }

    event.target.value = '';
  };

  const handlePublish = async (postStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!formData.title || !formData.description || !formData.price) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios: Título, Descripción y Precio');
      return;
    }

    if (selectedMedia.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos una imagen o video');
      return;
    }

    if (propertyConfig) {
      const specValidation = validateSpecifications(
        formData.propertyType,
        formData.specifications,
      );
      if (!specValidation.valid) {
        Alert.alert('Error de validación', specValidation.errors.join('\n'));
        return;
      }

      const amenitiesValidation = validateAmenities(
        formData.propertyType,
        formData.amenities,
      );
      if (!amenitiesValidation.valid) {
        Alert.alert('Error de validación', amenitiesValidation.errors.join('\n'));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price.replace(/,/g, ''));
      data.append('currency', formData.currency);
      data.append('propertyType', formData.propertyType);
      data.append('operationType', formData.operationType);
      data.append('postStatus', postStatus);
      data.append('specifications', JSON.stringify(formData.specifications || {}));
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

      console.log('📸 [handlePublish] Datos siendo enviados:');
      console.log('   Title:', formData.title);
      console.log('   PropertyType:', formData.propertyType);
      console.log('   Currency:', formData.currency);
      console.log('   PostStatus a enviar:', postStatus);
      console.log('   Specifications:', formData.specifications);
      console.log('   Amenities:', formData.amenities);
      console.log('   Media items:', selectedMedia.length);

      selectedMedia.forEach((media, index) => {
        const filename = media.uri.split('/').pop() || `${media.type}_${index}`;
        const isVideo = media.type === 'video';
        const match = /\.(\w+)$/.exec(filename);
        const extension = match ? match[1] : (isVideo ? 'mp4' : 'jpeg');
        const mimeType = isVideo ? `video/${extension}` : `image/${extension}`;

        console.log(`   ${isVideo ? 'Video' : 'Imagen'} ${index + 1}:`, { filename, mimeType, uri: media.uri });

        // @ts-ignore
        data.append('files', {
          uri: media.uri,
          name: filename,
          type: mimeType,
        });
      });

      const response = await apiService.createPropertyWithImages(data);

      console.log('📸 [handlePublish] Respuesta del API:');
      console.log('   ID Propiedad:', response?.id);
      console.log('   PostStatus enviado:', postStatus);
      console.log('   PostStatus recibido:', response?.postStatus);

      const successMessage = postStatus === 'DRAFT'
        ? 'Borrador guardado correctamente'
        : 'Tu propiedad ha sido publicada correctamente';

      Alert.alert('Éxito', successMessage, [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              title: '',
              description: '',
              price: '',
              currency: 'BOB',
              propertyType: 'APARTMENT',
              operationType: 'SALE',
              address: '',
              city: '',
              latitude: '',
              longitude: '',
              contactPhone: '',
              amenities: [],
              specifications: {},
            });
            setSelectedMedia([]);
            router.push('/(tabs)/profile?refresh=true');
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error publicando propiedad:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar la propiedad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => handlePublish('DRAFT');
  const handlePublishProperty = () => handlePublish('PUBLISHED');

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

      <ImageOptionsModal
        visible={showImageModal}
        onTakePhoto={takePhotoWithCamera}
        onPickFromGallery={pickImageFromGallery}
        onClose={() => setShowImageModal(false)}
      />

      <CurrencyModal
        visible={showCurrencyModal}
        selectedCurrency={formData.currency}
        onSelect={(currency) => setFormData({ ...formData, currency })}
        onClose={() => setShowCurrencyModal(false)}
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Crear Publicación</Text>
          <Text style={styles.headerSubtitle}>Comparte tu propiedad con miles de usuarios</Text>
        </View>

        {/* Scroll Content */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              {/* Información Básica */}
              <FormSection title="Información Básica">
                <Text style={styles.fieldLabel}>Título de la Publicación *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Departamento moderno en Zona Sur"
                  placeholderTextColor="#cbd5e1"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />

                <PriceInput
                  currency={formData.currency}
                  price={formData.price}
                  onCurrencyPress={() => setShowCurrencyModal(true)}
                  onPriceChange={(price) => setFormData({ ...formData, price })}
                />
              </FormSection>

              {/* Tipo de Propiedad */}
              <FormSection title="Tipo de Propiedad">
                <PropertyTypeSelector
                  selectedType={formData.propertyType}
                  onTypeChange={(type) => setFormData({ ...formData, propertyType: type as any })}
                />

                <OperationTypeSelector
                  selectedType={formData.operationType}
                  onTypeChange={(type) => setFormData({ ...formData, operationType: type as any })}
                />
              </FormSection>

              {/* Características */}
              <FormSection title={`Características de ${propertyConfig?.label || 'Propiedad'}`}>
                <SpecificationsForm
                  config={propertyConfig}
                  specifications={formData.specifications}
                  onUpdate={updateSpecification}
                />
              </FormSection>

              {/* Descripción */}
              <FormSection title="Descripción">
                <Text style={styles.fieldLabel}>Descripción *</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe tu propiedad en detalle..."
                  placeholderTextColor="#cbd5e1"
                  multiline
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </FormSection>

              {/* Ubicación y Contacto */}
              <FormSection title="📍 Ubicación y Contacto">
                <LocationForm
                  address={formData.address}
                  city={formData.city}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  contactPhone={formData.contactPhone}
                  showMap={showMap}
                  onAddressChange={(address) => setFormData({ ...formData, address })}
                  onCityChange={(city) => setFormData({ ...formData, city })}
                  onLatitudeChange={(lat) => !showMap && setFormData({ ...formData, latitude: lat })}
                  onLongitudeChange={(lon) => !showMap && setFormData({ ...formData, longitude: lon })}
                  onPhoneChange={(phone) => setFormData({ ...formData, contactPhone: phone })}
                  onToggleMap={() => setShowMap(!showMap)}
                  mapComponent={
                    showMap ? (
                      <MapViewProperty
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
                    ) : undefined
                  }
                />
              </FormSection>

              {/* Amenidades */}
              <FormSection title={`Amenidades para ${propertyConfig?.label || 'Propiedad'}`}>
                <AmenitiesSelector
                  config={propertyConfig}
                  selectedAmenities={formData.amenities}
                  onToggle={toggleAmenity}
                />
              </FormSection>

              {/* Fotos */}
              <FormSection title="Fotos">
                <MediaUploader
                  media={selectedMedia}
                  onAddMedia={showImageOptions}
                  onRemoveMedia={removeMedia}
                />
              </FormSection>

              {/* Botones de Acción */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.draftButton, isSubmitting && styles.draftButtonDisabled]}
                  onPress={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <ActivityIndicator color="#5585b5" style={{ marginRight: 8 }} />
                      <Text style={styles.draftButtonText}>Guardando...</Text>
                    </>
                  ) : (
                    <Text style={styles.draftButtonText}>GUARDAR BORRADOR</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handlePublishProperty}
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  buttonsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#5585b5',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  draftButton: {
    width: '100%',
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#5585b5',
  },
  draftButtonDisabled: {
    backgroundColor: '#e2e8f0',
    borderColor: '#94a3b8',
  },
  draftButtonText: {
    color: '#5585b5',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
