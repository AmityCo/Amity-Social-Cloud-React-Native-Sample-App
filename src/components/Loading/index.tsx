import { StyleSheet } from 'react-native';
import React, { VFC } from 'react';
import { ActivityIndicator } from 'react-native-paper';

type LoadingProps = {
  padded?: boolean;
};

const Loading: VFC<LoadingProps> = ({ padded = true }) => {
  return <ActivityIndicator style={[padded && styles.padded]} />;
};

const styles = StyleSheet.create({
  padded: {
    paddingVertical: 25,
  },
});

export default Loading;
