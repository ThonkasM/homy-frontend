import BioSection from '@/components/profile/bio-section';
import FavoritesGrid from '@/components/profile/favorites-grid';
import MenuModal from '@/components/profile/menu-modal';
import OptionsModal from '@/components/profile/options-modal';
import ProfileHeader from '@/components/profile/profile-header';
import ProfilePropertiesGrid from '@/components/profile/profile-properties-grid';
import StatsSection from '@/components/profile/stats-section';
import TabBar from '@/components/profile/tab-bar';
import { useAuth } from '@/context/auth-context';
import { useFavoritesContext } from '@/context/favorites-context';
import { Property, useProperties } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { uploadService } from '@/services/upload-service';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'properties' | 'favorites';

const createStyles = () => {
  return StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
      width: '100%',
    },
    section: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 24,
      width: '100%',
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
  });
};

export default function ProfileScreen() {
  const { user, logout, token, updateUser, isGuest } = useAuth();
  const { properties, loading, error, fetchUserProperties, deleteProperty, archiveProperty } = useProperties();
  const { favorites, fetchFavorites, removeFavorite } = useFavoritesContext();
  const styles = createStyles();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('properties');
  const [showMenu, setShowMenu] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const alertShownRef = useRef(false);

  // Proteger ruta si es invitado
  useFocusEffect(
    useCallback(() => {
      if (isGuest && !alertShownRef.current) {
        alertShownRef.current = true;

        if (Platform.OS === 'web') {
          const shouldLogin = window.confirm('Debes iniciar sesión para acceder a tu perfil. ¿Deseas ir a iniciar sesión?');
          if (shouldLogin) {
            router.push('/login');
          } else {
            alertShownRef.current = false;
            router.back();
          }
        } else {
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
      }
    }, [isGuest, router])
  );

  const buildAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab, fetchFavorites]);

  useEffect(() => {
    loadUserProperties();
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

        const uploadResponse = await uploadService.uploadAvatar(result.assets[0].uri, token);
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
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (user && token) {
        try {
          const response = await fetch(`${SERVER_BASE_URL}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            const updatedUser = data.data || data.user || data;
            if (updatedUser && updatedUser.email) {
              await updateUser(updatedUser);
            }
          }
        } catch (err) {
          console.error('Error reloading user:', err);
        }
      }
      await loadUserProperties();
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
        { text: 'Cancelar', style: 'cancel' },
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
        { text: 'Cancelar', style: 'cancel' },
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
        },
      ]
    );
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/edit-property/${propertyId}`);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const shouldLogout = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (shouldLogout) {
        logout().then(() => {
          router.replace('/welcome');
        });
      }
    } else {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Cerrar Sesión',
            onPress: async () => {
              await logout();
              router.replace('/welcome');
            },
            style: 'destructive',
          },
        ]
      );
    }
  };

  const handleViewPublicProfile = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await removeFavorite(propertyId);
      Alert.alert('Éxito', 'Removido de favoritos');
    } catch (err) {
      Alert.alert('Error', 'No pudimos remover de favoritos');
    }
  };

  const publishedProperties = properties.filter(p => p.postStatus === 'PUBLISHED');

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
        <ProfileHeader
          user={user}
          uploadingAvatar={uploadingAvatar}
          onAvatarPress={pickAndUploadAvatar}
          onMenuPress={() => setShowMenu(!showMenu)}
          onNamePress={handleViewPublicProfile}
          buildAvatarUrl={buildAvatarUrl}
        />

        {/* Stats Section */}
        <StatsSection propertiesCount={properties.length} />

        {/* Bio Section */}
        {user && <BioSection bio={user.bio} />}

        {/* Tabs */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Based on Active Tab */}
        {activeTab === 'properties' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Propiedades</Text>
              <Text style={styles.propertyCount}>({publishedProperties.length})</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {loading && properties.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5585b5" />
                <Text style={styles.emptyText}>Cargando propiedades...</Text>
              </View>
            ) : publishedProperties.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 48 }}>📝</Text>
                <Text style={styles.emptyText}>No tienes propiedades publicadas</Text>
              </View>
            ) : (
              <ProfilePropertiesGrid
                properties={publishedProperties}
                onPropertyPress={(property) => router.push(`/property-detail/${property.id}`)}
                onOptionsPress={(property) => {
                  setSelectedProperty(property);
                  setModalVisible(true);
                }}
              />
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favoritos</Text>
              <Text style={styles.propertyCount}>({favorites.length})</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

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
              <FavoritesGrid
                favorites={favorites}
                onFavoritePress={(propertyId) => router.push(`/property-detail/${propertyId}`)}
                onRemoveFavorite={handleRemoveFavorite}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Options Modal */}
      <OptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEdit={() => {
          if (selectedProperty) {
            setModalVisible(false);
            handleEditProperty(selectedProperty.id);
          }
        }}
        onArchive={() => {
          if (selectedProperty) {
            setModalVisible(false);
            handleArchiveProperty(selectedProperty.id, selectedProperty.title);
          }
        }}
        onDelete={() => {
          if (selectedProperty) {
            setModalVisible(false);
            handleDeleteProperty(selectedProperty.id, selectedProperty.title);
          }
        }}
      />

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onDrafts={() => {
          router.push('/drafts');
          setShowMenu(false);
        }}
        onArchived={() => {
          router.push('/archived');
          setShowMenu(false);
        }}
        onEditProfile={() => {
          router.push('/edit-profile');
          setShowMenu(false);
        }}
        onLogout={() => {
          setShowMenu(false);
          handleLogout();
        }}
      />
    </SafeAreaView>
  );
}
