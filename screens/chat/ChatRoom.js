import React, { Component } from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  state = {
    message: [],
  };

  get user() {
    return {
      _id: 1,
      name: this.props.navigation.state.params.name,
    };
  }

  render() {
    const chat = <GiftedChat message={this.state.name} user={this.user} />;

    // if ((Platform.OS = "android")) {
    //   return (
    //     <KeyboardAvoidingView
    //       style={{ flex: 1 }}
    //       keyboardVerticalOffset={30}
    //       enabled
    //     >
    //       {chat}
    //     </KeyboardAvoidingView>
    //   );
    // }
    return <SafeAreaView style={{ flex: 1 }}>{chat}</SafeAreaView>;
  }
}

export default ChatRoom;
