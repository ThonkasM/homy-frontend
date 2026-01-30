import { PROPERTY_TYPES_CONFIG } from '@/config/property-types.config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FeaturesSectionProps {
    propertyType: string;
    specifications?: Record<string, any>;
    // Legacy props
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking?: number;
}

export default function FeaturesSection({
    propertyType,
    specifications,
    bedrooms,
    bathrooms,
    area,
    parking,
}: FeaturesSectionProps) {
    // Modern specifications approach
    if (specifications && Object.keys(specifications).length > 0) {
        // Separar campos booleanos de los demás
        const nonBooleanFields: Array<[string, any]> = [];
        const booleanFields: Array<[string, any]> = [];

        Object.entries(specifications).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;

            if (typeof value === 'boolean') {
                if (value) booleanFields.push([key, value]);
            } else {
                nonBooleanFields.push([key, value]);
            }
        });

        // Combinar: primero no-booleanos, luego booleanos
        const orderedFields = [...nonBooleanFields, ...booleanFields];

        return (
            <View style={styles.cardHeaderSection}>
                <View style={styles.sectionFeatures}>
                    <Text style={styles.sectionTitle}>Características</Text>
                    <View style={styles.featureGrid}>
                        {orderedFields.map(([key, value]) => {
                            const config = PROPERTY_TYPES_CONFIG[propertyType];
                            const fieldConfig = config?.fields.find((f) => f.key === key);
                            const label = fieldConfig?.label || key;
                            const unit = fieldConfig?.unit || '';

                            if (typeof value === 'boolean') {
                                return (
                                    <View key={key} style={styles.featureCard}>
                                        <View>
                                            <Text style={[styles.featureLabel, { color: '#5585b5' }]}>{label}</Text>
                                        </View>
                                    </View>
                                );
                            }

                            return (
                                <View key={key} style={styles.featureCard}>
                                    <View>
                                        <Text style={styles.featureValue}>
                                            {typeof value === 'number' ? value.toFixed(0) : value}
                                        </Text>
                                        <Text style={styles.featureLabel}>
                                            {unit ? `${label} (${unit})` : label}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>
        );
    }

    // Legacy fallback
    if (bedrooms !== undefined || bathrooms !== undefined || area !== undefined) {
        return (
            <View style={styles.cardHeaderSection}>
                <View style={styles.sectionFeatures}>
                    <Text style={styles.sectionTitle}>Características</Text>
                    <View style={styles.featureGrid}>
                        {bedrooms !== undefined && (
                            <View style={styles.featureCard}>
                                <MaterialCommunityIcons name="bed" size={20} color="#5585b5" />
                                <View>
                                    <Text style={styles.featureValue}>{bedrooms}</Text>
                                    <Text style={styles.featureLabel}>Dorm.</Text>
                                </View>
                            </View>
                        )}
                        {bathrooms !== undefined && (
                            <View style={styles.featureCard}>
                                <MaterialCommunityIcons name="shower" size={20} color="#5585b5" />
                                <View>
                                    <Text style={styles.featureValue}>{bathrooms}</Text>
                                    <Text style={styles.featureLabel}>Baños</Text>
                                </View>
                            </View>
                        )}
                        {area !== undefined && (
                            <View style={styles.featureCard}>
                                <MaterialCommunityIcons name="ruler-square" size={20} color="#5585b5" />
                                <View>
                                    <Text style={styles.featureValue}>{area}</Text>
                                    <Text style={styles.featureLabel}>m²</Text>
                                </View>
                            </View>
                        )}
                        {parking !== undefined && parking > 0 && (
                            <View style={styles.featureCard}>
                                <MaterialCommunityIcons name="car" size={20} color="#5585b5" />
                                <View>
                                    <Text style={styles.featureValue}>{parking}</Text>
                                    <Text style={styles.featureLabel}>Est.</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    cardHeaderSection: {
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
    },
    sectionFeatures: {
        marginBottom: 0,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 12,
        textTransform: 'capitalize',
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'flex-start',
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 2,
        borderWidth: 1,
        borderColor: '#e0e7ff',
    },
    featureValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5585b5',
    },
    featureLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
});
