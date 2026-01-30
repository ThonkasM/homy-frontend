import FavoriteCard from '@/components/profile/favorite-card';
import { Property } from '@/hooks/use-properties';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

interface FavoritesGridProps {
    favorites: Array<{
        id: string;
        property: Property;
    }>;
    onFavoritePress: (propertyId: string) => void;
    onRemoveFavorite: (propertyId: string) => void;
}

export default function FavoritesGrid({
    favorites,
    onFavoritePress,
    onRemoveFavorite,
}: FavoritesGridProps) {
    const { width } = useWindowDimensions();
    const { hasSidebar } = useSidebarLayout();

    // Calcular ancho disponible considerando sidebar
    const availableWidth = hasSidebar ? width - 250 : width;
    const isMobile = availableWidth <= 768;

    const styles = createStyles(isMobile);

    return (
        <View style={styles.gridContainer}>
            {favorites.map((favorite) => (
                <View key={favorite.id} style={styles.cardWrapper}>
                    <FavoriteCard
                        favorite={favorite}
                        onPress={() => onFavoritePress(favorite.property.id)}
                        onRemoveFavorite={() => onRemoveFavorite(favorite.property.id)}
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
