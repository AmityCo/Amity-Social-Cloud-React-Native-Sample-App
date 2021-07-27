import * as React from "react";
import { Pressable } from "react-native";
import { StackHeaderProps } from "@react-navigation/stack";
import { Appbar, Avatar, useTheme } from "react-native-paper";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import ASCLogo from "assets/svg/ASCLogo";

const Header: React.FC<
  Pick<StackHeaderProps, "navigation" | "previous" | "scene">
> = ({ scene, previous, navigation }) => {
  const theme = useTheme();
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {previous ? (
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={theme.colors.primary}
        />
      ) : (
        <Pressable
          onPress={() => {
            (navigation as any as DrawerNavigationProp<{}>).openDrawer();
          }}
        >
          <Avatar.Image
            size={40}
            source={require("assets/images/avatar.png")}
          />
        </Pressable>
      )}
      <Appbar.Content title={previous ? title : <ASCLogo />} />
    </Appbar.Header>
  );
};

export default Header;
