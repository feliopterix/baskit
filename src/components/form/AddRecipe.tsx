import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function AddRecipe(props: {
  onConfirm: () => void;
  onCancel: () => void;
  mode?: "create" | "edit";
  disabled?: boolean;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accentColor.passive }]}
        onPress={props.onCancel}
      >
        <Text style={[styles.text, { color: theme.button.foreground }]}>
          Abbrechen
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={props.disabled}
        style={[
          styles.button,
          {
            backgroundColor: props.disabled
              ? theme.surface.cardSoft
              : theme.accentColor.active,
            opacity: props.disabled ? 0.6 : 1,
          },
        ]}
        onPress={props.onConfirm}
      >
        <Text style={[styles.text, { color: theme.button.foreground }]}>
          {props.mode === "edit" ? "Rezept speichern" : "Rezept anlegen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 14,
  },
  text: {
    fontSize: 16,
  },
});
