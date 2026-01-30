import { Platform, useWindowDimensions } from 'react-native';

const SIDEBAR_WIDTH = 250;
const BREAKPOINT = 1024;

/**
 * Hook para determinar si se debe mostrar el sidebar y obtener dimensiones del layout
 */
export function useSidebarLayout() {
    const { width } = useWindowDimensions();

    const hasSidebar = Platform.OS === 'web' && width > BREAKPOINT;
    const contentPaddingLeft = hasSidebar ? SIDEBAR_WIDTH : 0;
    const isMobile = width <= BREAKPOINT;

    return {
        hasSidebar,
        sidebarWidth: SIDEBAR_WIDTH,
        contentPaddingLeft,
        isMobile,
        screenWidth: width,
    };
}
