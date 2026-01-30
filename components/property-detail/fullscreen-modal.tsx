import VideoPlayer from '@/components/property-detail/video-player';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface PropertyMedia {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
    thumbnailUrl?: string;
    duration?: number;
    order: number;
}

interface FullscreenModalProps {
    visible: boolean;
    media: PropertyMedia[];
    currentIndex: number;
    screenWidth: number;
    onClose: () => void;
    onIndexChange: (index: number) => void;
}

export default function FullscreenModal({
    visible,
    media,
    currentIndex,
    screenWidth,
    onClose,
    onIndexChange,
}: FullscreenModalProps) {
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (visible && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    x: currentIndex * screenWidth,
                    animated: false,
                });
            }, 100);
        }
    }, [visible, currentIndex, screenWidth]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.fullscreenImageContainer}>
                {visible && (
                    <>
                        <ScrollView
                            ref={scrollRef}
                            horizontal
                            pagingEnabled
                            scrollEventThrottle={16}
                            onScroll={(event) => {
                                const contentOffsetX = event.nativeEvent.contentOffset.x;
                                const screenW = event.nativeEvent.layoutMeasurement.width;
                                const newIndex = Math.round(contentOffsetX / screenW);
                                onIndexChange(newIndex);
                            }}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={media.length > 1}
                            style={{ flex: 1, width: '100%' }}
                        >
                            {media.map((item: PropertyMedia) => (
                                <View
                                    key={item.id}
                                    style={{
                                        width: screenWidth,
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#000',
                                    }}
                                >
                                    {item.type === 'IMAGE' ? (
                                        <Image
                                            source={{ uri: item.url }}
                                            style={styles.fullscreenImage}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#000000',
                                            }}
                                        >
                                            <VideoPlayer
                                                uri={item.url}
                                                shouldPlay={currentIndex === media.findIndex(m => m.id === item.id)}
                                            />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>

                        {media.length > 1 && (
                            <View style={styles.pageIndicator}>
                                <View style={styles.pageIndicatorBadge}>
                                    <Text style={styles.pageIndicatorText}>
                                        {currentIndex + 1} / {media.length}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </>
                )}

                <TouchableOpacity
                    style={styles.fullscreenCloseButton}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color="#5585b5" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullscreenImageContainer: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    pageIndicator: {
        position: 'absolute',
        top: 24,
        left: 16,
        zIndex: 20,
    },
    pageIndicatorBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    pageIndicatorText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    fullscreenCloseButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
});
