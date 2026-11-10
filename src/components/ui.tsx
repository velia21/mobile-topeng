import React from "react";

import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle
} from "react-native";

export const C = {
  bg: "#F4E8D9",
  sand: "#E2B486",
  brown: "#8C4F2D",
  dark: "#4A2B1B",
  orange: "#B66B32",
  cream: "#FFF8EF",
  muted: "#8C7768",
  white: "#FFFFFF"
};

export function Button({
  title,
  onPress,
  secondary = false,
  style
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondary,
        style
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryText
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Screen({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.screen}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 22,
    paddingTop: 18
  },

  button: {
    backgroundColor: C.brown,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center"
  },

  secondary: {
    backgroundColor: "#EAD2B9",
    borderWidth: 1,
    borderColor: "#C89B74"
  },

  buttonText: {
    color: C.white,
    fontWeight: "700",
    fontSize: 14
  },

  secondaryText: {
    color: C.dark
  }
});