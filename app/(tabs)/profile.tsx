import { formatPriceWithCurrency } from '@/config/currencies.config';
import { useAuth } from '@/context/auth-context';
import { useFavoritesContext } from '@/context/favorites-context';
import { Property, useProperties } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { uploadService } from '@/services/upload-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const createStyles = (width: number) => {
  const isWeb = width > 768;
  const isMobile = width < 768;
  const cardWidth = isWeb ? '23%' : isMobile ? '48%' : '31%';
  const horizontalPadding = isWeb ? 40 : 24;

  return StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      width: '100%',
      maxWidth: isWeb ? 1200 : '100%' as any,
    },
    profileHeader: {
      backgroundColor: '#5585b5',
      paddingHorizontal: 24,
      paddingVertical: 32,
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    profileHeaderTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 0,
      gap: 16,
    },
    profileAvatar: {
      fontSize: 45,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: 80,
      position: 'relative',
    },
    profileAvatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    avatarContainer: {
      position: 'relative',
    },
    avatarEditBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#ffffff',
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#5585b5',
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    profileName: {
      fontSize: 24,
      fontWeight: '900',
      color: '#ffffff',
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    profileEmail: {
      fontSize: 13,
      color: '#d0d7ff',
      fontWeight: '500',
      marginBottom: 3,
    },
    profilePhone: {
      fontSize: 13,
      color: '#d0d7ff',
      fontWeight: '500',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: '#ffffff',
      marginTop: -16,
      marginHorizontal: 16,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    statCard: {
      flex: 1,
      backgroundColor: '#f8f9ff',
      borderRadius: 12,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#e8ecff',
    },
    statValue: {
      fontSize: 22,
      fontWeight: '900',
      color: '#5585b5',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: '#64748b',
      fontWeight: '600',
      textAlign: 'center',
    },
    statRating: {
      fontSize: 11,
      color: '#f59e0b',
      marginTop: 2,
    },
    section: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#5585b5',
    },
    propertyCount: {
      fontSize: 14,
      color: '#64748b',
      marginLeft: 8,
    },
    errorContainer: {
      backgroundColor: '#fee2e2',
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#ef4444',
    },
    errorText: {
      color: '#991b1b',
      fontSize: 13,
      fontWeight: '500',
    },
    gridContainer: {
      paddingHorizontal: 1,
      paddingVertical: 1,
    },
    propertyCard: {
      width: '100%',
      marginVertical: 8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    propertyImageContainer: {
      height: 80,
      width: 80,
      borderRadius: 8,
      marginRight: 16,
      overflow: 'hidden',
      backgroundColor: '#f1f5f9',
    },
    propertyImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f1f5f9',
    },
    propertyInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    propertyTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: 6,
    },
    propertyPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    propertyPrice: {
      fontSize: 16,
      fontWeight: '800',
      color: '#5585b5',
    },
    propertyOptionsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 12,
    },
    imageOverlay: {
      display: 'none',
    },
    propertyOverlayContent: {
      display: 'none',
    },
    propertyMeta: {
      fontSize: 12,
      color: '#64748b',
      fontWeight: '400',
    },
    actionButtons: {
      display: 'none',
    },
    editButton: {
      display: 'none',
    },
    deleteButton: {
      display: 'none',
    },
    buttonText: {
      display: 'none',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    modalOption: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalOptionLast: {
      borderBottomWidth: 0,
    },
    modalOptionText: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 12,
    },
    modalOptionEdit: {
      color: '#5585b5',
    },
    modalOptionArchive: {
      color: '#f59e0b',
    },
    modalOptionDelete: {
      color: '#dc2626',
    },
    // ============================================
    // TABS STYLES
    // ============================================
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      gap: 8,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: '#f1f5f9',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
    },
    tabButtonActive: {
      backgroundColor: '#5585b5',
    },
    tabText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#64748b',
    },
    tabTextActive: {
      color: '#ffffff',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: '#64748b',
      marginTop: 12,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // ============================================
    // MENU MODAL STYLES
    // ============================================
    menuModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    menuModalContent: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
      gap: 0,
    },
    menuModalHeader: {
      fontSize: 18,
      fontWeight: '700',
      color: '#5585b5',
      marginBottom: 20,
      textAlign: 'center',
    },
    menuOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      gap: 12,
      marginBottom: 8,
    },
    menuOptionText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#475569',
      flex: 1,
    },
    menuOptionLogout: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
    },
    menuOptionLogoutText: {
      color: '#dc2626',
      fontWeight: '700',
    },
    menuCloseButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 12,
    },
    menuCloseButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#64748b',
    },
    hamburgerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    bioCardSection: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    bioLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#5585b5',
      marginBottom: 8,
    },
    bioText: {
      fontSize: 15,
      color: '#475569',
      lineHeight: 24,
      fontWeight: '400',
    },
    emptyBioText: {
      fontSize: 15,
      color: '#94a3b8',
      fontStyle: 'italic',
    },
    // ============================================
    // EDIT PROFILE MODAL STYLES
    // ============================================
    editProfileModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    editProfileModalContent: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
    },
    editProfileModalHeader: {
      fontSize: 18,
      fontWeight: '700',
      color: '#5585b5',
      marginBottom: 20,
    },
    editProfileLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#475569',
      marginBottom: 8,
      marginTop: 16,
    },
    editProfileInput: {
      borderWidth: 1,
      borderColor: '#cbd5e1',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 15,
      color: '#0f172a',
      marginBottom: 16,
      backgroundColor: '#f8fafc',
    },
    editProfileInputMultiline: {
      borderWidth: 1,
      borderColor: '#cbd5e1',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 15,
      color: '#0f172a',
      marginBottom: 16,
      backgroundColor: '#f8fafc',
      minHeight: 100,
      textAlignVertical: 'top',
    },
    editProfileButtonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    editProfileButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editProfileButtonSave: {
      backgroundColor: '#5585b5',
    },
    editProfileButtonCancel: {
      backgroundColor: '#e2e8f0',
    },
    editProfileButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    editProfileButtonTextSave: {
      color: '#ffffff',
    },
    editProfileButtonTextCancel: {
      color: '#64748b',
    },
  });
};

export default function ProfileScreen() {
  const { user, logout, token, updateUser, isGuest } = useAuth();
  const { properties, loading, error, fetchUserProperties, deleteProperty, archiveProperty } = useProperties();
  const { favorites, fetchFavorites, removeFavorite } = useFavoritesContext();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'favorites'>('properties');
  const [showMenu, setShowMenu] = useState(false);
  const [editingBio, setEditingBio] = useState(user?.bio || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const alertShownRef = useRef(false);

  // Proteger ruta si es invitado - Usar useFocusEffect para que se ejecute cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      if (isGuest && !alertShownRef.current) {
        alertShownRef.current = true;
        Alert.alert(
          'Acceso Restringido',
          'Debes iniciar sesión para acceder a tu perfil',
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
    }, [isGuest, router])
  );

  const buildAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) {
      console.log('[buildAvatarUrl] Avatar path is empty or undefined');
      return null;
    }

    if (avatarPath.startsWith('http')) {
      console.log('[buildAvatarUrl] Avatar is already a full URL:', avatarPath);
      return avatarPath;
    }

    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    const fullUrl = `${SERVER_BASE_URL}${cleanPath}`;
    console.log('[buildAvatarUrl] Built avatar URL:', {
      originalPath: avatarPath,
      cleanPath,
      fullUrl,
      SERVER_BASE_URL,
    });
    return fullUrl;
  };

  useEffect(() => {
    // Cargar favoritos cuando se cambia a la tab de favoritos
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab, fetchFavorites]);

  useEffect(() => {
    loadUserProperties();
    // Si viene del crear post, hacer refresh automático
    if (searchParams.refresh === 'true') {
      handleRefresh();
    }
  }, []);

  const loadUserProperties = async () => {
    try {
      await fetchUserProperties({ page: 1, limit: 20 });
    } catch (err) {
      console.error('Error loading user properties:', err);
    }
  };

  const pickAndUploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingAvatar(true);

        if (!token) {
          throw new Error('No hay sesión activa');
        }

        console.log('📤 Subiendo nuevo avatar...');
        const uploadResponse = await uploadService.uploadAvatar(result.assets[0].uri, token);
        console.log('✅ Avatar subido exitosamente');

        // Actualizar el usuario en el contexto
        await updateUser({
          ...uploadResponse.user,
          role: user?.role || 'user',
          createdAt: user?.createdAt || new Date().toISOString(),
        });

        Alert.alert('Éxito', 'Foto de perfil actualizada');
      }
    } catch (err: any) {
      console.error('Error al actualizar avatar:', err.message);
      Alert.alert('Error', 'No pudimos actualizar tu foto de perfil: ' + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  }; const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Recargar usuario del contexto (incluye avatar actualizado)
      if (user && token) {
        try {
          const response = await fetch(`${SERVER_BASE_URL}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();

            // El backend devuelve { data: {...}, success: true, timestamp: "..." }
            const updatedUser = data.data || data.user || data;

            if (updatedUser && updatedUser.email) {
              await updateUser(updatedUser);
            } else {
              console.warn('⚠️ Respuesta incompleta del perfil:', data);
            }
          } else {
            console.error('❌ Error HTTP:', response.status);
          }
        } catch (err) {
          console.error('Error reloading user:', err);
        }
      }

      // Recargar propiedades
      await loadUserProperties();
      console.log('✅ Perfil actualizado completamente');
    } catch (err) {
      console.error('Error refreshing profile:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteProperty = (propertyId: string, title: string) => {
    Alert.alert(
      'Eliminar Propiedad',
      `¿Estás seguro de que deseas eliminar "${title}"?`,
      [
        { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              Alert.alert('Éxito', 'Propiedad eliminada exitosamente');
              await loadUserProperties();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo eliminar la propiedad');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleArchiveProperty = (propertyId: string, title: string) => {
    Alert.alert(
      'Archivar Propiedad',
      `¿Deseas archivar "${title}"? No será visible públicamente.`,
      [
        { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
        {
          text: 'Archivar',
          onPress: async () => {
            try {
              await archiveProperty(propertyId);
              Alert.alert('Éxito', 'Propiedad archivada exitosamente');
              await loadUserProperties();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo archivar la propiedad');
            }
          },
          style: 'default',
        },
      ]
    );
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/edit-property/${propertyId}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditProfilePress = () => {
    router.push('/edit-profile');
    setShowMenu(false);
  };

  const handleViewPublicProfile = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUpdatingProfile(true);

      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${SERVER_BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: editingBio,
        }),
      });

      if (!response.ok) {
        throw new Error('Error actualizando perfil');
      }

      const data = await response.json();

      const updatedUser = data.data || data.user || data;
      if (updatedUser && updatedUser.email) {
        await updateUser(updatedUser);
        Alert.alert('Éxito', 'Tu perfil ha sido actualizado');
        setShowEditProfileModal(false);
      }
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err);
      Alert.alert('Error', err.message || 'No pudimos actualizar tu perfil');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const renderPropertyCard = (property: Property) => {
    const imageUrl = property.images?.[0]?.url;
    const buildImageUrl = (imagePath: string | undefined) => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${SERVER_BASE_URL}${cleanPath}`;
    };
    const fullImageUrl = buildImageUrl(imageUrl);

    const handleImageError = (e: any) => {
      const errorMsg = e.nativeEvent.error;
      console.error('[ProfileScreen] 🖼️ Image load error:', {
        propertyId: property.id,
        propertyTitle: property.title,
        imageUrl: fullImageUrl,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      });
    };

    const openOptionsModal = () => {
      setSelectedProperty(property);
      setModalVisible(true);
    };

    const handleViewProperty = () => {
      router.push(`/property-detail/${property.id}`);
    };

    return (
      <TouchableOpacity
        key={property.id}
        style={styles.propertyCard}
        onPress={handleViewProperty}
        activeOpacity={0.8}
      >
        {/* Imagen */}
        <View style={styles.propertyImageContainer}>
          {fullImageUrl ? (
            <Image
              source={{ uri: fullImageUrl }}
              style={styles.propertyImage}
              onError={handleImageError}
            />
          ) : (
            <View style={[styles.propertyImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#cbd5e1', fontSize: 16 }}>📷</Text>
            </View>
          )}
        </View>

        {/* Información */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.title}
          </Text>
          <Text style={styles.propertyPrice}>
            {formatPriceWithCurrency(property.price, property.currency || 'BOB')}
          </Text>
        </View>

        {/* Botón de opciones */}
        <TouchableOpacity
          style={styles.propertyOptionsButton}
          onPress={(e) => {
            e.stopPropagation();
            openOptionsModal();
          }}
        >
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#5585b5" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderFavoriteCard = (favorite: any) => {
    const property = favorite.property;
    const imageUrl = property.images?.[0]?.url;
    const buildImageUrl = (imagePath: string | undefined) => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${SERVER_BASE_URL}${cleanPath}`;
    };
    const fullImageUrl = buildImageUrl(imageUrl);

    const handleRemoveFavorite = async () => {
      try {
        await removeFavorite(property.id);
        Alert.alert('Éxito', 'Removido de favoritos');
      } catch (err) {
        Alert.alert('Error', 'No pudimos remover de favoritos');
      }
    };

    const handleViewProperty = () => {
      router.push(`/property-detail/${property.id}`);
    };

    return (
      <View key={favorite.id} style={styles.propertyCard}>
        {/* Imagen */}
        <View style={styles.propertyImageContainer}>
          {fullImageUrl ? (
            <Image
              source={{ uri: fullImageUrl }}
              style={styles.propertyImage}
              onError={() => {
                console.error('[FavoriteCard] Image load error:', fullImageUrl);
              }}
            />
          ) : (
            <View style={[styles.propertyImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#cbd5e1', fontSize: 16 }}>📷</Text>
            </View>
          )}
        </View>

        {/* Información */}
        <View style={styles.propertyInfo}>
          <TouchableOpacity onPress={handleViewProperty}>
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.propertyPrice}>
              {formatPriceWithCurrency(property.price, property.currency || 'BOB')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón Remover de Favoritos */}
        <TouchableOpacity
          style={[styles.propertyOptionsButton]}
          onPress={handleRemoveFavorite}
        >
          <MaterialCommunityIcons name="heart" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#5585b5"
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderTop}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={pickAndUploadAvatar}
              disabled={uploadingAvatar}
            >
              {user?.avatar ? (
                buildAvatarUrl(user.avatar) ? (
                  <Image
                    key={`${user.avatar}`}
                    source={{ uri: buildAvatarUrl(user.avatar)! }}
                    style={styles.profileAvatarImage}
                    onError={(e) => {
                      console.error('❌ Avatar Image load error:', {
                        originalAvatar: user?.avatar,
                        builtUrl: buildAvatarUrl(user.avatar),
                        error: e.nativeEvent.error,
                      });
                    }}
                    onLoad={() => {
                      console.log('✅ Avatar Image loaded successfully:', buildAvatarUrl(user.avatar));
                    }}
                  />
                ) : (
                  <Text style={styles.profileAvatar}>{user.avatar}</Text>
                )
              ) : (
                <Text style={styles.profileAvatar}>👤</Text>
              )}
              <View style={styles.avatarEditBadge}>
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color="#5585b5" />
                ) : (
                  <MaterialCommunityIcons name="camera" size={16} color="#5585b5" />
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={handleViewPublicProfile} activeOpacity={0.7}>
                <Text style={styles.profileName}>
                  {user?.firstName || 'Usuario'} {user?.lastName || ''}
                </Text>
              </TouchableOpacity>
              {user?.email && <Text style={styles.profileEmail}>{user?.email}</Text>}
              {user?.phone && <Text style={styles.profilePhone}>{user?.phone}</Text>}
            </View>
            {/* Menu Hamburguesa Button */}
            <TouchableOpacity
              style={styles.hamburgerButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <MaterialCommunityIcons name="menu" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{properties.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0.0</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Bio Section */}
        {user && (
          <View style={styles.bioCardSection}>
            <Text style={styles.bioLabel}>Acerca de mí</Text>
            <Text style={user.bio ? styles.bioText : styles.emptyBioText}>
              {user.bio || 'Cuéntanos sobre ti añadiendo una biografía desde el menú'}
            </Text>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'properties' && styles.tabButtonActive]}
            onPress={() => setActiveTab('properties')}
          >
            <MaterialCommunityIcons
              name="home"
              size={16}
              color={activeTab === 'properties' ? '#ffffff' : '#64748b'}
            />
            <Text style={[styles.tabText, activeTab === 'properties' && styles.tabTextActive]}>
              Mis Propiedades
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'favorites' && styles.tabButtonActive]}
            onPress={() => setActiveTab('favorites')}
          >
            <MaterialCommunityIcons
              name="heart"
              size={16}
              color={activeTab === 'favorites' ? '#ffffff' : '#64748b'}
            />
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
              Favoritos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Based on Active Tab */}
        {activeTab === 'properties' ? (
          // MIS PROPIEDADES TAB
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Propiedades</Text>
              <Text style={styles.propertyCount}>({properties.filter(p => p.postStatus === 'PUBLISHED').length})</Text>
            </View>

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
            ) : properties.filter(p => p.postStatus === 'PUBLISHED').length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 48 }}>📝</Text>
                <Text style={styles.emptyText}>No tienes propiedades publicadas</Text>
              </View>
            ) : (
              <View style={styles.gridContainer}>
                {properties.filter(p => p.postStatus === 'PUBLISHED').map((property) => renderPropertyCard(property))}
              </View>
            )}
          </View>
        ) : (
          // FAVORITOS TAB
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favoritos</Text>
              <Text style={styles.propertyCount}>({favorites.length})</Text>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Loading State */}
            {loading && favorites.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5585b5" />
                <Text style={styles.emptyText}>Cargando favoritos...</Text>
              </View>
            ) : favorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 48 }}>💔</Text>
                <Text style={styles.emptyText}>No tienes favoritos aún</Text>
              </View>
            ) : (
              <View style={styles.gridContainer}>
                {favorites.map((favorite) => renderFavoriteCard(favorite))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de opciones */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Opción Editar */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                if (selectedProperty) {
                  setModalVisible(false);
                  handleEditProperty(selectedProperty.id);
                }
              }}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#5585b5" />
              <Text style={[styles.modalOptionText, styles.modalOptionEdit]}>Editar</Text>
            </TouchableOpacity>

            {/* Opción Archivar */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                if (selectedProperty) {
                  setModalVisible(false);
                  handleArchiveProperty(selectedProperty.id, selectedProperty.title);
                }
              }}
            >
              <MaterialCommunityIcons name="archive" size={24} color="#f59e0b" />
              <Text style={[styles.modalOptionText, styles.modalOptionArchive]}>Archivar</Text>
            </TouchableOpacity>

            {/* Opción Eliminar */}
            <TouchableOpacity
              style={[styles.modalOption, styles.modalOptionLast]}
              onPress={() => {
                if (selectedProperty) {
                  setModalVisible(false);
                  handleDeleteProperty(selectedProperty.id, selectedProperty.title);
                }
              }}
            >
              <MaterialCommunityIcons name="trash-can" size={24} color="#dc2626" />
              <Text style={[styles.modalOptionText, styles.modalOptionDelete]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Menu Modal - Bottom Sheet */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.menuModalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuModalContent}>
            <Text style={styles.menuModalHeader}>Menú</Text>

            {/* Borradores */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                router.push('/drafts');
                setShowMenu(false);
              }}
            >
              <MaterialCommunityIcons name="file-document" size={20} color="#f59e0b" />
              <Text style={styles.menuOptionText}>Borradores</Text>
            </TouchableOpacity>

            {/* Archivados */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                router.push('/archived');
                setShowMenu(false);
              }}
            >
              <MaterialCommunityIcons name="archive" size={20} color="#8b5cf6" />
              <Text style={styles.menuOptionText}>Archivados</Text>
            </TouchableOpacity>

            {/* Editar Perfil */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={handleEditProfilePress}
            >
              <MaterialCommunityIcons name="account-edit" size={20} color="#5585b5" />
              <Text style={styles.menuOptionText}>Editar Perfil</Text>
            </TouchableOpacity>

            {/* Cerrar Sesión */}
            <TouchableOpacity
              style={[styles.menuOption, styles.menuOptionLogout]}
              onPress={() => {
                setShowMenu(false);
                handleLogout();
              }}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#dc2626" />
              <Text style={[styles.menuOptionText, styles.menuOptionLogoutText]}>Cerrar Sesión</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
