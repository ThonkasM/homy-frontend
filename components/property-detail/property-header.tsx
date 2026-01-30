import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PropertyHeaderProps {
    title: string;
    price: string;
    address: string;
    city: string;
    onLocationPress: () => void;
}

export default function PropertyHeader({
    title,
    price,
    address,
    city,
    onLocationPress,
}: PropertyHeaderProps) {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.priceLocationRow}>
                <Text style={styles.price}>{price}</Text>

                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={onLocationPress}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="map-marker-radius" size={16} color="#5585b5" />
                    <Text style={styles.location} numberOfLines={1}>
                        {address}, {city}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationSeparator} />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 8,
        lineHeight: 32,
    },
    priceLocationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: '#5585b5',
        flex: 1,
    },
    location: {
        fontSize: 13,
        color: '#5585b5',
        marginBottom: 0,
        fontWeight: '500',
        flex: 1,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        flex: 1,
        justifyContent: 'flex-start',
    },
    locationSeparator: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
        marginHorizontal: -24,
    },
});
