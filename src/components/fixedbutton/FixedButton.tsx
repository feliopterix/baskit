import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function FixedButton(props: {
  onPress: () => void;
  label?: string;
  accessibilityLabel?: string;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableHighlight
        style={[
          styles.button,
          {
            backgroundColor: theme.accentColor.active,
            shadowColor: theme.accentColor.passive,
          },
        ]}
        underlayColor={theme.accentColor.passive}
        accessibilityRole="button"
        accessibilityLabel={props.accessibilityLabel ?? "Aktion ausführen"}
        onPress={props.onPress}
      >
        <Text style={[styles.text, { color: theme.button.foreground }]}>
          {props.label ?? "+"}
        </Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 64,
    height: 64,
    right: 16,
    bottom: 16,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  text: {
    fontSize: 38,
    lineHeight: 38,
    marginTop: -2,
  },
});
