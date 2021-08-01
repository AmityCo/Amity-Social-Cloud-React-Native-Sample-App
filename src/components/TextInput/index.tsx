/* eslint-disable react/jsx-props-no-spreading */
import React, { VFC } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Text, TextInput as TextInputComponent } from 'react-native-paper';

type TextInputProps = React.ComponentProps<typeof TextInputComponent> & {
  error?: boolean;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const TextInput: VFC<TextInputProps> = ({
  error,
  errorText,
  dense = true,
  containerStyle,
  mode = 'outlined',
  ...props
}) => {
  return (
    <View style={containerStyle}>
      <TextInputComponent mode={mode} dense={dense} error={error} {...props} />
      {error && errorText !== '' && <Text>{errorText}</Text>}
      {/* <HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
      </HelperText> */}
    </View>
  );
};

export default TextInput;
