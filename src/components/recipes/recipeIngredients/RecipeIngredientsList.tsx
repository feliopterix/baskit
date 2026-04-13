import { FlatList, StyleSheet } from "react-native";
import RecipeIngredient from "./RecipeIngredient";
import { IIngredient } from "../../../types";

export default function RecipeIngredientsList(props: {
  ingredients: IIngredient[];
  selectable?: boolean;
  selectedKeys?: string[];
  onToggleIngredient?: (ingredient: IIngredient, index: number) => void;
}) {
  return (
    <FlatList
      style={styles.list}
      data={props.ingredients}
      renderItem={({ item, index }) => (
        <RecipeIngredient
          ingredient={item}
          selectable={props.selectable}
          selected={
            props.selectable
              ? props.selectedKeys?.includes(`${item.name}-${index}`)
              : true
          }
          onToggle={() => {
            props.onToggleIngredient?.(item, index);
          }}
        />
      )}
      keyExtractor={(item, index) => `${item.name}-${index}`}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 8,
  },
});
