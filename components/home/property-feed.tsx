import { Property } from '@/hooks/use-properties';
import React from 'react';
import { FlatList, Platform, RefreshControlProps, StyleSheet, View } from 'react-native';
import PropertyCard from './property-card';

type PropertyFeedProps = {
    properties: Property[];
    onPropertyPress: (propertyId: string) => void;
    onOpenMap: (property: Property, e: any) => void;
    onOpenWhatsApp: (property: Property, e: any) => void;
    onShare: (property: Property, e: any) => void;
    isMobile: boolean;
    renderFooter?: () => React.ReactElement | null;
    renderEmpty?: () => React.ReactElement | null;
    onEndReached?: () => void;
    refreshControl?: React.ReactElement<RefreshControlProps>;
    ListHeaderComponent?: React.ReactElement | null;
    flatListRef?: React.RefObject<FlatList | null>;
};

export default function PropertyFeed({
    properties,
    onPropertyPress,
    onOpenMap,
    onOpenWhatsApp,
    onShare,
    isMobile,
    renderFooter,
    renderEmpty,
    onEndReached,
    refreshControl,
    ListHeaderComponent,
    flatListRef,
}: PropertyFeedProps) {
    const numColumns = isMobile ? 1 : 2;

    const keyExtractor = (item: Property) => item.id;

    const renderItem = ({ item }: { item: Property }) => {
        return (
            <View style={isMobile ? styles.cardWrapperMobile : styles.cardWrapperWeb}>
                <PropertyCard
                    property={item}
                    onPropertyPress={onPropertyPress}
                    onOpenMap={onOpenMap}
                    onOpenWhatsApp={onOpenWhatsApp}
                    onShare={onShare}
                    userAvatar={item.owner?.avatar}
                    userName={`${item.owner?.firstName} ${item.owner?.lastName}`}
                    isMobile={isMobile}
                />
            </View>
        );
    };

    return (
        <FlatList
            ref={flatListRef}
            data={properties}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            key={numColumns} // Force re-render cuando cambia numColumns
            numColumns={numColumns}
            contentContainerStyle={[
                styles.contentContainer,
                isMobile ? styles.contentMobile : styles.contentWeb,
            ]}
            columnWrapperStyle={!isMobile ? styles.columnWrapper : undefined}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            removeClippedSubviews={Platform.OS === 'android'}
            maxToRenderPerBatch={isMobile ? 2 : 4}
            updateCellsBatchingPeriod={100}
            windowSize={3}
            initialNumToRender={isMobile ? 3 : 6}
            refreshControl={refreshControl}
            ListHeaderComponent={ListHeaderComponent}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 16,
    },
    contentMobile: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    contentWeb: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        gap: 16,
    },
    cardWrapperMobile: {
        width: '100%',
        marginBottom: 16,
    },
    cardWrapperWeb: {
        flex: 1,
        maxWidth: '48%',
        marginBottom: 16,
    },
});
