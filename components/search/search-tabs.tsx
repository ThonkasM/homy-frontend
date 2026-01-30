import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TabType = 'properties' | 'users';

interface SearchTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'properties' && styles.tabActive]}
                onPress={() => onTabChange('properties')}
            >
                <Text style={[styles.tabText, activeTab === 'properties' && styles.tabTextActive]}>
                    Propiedades
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'users' && styles.tabActive]}
                onPress={() => onTabChange('users')}
            >
                <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
                    Usuarios
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingHorizontal: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#5585b5',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
    },
    tabTextActive: {
        color: '#5585b5',
    },
});
