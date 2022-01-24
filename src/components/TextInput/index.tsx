/* eslint-disable react/jsx-props-no-spreading */
import React, { VFC } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { TextInput as TextInputComponent, HelperText } from 'react-native-paper';

type TextInputProps = React.ComponentProps<typeof TextInputComponent> & {
  error?: boolean;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const TextInput: VFC<TextInputProps> = React.forwardRef(
  ({ error, errorText, dense = true, containerStyle, mode = 'outlined', ...props }, ref) => {
    const showError = error && errorText !== '';

    return (
      <View style={[{ height: showError ? 100 : 75 }, containerStyle]}>
        <TextInputComponent ref={ref} mode={mode} dense={dense} error={error} {...props} />
        {showError && (
          <HelperText type="error" visible={showError}>
            {errorText}
          </HelperText>
        )}
      </View>
    );
  },
);

export default TextInput;
