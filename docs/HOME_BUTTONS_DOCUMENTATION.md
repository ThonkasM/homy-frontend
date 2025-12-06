// 📋 DOCUMENTACIÓN - Botones de Acción en Home.tsx
// ================================================

// 🗺️ BOTÓN MAPA
// ============
// ✅ QUÉ HACE:
//    - Abre Google Maps o Apple Maps con la ubicación de la propiedad
//    - Usa deep links nativos (https://maps.google.com/ y maps://)
//    - Intenta primero Google Maps, luego Apple Maps como fallback
//
// ✅ REQUISITOS:
//    - La propiedad debe tener latitude y longitude válidos
//    - Google Maps o Apple Maps debe estar instalado en el dispositivo
//
// ✅ CÓMO FUNCIONA:
//    const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
//    Linking.openURL(googleMapsUrl);


// 💬 BOTÓN WHATSAPP
// ================
// ✅ QUÉ HACE:
//    - Abre WhatsApp con un mensaje pre-llenado
//    - Envía el mensaje al número de contacto de la propiedad
//    - El mensaje incluye el título y detalles básicos de la propiedad
//
// ✅ REQUISITOS:
//    - La propiedad debe tener contactPhone válido
//    - WhatsApp debe estar instalado en el dispositivo
//    - El número debe estar en formato internacional (ej: +591...)
//
// ✅ CÓMO FUNCIONA:
//    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
//    Linking.openURL(whatsappUrl);
//
// ✅ NÚMERO DE TELÉFONO:
//    - Si el número no tiene código de país, agrega +591 (Bolivia)
//    - Limpia todos los caracteres especiales
//    - Ejemplo: "71234567" → "+59171234567"
//              "+591 7123-4567" → "+59171234567"


// 📤 BOTÓN COMPARTIR
// =================
// ✅ QUÉ HACE:
//    - Abre el menú nativo de compartir del dispositivo
//    - Permite compartir la propiedad por WhatsApp, Email, SMS, etc.
//    - Incluye un link de deep link o web
//    - En desarrollo, usa http://localhost:3000/property/[id]
//    - En producción, usa homi://property/[id] o https://homi-app.com/property/[id]
//
// ✅ REQUISITOS:
//    - El dispositivo debe tener apps de compartir instaladas
//
// ✅ MENSAJE QUE SE COMPARTE:
//    🏠 Mira esta propiedad en Homi:
//    *Título de la propiedad*
//    $Precio
//    📍 Ciudad - Dirección
//    🔗 [Link a la propiedad]
//
// ✅ CONFIGURACIÓN DE DEEP LINKS (PRÓXIMO PASO):
//    Para que los links funcionen completamente, necesitarás:
//    
//    1. En app.json, agregar:
//       "scheme": "homi",
//       "plugins": [
//         [
//           "expo-router",
//           {
//             "origin": "https://homi-app.com"
//           }
//         ]
//       ]
//    
//    2. En EAS Build (producción), agregar la URL web configurada
//    
//    3. En el archivo _layout.tsx, manejar los deep links:
//       const linking = {
//         prefixes: ['homi://', 'https://homi-app.com'],
//         config: {
//           screens: {
//             'property-detail/[id]': 'property/:id'
//           }
//         }
//       }


// 🛠️ TESTING LOCAL
// ================
// Para probar en development:
//
// 1. MAPA: Verifica que tengas latitude y longitude en la propiedad
//    - Debería abrir Google Maps o Apple Maps
//
// 2. WHATSAPP: Instala WhatsApp en el simulador/device
//    - Debería abrirse con el mensaje pre-llenado
//    - El número se formatea automáticamente
//
// 3. COMPARTIR: Usa el menú Share nativo
//    - En iOS: Puede compartir por AirDrop, Mail, etc.
//    - En Android: Puede compartir por Gmail, WhatsApp, etc.
//    - Los links de desarrollo mostrarán: http://localhost:3000/property/[id]
//    - Estos no funcionarán hasta que deploys la app


// 📝 NOTAS IMPORTANTES
// ===================
// - Todos los handlers tienen e.stopPropagation() para evitar navegar a detalles
// - Los errores se muestran con Alert.alert() para mejor UX
// - El nombre del botón es "Chat" (no "WhatsApp") para ser agnóstico
// - El emoji del corazón cambió a través de los botones (mejor visual)
// - Los botones son responsive y se adaptan al ancho del pantalla
