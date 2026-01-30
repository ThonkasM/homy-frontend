import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoImage: {
        width: 200,
        height: 200,
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
