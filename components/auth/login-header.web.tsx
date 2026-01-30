import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    topSection: {
        alignItems: 'center' as any,
        marginBottom: 20,
    },
    logoContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#f0f4ff',
        borderRadius: 16,
        alignItems: 'center' as any,
        justifyContent: 'center' as any,
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    logoImage: {
        width: '150%',
        height: '150%',
    },
});

export default function LoginHeader() {
    return (
        <View style={styles.topSection}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/logos/BigLogo.jpeg')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}
