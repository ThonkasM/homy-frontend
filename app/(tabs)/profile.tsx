import { useAuth } from '@/context/auth-context';
import { Property, useProperties } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    propertyCard: {
      width: '100%',
      marginVertical: 12,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    propertyImageContainer: {
      height: 300,
      position: 'relative',
      width: '100%',
      backgroundColor: '#f1f5f9',
    },
    propertyImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f1f5f9',
    },
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
    propertyOverlayContent: {
      justifyContent: 'flex-end',
    },
    propertyPrice: {
      fontSize: 28,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    propertyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: 6,
      lineHeight: 22,
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    propertyMeta: {
      fontSize: 13,
      color: '#e2e8f0',
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    editButton: {
      flex: 1,
      backgroundColor: '#5585b5',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    deleteButton: {
      flex: 1,
      backgroundColor: '#dc2626',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
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
  const { user, logout } = useAuth();
  const { properties, loading, error, fetchUserProperties, deleteProperty } = useProperties();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserProperties();
      console.log('✅ Perfil actualizado');
    } catch (err) {
      console.error('Error refreshing properties:', err);
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

    return (
      <View key={property.id} style={styles.propertyCard}>
        <View style={styles.propertyImageContainer}>
          {fullImageUrl ? (
            <Image
              source={{ uri: fullImageUrl }}
              style={styles.propertyImage}
              onError={handleImageError}
            />
          ) : (
            <View style={[styles.propertyImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#cbd5e1', fontSize: 16 }}>📷 Sin imagen</Text>
            </View>
          )}

          <View style={styles.imageOverlay}>
            <View style={styles.propertyOverlayContent}>
              <Text style={styles.propertyPrice}>
                ${property.price.toLocaleString()}
              </Text>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {property.title}
              </Text>
              <Text style={styles.propertyMeta} numberOfLines={1}>
                📍 {property.address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProperty(property.id)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProperty(property.id, property.title)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
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
            <Text style={styles.profileAvatar}>{user?.avatar || '👤'}</Text>
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
    </SafeAreaView>
  );
}
