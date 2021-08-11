import { View, StyleSheet } from 'react-native';
import React, { VFC } from 'react';
import { HelperText, ActivityIndicator, Button } from 'react-native-paper';

import { t } from 'i18n';

type EmptyComponentProps = { loading: boolean; errorText?: string; onRetry?: () => void };

const EmptyComponent: VFC<EmptyComponentProps> = ({ loading, errorText, onRetry }) => {
  const text = errorText && errorText !== '' ? errorText : t('no_result');

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <HelperText type={errorText !== '' ? 'error' : 'info'} style={styles.errorText}>
            {text}
          </HelperText>
          {onRetry && <Button onPress={onRetry}>{t('retry')}</Button>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 25 },
  errorText: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
});

export default EmptyComponent;
