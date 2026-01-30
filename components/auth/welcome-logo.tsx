import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    logoContainer: {
        width: 150,
        height: 150,
        backgroundColor: '#f0f4ff',
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 0,
        borderColor: '#3b82f6',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
});

export default function WelcomeLogo() {
    return (
        <View style={styles.logoContainer}>
            <Image
                source={require('@/assets/logos/BigLogo.jpeg')}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </View>
    );
}
