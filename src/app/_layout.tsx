import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { C } from "../components/ui";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: C.bg,
          },

          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="videos"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="mask/[id]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="quiz"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="result"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}