import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useBaskitTheme } from "../../../context/theme/ThemeContextProvider";

export default function AddToBasket(props: {
  selectedCount: number;
  totalCount: number;
  onAddAll: () => void;
  onAddSelected: () => void;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.accentColor.passive },
        ]}
        onPress={props.onAddAll}
      >
        <Text style={{ color: theme.button.foreground }}>Alle hinzufuegen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              props.selectedCount > 0
                ? theme.accentColor.active
                : theme.surface.cardSoft,
          },
        ]}
        disabled={props.selectedCount === 0}
        onPress={props.onAddSelected}
      >
        <Text style={{ color: theme.button.foreground }}>
          Ausgewaehlte ({props.selectedCount}/{props.totalCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
