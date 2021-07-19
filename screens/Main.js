import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import TabList from './tab/TabList';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <NavigationContainer>
          <TabList/>
        </NavigationContainer>
    );
  }
}

