import { useAuth } from '@/context/auth-context';
import { Property, useProperties } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { uploadService } from '@/services/upload-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
    modalOptionDelete: {
      color: '#dc2626',
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
    logoutButton: {
      backgroundColor: '#dc2626',
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
      marginHorizontal: horizontalPadding,
      marginBottom: 32,
      marginTop: 16,
    },
    logoutButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
  });
};

export default function ProfileScreen() {
  const { user, logout, token, updateUser } = useAuth();
  const { properties, loading, error, fetchUserProperties, deleteProperty } = useProperties();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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
  }; useEffect(() => {
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
            console.log('📥 Respuesta del perfil:', JSON.stringify(data, null, 2));

            // El endpoint puede devolver { user: {...} } o solo {...}
            const updatedUser = data.user || data;

            if (updatedUser && updatedUser.email) {
              await updateUser(updatedUser);
              console.log('✅ Usuario actualizado:', updatedUser.email);
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

  const handleEditProperty = (propertyId: string) => {
    // TODO: Implementar pantalla de edición
    Alert.alert('Info', 'La edición de propiedades estará disponible próximamente');
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

    return (
      <View key={property.id} style={styles.propertyCard}>
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
            ${property.price.toLocaleString()}
          </Text>
        </View>

        {/* Botón de opciones */}
        <TouchableOpacity
          style={styles.propertyOptionsButton}
          onPress={openOptionsModal}
        >
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#5585b5" />
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
              <Text style={styles.profileName}>
                {user?.firstName || 'Usuario'} {user?.lastName || ''}
              </Text>
              {user?.email && <Text style={styles.profileEmail}>{user?.email}</Text>}
              {user?.phone && <Text style={styles.profilePhone}>{user?.phone}</Text>}
            </View>
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

        {/* User Properties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Propiedades</Text>
            <Text style={styles.propertyCount}>({properties.length})</Text>
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
          ) : properties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 48 }}>📝</Text>
              <Text style={styles.emptyText}>No tienes propiedades publicadas</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {properties.map((property) => renderPropertyCard(property))}
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
}
