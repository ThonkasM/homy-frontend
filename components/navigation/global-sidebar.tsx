import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const SIDEBAR_WIDTH = 250;

type NavRoute = {
    name: string;
    title: string;
    iconName: string;
    href: string;
};

const NAV_ROUTES: NavRoute[] = [
    { name: 'home', title: 'Home', iconName: 'house.fill', href: '/(tabs)/home' },
    { name: 'posts', title: 'Crear', iconName: 'plus.circle.fill', href: '/(tabs)/posts' },
    { name: 'map', title: 'Mapa', iconName: 'map.fill', href: '/(tabs)/map' },
    { name: 'profile', title: 'Perfil', iconName: 'person.crop.square.filled.and.at.rectangle', href: '/(tabs)/profile' },
];

export default function GlobalSidebar() {
    const { hasSidebar } = useSidebarLayout();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const pathname = usePathname();
    const colors = Colors[colorScheme ?? 'light'];

    const borderColor = colorScheme === 'dark' ? '#2a2a2a' : '#e5e7eb';
    const hoverColor = colorScheme === 'dark' ? '#2a2a2a' : '#f3f4f6';

    // No mostrar la sidebar si no es web o no cumple con el breakpoint
    if (!hasSidebar || Platform.OS !== 'web') return null;

    return (
        <View style={[styles.sidebar, { backgroundColor: colors.background, borderRightColor: borderColor }]}>
            <View style={[styles.sidebarHeader, { borderBottomColor: borderColor }]}>
                <Text style={[styles.sidebarTitle, { color: colors.text }]}>Menú</Text>
            </View>

            <View style={styles.sidebarContent}>
                {NAV_ROUTES.map((route) => {
                    // Verificar si estamos en la ruta o en una subruta
                    const isActive = pathname === route.href || pathname.startsWith(route.href);

                    return (
                        <Pressable
                            key={route.name}
                            onPress={() => router.push(route.href as any)}
                            style={({ hovered }: any) => [
                                styles.sidebarItem,
                                isActive && { backgroundColor: colors.tint + '15' },
                                hovered && !isActive && { backgroundColor: hoverColor },
                            ]}
                        >
                            <IconSymbol
                                size={24}
                                name={route.iconName as any}
                                color={isActive ? colors.tint : colors.icon}
                            />
                            <Text
                                style={[
                                    styles.sidebarItemText,
                                    { color: isActive ? colors.tint : colors.text }
                                ]}
                            >
                                {route.title}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        width: SIDEBAR_WIDTH,
        borderRightWidth: 1,
        ...Platform.select({
            web: {
                position: 'fixed' as any,
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
            },
        }),
    },
    sidebarHeader: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    sidebarTitle: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    sidebarContent: {
        flex: 1,
        paddingTop: 8,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 8,
        marginVertical: 2,
        borderRadius: 8,
        gap: 12,
        cursor: 'pointer' as any,
    },
    sidebarItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export { SIDEBAR_WIDTH };
