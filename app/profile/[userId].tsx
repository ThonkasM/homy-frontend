import { apiService, SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
    propertiesCount: number;
    reviewsCount: number;
    averageRating: number;
}

interface Property {
    id: string;
    title: string;
    price: number;
    images?: Array<{ id: string; url: string }>;
    propertyType: string;
    city: string;
    address: string;
}

interface PropertiesResponse {
    properties: Property[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    user: {
        id: string;
        name: string;
        avatar?: string;
    };
}

const createStyles = (screenWidth: number) => {
    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        statusBar: {
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            width: '100%',
            backgroundColor: '#ffffff',
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#5585b5',
            marginLeft: 12,
            flex: 1,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            backgroundColor: '#ffffff',
        },
        errorText: {
            fontSize: 16,
            color: '#ef4444',
            textAlign: 'center',
            marginBottom: 20,
        },
        retryButton: {
            backgroundColor: '#5585b5',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
        },
        retryButtonText: {
            color: '#ffffff',
            fontWeight: '600',
        },
        // Profile Header
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
        profileAvatarImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.4)',
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
        // Grid
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
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
        },
        emptyText: {
            fontSize: 16,
            color: '#64748b',
            textAlign: 'center',
            marginTop: 12,
        },
        loadingText: {
            fontSize: 14,
            color: '#64748b',
            marginTop: 12,
        },
        paginationContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            gap: 8,
        },
        paginationButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: '#f0f4ff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e0e7ff',
        },
        paginationButtonActive: {
            backgroundColor: '#38598b',
            borderColor: '#38598b',
        },
        paginationButtonText: {
            fontSize: 12,
            color: '#38598b',
            fontWeight: '600',
        },
        paginationButtonTextActive: {
            color: '#ffffff',
        },
    });
};

export default function PublicProfileScreen() {
    const { width } = useWindowDimensions();
    const styles = createStyles(width);
    const router = useRouter();
    const { userId } = useLocalSearchParams() as { userId: string };

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        loadProfile();
        loadProperties(1);
    }, [userId]);

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

    const loadProfile = async () => {
        try {
            const profile = await apiService.getUserPublicProfile(userId);
            setUserProfile(profile);
        } catch (err: any) {
            console.error('Error loading profile:', err);
            setError('No se pudo cargar el perfil del usuario');
        }
    };

    const loadProperties = async (page: number) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response: PropertiesResponse = await apiService.getUserPublicProperties(
                userId,
                page,
                ITEMS_PER_PAGE
            );

            if (page === 1) {
                setProperties(response.properties);
            } else {
                setProperties((prev) => [...prev, ...response.properties]);
            }

            setTotalPages(response.pagination.pages);
            setCurrentPage(page);
        } catch (err: any) {
            console.error('Error loading properties:', err);
            if (page === 1) {
                setError('No se pudieron cargar las propiedades');
            } else {
                Alert.alert('Error', 'No se pudieron cargar más propiedades');
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handlePropertyPress = (propertyId: string) => {
        router.push(`/property-detail/${propertyId}`);
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loadingMore) {
            loadProperties(currentPage + 1);
        }
    };

    const getImageUrl = (property: Property): string => {
        const imageUrl = property.images?.[0]?.url;
        if (!imageUrl) {
            return 'https://via.placeholder.com/300x300?text=Sin+imagen';
        }
        return imageUrl.startsWith('http') ? imageUrl : `${SERVER_BASE_URL}${imageUrl}`;
    };

    if (loading && properties.length === 0) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
                <View style={styles.headerBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#5585b5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Perfil</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5585b5" />
                    <Text style={styles.loadingText}>Cargando perfil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && !userProfile) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
                <View style={styles.headerBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#5585b5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Perfil</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            loadProfile();
                            loadProperties(1);
                        }}
                    >
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />

            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="#5585b5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* Profile Header Section */}
                {userProfile && (
                    <View style={styles.profileHeader}>
                        <View style={styles.profileHeaderTop}>
                            {userProfile.avatar ? (
                                buildAvatarUrl(userProfile.avatar) ? (
                                    <Image
                                        source={{ uri: buildAvatarUrl(userProfile.avatar)! }}
                                        style={styles.profileAvatarImage}
                                        onError={(e) => {
                                            console.error('❌ Avatar load error:', {
                                                originalAvatar: userProfile.avatar,
                                                builtUrl: buildAvatarUrl(userProfile.avatar),
                                                error: e.nativeEvent.error,
                                            });
                                        }}
                                        onLoad={() => {
                                            console.log('✅ Avatar loaded successfully:', buildAvatarUrl(userProfile.avatar));
                                        }}
                                    />
                                ) : (
                                    <Text style={styles.profileAvatar}>{userProfile.avatar}</Text>
                                )
                            ) : (
                                <Text style={styles.profileAvatar}>👤</Text>
                            )}
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>
                                    {userProfile.firstName} {userProfile.lastName}
                                </Text>
                                {userProfile.email && <Text style={styles.profileEmail}>{userProfile.email}</Text>}
                                {userProfile.phone && <Text style={styles.profilePhone}>{userProfile.phone}</Text>}
                            </View>
                        </View>
                    </View>
                )}

                {/* Stats Section */}
                {userProfile && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{userProfile.propertiesCount}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{userProfile.reviewsCount}</Text>
                            <Text style={styles.statLabel}>Reseñas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {userProfile.averageRating != null ? userProfile.averageRating.toFixed(1) : '0.0'}
                            </Text>
                            <Text style={styles.statLabel}>Rating</Text>
                            {userProfile.averageRating != null && userProfile.averageRating > 0 && (
                                <Text style={styles.statRating}>⭐ {userProfile.averageRating.toFixed(1)}/5</Text>
                            )}
                        </View>
                    </View>
                )}

                {/* Properties List */}
                {properties.length > 0 ? (
                    <View style={styles.gridContainer}>
                        <FlatList
                            data={properties}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.propertyCard}
                                    onPress={() => handlePropertyPress(item.id)}
                                    activeOpacity={0.95}
                                >
                                    <View style={styles.propertyImageContainer}>
                                        <Image
                                            source={{ uri: getImageUrl(item) }}
                                            style={styles.propertyImage}
                                        />
                                        <View style={styles.imageOverlay}>
                                            <View style={styles.propertyOverlayContent}>
                                                <Text style={styles.propertyPrice}>
                                                    ${item.price.toLocaleString()}
                                                </Text>
                                                <Text style={styles.propertyTitle} numberOfLines={1}>
                                                    {item.title}
                                                </Text>
                                                <Text style={styles.propertyMeta} numberOfLines={1}>
                                                    📍 {item.address}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <View style={styles.paginationContainer}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <TouchableOpacity
                                        key={page}
                                        style={[
                                            styles.paginationButton,
                                            currentPage === page && styles.paginationButtonActive,
                                        ]}
                                        onPress={() => {
                                            if (page !== currentPage) {
                                                setProperties([]);
                                                loadProperties(page);
                                            }
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.paginationButtonText,
                                                currentPage === page && styles.paginationButtonTextActive,
                                            ]}
                                        >
                                            {page}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                ) : !loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={{ fontSize: 48 }}>🏠</Text>
                        <Text style={styles.emptyText}>Este usuario aún no tiene propiedades publicadas</Text>
                    </View>
                ) : null}

                {loadingMore && (
                    <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#5585b5" />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
