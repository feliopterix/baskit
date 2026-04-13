import { StyleSheet, TextInput } from "react-native";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function RecipeFormTitle(props: {
  title: string;
  setTitle: (title: string) => void;
}) {
  const theme = useBaskitTheme();

  return (
    <TextInput
      style={[
        styles.title,
        {
          color: theme.text.primary,
          borderColor: theme.surface.cardSoft,
          backgroundColor: theme.surface.card,
        },
      ]}
      value={props.title}
      placeholder="Titel"
      placeholderTextColor={theme.text.muted}
      onChangeText={props.setTitle}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
