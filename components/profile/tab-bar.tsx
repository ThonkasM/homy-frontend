import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabType = 'properties' | 'favorites';

interface TabBarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'properties' && styles.tabButtonActive]}
                onPress={() => onTabChange('properties')}
            >
                <MaterialCommunityIcons
                    name="home"
                    size={16}
                    color={activeTab === 'properties' ? '#ffffff' : '#64748b'}
                />
                <Text style={[styles.tabText, activeTab === 'properties' && styles.tabTextActive]}>
                    Mis Propiedades
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'favorites' && styles.tabButtonActive]}
                onPress={() => onTabChange('favorites')}
            >
                <MaterialCommunityIcons
                    name="heart"
                    size={16}
                    color={activeTab === 'favorites' ? '#ffffff' : '#64748b'}
                />
                <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
                    Favoritos
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        gap: 8,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    tabButtonActive: {
        backgroundColor: '#5585b5',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    tabTextActive: {
        color: '#ffffff',
    },
});
