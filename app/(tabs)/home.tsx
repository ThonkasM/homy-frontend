import FiltersModal from '@/components/filters-modal';
import { EmptyState, ErrorMessage, LoadingFooter, LoadingState } from '@/components/home/feed-states';
import FilterButton from '@/components/home/filter-button';
import HomeHeader from '@/components/home/home-header';
import { createHomeStyles } from '@/components/home/home.styles';
import PropertyFeed from '@/components/home/property-feed';
import { formatPriceWithCurrency } from '@/config/currencies.config';
import { useAuth } from '@/context/auth-context';
import { Property, PropertyFilters, useProperties } from '@/hooks/use-properties';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';
import * as ExpoLinking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  Share,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { properties, loading, error, fetchProperties } = useProperties();
  const { hasSidebar } = useSidebarLayout();
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const flatListRef = useRef<FlatList | null>(null);
  const isLoadingMoreRef = useRef(false);

  // Estado completo de filtros avanzados
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 15,
  });

  // Filtros UI (para el modal)
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
  const styles = useMemo(() => createHomeStyles(width, hasSidebar), [width, hasSidebar]);
  const isMobile = width <= 1024;

  // Toggle de tipo de propiedad
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

  // Verificar si hay filtros activos
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
  }, []);

  const loadProperties = async () => {
    try {
      setCurrentPage(1);
      setHasMore(true);
      const response = await fetchProperties({ page: 1, limit: 4 });
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
      const filtersToUse = filters || advancedFilters;
      const activePropertyTypes = Object.keys(selectedPropertyTypes)
        .filter(key => selectedPropertyTypes[key]);

      const finalFilters: PropertyFilters = {
        ...filtersToUse,
        page: 1,
        limit: 3,
      };

      if (activePropertyTypes.length > 0) {
        finalFilters.propertyType = activePropertyTypes[0];
      }

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
    if (!hasMore || isLoadingMoreRef.current || loading) {
      return;
    }

    try {
      isLoadingMoreRef.current = true;
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const activePropertyTypes = Object.keys(selectedPropertyTypes)
        .filter(key => selectedPropertyTypes[key]);

      const finalFilters: PropertyFilters = {
        ...advancedFilters,
        page: nextPage,
        limit: 3,
      };

      if (activePropertyTypes.length > 0) {
        finalFilters.propertyType = activePropertyTypes[0];
      }

      const response = await fetchProperties(finalFilters);
      if (response && response.properties) {
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
  // Handlers
  // ========================================

  const handlePropertyPress = useCallback((propertyId: string) => {
    router.push(`/property-detail/${propertyId}`);
  }, [router]);

  const handleOpenMap = useCallback((property: Property, e: any) => {
    e.stopPropagation();
    try {
      const { latitude, longitude, title } = property;

      if (!latitude || !longitude) {
        Alert.alert('⚠️ Error', 'La propiedad no tiene coordenadas registradas');
        return;
      }

      let mapUrl = '';

      if (Platform.OS === 'ios') {
        mapUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
      } else {
        mapUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(title)})`;
      }

      Linking.openURL(mapUrl).catch((err) => {
        const fallbackUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(fallbackUrl).catch(() => {
          Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
        });
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    }
  }, []);

  const handleOpenWhatsApp = useCallback((property: Property, e: any) => {
    e.stopPropagation();
    try {
      if (!property.contactPhone) {
        Alert.alert('⚠️ Error', 'La propiedad no tiene teléfono de contacto');
        return;
      }

      const cleanPhone = property.contactPhone.replace(/\D/g, '');
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
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    }
  }, []);

  const handleShare = useCallback(async (property: Property, e: any) => {
    e.stopPropagation();
    try {
      const deepLink = ExpoLinking.createURL(`property-detail/${property.id}`);

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
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo compartir la propiedad');
    }
  }, []);

  // ========================================
  // Render functions
  // ========================================

  const renderFooter = useCallback(() => {
    return (
      <LoadingFooter
        loading={loadingMore}
        hasMore={hasMore}
        totalItems={allProperties.length}
      />
    );
  }, [loadingMore, hasMore, allProperties.length]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return <LoadingState />;
    }
    return <EmptyState />;
  }, [loading]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
      <View style={styles.container}>
        {/* Header */}
        <HomeHeader
          onSearchPress={() => router.push('/search')}
          isMobile={isMobile}
        />

        {/* Botón de Filtros */}
        <FilterButton
          onPress={() => setFilterModalVisible(true)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Modal de Filtros */}
        <FiltersModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filters={advancedFilters}
          onApplyFilters={handleApplyFilters}
          selectedPropertyTypes={selectedPropertyTypes}
          onTogglePropertyType={togglePropertyTypeFilter}
        />

        {/* Feed con PropertyFeed */}
        <PropertyFeed
          flatListRef={flatListRef}
          properties={allProperties}
          onPropertyPress={handlePropertyPress}
          onOpenMap={handleOpenMap}
          onOpenWhatsApp={handleOpenWhatsApp}
          onShare={handleShare}
          isMobile={isMobile}
          onEndReached={loadMoreProperties}
          renderFooter={renderFooter}
          renderEmpty={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#5585b5"
            />
          }
          ListHeaderComponent={error ? <ErrorMessage message={error} /> : null}
        />
      </View>
    </SafeAreaView>
  );
}
