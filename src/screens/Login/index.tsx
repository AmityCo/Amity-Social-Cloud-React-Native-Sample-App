import React, { VFC } from 'react';
import Switch from 'expo-dark-mode-switch';
import { View, Platform } from 'react-native';
import { connectClient } from '@amityco/ts-sdk';
import * as Application from 'expo-application';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Surface, Button, Text, HelperText } from 'react-native-paper';

import { TextInput } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import usePreferences from 'hooks/usePreferences';

import ASCLogo from 'assets/svg/ASCLogo';

import styles from './styles';

type LoginFormData = Parameters<typeof connectClient>[0];

const LoginScreen: VFC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const { login, isConnecting, error } = useAuth();
  const { theme, toggleTheme } = usePreferences();

  const onSubmit: SubmitHandler<LoginFormData> = async formData => {
    const deviceId =
      Platform.OS === 'android'
        ? Application.androidId
        : await Application.getIosIdForVendorAsync();
    const data = { ...formData, deviceId: deviceId || undefined };

    await login(data);
  };

  return (
    <Surface style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoArea}>
          <ASCLogo width={250} height={150} />
        </View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              autoCapitalize="none"
              autoCompleteType="off"
              error={!!errors?.userId}
              label={t('auth.username')}
              containerStyle={styles.input}
              errorText={errors?.userId?.message}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          name="userId"
          defaultValue="test"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              error={!!errors?.displayName}
              label={t('auth.displayName')}
              containerStyle={styles.input}
              errorText={errors?.displayName?.message}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          name="displayName"
          defaultValue="test"
        />

        {error !== '' && <HelperText type="error">{error}</HelperText>}

        <Button
          mode="contained"
          style={styles.btn}
          loading={isConnecting}
          disabled={isConnecting}
          onPress={handleSubmit(onSubmit)}
        >
          <Text>{t('auth.login')}</Text>
        </Button>

        <View style={styles.darkModeToggleArea}>
          <Switch value={theme === 'dark'} onChange={toggleTheme} />
        </View>
      </SafeAreaView>
    </Surface>
  );
};

export default LoginScreen;
