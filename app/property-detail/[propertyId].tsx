import { formatPriceWithCurrency } from '@/config/currencies.config';
import { PROPERTY_TYPES_CONFIG } from '@/config/property-types.config';
import { useFavoritesContext } from '@/context/favorites-context';
import { Property } from '@/hooks/use-properties';
import { apiService, SERVER_BASE_URL } from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, Linking, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Interfaz para PropertyMedia (imágenes y videos)
interface PropertyMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  order: number;
}


const createStyles = (screenWidth: number) => {
  const isWeb = screenWidth > 768;
  const carouselHeight = isWeb ? 350 : 300;
  const contentPadding = isWeb ? 30 : 24;
  const maxWidth = isWeb ? 768 : '100%' as any;  // Reducido de 1200 a 768 para web
  const imageContainerWidth = isWeb ? 768 : screenWidth;  // Usa maxWidth en web

  return StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      width: '100%',
      maxWidth: maxWidth as any,
      backgroundColor: '#ffffff',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#5585b5',
      marginLeft: 12,
      flex: 1,
    },
    imageCarousel: {
      width: '100%',
      height: carouselHeight,
      backgroundColor: '#f8fafc',
      maxWidth: maxWidth as any,
    },
    imageContainer: {
      width: imageContainerWidth,
      height: carouselHeight,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    carouselWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: maxWidth as any,
    },
    carouselButtonsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      pointerEvents: 'box-none' as any,
    },
    carouselButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 5,
    },
    paginationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 6,
      backgroundColor: '#ffffff',
    },
    paginationBadge: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      zIndex: 5,
    },
    paginationBadgeText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    // Video overlay styles
    videoOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButtonContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    videoDurationBadge: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      zIndex: 5,
    },
    videoDurationText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    // Fullscreen video styles
    fullscreenVideoContainer: {
      flex: 1,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullscreenVideo: {
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      paddingHorizontal: contentPadding,
      paddingVertical: 20,
      width: '100%',
      maxWidth: maxWidth as any,
      gap: 16,
    },
    // Card base para secciones
    card: {
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    cardHeaderSection: {
      backgroundColor: '#f9fafb',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 16,
    },
    cardWhite: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 16,
    },
    cardBlueLight: {
      backgroundColor: '#f0f4ff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e0e7ff',
    },
    header: {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: '#0f172a',
      marginBottom: 8,
      lineHeight: 32,
    },
    priceLocationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    price: {
      fontSize: 22,
      fontWeight: '800',
      color: '#5585b5',
      flex: 1,
    },
    location: {
      fontSize: 13,
      color: '#5585b5',
      marginBottom: 0,
      fontWeight: '500',
      flex: 1,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0,
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: '#f0f4ff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#cbd5e1',
      flex: 1,
      justifyContent: 'flex-start',
    },
    locationSeparator: {
      height: 1,
      backgroundColor: '#f1f5f9',
      marginVertical: 16,
      marginHorizontal: -24,
    },
    section: {
      marginBottom: 0,
    },
    sectionFeatures: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#5585b5',
      marginBottom: 12,
      textTransform: 'capitalize',
    },
    description: {
      fontSize: 15,
      color: '#475569',
      lineHeight: 24,
      fontWeight: '400',
    },
    // Nuevo: Features Horizontal Pills Layout
    featureGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'flex-start',
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f4ff',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 2,
      borderWidth: 1,
      borderColor: '#e0e7ff',
    },
    featureValue: {
      fontSize: 16,
      fontWeight: '700',
      color: '#5585b5',
    },
    featureLabel: {
      fontSize: 13,
      color: '#64748b',
      fontWeight: '500',
    },
    amenitiesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    amenityTag: {
      backgroundColor: '#f8fafc',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#cbd5e1',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    amenityText: {
      fontSize: 13,
      color: '#475569',
      fontWeight: '500',
    },
    contactSection: {
      backgroundColor: '#f0f4ff',
      borderRadius: 14,
      padding: 16,
      marginBottom: 0,
      borderWidth: 1,
      borderColor: '#e0e7ff',
    },
    contactHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    contactAvatar: {
      fontSize: 36,
      marginRight: 12,
    },
    contactAvatarImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      backgroundColor: '#e2e8f0',
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 15,
      fontWeight: '700',
      color: '#5585b5',
      marginBottom: 2,
    },
    contactButtonsContainer: {
      flexDirection: 'column',
      gap: 8,
    },
    contactTitle: {
      fontSize: 12,
      color: '#64748b',
    },
    contactMinimalButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: '#5585b5',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 110,
    },
    contactMinimalButtonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 6,
    },
    contactMinimalButtonWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 32,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: '#5585b5',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      shadowColor: '#5585b5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '700',
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#5585b5',
    },
    secondaryButtonText: {
      color: '#5585b5',
      fontSize: 14,
      fontWeight: '700',
    },
    // Botones flotantes en header (absolutos sobre imagen)
    floatingHeaderButtons: {
      position: 'absolute',
      top: 12,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      zIndex: 15,
      pointerEvents: 'box-none' as any,
    },
    floatingButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    // Favoritos botón flotante
    favoriteButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    // Modal fullscreen
    fullscreenImageContainer: {
      flex: 1,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullscreenImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    fullscreenCloseButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
    },
    // Modal Descripción Completa
    descriptionModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    descriptionModalContent: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
      maxHeight: '85%',
      flex: 1,
    },
    descriptionModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      backgroundColor: '#ffffff',
    },
    descriptionModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#5585b5',
    },
    descriptionModalCloseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#f1f5f9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    descriptionModalText: {
      fontSize: 15,
      color: '#475569',
      lineHeight: 26,
      fontWeight: '400',
      paddingBottom: 24,
    },
    descriptionTruncated: {
      fontSize: 15,
      color: '#475569',
      lineHeight: 24,
      fontWeight: '400',
    },
    showMoreButton: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: '#f0f4ff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#e0e7ff',
      alignSelf: 'flex-start',
    },
    showMoreButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#5585b5',
    },
    // CTA Sticky Bottom
    stickyCtaContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 20,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    ctaButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    ctaPrimaryButton: {
      backgroundColor: '#5585b5',
    },
    ctaPrimaryButtonText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '700',
    },
    ctaSecondaryButton: {
      backgroundColor: '#f1f5f9',
      borderWidth: 1,
      borderColor: '#cbd5e1',
    },
    ctaSecondaryButtonText: {
      color: '#475569',
      fontSize: 15,
      fontWeight: '700',
    },
  });
};

// Componente helper para reproducir videos con expo-video
const VideoPlayerComponent = ({ uri, shouldPlay }: { uri: string; shouldPlay: boolean }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.muted = false;
  });

  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldPlay, player]);

  return (
    <VideoView
      style={{
        width: '100%',
        height: '100%',
      }}
      player={player}
      allowsPictureInPicture
      fullscreenOptions={{
        enable: true,
        orientation: 'landscape',
      }}
    />
  );
};

export default function PropertyDetailScreen() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const { propertyId } = useLocalSearchParams() as { propertyId: string };

  // 1. REFS - Todos los useRef juntos
  const scrollViewRef = useRef<ScrollView>(null);
  const fullscreenScrollRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 2. CONTEXT
  const { favorites, fetchFavorites, addFavorite, removeFavorite } = useFavoritesContext();

  // 3. STATE - Todos los useState juntos
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Derived state: check if property is favorited
  const isLiked = favorites.some(fav => fav.propertyId === propertyId);

  // Límite de caracteres para descripción truncada
  const DESCRIPTION_LIMIT = 150;

  // 4. CALLBACKS - Todos los useCallback juntos
  const truncateDescription = useCallback((text: string, limit: number): { truncated: string; isTruncated: boolean } => {
    if (text.length > limit) {
      return {
        truncated: text.substring(0, limit).trim() + '...',
        isTruncated: true,
      };
    }
    return {
      truncated: text,
      isTruncated: false,
    };
  }, []);

  // Función para cerrar el modal fullscreen y sincronizar con el carrusel
  const handleCloseFullscreenModal = useCallback(() => {
    if (fullscreenImageIndex !== null) {
      setCurrentImageIndex(fullscreenImageIndex);
      // Scroll al carrusel en la misma posición
      const scrollPosition = fullscreenImageIndex * (width > 768 ? 768 : width);
      scrollViewRef.current?.scrollTo({
        x: scrollPosition,
        animated: false,
      });
    }
    setFullscreenImageIndex(null);
  }, [fullscreenImageIndex, width]);

  const handleLike = useCallback(async () => {
    // Animación de escala y rebote
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
    ]).start();

    try {
      if (isLiked) {
        // Remove from favorites
        await removeFavorite(propertyId);
      } else {
        // Add to favorites
        await addFavorite(propertyId);
      }
    } catch (err: any) {
      console.error('[PropertyDetail] Error al actualizar favoritos:', err);

      // Extraer mensaje de error del response
      let errorMessage = 'No se pudo actualizar los favoritos';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      Alert.alert('⚠️ Error', errorMessage);
    }
  }, [isLiked, propertyId, removeFavorite, addFavorite]);

  const handleScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentImageIndex(currentIndex);
  }, [width]);

  const handleMainScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
  }, []);

  const handlePrevImage = useCallback(() => {
    const newIndex = Math.max(0, currentImageIndex - 1);
    scrollViewRef.current?.scrollTo({
      x: newIndex * (width > 768 ? 768 : width),
      animated: true,
    });
    setCurrentImageIndex(newIndex);
  }, [currentImageIndex, width]);

  const handleNextImage = useCallback(() => {
    if (property && property.images && property.images.length > 0) {
      const maxIndex = property.images.length - 1;
      const newIndex = Math.min(maxIndex, currentImageIndex + 1);
      scrollViewRef.current?.scrollTo({
        x: newIndex * (width > 768 ? 768 : width),
        animated: true,
      });
      setCurrentImageIndex(newIndex);
    }
  }, [currentImageIndex, property, width]);

  const buildAvatarUrl = useCallback((avatarPath: string | undefined) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  }, []);

  const handleCall = useCallback(async () => {
    if (!property?.owner?.phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    const phoneNumber = property.owner.phone.replace(/[^\d+]/g, '');
    const callUrl = `tel:${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(callUrl);
      if (canOpen) {
        await Linking.openURL(callUrl);
      } else {
        Alert.alert('Error', 'No se puede realizar llamadas en este dispositivo');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo hacer la llamada');
    }
  }, [property?.owner?.phone]);

  const handleContactWhatsApp = useCallback(async () => {
    if (!property?.owner?.phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    // Limpiar el número: remover espacios, guiones, paréntesis
    const phoneNumber = property.owner.phone.replace(/[^\d+]/g, '');

    // Construir URL de WhatsApp
    const whatsappUrl = Platform.OS === 'web'
      ? `https://web.whatsapp.com/send?phone=${phoneNumber}`
      : `whatsapp://send?phone=${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Si no tiene WhatsApp, ofrecer alternativa
        Alert.alert(
          'WhatsApp no disponible',
          '¿Deseas llamar al propietario?',
          [
            { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
            { text: 'Llamar', onPress: handleCall },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    }
  }, [property?.owner?.phone]);

  // 🗺️ Abre selector nativo de apps de mapas
  const handleOpenMap = useCallback(async (property: Property, e: any) => {
    e.stopPropagation();
    try {
      const { latitude, longitude, title } = property;

      if (!latitude || !longitude) {
        Alert.alert('⚠️ Error', 'La propiedad no tiene coordenadas registradas');
        return;
      }

      let mapUrl = '';

      if (Platform.OS === 'ios') {
        // iOS: URL http:// permite que otras apps compitan con Apple Maps
        mapUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
      } else {
        // Android: geo: schema dispara selector nativo automáticamente
        mapUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(title)})`;
      }

      Linking.openURL(mapUrl).catch((err) => {
        console.error('Error abriendo mapas:', err);

        // Fallback: Si falla, intenta con URL web genérica
        const fallbackUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(fallbackUrl).catch(() => {
          Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
        });
      });
    } catch (error) {
      console.error('Error abriendo mapas:', error);
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    }
  }, []);

  // Construir URLs completas de imágenes y videos (ANTES de effects)
  const propertyMedia: PropertyMedia[] = useMemo(() => {
    if (!property?.images) return [];

    return (property.images || []).map((img: any) => {
      // Soportar tanto formato nuevo (PropertyMedia) como legacy (simple URL)
      const isNewFormat = img.type !== undefined;

      const finalUrl = img.url?.startsWith('http')
        ? img.url
        : `${SERVER_BASE_URL}${img.url}`;

      const finalThumbnailUrl = img.thumbnailUrl
        ? (img.thumbnailUrl.startsWith('http')
          ? img.thumbnailUrl
          : `${SERVER_BASE_URL}${img.thumbnailUrl}`)
        : undefined;

      return {
        id: img.id,
        type: img.type || 'IMAGE', // Legacy support: asumir IMAGE si no tiene tipo
        url: finalUrl,
        thumbnailUrl: finalThumbnailUrl,
        duration: img.duration,
        order: img.order || 0,
      };
    });
  }, [property?.images]);

  // Helper para formatear duración de video
  const formatVideoDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Effect hooks DESPUÉS de todos los callbacks
  useEffect(() => {
    loadProperty();
    loadFavorites();
  }, [propertyId]);

  // Scroll al índice correcto cuando se abre el modal fullscreen
  useEffect(() => {
    if (fullscreenImageIndex !== null && fullscreenScrollRef.current) {
      setTimeout(() => {
        fullscreenScrollRef.current?.scrollTo({
          x: fullscreenImageIndex * width,
          animated: false,
        });
      }, 100);
    }
  }, [fullscreenImageIndex, width]);

  // Funciones async (loadProperty, loadFavorites)
  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPropertyById(propertyId);
      setProperty(data);
    } catch (err: any) {
      console.error('Error loading property:', err);
      setError(err.message || 'No se pudo cargar la propiedad');
      Alert.alert('Error', 'No se pudo cargar los detalles de la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      await fetchFavorites();
    } catch (err) {
      console.error('[PropertyDetail] Error cargando favoritos:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5585b5" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !property) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ flex: 1, position: 'relative' }}>
          <View style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 15,
          }}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#5585b5" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 16, color: '#ef4444', textAlign: 'center' }}>
              {error || 'No se pudo cargar la propiedad'}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 20, backgroundColor: '#5585b5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
              onPress={() => router.back()}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 1)" translucent />

      {/* Modal Descripción Completa */}
      <Modal
        visible={showFullDescription}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowFullDescription(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <View style={styles.descriptionModalHeader}>
            <Text style={styles.descriptionModalTitle}>Descripción Completa</Text>
            <TouchableOpacity
              style={styles.descriptionModalCloseButton}
              onPress={() => setShowFullDescription(false)}
            >
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.descriptionModalText}>{property?.description}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal Fullscreen de Imagen */}
      <Modal
        visible={fullscreenImageIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseFullscreenModal}
      >
        <View style={styles.fullscreenImageContainer}>
          {fullscreenImageIndex !== null && (
            <>
              <ScrollView
                ref={fullscreenScrollRef}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                onScroll={(event) => {
                  const contentOffsetX = event.nativeEvent.contentOffset.x;
                  const screenWidth = event.nativeEvent.layoutMeasurement.width;
                  const currentIndex = Math.round(contentOffsetX / screenWidth);
                  setFullscreenImageIndex(currentIndex);
                }}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={propertyMedia.length > 1}
                style={{ flex: 1, width: '100%' }}
              >
                {propertyMedia.map((item: PropertyMedia) => (
                  <View
                    key={item.id}
                    style={{
                      width: width,
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#000',
                    }}
                  >
                    {item.type === 'IMAGE' ? (
                      <Image
                        source={{ uri: item.url }}
                        style={styles.fullscreenImage}
                      />
                    ) : (
                      // Video: usar VideoView component de expo-video para reproducción
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#000000',
                        }}
                      >
                        <VideoPlayerComponent
                          uri={item.url}
                          shouldPlay={fullscreenImageIndex === propertyMedia.findIndex(m => m.id === item.id)}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>

              {/* Indicador de página */}
              {propertyMedia.length > 1 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 24,
                    left: 16,
                    zIndex: 20,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>
                      {fullscreenImageIndex + 1} / {propertyMedia.length}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Botón cerrar */}
          <TouchableOpacity
            style={styles.fullscreenCloseButton}
            onPress={handleCloseFullscreenModal}
          >
            <Ionicons name="close" size={24} color="#5585b5" />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingBottom: 80 }}
          onScroll={handleMainScroll}
          scrollEventThrottle={16}
        >
          {/* Image Carousel */}
          {propertyMedia.length > 0 ? (
            <>
              <View style={styles.carouselWrapper}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  scrollEventThrottle={16}
                  onScroll={handleScroll}
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageCarousel}
                >
                  {propertyMedia.map((item: PropertyMedia, index: number) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.imageContainer}
                      onPress={() => setFullscreenImageIndex(index)}
                      activeOpacity={0.9}
                    >
                      {item.type === 'IMAGE' ? (
                        <Image
                          source={{ uri: item.url }}
                          style={styles.image}
                          onError={(e) => {
                            console.error('❌ Error loading image:', {
                              url: item.url,
                              errorCode: e.nativeEvent.error,
                              timestamp: new Date().toISOString(),
                            });
                          }}
                        />
                      ) : (
                        // Video: mostrar thumbnail con overlay de play
                        <>
                          <Image
                            source={{ uri: item.thumbnailUrl || item.url }}
                            style={styles.image}
                            onError={() => {
                              console.error('❌ Error loading video thumbnail:', item.thumbnailUrl);
                            }}
                          />
                          <View style={styles.videoOverlay}>
                            <View style={styles.playButtonContainer}>
                              <MaterialCommunityIcons name="play" size={32} color="#5585b5" />
                            </View>
                          </View>
                          {item.duration && (
                            <View style={styles.videoDurationBadge}>
                              <Text style={styles.videoDurationText}>
                                {formatVideoDuration(item.duration)}
                              </Text>
                            </View>
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Botones Flotantes Header */}
                <View style={styles.floatingHeaderButtons}>
                  <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="chevron-back" size={24} color="#5585b5" />
                  </TouchableOpacity>
                </View>

                {/* Botón de Favoritos Flotante */}
                <Animated.View
                  style={[
                    styles.favoriteButton,
                    {
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={handleLike}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={28}
                      color={isLiked ? '#ef4444' : '#64748b'}
                    />
                  </TouchableOpacity>
                </Animated.View>

                {/* Pagination Badge */}
                <View style={styles.paginationBadge}>
                  <Text style={styles.paginationBadgeText}>
                    {currentImageIndex + 1}/{propertyMedia.length}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={[styles.imageContainer, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#cbd5e1', fontSize: 16 }}>No hay imágenes disponibles</Text>
            </View>
          )}

          {/* Image Diagnostics - Mostrar si hay errores */}
          {/*propertyImages.length > 0 && (
          <ImageDiagnostics
            imageUrls={propertyImages.map((img) => img.url)}
            propertyId={property.id}
          />
        )*/}

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Title, Price and Location - Main Info */}
            <View>
              <Text style={styles.title}>{property.title}</Text>

              <View style={styles.priceLocationRow}>

                <Text style={styles.price}>{formatPriceWithCurrency(property.price, property.currency || 'BOB')}</Text>
                {/* Ubicación Clickeable */}
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={(e) => handleOpenMap(property, e)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="map-marker-radius" size={16} color="#5585b5" />
                  <Text style={styles.location} numberOfLines={1}>
                    {property.address}, {property.city}
                  </Text>
                </TouchableOpacity>


              </View>

              <View style={styles.locationSeparator} />
            </View>

            {/* Contact Card */}
            <View style={styles.cardBlueLight}>
              <View style={styles.contactHeader}>
                {buildAvatarUrl(property.owner?.avatar) ? (
                  <Image
                    source={{ uri: buildAvatarUrl(property.owner?.avatar)! }}
                    style={styles.contactAvatarImage}
                    onError={() => {
                      console.error('❌ Avatar load error:', property.owner?.avatar);
                    }}
                  />
                ) : (
                  <Text style={styles.contactAvatar}>
                    {property.owner?.avatar || '👤'}
                  </Text>
                )}
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>
                    {property.owner?.firstName} {property.owner?.lastName}
                  </Text>
                  {property.owner?.phone && (
                    <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '500' }}>
                      {property.owner.phone}
                    </Text>
                  )}
                </View>
                <View style={styles.contactButtonsContainer}>
                  <TouchableOpacity
                    style={styles.contactMinimalButton}
                    onPress={handleContactWhatsApp}
                    activeOpacity={0.8}
                  >
                    <View style={styles.contactMinimalButtonWrapper}>
                      <MaterialCommunityIcons name="whatsapp" size={16} color="#ffffff" />
                      <Text style={styles.contactMinimalButtonText}>Contactar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.contactMinimalButton}
                    onPress={() => {
                      // Navigate to public profile - route will be created as profile/[userId].tsx
                      const href = `/profile/${property.owner?.id}` as any;
                      router.push(href);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.contactMinimalButtonWrapper}>
                      <MaterialCommunityIcons name="account" size={16} color="#ffffff" />
                      <Text style={styles.contactMinimalButtonText}>Perfil</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            {/* Features Card - Dinámicas basadas en specifications */}
            {property.specifications && Object.keys(property.specifications).length > 0 ? (
              <View style={styles.cardHeaderSection}>
                <View style={styles.sectionFeatures}>
                  <Text style={styles.sectionTitle}>Características</Text>
                  <View style={styles.featureGrid}>
                    {Object.entries(property.specifications).map(([key, value]) => {
                      // Obtener la configuración del campo desde el config
                      const config = PROPERTY_TYPES_CONFIG[property.propertyType];
                      const fieldConfig = config?.fields.find((f) => f.key === key);
                      const label = fieldConfig?.label || key;
                      const unit = fieldConfig?.unit || '';

                      // No renderizar si el valor es null, undefined o vacío
                      if (value === null || value === undefined || value === '') return null;

                      // Para booleanos
                      if (typeof value === 'boolean') {
                        return value ? (
                          <View key={key} style={styles.featureCard}>
                            <View>
                              <Text style={[styles.featureLabel, { color: '#5585b5' }]}>{label}</Text>
                            </View>
                          </View>
                        ) : null;
                      }

                      return (
                        <View key={key} style={styles.featureCard}>
                          <View>
                            <Text style={styles.featureValue}>
                              {typeof value === 'number' ? value.toFixed(0) : value}
                            </Text>
                            <Text style={styles.featureLabel}>
                              {unit ? `${label} (${unit})` : label}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            ) : (property.bedrooms !== undefined || property.bathrooms !== undefined || property.area !== undefined) ? (
              // Fallback a datos legacy si no hay specifications
              <View style={styles.cardHeaderSection}>
                <View style={styles.sectionFeatures}>
                  <Text style={styles.sectionTitle}>Características</Text>
                  <View style={styles.featureGrid}>
                    {property.bedrooms !== undefined && (
                      <View style={styles.featureCard}>
                        <MaterialCommunityIcons name="bed" size={20} color="#5585b5" />
                        <View>
                          <Text style={styles.featureValue}>{property.bedrooms}</Text>
                          <Text style={styles.featureLabel}>Dorm.</Text>
                        </View>
                      </View>
                    )}
                    {property.bathrooms !== undefined && (
                      <View style={styles.featureCard}>
                        <MaterialCommunityIcons name="shower" size={20} color="#5585b5" />
                        <View>
                          <Text style={styles.featureValue}>{property.bathrooms}</Text>
                          <Text style={styles.featureLabel}>Baños</Text>
                        </View>
                      </View>
                    )}
                    {property.area !== undefined && (
                      <View style={styles.featureCard}>
                        <MaterialCommunityIcons name="ruler-square" size={20} color="#5585b5" />
                        <View>
                          <Text style={styles.featureValue}>{property.area}</Text>
                          <Text style={styles.featureLabel}>m²</Text>
                        </View>
                      </View>
                    )}
                    {property.parking !== undefined && property.parking > 0 && (
                      <View style={styles.featureCard}>
                        <MaterialCommunityIcons name="car" size={20} color="#5585b5" />
                        <View>
                          <Text style={styles.featureValue}>{property.parking}</Text>
                          <Text style={styles.featureLabel}>Est.</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Description Card */}
            <View style={styles.cardWhite}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              {(() => {
                const { truncated, isTruncated } = truncateDescription(property.description, DESCRIPTION_LIMIT);
                return (
                  <>
                    <Text style={styles.descriptionTruncated}>{truncated}</Text>
                    {isTruncated && (
                      <TouchableOpacity
                        style={styles.showMoreButton}
                        onPress={() => setShowFullDescription(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.showMoreButtonText}>Mostrar más</Text>
                      </TouchableOpacity>
                    )}
                  </>
                );
              })()}
            </View>
            {/* Amenities Card - Ahora con etiquetas descriptivas */}
            {property.amenities && property.amenities.length > 0 && (
              <View style={styles.cardWhite}>
                <Text style={styles.sectionTitle}>Amenidades</Text>
                <View style={styles.amenitiesList}>
                  {property.amenities.map((amenityId: string, index: number) => {
                    // Obtener la etiqueta desde el config
                    const config = PROPERTY_TYPES_CONFIG[property.propertyType];
                    const amenityConfig = config?.amenities.find((a) => a.id === amenityId);
                    const amenityLabel = amenityConfig?.label || amenityId;

                    return (
                      <View key={index} style={styles.amenityTag}>
                        <MaterialCommunityIcons name="check" size={14} color="#5585b5" />
                        <Text style={styles.amenityText}>{amenityLabel}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}



          </View>
        </ScrollView>
      </View>
    </SafeAreaView >
  );
}

PropertyDetailScreen.options = {
  headerShown: false,

};
