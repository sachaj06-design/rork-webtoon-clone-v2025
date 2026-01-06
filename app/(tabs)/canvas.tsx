import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

export default function CanvasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CANVAS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundMain,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
