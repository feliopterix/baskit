import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Checkbox from "../../checkbox/Checkbox";
import { AssembleIngredient } from "../../../helper/AssembleIngredient";
import { IBaskitIngredient as IBaskitItem } from "../../../types";
import { useBaskitTheme } from "../../../context/theme/ThemeContextProvider";

export default function BasketItem(props: {
  ingredient: IBaskitItem;
  sourceCount?: number;
  subtitle?: string;
  onCheckChanged: (checked: boolean) => void;
  onLongPress: () => void;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container}>
      <Checkbox
        defaultValue={props.ingredient.checked}
        disabled={props.ingredient.markedAsDeleted}
        tintColor={
          props.ingredient.checked
            ? theme.text.muted
            : theme.text.primary
        }
        onValueChanged={(checked: boolean) => {
          props.onCheckChanged(checked);
        }}
        onLongPress={() => {
          props.onLongPress();
        }}
      >
        <View style={styles.textWrap}>
          <Text
            style={[
              styles.text,
              {
                color: props.ingredient.markedAsDeleted
                  ? theme.text.muted
                  : props.ingredient.checked
                    ? theme.text.secondary
                    : theme.text.primary,
                textDecorationColor: theme.text.muted,
                textDecorationStyle: "solid",
                textDecorationLine: props.ingredient.markedAsDeleted
                  ? "line-through"
                  : "none",
              },
            ]}
          >
            {AssembleIngredient(props.ingredient)}
          </Text>
          <Text style={[styles.meta, { color: theme.text.muted }]}>
            {props.subtitle ||
              (props.sourceCount && props.sourceCount > 1
                ? `${props.sourceCount} Quellen`
                : "Eine Quelle")}
          </Text>
        </View>
      </Checkbox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
  },
  textWrap: {
    flex: 1,
    paddingVertical: 2,
    paddingLeft: 8,
  },
  text: {
    fontSize: 18,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
  },
});
