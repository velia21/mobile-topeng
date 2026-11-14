
import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export const C = {
  bg: "#E2B486",
  sand: "#E2B486",
  brown: "#8C4F2D",
  dark: "#3D2B1F",
  orange: "#A65E2D",
  cream: "#FFF8EF",
  muted: "#8C7768",
  white: "#FFFFFF",
};

export function Button({
  title,
  onPress,
  secondary = false,
  style,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        style,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Screen({
  children,
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
    paddingHorizontal: 15,
    paddingTop: 12,
  },

  button: {
    backgroundColor: C.brown,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  secondary: {
    backgroundColor: "#EAD2B9",
    borderWidth: 1,
    borderColor: "#C89B74",
  },

  buttonText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 12,
  },

  secondaryText: {
    color: C.dark,
  },

  pressed: {
    opacity: 0.75,
  },
});
