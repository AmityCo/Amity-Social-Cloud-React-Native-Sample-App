import React, { VFC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CardTitleProps = {
  title?: string;
  flagCount?: number;
  hashFlag?: boolean;
  isDeleted?: boolean;
};

const CardTitle: VFC<CardTitleProps> = ({ title, flagCount, hashFlag, isDeleted }) => {
  const {
    colors: { error: errorColor },
  } = useTheme();

  return (
    <View style={styles.container}>
      <Title style={styles.item}>{title}</Title>
      {isDeleted && (
        <MaterialCommunityIcons
          size={16}
          style={styles.item}
          color={errorColor}
          name="delete-forever"
        />
      )}
      {!!flagCount && (
        <View style={[styles.item, styles.container]}>
          <Text>{flagCount}</Text>
          <MaterialCommunityIcons name="flag" size={16} color={errorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  item: { marginEnd: 5 },
});
export default CardTitle;