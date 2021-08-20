// eslint-disable-next-line import/no-extraneous-dependencies
import { Alert } from 'react-native';
import { AxiosError } from 'axios';

import { t } from 'i18n';

const getErrorMessage = (error: Error | AxiosError | undefined): string => {
  return error?.message ?? 'Error while handling request!';
};

export const alertError = (error: Error | AxiosError, onClose: () => void): void => {
  Alert.alert(
    'Oooops!',
    getErrorMessage(error),
    [
      {
        text: t('close'),
        onPress: async () => {
          onClose();
        },
      },
    ],
    { cancelable: false },
  );
};

export default getErrorMessage;
