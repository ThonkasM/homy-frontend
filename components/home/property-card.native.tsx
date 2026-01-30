import { formatPriceWithCurrency } from '@/config/currencies.config';
import { Property } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PropertyCardProps {
    property: Property;
    onPropertyPress: (id: string) => void;
    onOpenMap: (p: Property, e: any) => void;
    onOpenWhatsApp: (p: Property, e: any) => void;
    onShare: (p: Property, e: any) => void;
    userAvatar?: string;
    userName?: string;
    isMobile: boolean;
}

const PropertyCard = React.memo(({
    property,
    onPropertyPress,
    onOpenMap,
    onOpenWhatsApp,
    onShare,
    userAvatar,
    userName,
    isMobile,
}: PropertyCardProps) => {
    const imageUrl = property.images?.[0]?.url;
    const iconSize = isMobile ? 16 : 20;

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

    const styles = createStyles(isMobile);

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

                    {/* Información superpuesta sobre la imagen (estilo Instagram) */}
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
        prevProps.isMobile === nextProps.isMobile
    );
});

PropertyCard.displayName = 'PropertyCard';

const createStyles = (isMobile: boolean) => {
    return StyleSheet.create({
        propertyCard: {
            width: '100%',
            marginVertical: isMobile ? 12 : 0,
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
    });
};

export default PropertyCard;
