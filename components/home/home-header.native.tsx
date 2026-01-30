import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface HomeHeaderProps {
    onSearchPress: () => void;
    isMobile: boolean;
}

export default function HomeHeader({ onSearchPress, isMobile }: HomeHeaderProps) {
    const styles = createStyles(isMobile);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <Image
                    source={require('@/assets/logos/NormalLogo.jpeg')}
                    style={styles.headerLogo}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={onSearchPress}
                >
                    <Ionicons name="search" size={24} color="#5585b5" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (isMobile: boolean) => {
    return StyleSheet.create({
        headerContainer: {
            paddingHorizontal: isMobile ? 16 : 24,
            paddingTop: 12,
            paddingBottom: 16,
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            width: '100%',
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        headerLogo: {
            height: 40,
            width: 120,
        },
        searchButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#f1f5f9',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
    });
};
