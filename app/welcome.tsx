import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f4ff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  logoText: {
    fontSize: 50,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  heroSection: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 28,
  },
  propertyShowcase: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  showcaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  propertyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  propertyType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  propertyInfo: {
    fontSize: 13,
    color: '#64748b',
  },
  featureContainer: {
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    marginTop: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
});

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top Section - Logo & Brand */}
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🏡</Text>
            </View>
            <Text style={styles.appName}>HO{'\n'}MY</Text>
            <Text style={styles.tagline}></Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Encuentra tu{'\n'}
              Espacio Perfecto
            </Text>
            <Text style={styles.heroSubtitle}>
              Descubre miles de propiedades disponibles para compra, alquiler o anticrético
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featureContainer}>
            <View style={styles.featureGrid}>
              <View style={styles.featureCard}>
                <Text style={styles.featureIcon}>🔍</Text>
                <Text style={styles.featureLabel}>Buscar</Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureIcon}>🏠</Text>
                <Text style={styles.featureLabel}>Explorar</Text>
              </View>
              <View style={styles.featureCard}>
                <Text style={styles.featureIcon}>💬</Text>
                <Text style={styles.featureLabel}>Contactar</Text>
              </View>
            </View>
          </View>

          <View style={styles.dividerLine} />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.secondaryButtonText}>CREAR CUENTA</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Homi. Todos los derechos reservados.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
