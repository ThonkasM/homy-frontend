import PropertySearchCard from '@/components/search/property-search-card';
import SearchEmptyState from '@/components/search/search-empty-state';
import SearchHeader from '@/components/search/search-header';
import SearchTabs, { TabType } from '@/components/search/search-tabs';
import UserSearchCard from '@/components/search/user-search-card';
import { useProperties } from '@/hooks/use-properties';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';
import { useUsers } from '@/hooks/use-users';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const createStyles = (width: number, hasSidebar: boolean) => {
    const isMobile = width <= 1024;
    const maxWidth = !hasSidebar && width > 768 ? 600 : '100%' as any;

    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        container: {
            flex: 1,
            width: '100%',
            maxWidth: maxWidth as any,
            alignSelf: 'center',
        },
        contentContainer: {
            flex: 1,
            backgroundColor: '#f9fafb',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 80,
        },
    });
};

export default function SearchScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { hasSidebar } = useSidebarLayout();
    const styles = React.useMemo(() => createStyles(width, hasSidebar), [width, hasSidebar]);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('properties');

    const { properties, loading: loadingProperties, fetchProperties } = useProperties();
    const { users, loading: loadingUsers, searchUsers } = useUsers();

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim()) return;

        if (activeTab === 'properties') {
            fetchProperties({ search: searchQuery, page: 1, limit: 20 });
        } else {
            searchUsers({ search: searchQuery, page: 1, limit: 20 });
        }
    }, [searchQuery, activeTab, fetchProperties, searchUsers]);

    // Auto-search cuando cambia el query (con debounce)
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, activeTab]);

    const handlePropertyPress = useCallback((propertyId: string) => {
        router.push(`/property-detail/${propertyId}`);
    }, [router]);

    const handleUserPress = useCallback((userId: string) => {
        router.push(`/profile/${userId}`);
    }, [router]);

    const isLoading = activeTab === 'properties' ? loadingProperties : loadingUsers;
    const hasResults = activeTab === 'properties' ? properties.length > 0 : users.length > 0;
    const showEmpty = !isLoading && searchQuery.trim() && !hasResults;

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
            <View style={styles.container}>
                <SearchHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder={`Buscar ${activeTab === 'properties' ? 'propiedades' : 'usuarios'}...`}
                />

                <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#5585b5" />
                            <SearchEmptyState type="loading" />
                        </View>
                    ) : !searchQuery.trim() ? (
                        <SearchEmptyState type="initial" activeTab={activeTab} />
                    ) : showEmpty ? (
                        <SearchEmptyState type="no-results" searchQuery={searchQuery} />
                    ) : (
                        <>
                            {activeTab === 'properties'
                                ? properties.map(property => (
                                    <PropertySearchCard
                                        key={property.id}
                                        property={property}
                                        onPress={handlePropertyPress}
                                    />
                                ))
                                : users.map(user => (
                                    <UserSearchCard
                                        key={user.id}
                                        user={user}
                                        onPress={handleUserPress}
                                    />
                                ))}
                            <View style={{ height: 20 }} />
                        </>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
