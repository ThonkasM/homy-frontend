import { Platform } from 'react-native';

// Import based on platform - Metro will only bundle the appropriate file
// Web version shows "No disponible" message
// Native version shows actual Google Maps with location picker

let MapViewProperty: any;

if (Platform.OS === 'web') {
    MapViewProperty = require('./map-view-property.web').default;
} else {
    MapViewProperty = require('./map-view-property.native').default;
}

export default MapViewProperty;
