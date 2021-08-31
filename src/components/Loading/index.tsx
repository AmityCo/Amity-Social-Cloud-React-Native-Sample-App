import React, { VFC } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import styles from './styles';

type LoadingProps = {
  padded?: boolean;
};

const Loading: VFC<LoadingProps> = ({ padded = true }) => {
  return <ActivityIndicator style={[padded && styles.padded]} />;
};

export default Loading;
