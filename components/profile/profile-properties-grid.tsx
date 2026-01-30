import ProfilePropertyCard from '@/components/profile/profile-property-card';
import { Property } from '@/hooks/use-properties';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

interface ProfilePropertiesGridProps {
    properties: Property[];
    onPropertyPress: (property: Property) => void;
    onOptionsPress: (property: Property) => void;
}

export default function ProfilePropertiesGrid({
    properties,
    onPropertyPress,
    onOptionsPress,
}: ProfilePropertiesGridProps) {
    const { width } = useWindowDimensions();
    const { hasSidebar } = useSidebarLayout();

    // Calcular ancho disponible considerando sidebar
    const availableWidth = hasSidebar ? width - 250 : width;
    const isMobile = availableWidth <= 768;

    const styles = createStyles(isMobile);

    return (
        <View style={styles.gridContainer}>
            {properties.map((property) => (
                <View key={property.id} style={styles.cardWrapper}>
                    <ProfilePropertyCard
                        property={property}
                        onPress={() => onPropertyPress(property)}
                        onOptionsPress={() => onOptionsPress(property)}
                    />
                </View>
            ))}
        </View>
    );
}

const createStyles = (isMobile: boolean) => {
    return StyleSheet.create({
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: isMobile ? 0 : 16,
            paddingHorizontal: isMobile ? 0 : 8,
        },
        cardWrapper: {
            width: isMobile ? '100%' : 'calc(50% - 8px)',
        },
    });
};
