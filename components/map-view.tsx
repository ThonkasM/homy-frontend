import { Platform } from 'react-native';

// Import based on platform - Metro will only bundle the appropriate file
// Web version shows "En Desarrollo" placeholder
// Native version shows actual Google Maps

let MapViewComponent: any;

if (Platform.OS === 'web') {
  MapViewComponent = require('./map-view.web').default;
} else {
  MapViewComponent = require('./map-view.native').default;
}

export default MapViewComponent;
