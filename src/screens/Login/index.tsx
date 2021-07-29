import React, { VFC } from 'react';
import Switch from 'expo-dark-mode-switch';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Surface, Button, Text } from 'react-native-paper';

import { TextInput } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import usePreferences from 'hooks/usePreferences';

import { LoginFormData } from 'types';

import ASCLogo from 'assets/svg/ASCLogo';

const LoginScreen: VFC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const { login, isAuthenticating } = useAuth();
  const { theme, toggleTheme } = usePreferences();

  const onSubmit: SubmitHandler<LoginFormData> = async data => {
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
              onBlur={onBlur}
              autoCapitalize="none"
              autoCompleteType="off"
              onChangeText={onChange}
              error={!!errors?.username}
              label={t('auth.username')}
              containerStyle={styles.input}
              errorText={errors?.username?.message}
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              secureTextEntry
              onChangeText={onChange}
              error={!!errors?.password}
              label={t('auth.password')}
              containerStyle={styles.input}
              errorText={errors?.password?.message}
            />
          )}
          name="password"
        />

        <Button
          mode="contained"
          style={styles.btn}
          loading={isAuthenticating}
          disabled={isAuthenticating}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoArea: { marginBottom: 20, alignItems: 'center' },
  input: { width: '75%', marginBottom: 15 },
  btn: { width: 200, alignSelf: 'center' },
  darkModeToggleArea: {
    marginTop: 25,
  },
});

export default LoginScreen;
