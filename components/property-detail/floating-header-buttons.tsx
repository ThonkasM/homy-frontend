import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface FloatingHeaderButtonsProps {
    onBackPress: () => void;
    onFavoritePress: () => void;
    isLiked: boolean;
    scaleAnim: Animated.Value;
}

export default function FloatingHeaderButtons({
    onBackPress,
    onFavoritePress,
    isLiked,
    scaleAnim,
}: FloatingHeaderButtonsProps) {
    return (
        <>
            {/* Back Button */}
            <View style={styles.floatingHeaderButtons}>
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={onBackPress}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={24} color="#5585b5" />
                </TouchableOpacity>
            </View>

            {/* Favorite Button */}
            <Animated.View
                style={[
                    styles.favoriteButton,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={onFavoritePress}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={28}
                        color={isLiked ? '#ef4444' : '#64748b'}
                    />
                </TouchableOpacity>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    floatingHeaderButtons: {
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        zIndex: 15,
        pointerEvents: 'box-none',
    },
    floatingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
});
