import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

export default function MySeriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MES SÉRIES</Text>
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
