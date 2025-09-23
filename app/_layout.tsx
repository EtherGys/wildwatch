import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'transparentModal',
          title: 'Observation',
          headerShown: true,
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
