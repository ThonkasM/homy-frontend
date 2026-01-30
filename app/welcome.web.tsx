import AuthFooter from '@/components/auth/auth-footer';
import WelcomeButtons from '@/components/auth/welcome-buttons';
import WelcomeHero from '@/components/auth/welcome-hero';
import WelcomeLogo from '@/components/auth/welcome-logo';
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        minHeight: '100vh' as any,
        display: 'flex' as any,
        flexDirection: 'column' as any,
    },
    mainContent: {
        flex: 1,
        display: 'flex' as any,
    },
    splitLayout: {
        flexDirection: 'row' as any,
        minHeight: '100vh' as any,
        maxWidth: 1440,
        marginHorizontal: 'auto' as any,
        width: '100%',
    },
    leftSection: {
        flex: 1,
        paddingHorizontal: 80,
        paddingVertical: 80,
        display: 'flex' as any,
        justifyContent: 'center' as any,
        alignItems: 'flex-start' as any,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' as any,
    },
    rightSection: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 80,
        paddingVertical: 80,
        display: 'flex' as any,
        justifyContent: 'center' as any,
        alignItems: 'center' as any,
        borderLeftWidth: 1,
        borderLeftColor: '#e2e8f0',
    },
    rightContent: {
        width: '100%',
        maxWidth: 460,
        display: 'flex' as any,
        flexDirection: 'column' as any,
        alignItems: 'center' as any,
    },
    footerWrapper: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    footerContent: {
        maxWidth: 1440,
        marginHorizontal: 'auto' as any,
        paddingHorizontal: 80,
        paddingVertical: 24,
    },
});

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Split Content */}
                <View style={styles.mainContent}>
                    <View style={styles.splitLayout}>
                        {/* Left Section - Hero */}
                        <View style={styles.leftSection}>
                            <WelcomeHero />
                        </View>

                        {/* Right Section - Actions */}
                        <View style={styles.rightSection}>
                            <View style={styles.rightContent}>
                                <WelcomeLogo />
                                <WelcomeButtons />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerWrapper}>
                    <View style={styles.footerContent}>
                        <AuthFooter />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
