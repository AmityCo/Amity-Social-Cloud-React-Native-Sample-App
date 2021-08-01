import { View, StyleSheet } from 'react-native';
import React, { VFC } from 'react';
import { HelperText, ActivityIndicator } from 'react-native-paper';

type EmptyComponentProps = { loading: boolean; errorText: string };

const EmptyComponent: VFC<EmptyComponentProps> = ({ loading, errorText }) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <HelperText type="info" style={styles.errorText}>
          {errorText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 25 },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25 },
});

export default EmptyComponent;
