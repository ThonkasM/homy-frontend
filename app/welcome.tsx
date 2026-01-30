import AuthFooter from '@/components/auth/auth-footer';
import WelcomeButtons from '@/components/auth/welcome-buttons';
import WelcomeHero from '@/components/auth/welcome-hero';
import WelcomeLogo from '@/components/auth/welcome-logo';
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
});

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top Section - Logo & Brand */}
          <View style={styles.topSection}>
            <WelcomeLogo />
          </View>

          {/* Hero Section */}
          <WelcomeHero />

          {/* Buttons */}
          <WelcomeButtons />

          {/* Footer */}
          <AuthFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
