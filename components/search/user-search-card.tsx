import { User } from '@/hooks/use-users';
import { SERVER_BASE_URL } from '@/services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserSearchCardProps {
    user: User;
    onPress: (userId: string) => void;
}

export default function UserSearchCard({ user, onPress }: UserSearchCardProps) {
    const buildImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    const avatarUrl = buildImageUrl(user.avatar);

    return (
        <TouchableOpacity
            style={styles.userCard}
            onPress={() => onPress(user.id)}
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
}

const styles = StyleSheet.create({
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
