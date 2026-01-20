import { formatPriceWithCurrency } from '@/config/currencies.config';
import { useAuth } from '@/context/auth-context';
import { useFavoritesContext } from '@/context/favorites-context';
import { Property, useProperties } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ExpoLinking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente separado para la tarjeta de propiedad con animación
const PropertyCard = ({
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const imageUrl = property.images?.[0]?.url;
  const iconSize = isMobile ? 16 : 20;

  const handleHeartPress = (propertyId: string, e: any) => {
    e.stopPropagation();

    // Animación de escala y rebote
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
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

    onLike(propertyId, e);
  };

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
              {
                transform: [{ scale: scaleAnim }],
              },
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
};

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
      marginBottom: 12,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#e2e8f0',
      paddingHorizontal: 16,
      height: 44,
    },
    searchIcon: {
      fontSize: 16,
      marginRight: 8,
      color: '#64748b',
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: '#0f172a',
      paddingVertical: 0,
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
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      gap: 8,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#5585b5',
    },
    filterBadge: {
      marginLeft: 'auto',
      backgroundColor: '#ef4444',
      borderRadius: 12,
      minWidth: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterBadgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      paddingTop: 0,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1f2937',
    },
    filtersList: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    filterItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#e5e7eb',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    filterItemLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: '#1f2937',
    },
    colorIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    filterActionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: '#f3f4f6',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    filterActionButtonPrimary: {
      backgroundColor: '#5585b5',
      borderColor: '#5585b5',
    },
    filterActionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#64748b',
    },
    filterActionButtonPrimaryText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
    },
  });
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { properties, loading, error, fetchProperties } = useProperties();
  const { favorites, fetchFavorites, addFavorite, removeFavorite } = useFavoritesContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({
    HOUSE: true,
    APARTMENT: true,
    OFFICE: true,
    LAND: true,
    COMMERCIAL: true,
    WAREHOUSE: true,
    ROOM: true,
  });
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const isMobile = width <= 768;

  const propertyTypes = [
    { type: 'HOUSE', label: 'Casa' },
    { type: 'APARTMENT', label: 'Departamento' },
    { type: 'OFFICE', label: 'Oficina' },
    { type: 'LAND', label: 'Terreno' },
    { type: 'COMMERCIAL', label: 'Comercial' },
    { type: 'WAREHOUSE', label: 'Almacén' },
    { type: 'ROOM', label: 'Habitación' },
  ];

  // Create a Set of favorite property IDs for quick lookup
  const likedProperties = new Set(
    favorites.map((fav) => fav.propertyId)
  );

  // Funciones de filtrado
  const toggleFilter = (propertyType: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [propertyType]: !prev[propertyType]
    }));
  };

  const selectAllFilters = () => {
    const allSelected: { [key: string]: boolean } = {};
    propertyTypes.forEach(pt => {
      allSelected[pt.type] = true;
    });
    setSelectedFilters(allSelected);
  };

  const clearAllFilters = () => {
    const allCleared: { [key: string]: boolean } = {};
    propertyTypes.forEach(pt => {
      allCleared[pt.type] = false;
    });
    setSelectedFilters(allCleared);
  };

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  // Filtrar propiedades según búsqueda y filtros de tipo
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilters[property.propertyType.toUpperCase()];
    return matchesSearch && matchesFilter;
  });

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
      await fetchProperties({ page: 1, limit: 20 });
    } catch (err) {
      console.error('Error loading properties:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProperties();
    } catch (err) {
      console.error('Error refreshing properties:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Función para obtener el color del filtro según tipo de propiedad
  const getFilterButtonColor = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
      case 'HOUSE':
        return '#5585b5'; // Azul
      case 'APARTMENT':
        return '#10b981'; // Verde
      case 'OFFICE':
        return '#f97316'; // Naranja
      case 'LAND':
        return '#f59e0b'; // Ámbar
      case 'COMMERCIAL':
        return '#8b5cf6'; // Púrpura
      case 'WAREHOUSE':
        return '#6366f1'; // Índigo
      case 'ROOM':
        return '#ec4899'; // Rosa
      default:
        return '#5585b5'; // Azul por defecto
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property-detail/${propertyId}`);
  };

  const handleLike = async (propertyId: string, e: any) => {
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
  };

  // 🗺️ Abre selector nativo de apps de mapas
  const handleOpenMap = (property: Property, e: any) => {
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
  };

  // 💬 Abre WhatsApp con el número del contacto
  const handleOpenWhatsApp = (property: Property, e: any) => {
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
  };

  // 📤 Comparte la publicación con deep link
  const handleShare = async (property: Property, e: any) => {
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
  };

  const buildImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  };

  const renderPropertyCard = (property: Property) => {
    const isLiked = likedProperties.has(property.id);

    return (
      <PropertyCard
        property={property}
        styles={styles}
        isLiked={isLiked}
        onPropertyPress={handlePropertyPress}
        onLike={handleLike}
        onOpenMap={handleOpenMap}
        onOpenWhatsApp={handleOpenWhatsApp}
        onShare={handleShare}
        userAvatar={property.owner?.avatar}
        userName={`${property.owner?.firstName} ${property.owner?.lastName}`}
        isMobile={isMobile}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/logos/NormalLogo.jpeg')}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar propiedades..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Botón de Filtros */}
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="#5585b5" />
            <Text style={styles.filterButtonText}>Filtros</Text>
            {activeFilterCount < propertyTypes.length && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Modal de Filtros */}
        <Modal
          visible={filterModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtrar por tipo</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1f2937" />
                </TouchableOpacity>
              </View>

              {/* Lista de filtros */}
              <ScrollView style={styles.filtersList}>
                {propertyTypes.map((pt) => (
                  <TouchableOpacity
                    key={pt.type}
                    style={styles.filterItemContainer}
                    onPress={() => toggleFilter(pt.type)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedFilters[pt.type] && {
                          backgroundColor: getFilterButtonColor(pt.type),
                          borderColor: getFilterButtonColor(pt.type),
                        }
                      ]}
                    >
                      {selectedFilters[pt.type] && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      )}
                    </View>
                    <Text style={styles.filterItemLabel}>{pt.label}</Text>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: getFilterButtonColor(pt.type) }
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botones de acción */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.filterActionButton}
                  onPress={clearAllFilters}
                >
                  <Text style={styles.filterActionButtonText}>Limpiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterActionButton, styles.filterActionButtonPrimary]}
                  onPress={selectAllFilters}
                >
                  <Text style={styles.filterActionButtonPrimaryText}>Seleccionar Todo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Feed tipo Instagram */}
        <ScrollView
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#5585b5"
            />
          }
        >
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Loading State */}
          {loading && properties.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5585b5" />
              <Text style={styles.emptyText}>Cargando propiedades...</Text>
            </View>
          ) : properties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 64 }}>🏠</Text>
              <Text style={styles.emptyText}>No hay propiedades disponibles</Text>
            </View>
          ) : filteredProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 64 }}>🔍</Text>
              <Text style={styles.emptyText}>No hay propiedades que coincidan con los filtros</Text>
            </View>
          ) : (
            <View style={{ width: '100%', alignItems: 'center', paddingVertical: 8 }}>
              {filteredProperties.map((property) => (
                <View key={property.id}>
                  {renderPropertyCard(property)}
                </View>
              ))}
              {/* Espaciador al final */}
              <View style={{ height: 20 }} />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
