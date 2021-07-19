import React, { Component } from 'react';
import { SafeAreaView,Text } from 'react-native';

import { ApplicationStyles } from '../../styles/AppStyles';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={ApplicationStyles.container}>
          <Text>
              chat
          </Text>
      </SafeAreaView>
    );
  }
}

export default Chat;
