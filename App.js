import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginPage from "./screens/LoginPage";
import Main from "./screens/Main";

const AppNavigator = createStackNavigator(
  {
    Login: LoginPage,
    Main: Main,
  },
  {
    headerMode: "none",
  }
);

export default createAppContainer(AppNavigator);
