import { Platform } from 'react-native';

const MapScreen = Platform.OS === 'web'
  ? require('./map.web').default
  : require('./map.native').default;

export default MapScreen;
