import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import color from 'color';

type NotificationTwittProps = {
  id: number;
  name: string;
  content: string;
  people: Array<{
    name: string;
    image: string;
  }>;
};

const NotificationTwitt: FC<NotificationTwittProps> = ({ people, name, content }) => {
  const theme = useTheme();

  const contentColor = color(theme.colors.text).alpha(0.8).rgb().string();

  return (
    <Surface style={styles.container}>
      <View style={styles.leftColumn}>
        <MaterialCommunityIcons name="star-four-points" size={30} color="#8d38e8" />
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.topRow}>
          {people.map(({ name: name_, image }) => (
            <Avatar.Image
              style={{ marginRight: 10 }}
              key={name_}
              source={{ uri: image }}
              size={40}
            />
          ))}
        </View>
        <Text style={{ marginBottom: 10 }}>
          {people.map(({ name: name_ }) => name_).join(' and ')} likes {name} tweet.
        </Text>
        <Text style={{ color: contentColor }}>{content}</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  leftColumn: {
    width: 100,
    marginRight: 10,
    alignItems: 'flex-end',
  },
  rightColumn: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default NotificationTwitt;
