import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorStateProps {
    error: string | null;
    onBackPress: () => void;
}

export default function ErrorState({ error, onBackPress }: ErrorStateProps) {
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.errorContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={onBackPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={24} color="#5585b5" />
                    </TouchableOpacity>
                </View>
                <View style={styles.errorContent}>
                    <Text style={styles.errorText}>
                        {error || 'No se pudo cargar la propiedad'}
                    </Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBackPress}
                    >
                        <Text style={styles.backButtonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        position: 'relative',
        width: '100%',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 15,
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
    errorContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: '#5585b5',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
