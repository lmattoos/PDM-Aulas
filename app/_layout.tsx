import { AuthProvider } from "@/context/AuthProvider";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="entrar" />
      </Stack>
    </AuthProvider>
  );
}
