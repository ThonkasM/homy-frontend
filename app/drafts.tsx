import { useProperties } from '@/hooks/use-properties';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DraftsScreen() {
    const router = useRouter();
    const { properties, loading, fetchUserProperties, publishProperty, archiveProperty } = useProperties();
    const [refreshing, setRefreshing] = useState(false);

    // Filtrar propiedades con postStatus: DRAFT
    const draftProperties = properties.filter((p: any) => p.postStatus === 'DRAFT');

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        try {
            await fetchUserProperties();
        } catch (err) {
            console.error('Error loading drafts:', err);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await loadDrafts();
        } catch (err) {
            console.error('Error refreshing drafts:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePublishProperty = (propertyId: string, title: string) => {
        Alert.alert(
            'Publicar Propiedad',
            `¿Deseas publicar "${title}"?`,
            [
                { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Publicar',
                    onPress: async () => {
                        try {
                            await publishProperty(propertyId);
                            Alert.alert('Éxito', 'Propiedad publicada exitosamente');
                            await loadDrafts();
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'No se pudo publicar la propiedad');
                        }
                    },
                    style: 'default',
                },
            ]
        );
    };

    const handleArchiveProperty = (propertyId: string, title: string) => {
        Alert.alert(
            'Archivar Propiedad',
            `¿Deseas archivar "${title}"? No será visible públicamente.`,
            [
                { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Archivar',
                    onPress: async () => {
                        try {
                            await archiveProperty(propertyId);
                            Alert.alert('Éxito', 'Propiedad archivada exitosamente');
                            await loadDrafts();
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'No se pudo archivar la propiedad');
                        }
                    },
                    style: 'default',
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#5585b5"
                    />
                }
            >
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#5585b5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Borradores</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#5585b5" />
                    </View>
                ) : draftProperties.length > 0 ? (
                    <View style={styles.listContainer}>
                        {draftProperties.map((property: any) => (
                            <View key={property.id} style={styles.propertyCard}>
                                <TouchableOpacity
                                    onPress={() => router.push(`/property-detail/${property.id}`)}
                                    style={{ flex: 1 }}
                                >
                                    <Text style={styles.propertyTitle}>{property.title}</Text>
                                    <Text style={styles.propertyPrice}>${property.price.toLocaleString()}</Text>
                                    <Text style={styles.propertyStatus}>📝 Borrador</Text>
                                </TouchableOpacity>

                                {/* Botones de acción */}
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.archiveButton]}
                                        onPress={() => handleArchiveProperty(property.id, property.title)}
                                    >
                                        <MaterialCommunityIcons name="archive" size={16} color="#ffffff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.publishButton]}
                                        onPress={() => handlePublishProperty(property.id, property.title)}
                                    >
                                        <MaterialCommunityIcons name="cloud-upload" size={16} color="#ffffff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📄</Text>
                        <Text style={styles.emptyText}>No tienes borradores</Text>
                        <Text style={styles.emptySubtext}>Tus propiedades guardadas como borradores aparecerán aquí</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5585b5',
        flex: 1,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    propertyCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    propertyPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5585b5',
        marginBottom: 8,
    },
    propertyStatus: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    archiveButton: {
        backgroundColor: '#f59e0b',
    },
    publishButton: {
        backgroundColor: '#10b981',
    },
    publishButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 24,
    },
    emptyEmoji: {
        fontSize: 60,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
});
