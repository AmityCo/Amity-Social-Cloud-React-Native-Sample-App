/* eslint-disable */
import React, { Component } from 'react';
import { View, NativeMethodsMixin, Dimensions } from 'react-native';

class InViewPort extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    this.state = { rectTop: 0, rectBottom: 0 };
  }

  componentDidMount() {
    // @ts-ignore
    if (!this.props.disabled) {
      this.startWatching();
    }
  }

  componentWillUnmount() {
    this.stopWatching();
  }

  // @ts-ignore
  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching();
    } else {
      // @ts-ignore
      this.lastValue = null;
      this.startWatching();
    }
  }

  startWatching() {
    // @ts-ignore
    if (this.interval) {
      return;
    }
    // @ts-ignore
    this.interval = setInterval(() => {
      // @ts-ignore
      if (!this.myview) {
        return;
      }
      // @ts-ignore
      this.myview.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          rectTop: pageY,
          rectBottom: pageY + height,
          rectWidth: pageX + width,
        });
      });
      this.isInViewPort();
      // @ts-ignore
    }, this.props.delay || 100);
  }

  stopWatching() {
    // @ts-ignore
    this.interval = clearInterval(this.interval);
  }

  isInViewPort() {
    const window = Dimensions.get('window');
    const isVisible =
      // @ts-ignore
      this.state.rectBottom != 0 &&
      // @ts-ignore
      this.state.rectTop >= 0 &&
      // @ts-ignore
      this.state.rectBottom <= window.height &&
      // @ts-ignore
      this.state.rectWidth > 0 &&
      // @ts-ignore
      this.state.rectWidth <= window.width;
    // @ts-ignore
    if (this.lastValue !== isVisible) {
      // @ts-ignore
      this.lastValue = isVisible;
      // @ts-ignore
      this.props.onChange(isVisible);
    }
  }

  render() {
    return (
      <View
        collapsable={false}
        ref={component => {
          // @ts-ignore
          this.myview = component;
        }}
        {...this.props}
      >
        {this.props.children}
      </View>
    );
  }
}

export default InViewPort;
