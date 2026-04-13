import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Checkbox from "../../checkbox/Checkbox";
import { AssembleIngredient } from "../../../helper/AssembleIngredient";
import { IIngredient } from "../../../types";
import { useBaskitTheme } from "../../../context/theme/ThemeContextProvider";

export default function RecipeIngredient(props: {
  ingredient: IIngredient;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container}>
      <Checkbox
        disabled={!props.selectable}
        hidden={!props.selectable}
        value={props.selectable ? props.selected : true}
        onValueChanged={() => {
          props.onToggle?.();
        }}
      >
        <Text style={[styles.text, { color: theme.text.primary }]}>
          {AssembleIngredient(props.ingredient)}
        </Text>
      </Checkbox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    marginLeft: 8,
  },
});
