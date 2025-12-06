import React from 'react';
import { Text, View } from 'react-native';

export default function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: '#5585b5', marginBottom: 8 }}>
        🗺️ En Desarrollo
      </Text>
      <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', paddingHorizontal: 24 }}>
        La vista de mapa está disponible en la versión móvil
      </Text>
    </View>
  );
}
