import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
  },
});

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🏡</Text>
        <Text style={styles.appName}>Homi</Text>
      </View>
    </View>
  );
}
