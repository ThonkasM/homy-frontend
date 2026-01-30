import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    topSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 12,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#f0f4ff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
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
