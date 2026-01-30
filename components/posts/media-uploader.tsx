import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export interface MediaItem {
    uri: string;
    type: 'image' | 'video';
    duration?: number;
}

interface MediaUploaderProps {
    media: MediaItem[];
    onAddMedia: () => void;
    onRemoveMedia: (index: number) => void;
    maxItems?: number;
}

export default function MediaUploader({
    media,
    onAddMedia,
    onRemoveMedia,
    maxItems = 10,
}: MediaUploaderProps) {
    const { width } = useWindowDimensions();
    const isWeb = width > 768;
    const imageContainerWidth = isWeb ? '18%' : '23%';

    return (
        <>
            {media.length > 0 && (
                <View style={styles.imagesGrid}>
                    {media.map((item, index) => (
                        <View key={index} style={[styles.imageContainer, { width: imageContainerWidth as any }]}>
                            <Image source={{ uri: item.uri }} style={styles.selectedImage} />
                            {item.type === 'video' && (
                                <View style={styles.mediaOverlay}>
                                    <View style={styles.playButtonSmall}>
                                        <Text style={styles.playButtonText}>▶</Text>
                                    </View>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => onRemoveMedia(index)}
                            >
                                <Text style={styles.removeImageText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <Text style={styles.imageCounter}>
                {media.length}/{maxItems} archivo{media.length !== 1 ? 's' : ''} seleccionado{media.length !== 1 ? 's' : ''}
                {media.length > 0 && (
                    <Text style={{ color: '#7c3aed' }}>
                        {' '}({media.filter(m => m.type === 'image').length} imagen{media.filter(m => m.type === 'image').length !== 1 ? 'es' : ''}, {media.filter(m => m.type === 'video').length} video{media.filter(m => m.type === 'video').length !== 1 ? 's' : ''})
                    </Text>
                )}
            </Text>

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={onAddMedia}
                disabled={media.length >= maxItems}
            >
                <Text style={styles.uploadText}>
                    {media.length >= maxItems ? '✓ Máximo alcanzado' : '+ Agregar Fotos o Videos'}
                </Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    imageContainer: {
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    removeImageText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    mediaOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#5585b5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
    },
    imageCounter: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 12,
        fontWeight: '500',
    },
    uploadButton: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#5585b5',
        borderRadius: 10,
        paddingVertical: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#f0f4ff',
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5585b5',
    },
});
