import { Platform } from 'react-native';

const CreatePostScreen = Platform.OS === 'web'
  ? require('./posts.web').default
  : require('./posts.native').default;

export default CreatePostScreen;
