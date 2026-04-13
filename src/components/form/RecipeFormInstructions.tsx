import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { Text } from "react-native-paper";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function RecipeFormInstructions(props: {
  instructions: string[];
  setInstructions: (instructions: string[]) => void;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text.primary }]}>
        Anleitung
      </Text>

      <View style={styles.instructionsContainer}>
        {props.instructions.map((instruction: string, index: number) => {
          return (
            <View style={styles.instruction} key={`${instruction}-${index}`}>
              <Text style={[styles.counter, { color: theme.text.secondary }]}>
                {index + 1 + "."}
              </Text>
              <TextInput
                style={[
                  styles.text,
                  {
                    color: theme.text.primary,
                    borderColor: theme.surface.cardSoft,
                    backgroundColor: theme.surface.card,
                  },
                ]}
                value={instruction}
                placeholder="Anweisung"
                placeholderTextColor={theme.text.muted}
                multiline
                onChangeText={(text) => {
                  const next = [...props.instructions];
                  next[index] = text;
                  props.setInstructions(next);
                }}
              />
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  { backgroundColor: theme.accentColor.passive },
                ]}
                onPress={() => {
                  props.setInstructions(
                    props.instructions.filter((_, itemIndex) => itemIndex !== index)
                  );
                }}
              >
                <Text style={{ color: theme.button.foreground }}>Entfernen</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme.accentColor.active },
          ]}
          onPress={() => {
            props.setInstructions([...props.instructions, ""]);
          }}
        >
          <Text style={{ color: theme.button.foreground }}>
            Schritt hinzufuegen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
  },
  instructionsContainer: {
    marginTop: 16,
    gap: 10,
  },
  instruction: {
    gap: 8,
  },
  counter: {
    fontSize: 14,
  },
  text: {
    minHeight: 64,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  deleteButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },
});
