import { StyleSheet, TextInput } from "react-native";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function RecipeFormDescription(props: {
  description: string;
  setDescription: (description: string) => void;
}) {
  const theme = useBaskitTheme();

  return (
    <TextInput
      style={[
        styles.description,
        {
          color: theme.text.secondary,
          borderColor: theme.surface.cardSoft,
          backgroundColor: theme.surface.card,
        },
      ]}
      value={props.description}
      placeholder="Beschreibung"
      placeholderTextColor={theme.text.muted}
      multiline
      onChangeText={props.setDescription}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginBottom: 16,
  },
  description: {
    flex: 1,
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    textAlignVertical: "top",
  },
});
