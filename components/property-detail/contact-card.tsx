import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Owner {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
}

interface ContactCardProps {
    owner: Owner;
    avatarUrl: string | null;
    onWhatsAppPress: () => void;
    onProfilePress: () => void;
}

export default function ContactCard({
    owner,
    avatarUrl,
    onWhatsAppPress,
    onProfilePress,
}: ContactCardProps) {
    return (
        <View style={styles.cardBlueLight}>
            <View style={styles.contactHeader}>
                {avatarUrl ? (
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.contactAvatarImage}
                        onError={() => {
                            console.error('❌ Avatar load error:', owner.avatar);
                        }}
                    />
                ) : (
                    <Text style={styles.contactAvatar}>
                        {owner.avatar || '👤'}
                    </Text>
                )}
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>
                        {owner.firstName} {owner.lastName}
                    </Text>
                    {owner.phone && (
                        <Text style={styles.contactPhone}>
                            {owner.phone}
                        </Text>
                    )}
                </View>
                <View style={styles.contactButtonsContainer}>
                    <TouchableOpacity
                        style={styles.contactMinimalButton}
                        onPress={onWhatsAppPress}
                        activeOpacity={0.8}
                    >
                        <View style={styles.contactMinimalButtonWrapper}>
                            <MaterialCommunityIcons name="whatsapp" size={16} color="#ffffff" />
                            <Text style={styles.contactMinimalButtonText}>Contactar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contactMinimalButton}
                        onPress={onProfilePress}
                        activeOpacity={0.8}
                    >
                        <View style={styles.contactMinimalButtonWrapper}>
                            <MaterialCommunityIcons name="account" size={16} color="#ffffff" />
                            <Text style={styles.contactMinimalButtonText}>Perfil</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardBlueLight: {
        backgroundColor: '#f0f4ff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e7ff',
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    contactAvatar: {
        fontSize: 36,
        marginRight: 12,
    },
    contactAvatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: '#e2e8f0',
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 2,
    },
    contactPhone: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    contactButtonsContainer: {
        flexDirection: 'column',
        gap: 8,
    },
    contactMinimalButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#5585b5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 110,
    },
    contactMinimalButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    contactMinimalButtonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
