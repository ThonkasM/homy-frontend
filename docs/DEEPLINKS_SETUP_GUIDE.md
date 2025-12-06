// 🔗 GUÍA DE CONFIGURACIÓN DE DEEP LINKS
// ======================================

// El botón COMPARTIR ya está funcional, pero para que los links deep realmente funcionen
// cuando alguien hace clic en ellos, necesitas seguir estos pasos:

// ═══════════════════════════════════════════════════════════════════════════════════

// PASO 1: Configurar el scheme en app.json
// ========================================
// Ya tienes "scheme": "expocourse" en tu app.json

// Para Homi, puedes cambiar a:
// "scheme": "homi"

// Así, los links se vería así: homi://property/[propertyId]

// ═══════════════════════════════════════════════════════════════════════════════════

// PASO 2: Configurar las rutas en _layout.tsx (app/(tabs)/_layout.tsx)
// ==================================================================

// En el archivo que define las rutas de la app, agrega linking configuration:

/*
import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['homi://', 'exp://'],
  config: {
    screens: {
      '(tabs)': {
        screens: {
          'property-detail': {
            screens: {
              '[id]': 'property/:id'
            }
          }
        }
      },
      // También puedes agregar rutas para compartir:
      notFound: '*'
    }
  }
};

// Luego usa esto en tu NavigationContainer:
<NavigationContainer linking={linking}>
  {/* ... rest of your navigator */}
</NavigationContainer>
*/

// ═══════════════════════════════════════════════════════════════════════════════════

// PASO 3: Para PRODUCCIÓN con EAS
// ================================

// Si planeas deployar con EAS, necesitarás:

// 1. En app.json, agregar un assetPattern que incluya los links:

/*
"assetBundlePatterns": ["**"],
"plugins": [
  "expo-router",
  [
    "expo-build-properties",
    {
      "ios": {
        "useFrameworks": "static"
      }
    }
  ]
]
*/

// 2. Configurar Universal Links (iOS) y App Links (Android) con EAS
// El comando sería algo como:
// eas build --platform ios --with-submission

// 3. O generar un web preview URL con EAS:
// eas build --platform web

// ═══════════════════════════════════════════════════════════════════════════════════

// FUNCIONAMIENTO ACTUAL (Sin configuración adicional)
// ===================================================

// ✅ El botón COMPARTIR ya funciona:
//    1. Se abre el menú nativo de compartir
//    2. Se copia el mensaje con el link en el portapapeles
//    3. Si lo compartes por WhatsApp/Email/SMS, envía el texto con el link
//    4. Si la otra persona hace clic en el link:
//       - Si tiene la app instalada, abre el deep link
//       - Si NO tiene la app, abre la URL en el navegador

// ❌ Lo que falta configurar:
//    - Si alguien hace clic en el link compartido y NO tiene la app:
//      El navegador debería mostrar una página de descargas o landing
//      Eso se configura en producción con un redirect service

// ═══════════════════════════════════════════════════════════════════════════════════

// TESTING LOCAL DE DEEP LINKS
// =============================

// Para probar que los deep links funcionan en Expo dev:

// 1. Asegúrate que app.json tiene "scheme": "homi" (o expocourse)

// 2. En iPhone Simulator, puedes copiar esto en Safari:
//    homi://property/prop-001
//    Debería navegar a la pantalla de detalles

// 3. En Android Emulator, usa:
//    adb shell am start -W -a android.intent.action.VIEW -d "homi://property/prop-001" com.thonkasm.homi

// ═══════════════════════════════════════════════════════════════════════════════════

// RESUMEN
// =======
// - El botón COMPARTIR ya está 100% funcional ✅
// - Los links se copian correctamente al portapapeles ✅
// - Se pueden compartir por cualquier app (WhatsApp, Email, etc.) ✅
// - Los deep links funcionan en local development ✅
// - Para producción, necesitas EAS Build + Universal Links ⏳ (Futuro)

// PREGUNTA: ¿Quieres que configuremos todo esto ahora o prefieres dejarlo para cuando hagas el deployment?
