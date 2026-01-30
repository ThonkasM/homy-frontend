import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchHeaderProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    onSearch: () => void;
    placeholder: string;
}

export default function SearchHeader({
    searchQuery,
    onSearchChange,
    onSearch,
    placeholder
}: SearchHeaderProps) {
    const router = useRouter();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#5585b5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Buscar</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    autoFocus
                    returnKeyType="search"
                    onSubmitEditing={onSearch}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={() => onSearchChange('')}>
                        <Ionicons name="close-circle" size={20} color="#64748b" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#5585b5',
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#0f172a',
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
    },
});
