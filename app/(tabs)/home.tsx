import FiltersModal from '@/components/filters-modal';
import { formatPriceWithCurrency } from '@/config/currencies.config';
import { useAuth } from '@/context/auth-context';
import { useFavoritesContext } from '@/context/favorites-context';
import { Property, PropertyFilters, useProperties } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ExpoLinking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente separado para la tarjeta de propiedad con animación (Memoizado para evitar re-renders)
const PropertyCard = React.memo(({
  property,
  styles,
  isLiked,
  onPropertyPress,
  onLike,
  onOpenMap,
  onOpenWhatsApp,
  onShare,
  userAvatar,
  userName,
  isMobile,
}: {
  property: Property;
  styles: any;
  isLiked: boolean;
  onPropertyPress: (id: string) => void;
  onLike: (id: string, e: any) => void;
  onOpenMap: (p: Property, e: any) => void;
  onOpenWhatsApp: (p: Property, e: any) => void;
  onShare: (p: Property, e: any) => void;
  userAvatar?: string;
  userName?: string;
  isMobile: boolean;
}) => {
  // Usar Reanimated (mejor rendimiento en Samsung)
  const scale = useSharedValue(1);
  const imageUrl = property.images?.[0]?.url;
  const iconSize = isMobile ? 16 : 20;

  const handleHeartPress = (propertyId: string, e: any) => {
    e.stopPropagation();

    // Animación de escala y rebote con Reanimated (optimizado para Samsung)
    scale.value = withSpring(1.2, { damping: 10, stiffness: 100 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    });

    onLike(propertyId, e);
  };

  // Estilo animado con Reanimated
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const buildImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  };

  const buildAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  };

  const fullImageUrl = buildImageUrl(imageUrl);
  const fullAvatarUrl = buildAvatarUrl(userAvatar);

  return (
    <View key={property.id} style={styles.propertyCard}>
      {/* Imagen - Clickeable */}
      <TouchableOpacity
        style={styles.propertyImageContainer}
        onPress={() => onPropertyPress(property.id)}
        activeOpacity={0.9}
      >
        {fullImageUrl ? (
          <Image
            source={{ uri: fullImageUrl }}
            style={styles.propertyImage}
            onError={(e) => {
              console.error('❌ Image load error:', {
                url: fullImageUrl,
                error: e.nativeEvent.error,
              });
            }}
          />
        ) : (
          <View style={[styles.propertyImage, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 48 }}>🏠</Text>
          </View>
        )}

        {/* Overlay con información superpuesta */}
        <View style={styles.imageOverlay}>
          {/* Usuario info en la esquina superior izquierda */}
          {(userAvatar || userName) && (
            <View style={styles.userInfoOverlay}>
              {fullAvatarUrl ? (
                <Image
                  source={{ uri: fullAvatarUrl }}
                  style={styles.userAvatarImage}
                  onError={() => {
                    console.error('❌ Avatar load error:', fullAvatarUrl);
                  }}
                />
              ) : userAvatar ? (
                <Text style={styles.userAvatarEmoji}>{userAvatar}</Text>
              ) : (
                <Text style={styles.userAvatarEmoji}>👤</Text>
              )}
              {userName && <Text style={styles.userName} numberOfLines={1}>{userName}</Text>}
            </View>
          )}

          {/* Botón de corazón con animación */}
          <Animated.View
            style={[
              styles.heartButton,
              animatedStyle,
            ]}
          >
            <TouchableOpacity
              onPress={(e) => handleHeartPress(property.id, e)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? '#ef4444' : '#64748b'}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Información superpuesta */}
          <View style={styles.propertyOverlayContent}>
            <Text style={styles.propertyPrice}>
              {formatPriceWithCurrency(property.price, property.currency || 'BOB')}
            </Text>
            <Text numberOfLines={2} style={styles.propertyTitle}>
              {property.title}
            </Text>
            <Text style={styles.propertyMeta}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#fffff" /> {property.city} • {property.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Botones de acción - 3 botones: Mapa, WhatsApp, Compartir */}
      <View style={styles.actionButtons}>
        {/* Botón Ubicación */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonMapStyle]}
          onPress={(e) => onOpenMap(property, e)}
        >
          <MaterialCommunityIcons name="map-marker-radius" size={iconSize} color="#ffffff" />
          <Text style={styles.actionButtonText}>Ubicación</Text>
        </Pressable>

        {/* Botón Consultar */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonChatStyle]}
          onPress={(e) => onOpenWhatsApp(property, e)}
        >
          <MaterialCommunityIcons name="message-text-outline" size={iconSize} color="#ffffff" />
          <Text style={styles.actionButtonText}>Consultar</Text>
        </Pressable>

        {/* Botón Compartir */}
        <Pressable
          style={[styles.actionButton, styles.actionButtonShareStyle]}
          onPress={(e) => onShare(property, e)}
        >
          <MaterialCommunityIcons name="share-all" size={iconSize} color="#ffffff" />
          <Text style={styles.actionButtonText}>Compartir</Text>
        </Pressable>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.isMobile === nextProps.isMobile
  );
});

const createStyles = (width: number) => {
  const isWeb = width > 768;
  const isMobile = width <= 768;
  const maxWidth = isWeb ? 600 : '100%' as any;
  const cardWidth = isMobile ? Dimensions.get('window').width - 16 : Math.min(width * 0.9, 600);

  return StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      width: '100%',
      maxWidth: maxWidth as any,
      alignSelf: 'center',
    },
    // Header - Minimal y elegante
    headerContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      width: '100%',
      maxWidth: maxWidth as any,
      alignSelf: 'center',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: '#5585b5',
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    headerLogo: {
      height: 40,
      width: 120,
    },
    searchButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#f1f5f9',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    // Feed estilo Instagram
    feedContainer: {
      flex: 1,
      width: '100%',
      maxWidth: maxWidth as any,
      alignSelf: 'center',
      backgroundColor: '#f9fafb',
      paddingVertical: isMobile ? 12 : 16,
    },
    // Tarjeta de propiedad - Full width, tipo story
    propertyCard: {
      width: cardWidth,
      marginVertical: isMobile ? 12 : 16,
      marginHorizontal: 'auto',
      borderRadius: isMobile ? 16 : 20,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isMobile ? 0.08 : 0.15,
      shadowRadius: isMobile ? 4 : 12,
      elevation: isMobile ? 3 : 6,
      ...(!isMobile && {
        borderWidth: 1,
        borderColor: '#e2e8f0',
      }),
    },
    propertyImageContainer: {
      height: isMobile ? 400 : 350,
      position: 'relative',
      width: '100%',
      backgroundColor: '#f1f5f9',
    },
    propertyImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f1f5f9',
    },
    // Overlay gradient en la imagen
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    // Información superpuesta sobre la imagen (estilo Instagram)
    propertyOverlayContent: {
      justifyContent: 'flex-end',
    },
    propertyPrice: {
      fontSize: 32,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    propertyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: 6,
      lineHeight: 24,
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    propertyMeta: {
      fontSize: 14,
      color: '#e2e8f0',
      fontWeight: '500',
    },
    // Contenedor de info debajo (opcional, para móvil)
    propertyContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#f1f5f9',
    },
    propertyType: {
      fontSize: 12,
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
      alignSelf: 'flex-start',
      fontWeight: '600',
    },
    propertyDescription: {
      fontSize: 13,
      color: '#475569',
      marginTop: 8,
      lineHeight: 18,
    },
    // Usuario info sobre la imagen
    userInfoOverlay: {
      position: 'absolute',
      top: 16,
      left: 16,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    userAvatar: {
      fontSize: 24,
      marginRight: 8,
    },
    userAvatarImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
      backgroundColor: '#e2e8f0',
    },
    userAvatarEmoji: {
      fontSize: 20,
      marginRight: 8,
    },
    userName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#0f172a',
    },
    // Estados de carga y error
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
    },
    emptyText: {
      fontSize: 16,
      color: '#64748b',
      marginTop: 16,
      fontWeight: '500',
    },
    errorContainer: {
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
      padding: 14,
      backgroundColor: '#fee2e2',
      borderRadius: 10,
      borderLeftWidth: 4,
      borderLeftColor: '#ef4444',
    },
    errorText: {
      fontSize: 14,
      color: '#991b1b',
      fontWeight: '500',
    },
    // Badges sobre la imagen
    badgeContainer: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    badge: {
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    badgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    heartButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: isMobile ? 12 : 16,
      paddingVertical: isMobile ? 12 : 20,
      gap: isMobile ? 8 : 12,
      justifyContent: 'space-between',
      backgroundColor: '#ffffff',
      borderTopWidth: 2,
      borderTopColor: '#f3f4f6',
    },
    actionButton: {
      flex: 1,
      paddingVertical: isMobile ? 10 : 14,
      paddingHorizontal: isMobile ? 8 : 12,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      gap: isMobile ? 4 : 8,
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    actionButtonMapStyle: {
      backgroundColor: '#5585b5',
    },
    actionButtonChatStyle: {
      backgroundColor: '#53a8b6',
    },
    actionButtonShareStyle: {
      backgroundColor: '#79c2d0',
    },
    actionButtonText: {
      fontSize: isMobile ? 11 : 13,
      fontWeight: '600',
      textAlign: 'center',
      color: '#ffffff',
      letterSpacing: 0.3,
      marginLeft: isMobile ? 2 : 4,
    },
    // Filtros styles
    filterButtonContainer: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    filterButton: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      borderWidth: 1.5,
      borderColor: '#5585b5',
      gap: 8,
      shadowColor: '#5585b5',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    filterButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#5585b5',
      letterSpacing: 0.3,
    },
    filterBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 12,
      height: 12,
      backgroundColor: '#ef4444',
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  });
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { properties, loading, error, fetchProperties } = useProperties();
  const { favorites, fetchFavorites, addFavorite, removeFavorite } = useFavoritesContext();
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const isLoadingMoreRef = useRef(false); // Evitar llamadas duplicadas

  // Estado completo de filtros avanzados
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 3, // Carga inicial más rápida
  });

  // Filtros UI (para el modal) - Inicialmente sin filtros
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<{ [key: string]: boolean }>({
    HOUSE: false,
    APARTMENT: false,
    OFFICE: false,
    LAND: false,
    COMMERCIAL: false,
    WAREHOUSE: false,
    ROOM: false,
  });

  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width), [width]);
  const isMobile = width <= 768;

  // Create a Set of favorite property IDs for quick lookup (memoizado)
  const likedProperties = useMemo(
    () => new Set(favorites.map((fav) => fav.propertyId)),
    [favorites]
  );

  // Función para toggle de tipo de propiedad
  const togglePropertyTypeFilter = (propertyType: string) => {
    setSelectedPropertyTypes(prev => ({
      ...prev,
      [propertyType]: !prev[propertyType]
    }));
  };

  // Aplicar filtros desde el modal
  const handleApplyFilters = async (newFilters: PropertyFilters) => {
    setAdvancedFilters(newFilters);
    setFilterModalVisible(false);
    await loadPropertiesWithFilters(newFilters);
  };

  // Verificar si hay filtros activos (para mostrar badge rojo)
  const hasActiveFilters = useMemo(() => {
    const hasPropertyTypes = Object.values(selectedPropertyTypes).some(Boolean);
    const hasOtherFilters =
      advancedFilters.operationType ||
      advancedFilters.currency ||
      advancedFilters.minPrice ||
      advancedFilters.maxPrice ||
      advancedFilters.dormitorios_min ||
      advancedFilters.baños_min ||
      advancedFilters.city ||
      advancedFilters.sortBy;
    return hasPropertyTypes || Boolean(hasOtherFilters);
  }, [selectedPropertyTypes, advancedFilters]);



  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);



  const loadFavorites = async () => {
    try {
      await fetchFavorites();
    } catch (err) {
      console.error('[HomeScreen] Error cargando favoritos:', err);
    }
  };

  const loadProperties = async () => {
    try {
      setCurrentPage(1);
      setHasMore(true);
      const response = await fetchProperties({ page: 1, limit: 3 });
      if (response) {
        setAllProperties(response.properties);
        setHasMore(response.pagination.page < response.pagination.pages);
      }
    } catch (err) {
      console.error('Error loading properties:', err);
    }
  };

  const loadPropertiesWithFilters = async (filters?: PropertyFilters) => {
    try {
      // Usar filtros pasados como parámetro o los del estado
      const filtersToUse = filters || advancedFilters;

      // Construir filtros para enviar al backend
      const activePropertyTypes = Object.keys(selectedPropertyTypes)
        .filter(key => selectedPropertyTypes[key]);

      const finalFilters: PropertyFilters = {
        ...filtersToUse,
        page: 1,
        limit: 3,
      };

      // Solo agregar propertyType si hay algún tipo seleccionado
      if (activePropertyTypes.length > 0) {
        finalFilters.propertyType = activePropertyTypes[0]; // Por ahora solo el primero
      }

      console.log('[HomeScreen] Filtros a enviar:', JSON.stringify(finalFilters, null, 2));

      setCurrentPage(1);
      setHasMore(true);
      const response = await fetchProperties(finalFilters);
      if (response) {
        setAllProperties(response.properties);
        setHasMore(response.pagination.page < response.pagination.pages);
      }
    } catch (err) {
      console.error('Error loading properties with filters:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPropertiesWithFilters();
    } catch (err) {
      console.error('Error refreshing properties:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreProperties = useCallback(async () => {
    // Protección contra llamadas duplicadas
    if (!hasMore || isLoadingMoreRef.current || loading) {
      return;
    }

    try {
      isLoadingMoreRef.current = true;
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      // Construir filtros para la siguiente página
      const activePropertyTypes = Object.keys(selectedPropertyTypes)
        .filter(key => selectedPropertyTypes[key]);

      const finalFilters: PropertyFilters = {
        ...advancedFilters,
        page: nextPage,
        limit: 3, // Scroll infinito: cargas más pequeñas y frecuentes
      };

      if (activePropertyTypes.length > 0) {
        finalFilters.propertyType = activePropertyTypes[0];
      }

      console.log('[HomeScreen] Cargando página:', nextPage);

      const response = await fetchProperties(finalFilters);
      if (response && response.properties) {
        // Deduplicar: solo agregar propiedades que no existan ya
        setAllProperties(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProperties = response.properties.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProperties];
        });
        setCurrentPage(nextPage);
        setHasMore(response.pagination.page < response.pagination.pages);
      }
    } catch (err) {
      console.error('Error loading more properties:', err);
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [hasMore, loading, currentPage, selectedPropertyTypes, advancedFilters, fetchProperties]);

  // ========================================
  // Handlers (declarados ANTES de renderItem)
  // ========================================

  const handlePropertyPress = useCallback((propertyId: string) => {
    router.push(`/property-detail/${propertyId}`);
  }, [router]);

  const handleLike = useCallback(async (propertyId: string, e: any) => {
    e.stopPropagation();

    if (isGuest) {
      Alert.alert(
        'Acceso Restringido',
        'Debes iniciar sesión para guardar favoritos',
        [
          { text: 'Iniciar Sesión', onPress: () => router.push('/login') },
          { text: 'Cancelar', onPress: () => { } }
        ]
      );
      return;
    }

    try {
      if (likedProperties.has(propertyId)) {
        // Remove from favorites
        await removeFavorite(propertyId);
      } else {
        // Add to favorites
        await addFavorite(propertyId);
      }
    } catch (err: any) {
      console.error('[HomeScreen] Error al actualizar favoritos:', err);

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
  }, [isGuest, likedProperties, removeFavorite, addFavorite, router]);

  // 🗺️ Abre selector nativo de apps de mapas
  const handleOpenMap = useCallback((property: Property, e: any) => {
    e.stopPropagation();
    try {
      const { latitude, longitude, title } = property;

      if (!latitude || !longitude) {
        Alert.alert('⚠️ Error', 'La propiedad no tiene coordenadas registradas');
        return;
      }

      // URL universal que dispara el selector de apps
      // geo: funciona en Android (muestra selector automático)
      // http:// funciona en iOS (permite competencia de apps)
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

  // 💬 Abre WhatsApp con el número del contacto
  const handleOpenWhatsApp = useCallback((property: Property, e: any) => {
    e.stopPropagation();
    try {
      if (!property.contactPhone) {
        Alert.alert('⚠️ Error', 'La propiedad no tiene teléfono de contacto');
        return;
      }

      // Limpia el número (solo dígitos)
      const cleanPhone = property.contactPhone.replace(/\D/g, '');

      // Si no tiene código de país (+), agrega +591 (Bolivia)
      let phoneWithCode = cleanPhone;
      if (!cleanPhone.startsWith('591')) {
        phoneWithCode = `591${cleanPhone}`;
      }

      const message = encodeURIComponent(`Hola, estoy interesado en la propiedad: "${property.title}". ¿Podrías darme más información?`);
      const whatsappUrl = `whatsapp://send?phone=${phoneWithCode}&text=${message}`;

      Linking.openURL(whatsappUrl).catch(() => {
        Alert.alert('⚠️ Error', 'WhatsApp no está instalado en tu dispositivo');
      });
    } catch (error) {
      console.error('Error abriendo WhatsApp:', error);
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    }
  }, []);

  // 📤 Comparte la publicación con deep link
  const handleShare = useCallback(async (property: Property, e: any) => {
    e.stopPropagation();
    try {
      // Genera el deep link usando ExpoLinking.createURL()
      // En desarrollo con Expo Go: exp://192.168.x.x:8081/--/property-detail/123
      // En producción: homi://property-detail/123
      const deepLink = ExpoLinking.createURL(`property-detail/${property.id}`);

      console.log('📤 Deep link generado:', deepLink);

      // Mensaje para compartir con formato mejorado
      const shareMessage = `🏠 Mira esta propiedad en Homi:

*${property.title}*
${formatPriceWithCurrency(property.price, property.currency || 'BOB')}
📍 ${property.city} - ${property.address}

${deepLink}`;

      const result = await Share.share({
        message: shareMessage,
        title: `Compartir: ${property.title}`,
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Compartido exitosamente');
      } else if (result.action === Share.dismissedAction) {
        console.log('❌ Share cancelado');
      }
    } catch (error: any) {
      console.error('Error compartiendo:', error);
      Alert.alert('Error', 'No se pudo compartir la propiedad');
    }
  }, []);

  const buildImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  };

  // ========================================
  // Render functions para FlatList
  // ========================================

  // keyExtractor optimizado para FlatList
  const keyExtractor = useCallback((item: Property) => item.id, []);

  // renderItem optimizado para FlatList
  const renderItem = useCallback(({ item }: { item: Property }) => {
    const isLiked = likedProperties.has(item.id);
    return (
      <PropertyCard
        property={item}
        styles={styles}
        isLiked={isLiked}
        onPropertyPress={handlePropertyPress}
        onLike={handleLike}
        onOpenMap={handleOpenMap}
        onOpenWhatsApp={handleOpenWhatsApp}
        onShare={handleShare}
        userAvatar={item.owner?.avatar}
        userName={`${item.owner?.firstName} ${item.owner?.lastName}`}
        isMobile={isMobile}
      />
    );
  }, [likedProperties, styles, handlePropertyPress, handleLike, handleOpenMap, handleOpenWhatsApp, handleShare, isMobile]);

  // Footer component para FlatList
  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#5585b5" />
        </View>
      );
    }
    if (!hasMore && allProperties.length > 0) {
      return (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>No hay más propiedades</Text>
        </View>
      );
    }
    return <View style={{ height: 20 }} />;
  }, [loadingMore, hasMore, allProperties.length]);

  // Empty component para FlatList
  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5585b5" />
          <Text style={styles.emptyText}>Cargando propiedades...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 64 }}>🏠</Text>
        <Text style={styles.emptyText}>No hay propiedades disponibles</Text>
      </View>
    );
  }, [loading, styles]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Image
              source={require('@/assets/logos/NormalLogo.jpeg')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search" size={24} color="#5585b5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de Filtros con badge rojo simple */}
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="#5585b5" />
            <Text style={styles.filterButtonText}>Filtros</Text>
            {hasActiveFilters && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        </View>

        {/* Modal de Filtros */}
        <FiltersModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filters={advancedFilters}
          onApplyFilters={handleApplyFilters}
          selectedPropertyTypes={selectedPropertyTypes}
          onTogglePropertyType={togglePropertyTypeFilter}
        />

        {/* Feed tipo Instagram con FlatList (virtualizado) */}
        <FlatList
          ref={flatListRef}
          data={allProperties}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingVertical: isMobile ? 12 : 16, alignItems: 'center' }}
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          // Scroll infinito optimizado
          onEndReached={loadMoreProperties}
          onEndReachedThreshold={0.5} // Cargar cuando estés al 50% del final
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          // Optimizaciones de performance para scroll suave
          removeClippedSubviews={Platform.OS === 'android'} // Solo Android
          maxToRenderPerBatch={2} // Renderizar de a 2 en vez de 3
          updateCellsBatchingPeriod={100} // Más tiempo entre updates = menos jank
          windowSize={3} // Solo 3 pantallas en memoria (reducido de 5)
          initialNumToRender={3} // Renderizar exactamente los 3 items iniciales
          // Pull to refresh
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#5585b5"
            />
          }
          // Header con mensajes de error
          ListHeaderComponent={
            error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
