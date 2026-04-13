import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native-virtualized-view";
import { BlurView } from "expo-blur";
import { ImageLib } from "../../../ImageLib";
import { AssetLib } from "../../../AssetLib";
import RecipeIngredientsList from "../recipeIngredients/RecipeIngredientsList";
import Instructions from "../instructions/Instructions";
import AddToBasket from "../addtobasket/AddToBasket";
import { IBaskitRecipe } from "../../../types";
import { useBasketItemContext } from "../../../context/basketItems/BasketItemsContextProvider";
import useDBRemove from "../../../context/database/hooks/useDBRemove";
import { useBaskitTheme } from "../../../context/theme/ThemeContextProvider";
import RecipeForm from "../../form/RecipeForm";

export default function RecipeModal(props: {
  data: IBaskitRecipe;
  onClose: (changed: boolean) => void;
}) {
  const theme = useBaskitTheme();
  const { addRecipeToBasket, markRecipeDeleted } = useBasketItemContext();
  const removeRecipe = useDBRemove("recipes");
  const [editing, setEditing] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    props.data.ingredients.map((ingredient, index) => `${ingredient.name}-${index}`)
  );

  const selectedIngredients = useMemo(
    () =>
      props.data.ingredients.filter((ingredient, index) =>
        selectedKeys.includes(`${ingredient.name}-${index}`)
      ),
    [props.data.ingredients, selectedKeys]
  );

  const toggleIngredient = (name: string, index: number) => {
    const key = `${name}-${index}`;
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const handleAddToBasket = async (ingredients: typeof selectedIngredients) => {
    await addRecipeToBasket(props.data, ingredients);

    const ingredientCount = ingredients.length;
    const ingredientLabel = ingredientCount === 1 ? "Zutat" : "Zutaten";
    Alert.alert(
      "Zur Einkaufsliste hinzugefuegt",
      `${ingredientCount} ${ingredientLabel} aus "${props.data.title}" wurden uebernommen.`
    );
    props.onClose(true);
  };

  if (editing) {
    return (
      <RecipeForm
        recipe={props.data}
        onClose={(changed) => {
          setEditing(false);
          props.onClose(changed);
        }}
      />
    );
  }

  return (
    <View style={styles.overlay}>
      <BlurView
        style={[styles.container, { backgroundColor: theme.surface.overlay }]}
        intensity={12}
      >
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Image style={styles.headerIcon} source={AssetLib.Edit}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await removeRecipe({
                    field: "id",
                    conditional: "=",
                    value: props.data.id,
                  });
                  await markRecipeDeleted(props.data);
                  props.onClose(true);
                }}
              >
                <Image style={styles.headerIcon} source={AssetLib.Trash}></Image>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => props.onClose(false)}>
              <Image style={styles.headerIcon} source={AssetLib.Cross}></Image>
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: theme.text.primary }]}>
            {props.data.title}
          </Text>
          <Image
            style={styles.image}
            source={
              props.data.image && props.data.image !== "Default"
                ? { uri: props.data.image }
                : ImageLib["Default"]
            }
          />

          {props.data.description ? (
            <Text style={[styles.description, { color: theme.text.secondary }]}>
              {props.data.description}
            </Text>
          ) : null}

          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Zutaten
          </Text>
          <RecipeIngredientsList
            ingredients={props.data.ingredients}
            selectable
            selectedKeys={selectedKeys}
            onToggleIngredient={(ingredient, index) => {
              toggleIngredient(ingredient.name, index);
            }}
          />

          <AddToBasket
            totalCount={props.data.ingredients.length}
            selectedCount={selectedIngredients.length}
            onAddAll={async () => {
              await handleAddToBasket(props.data.ingredients);
            }}
            onAddSelected={async () => {
              await handleAddToBasket(selectedIngredients);
            }}
          />

          <Instructions instructions={props.data.instructions} />
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    padding: 8,
  },
  container: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    padding: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 30,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 22,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 10,
  },
});
