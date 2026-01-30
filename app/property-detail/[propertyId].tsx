import AmenitiesCard from '@/components/property-detail/amenities-card';
import ContactCard from '@/components/property-detail/contact-card';
import DescriptionCard from '@/components/property-detail/description-card';
import DescriptionModal from '@/components/property-detail/description-modal';
import ErrorState from '@/components/property-detail/error-state';
import FeaturesSection from '@/components/property-detail/features-section';
import FloatingHeaderButtons from '@/components/property-detail/floating-header-buttons';
import FullscreenModal from '@/components/property-detail/fullscreen-modal';
import ImageCarousel, { PropertyMedia } from '@/components/property-detail/image-carousel';
import LoadingState from '@/components/property-detail/loading-state';
import PropertyHeader from '@/components/property-detail/property-header';
import { formatPriceWithCurrency } from '@/config/currencies.config';
import { useFavoritesContext } from '@/context/favorites-context';
import { Property } from '@/hooks/use-properties';
import { apiService, SERVER_BASE_URL } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Linking, Platform, ScrollView, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const createStyles = (screenWidth: number) => {
    const isMobile = screenWidth <= 768;
    const isWeb = Platform.OS === 'web';

    const carouselHeight = isMobile ? 300 : 450;
    const contentPadding = isMobile ? 16 : 24;

    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        scrollContainer: {
            flex: 1,
        },
        imageCarousel: {
            width: '100%',
            height: carouselHeight,
            backgroundColor: '#f8fafc',
        },
        carouselWrapper: {
            position: 'relative',
            width: '100%',
        },
        contentContainer: {
            paddingHorizontal: contentPadding,
            paddingVertical: 20,
            width: '100%',
            gap: 16,
            ...(isWeb && {
                maxWidth: 1200,
                alignSelf: 'center',
            }),
        },
    });
};

export default function PropertyDetailScreen() {
    const { width } = useWindowDimensions();
    const styles = useMemo(() => createStyles(width), [width]);
    const router = useRouter();
    const { propertyId } = useLocalSearchParams() as { propertyId: string };

    // REFS
    const scrollViewRef = useRef<ScrollView>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // CONTEXT
    const { favorites, fetchFavorites, addFavorite, removeFavorite } = useFavoritesContext();

    // STATE
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Derived state
    const isLiked = favorites.some(fav => fav.propertyId === propertyId);

    // Build media array
    const propertyMedia: PropertyMedia[] = useMemo(() => {
        if (!property?.images) return [];

        return (property.images || []).map((img: any) => {
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
                type: img.type || 'IMAGE',
                url: finalUrl,
                thumbnailUrl: finalThumbnailUrl,
                duration: img.duration,
                order: img.order || 0,
            };
        });
    }, [property?.images]);

    // CALLBACKS
    const handleCloseFullscreenModal = useCallback(() => {
        if (fullscreenImageIndex !== null) {
            setCurrentImageIndex(fullscreenImageIndex);
            const scrollPosition = fullscreenImageIndex * width;
            scrollViewRef.current?.scrollTo({
                x: scrollPosition,
                animated: false,
            });
        }
        setFullscreenImageIndex(null);
    }, [fullscreenImageIndex, width]);

    const handleLike = useCallback(async () => {
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
                await removeFavorite(propertyId);
            } else {
                await addFavorite(propertyId);
            }
        } catch (err: any) {
            console.error('[PropertyDetail] Error al actualizar favoritos:', err);

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
    }, [isLiked, propertyId, removeFavorite, addFavorite, scaleAnim]);

    const handleScroll = useCallback((event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentImageIndex(currentIndex);
    }, [width]);

    const buildAvatarUrl = useCallback((avatarPath: string | undefined) => {
        if (!avatarPath) return null;
        if (avatarPath.startsWith('http')) return avatarPath;
        const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    }, []);

    const handleContactWhatsApp = useCallback(async () => {
        if (!property?.owner?.phone) {
            Alert.alert('Error', 'No hay número de teléfono disponible');
            return;
        }

        const phoneNumber = property.owner.phone.replace(/[^\d+]/g, '');
        const whatsappUrl = Platform.OS === 'web'
            ? `https://web.whatsapp.com/send?phone=${phoneNumber}`
            : `whatsapp://send?phone=${phoneNumber}`;

        try {
            const canOpen = await Linking.canOpenURL(whatsappUrl);
            if (canOpen) {
                await Linking.openURL(whatsappUrl);
            } else {
                Alert.alert(
                    'WhatsApp no disponible',
                    '¿Deseas llamar al propietario?',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                            text: 'Llamar',
                            onPress: async () => {
                                const callUrl = `tel:${phoneNumber}`;
                                await Linking.openURL(callUrl);
                            }
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir WhatsApp');
        }
    }, [property?.owner?.phone]);

    const handleOpenMap = useCallback(async () => {
        try {
            if (!property) return;

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
                console.error('Error abriendo mapas:', err);
                const fallbackUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
                Linking.openURL(fallbackUrl).catch(() => {
                    Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
                });
            });
        } catch (error) {
            console.error('Error abriendo mapas:', error);
            Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
        }
    }, [property]);

    const handleProfilePress = useCallback(() => {
        if (!property?.owner?.id) return;
        const href = `/profile/${property.owner.id}` as any;
        router.push(href);
    }, [property?.owner?.id, router]);

    // EFFECTS
    useEffect(() => {
        loadProperty();
        loadFavorites();
    }, [propertyId]);

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
        return <LoadingState />;
    }

    if (error || !property) {
        return (
            <ErrorState
                error={error}
                onBackPress={() => router.back()}
            />
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 1)" translucent />

            {/* Description Modal */}
            <DescriptionModal
                visible={showFullDescription}
                description={property.description}
                onClose={() => setShowFullDescription(false)}
            />

            {/* Fullscreen Image Modal */}
            <FullscreenModal
                visible={fullscreenImageIndex !== null}
                media={propertyMedia}
                currentIndex={fullscreenImageIndex ?? 0}
                screenWidth={width}
                onClose={handleCloseFullscreenModal}
                onIndexChange={setFullscreenImageIndex}
            />

            <View style={styles.scrollContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ paddingBottom: 80 }}
                >
                    {/* Image Carousel */}
                    <View style={styles.carouselWrapper}>
                        <View style={styles.imageCarousel}>
                            <ImageCarousel
                                media={propertyMedia}
                                currentIndex={currentImageIndex}
                                onScroll={handleScroll}
                                onMediaPress={(index) => setFullscreenImageIndex(index)}
                                carouselHeight={width <= 768 ? 300 : 450}
                                imageContainerWidth={width}
                                scrollViewRef={scrollViewRef}
                            />
                        </View>

                        {/* Floating Header Buttons */}
                        <FloatingHeaderButtons
                            onBackPress={() => router.back()}
                            onFavoritePress={handleLike}
                            isLiked={isLiked}
                            scaleAnim={scaleAnim}
                        />
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {/* Property Header */}
                        <PropertyHeader
                            title={property.title}
                            price={formatPriceWithCurrency(property.price, property.currency || 'BOB')}
                            address={property.address}
                            city={property.city}
                            onLocationPress={handleOpenMap}
                        />

                        {/* Contact Card */}
                        {property.owner && (
                            <ContactCard
                                owner={property.owner}
                                avatarUrl={buildAvatarUrl(property.owner.avatar)}
                                onWhatsAppPress={handleContactWhatsApp}
                                onProfilePress={handleProfilePress}
                            />
                        )}

                        {/* Features Section */}
                        <FeaturesSection
                            propertyType={property.propertyType}
                            specifications={property.specifications}
                            bedrooms={property.bedrooms}
                            bathrooms={property.bathrooms}
                            area={property.area}
                            parking={property.parking}
                        />

                        {/* Description Card */}
                        <DescriptionCard
                            description={property.description}
                            onShowMore={() => setShowFullDescription(true)}
                        />

                        {/* Amenities Card */}
                        <AmenitiesCard
                            amenities={property.amenities}
                            propertyType={property.propertyType}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

PropertyDetailScreen.options = {
    headerShown: false,
};
