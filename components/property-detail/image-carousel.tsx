import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface PropertyMedia {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
    thumbnailUrl?: string;
    duration?: number;
    order: number;
}

interface ImageCarouselProps {
    media: PropertyMedia[];
    currentIndex: number;
    onScroll: (event: any) => void;
    onMediaPress: (index: number) => void;
    carouselHeight: number;
    imageContainerWidth: number;
    scrollViewRef: React.RefObject<ScrollView>;
}

const formatVideoDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ImageCarousel({
    media,
    currentIndex,
    onScroll,
    onMediaPress,
    carouselHeight,
    imageContainerWidth,
    scrollViewRef,
}: ImageCarouselProps) {
    if (media.length === 0) {
        return (
            <View style={[styles.emptyContainer, { height: carouselHeight }]}>
                <Text style={styles.emptyText}>No hay imágenes disponibles</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                onScroll={onScroll}
                showsHorizontalScrollIndicator={false}
                style={{ height: carouselHeight }}
            >
                {media.map((item: PropertyMedia, index: number) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.imageContainer, { width: imageContainerWidth, height: carouselHeight }]}
                        onPress={() => onMediaPress(index)}
                        activeOpacity={0.9}
                    >
                        {item.type === 'IMAGE' ? (
                            <Image
                                source={{ uri: item.url }}
                                style={styles.image}
                                onError={(e) => {
                                    console.error('❌ Error loading image:', {
                                        url: item.url,
                                        errorCode: e.nativeEvent.error,
                                        timestamp: new Date().toISOString(),
                                    });
                                }}
                            />
                        ) : (
                            <>
                                <Image
                                    source={{ uri: item.thumbnailUrl || item.url }}
                                    style={styles.image}
                                    onError={() => {
                                        console.error('❌ Error loading video thumbnail:', item.thumbnailUrl);
                                    }}
                                />
                                <View style={styles.videoOverlay}>
                                    <View style={styles.playButtonContainer}>
                                        <MaterialCommunityIcons name="play" size={32} color="#5585b5" />
                                    </View>
                                </View>
                                {item.duration && (
                                    <View style={styles.videoDurationBadge}>
                                        <Text style={styles.videoDurationText}>
                                            {formatVideoDuration(item.duration)}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination Badge */}
            <View style={styles.paginationBadge}>
                <Text style={styles.paginationBadgeText}>
                    {currentIndex + 1}/{media.length}
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    emptyText: {
        color: '#cbd5e1',
        fontSize: 16,
    },
    imageContainer: {
        backgroundColor: '#f8fafc',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButtonContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    videoDurationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 5,
    },
    videoDurationText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    paginationBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        zIndex: 5,
    },
    paginationBadgeText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});
