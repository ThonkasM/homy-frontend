import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
    createdAt?: string;
}

interface ProfileHeaderProps {
    user: User | null;
    uploadingAvatar: boolean;
    onAvatarPress: () => void;
    onMenuPress: () => void;
    onNamePress: () => void;
    buildAvatarUrl: (avatarPath: string | undefined) => string | null;
}

export default function ProfileHeader({
    user,
    uploadingAvatar,
    onAvatarPress,
    onMenuPress,
    onNamePress,
    buildAvatarUrl,
}: ProfileHeaderProps) {
    return (
        <View style={styles.profileHeader}>
            <View style={styles.profileHeaderTop}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={onAvatarPress}
                    disabled={uploadingAvatar}
                >
                    {user?.avatar ? (
                        buildAvatarUrl(user.avatar) ? (
                            <Image
                                key={`${user.avatar}`}
                                source={{ uri: buildAvatarUrl(user.avatar)! }}
                                style={styles.profileAvatarImage}
                                onError={(e) => {
                                    console.error('❌ Avatar Image load error:', {
                                        originalAvatar: user?.avatar,
                                        builtUrl: buildAvatarUrl(user.avatar),
                                        error: e.nativeEvent.error,
                                    });
                                }}
                                onLoad={() => {
                                    console.log('✅ Avatar Image loaded successfully:', buildAvatarUrl(user.avatar));
                                }}
                            />
                        ) : (
                            <Text style={styles.profileAvatar}>{user.avatar}</Text>
                        )
                    ) : (
                        <Text style={styles.profileAvatar}>👤</Text>
                    )}
                    <View style={styles.avatarEditBadge}>
                        {uploadingAvatar ? (
                            <ActivityIndicator size="small" color="#5585b5" />
                        ) : (
                            <MaterialCommunityIcons name="camera" size={16} color="#5585b5" />
                        )}
                    </View>
                </TouchableOpacity>

                <View style={styles.profileInfo}>
                    <TouchableOpacity onPress={onNamePress} activeOpacity={0.7}>
                        <Text style={styles.profileName}>
                            {user?.firstName || 'Usuario'} {user?.lastName || ''}
                        </Text>
                    </TouchableOpacity>
                    {user?.email && <Text style={styles.profileEmail}>{user?.email}</Text>}
                    {user?.phone && <Text style={styles.profilePhone}>{user?.phone}</Text>}
                </View>

                <TouchableOpacity
                    style={styles.hamburgerButton}
                    onPress={onMenuPress}
                >
                    <MaterialCommunityIcons name="menu" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        position: 'relative',
    },
    profileAvatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5585b5',
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
    hamburgerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
});
