import React, { Component } from "react";

import {
  SafeAreaView,
  Animated,
  Text,
  View,
  Image,
  TextInput,
  CheckBox,
} from "react-native";

import {
  createClient,
  connectClient,
  isConnected,
  //  queryChannels,
} from "@amityco/ts-sdk";

import { ApplicationStyles } from "../styles/AppStyles";
import ApplicationConstants from "../constants/AppConstants";
import AppButton from "../constants/AppComponents";

export const client = createClient(
  "b3bee90c39d9a5644831d84e5a0d1688d100ddebef3c6e78"
);

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logoAnime: new Animated.Value(0),
      checked: false,
      form: {
        username: { value: "" },
        password: { value: "" },
      },
    };
  }

  updateForm = (name, text) => {
    let formCopy = this.state.form;

    formCopy[name].value = text;

    this.setState({
      form: formCopy,
    });
  };

  submitUser = async () => {
    const { form } = this.state;
    let formToSubmit = {};

    let formCopy = form;

    for (let key in formCopy) {
      formToSubmit[key] = formCopy[key].value;
    }

    const { username, password } = formToSubmit;

    await connectClient(username);
    console.log("client is connected:", isConnected());

    if (isConnected()) {
      this.props.navigation.navigate("Main", { name: this.username });
    }
  };

  checkClicked = async () => {
    await this.setState((prevState) => ({
      isCheck: !prevState.isCheck,
    })); // setState is async function.

    // Call function type prop with return values.
    this.props.clicked &&
      this.props.clicked(this.props.value, this.state.isCheck);
  };

  render(onSubmit) {
    return (
      <SafeAreaView style={ApplicationStyles.container}>
        <Image
          style={{ width: 150, height: 93, marginBottom: 20 }}
          source={require("../../demo-chat-app/assets/amity-social-cloud-logo.png")}
        />

        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          {ApplicationConstants.loginWelcomeText}
        </Text>

        <TextInput
          style={ApplicationStyles.input}
          placeholder={ApplicationConstants.loginUsernamePlaceHolder}
          onChangeText={(val) => this.updateForm("username", val)}
        />

        <TextInput
          style={ApplicationStyles.input}
          placeholder={ApplicationConstants.loginPasswordPlaceHolder}
          onChangeText={(val) => this.updateForm("password", val)}
          secureTextEntry={true}
        />

        <AppButton
          text={ApplicationConstants.loginButtonText}
          onPress={this.submitUser}
        />

        <View style={ApplicationStyles.checkboxContainer}>
          <CheckBox
            onValueChange={() =>
              this.setState({ checked: !this.state.checked })
            }
            value={this.state.checked}
            style={ApplicationStyles.checkbox}
          />
          <Text style={ApplicationStyles.label}>
            {ApplicationConstants.loginKeepSignIn}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default LoginPage;
