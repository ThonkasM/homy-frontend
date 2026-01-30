import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
  },
});

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Top Section - Logo & Brand */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/logos/BigLogo.jpeg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
