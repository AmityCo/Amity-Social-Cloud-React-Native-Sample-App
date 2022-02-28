import { Alert } from 'react-native';

import { t } from 'i18n';

import getErrorMessage from './getErrorMessage';

export const alertError = (error: Error, onClose?: () => void): void => {
  Alert.alert(
    'Oooops!',
    getErrorMessage(error),
    [
      {
        text: t('close'),
        onPress: async () => {
          if (onClose) onClose();
        },
      },
    ],
    { cancelable: false },
  );
};

export const alertConfirmation = (onPress: () => void): void => {
  Alert.alert(
    t('are_you_sure'),
    '',
    [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('ok'),
        onPress: async () => {
          if (onPress) onPress();
        },
      },
    ],
    { cancelable: false },
  );
};

export default {};
