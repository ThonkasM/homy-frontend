import { Property, useProperties } from '@/hooks/use-properties';
import { User, useUsers } from '@/hooks/use-users';
import { SERVER_BASE_URL } from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'properties' | 'users';

const createStyles = (width: number) => {
    const isWeb = width > 768;
    const isMobile = width <= 768;
    const maxWidth = isWeb ? 600 : '100%' as any;

    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        container: {
            flex: 1,
            width: '100%',
            maxWidth: maxWidth as any,
            alignSelf: 'center',
        },
        // Header con buscador
        headerContainer: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 16,
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
        },
        headerTop: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            gap: 12,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f1f5f9',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '800',
            color: '#5585b5',
            flex: 1,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            paddingHorizontal: 16,
            height: 48,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 15,
            color: '#0f172a',
            paddingVertical: 0,
        },
        clearButton: {
            padding: 4,
        },
        // Tabs
        tabsContainer: {
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            paddingHorizontal: 16,
        },
        tab: {
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: 'transparent',
        },
        tabActive: {
            borderBottomColor: '#5585b5',
        },
        tabText: {
            fontSize: 15,
            fontWeight: '600',
            color: '#64748b',
        },
        tabTextActive: {
            color: '#5585b5',
        },
        // Contenido
        contentContainer: {
            flex: 1,
            backgroundColor: '#f9fafb',
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
            textAlign: 'center',
            paddingHorizontal: 32,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 80,
        },
        // Tarjeta de propiedad (versión compacta)
        propertyCard: {
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            marginHorizontal: 16,
            marginVertical: 8,
            borderRadius: 12,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        },
        propertyImage: {
            width: 100,
            height: 100,
            backgroundColor: '#f1f5f9',
        },
        propertyInfo: {
            flex: 1,
            padding: 12,
            justifyContent: 'space-between',
        },
        propertyTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: 4,
        },
        propertyPrice: {
            fontSize: 18,
            fontWeight: '700',
            color: '#5585b5',
            marginBottom: 4,
        },
        propertyMeta: {
            fontSize: 13,
            color: '#64748b',
        },
        // Tarjeta de usuario
        userCard: {
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            marginHorizontal: 16,
            marginVertical: 8,
            padding: 16,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
            alignItems: 'center',
        },
        userAvatar: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#e2e8f0',
            marginRight: 16,
        },
        userAvatarText: {
            fontSize: 28,
            textAlign: 'center',
            lineHeight: 60,
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            fontSize: 17,
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: 4,
        },
        userEmail: {
            fontSize: 14,
            color: '#64748b',
            marginBottom: 8,
        },
        userStats: {
            flexDirection: 'row',
            gap: 16,
        },
        userStat: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        userStatText: {
            fontSize: 13,
            color: '#64748b',
            fontWeight: '500',
        },
        chevron: {
            marginLeft: 8,
        },
    });
};

export default function SearchScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const styles = React.useMemo(() => createStyles(width), [width]);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('properties');

    const { properties, loading: loadingProperties, fetchProperties } = useProperties();
    const { users, loading: loadingUsers, searchUsers } = useUsers();

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim()) return;

        if (activeTab === 'properties') {
            fetchProperties({ search: searchQuery, page: 1, limit: 20 });
        } else {
            searchUsers({ search: searchQuery, page: 1, limit: 20 });
        }
    }, [searchQuery, activeTab, fetchProperties, searchUsers]);

    // Auto-search cuando cambia el query (con debounce)
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, activeTab]);

    const handlePropertyPress = useCallback((propertyId: string) => {
        router.push(`/property-detail/${propertyId}`);
    }, [router]);

    const handleUserPress = useCallback((userId: string) => {
        router.push(`/profile/${userId}`);
    }, [router]);

    const buildImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    const renderPropertyItem = (property: Property) => {
        const imageUrl = buildImageUrl(property.images?.[0]?.url);

        return (
            <TouchableOpacity
                key={property.id}
                style={styles.propertyCard}
                onPress={() => handlePropertyPress(property.id)}
                activeOpacity={0.8}
            >
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.propertyImage} />
                ) : (
                    <View style={[styles.propertyImage, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 32 }}>🏠</Text>
                    </View>
                )}
                <View style={styles.propertyInfo}>
                    <Text style={styles.propertyTitle} numberOfLines={2}>
                        {property.title}
                    </Text>
                    <Text style={styles.propertyPrice}>
                        {property.currency || 'BOB'} {property.price.toLocaleString()}
                    </Text>
                    <Text style={styles.propertyMeta} numberOfLines={1}>
                        📍 {property.city} • {property.address}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderUserItem = (user: User) => {
        const avatarUrl = buildImageUrl(user.avatar);

        return (
            <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => handleUserPress(user.id)}
                activeOpacity={0.8}
            >
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.userAvatar} />
                ) : (
                    <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>👤</Text>
                    </View>
                )}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text style={styles.userEmail} numberOfLines={1}>
                        {user.email}
                    </Text>
                    <View style={styles.userStats}>
                        <View style={styles.userStat}>
                            <MaterialCommunityIcons name="home-variant" size={16} color="#64748b" />
                            <Text style={styles.userStatText}>{user.propertiesCount || 0} propiedades</Text>
                        </View>
                        {user.averageRating !== null && (
                            <View style={styles.userStat}>
                                <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
                                <Text style={styles.userStatText}>{user.averageRating?.toFixed(1)}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" style={styles.chevron} />
            </TouchableOpacity>
        );
    };

    const isLoading = activeTab === 'properties' ? loadingProperties : loadingUsers;
    const hasResults = activeTab === 'properties' ? properties.length > 0 : users.length > 0;
    const showEmpty = !isLoading && searchQuery.trim() && !hasResults;

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
            <View style={styles.container}>
                {/* Header con buscador */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#5585b5" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Buscar</Text>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={`Buscar ${activeTab === 'properties' ? 'propiedades' : 'usuarios'}...`}
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                            returnKeyType="search"
                            onSubmitEditing={handleSearch}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#64748b" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'properties' && styles.tabActive]}
                        onPress={() => setActiveTab('properties')}
                    >
                        <Text style={[styles.tabText, activeTab === 'properties' && styles.tabTextActive]}>
                            Propiedades
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'users' && styles.tabActive]}
                        onPress={() => setActiveTab('users')}
                    >
                        <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
                            Usuarios
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Contenido */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#5585b5" />
                            <Text style={styles.emptyText}>Buscando...</Text>
                        </View>
                    ) : !searchQuery.trim() ? (
                        <View style={styles.emptyContainer}>
                            <Text style={{ fontSize: 64 }}>🔍</Text>
                            <Text style={styles.emptyText}>
                                Escribe algo para buscar {activeTab === 'properties' ? 'propiedades' : 'usuarios'}
                            </Text>
                        </View>
                    ) : showEmpty ? (
                        <View style={styles.emptyContainer}>
                            <Text style={{ fontSize: 64 }}>🤷‍♂️</Text>
                            <Text style={styles.emptyText}>
                                No se encontraron resultados para "{searchQuery}"
                            </Text>
                        </View>
                    ) : (
                        <>
                            {activeTab === 'properties'
                                ? properties.map(renderPropertyItem)
                                : users.map(renderUserItem)}
                            <View style={{ height: 20 }} />
                        </>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
