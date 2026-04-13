import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { IIngredient } from "../../types";
import RecipeFormIngredient from "./RecipeFormIngredient";
import RecipeIngredient from "../recipes/recipeIngredients/RecipeIngredient";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";
import { normalizeIngredient } from "../../helper/NormalizeIngredient";

export default function RecipeIngredientsList(props: {
  editable: boolean;
  ingredients: IIngredient[],
  setIngredients: (ingredients: IIngredient[]) => void,
}) {
  const theme = useBaskitTheme();

  return (
    <View>
      <FlatList
        style={styles.list}
        data={props.ingredients}
        renderItem={({ item, index }) => (
          <View style={styles.entry}>
            <View style={styles.entryText}>
              <RecipeIngredient ingredient={item} />
            </View>
            {props.editable && (
              <TouchableOpacity
                style={[
                  styles.removeButton,
                  { backgroundColor: theme.accentColor.passive },
                ]}
                onPress={() => {
                  props.setIngredients(
                    props.ingredients.filter((_, itemIndex) => itemIndex !== index)
                  );
                }}
              >
                <Text style={{ color: theme.button.foreground }}>Entfernen</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item, index) => `${item.name}-${index}`}
      />
      {props.editable && (
        <View style={styles.list}>
          <RecipeFormIngredient confirmData={(ingredient: IIngredient) => {
            const normalized = normalizeIngredient(ingredient);
            if (!normalized) return;
            props.setIngredients([...props.ingredients, normalized]);
          }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 8,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  entryText: {
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
