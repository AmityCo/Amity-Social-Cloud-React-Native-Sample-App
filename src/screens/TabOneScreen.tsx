import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import EditScreenInfo from 'components/EditScreenInfo';

const TabOneScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One23</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default TabOneScreen;
