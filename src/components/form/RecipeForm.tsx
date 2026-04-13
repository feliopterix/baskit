import { useContext, useEffect, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native-virtualized-view";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import { AssetLib } from "../../AssetLib";
import { ImageLib } from "../../ImageLib";
import { DBContext } from "../../context/database/DBContextProvider";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";
import { normalizeIngredient } from "../../helper/NormalizeIngredient";
import { ToDBRecipe } from "../../helper/ToDBRecipe";
import { IBaskitRecipe, IIngredient } from "../../types";
import AddRecipe from "./AddRecipe";
import RecipeFormDescription from "./RecipeFormDescription";
import RecipeFormIngredientsList from "./RecipeFormIngredientsList";
import RecipeFormInstructions from "./RecipeFormInstructions";
import RecipeFormTitle from "./RecipeFormTitle";

export default function RecipeForm(props: {
  recipe?: IBaskitRecipe | null;
  onClose: (changed: boolean) => void;
}) {
  const theme = useBaskitTheme();
  const database = useContext(DBContext);
  const [titleValue, setTitleValue] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);

  useEffect(() => {
    if (!props.recipe) return;

    setTitleValue(props.recipe.title);
    setImageUri(
      props.recipe.image && props.recipe.image !== "Default"
        ? props.recipe.image
        : null
    );
    setDescriptionValue(props.recipe.description || "");
    setInstructions(
      props.recipe.instructions.length > 0 ? props.recipe.instructions : [""]
    );
    setIngredients(props.recipe.ingredients);
  }, [props.recipe]);

  const sanitizedIngredients = useMemo(
    () =>
      ingredients
        .map((ingredient) => normalizeIngredient(ingredient))
        .filter((ingredient): ingredient is IIngredient => ingredient !== null),
    [ingredients]
  );

  const sanitizedInstructions = useMemo(
    () => instructions.map((item) => item.trim()).filter((item) => item.length > 0),
    [instructions]
  );

  const isValid = titleValue.trim().length > 0 && sanitizedIngredients.length > 0;

  const saveRecipe = async () => {
    if (!database || !isValid) return;

    const recipePayload = {
      title: titleValue.trim(),
      image: imageUri || "Default",
      ingredients: sanitizedIngredients,
      description: descriptionValue.trim(),
      instructions: sanitizedInstructions,
    };

    if (props.recipe) {
      await database.executeQuery(
        `
          UPDATE recipes
          SET title = ?,
              image = ?,
              ingredients = ?,
              description = ?,
              instructions = ?
          WHERE id = ?
        `,
        [
          recipePayload.title,
          recipePayload.image,
          JSON.stringify(recipePayload.ingredients),
          recipePayload.description,
          JSON.stringify(recipePayload.instructions),
          props.recipe.id,
        ]
      );
      return;
    }

    const dbRecipe = ToDBRecipe(recipePayload);
    await database.executeQuery(
      `
        INSERT INTO recipes (id, title, image, ingredients, description, instructions)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        dbRecipe.id,
        dbRecipe.title,
        dbRecipe.image,
        dbRecipe.ingredients,
        dbRecipe.description,
        dbRecipe.instructions,
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.overlay}>
      <BlurView style={[styles.container, { backgroundColor: theme.surface.overlay }]} intensity={12}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.heading, { color: theme.text.primary }]}>
              {props.recipe ? "Rezept bearbeiten" : "Neues Rezept"}
            </Text>
            <TouchableOpacity onPress={() => props.onClose(false)}>
              <Image style={styles.icon} source={AssetLib.Cross}></Image>
            </TouchableOpacity>
          </View>

          <RecipeFormTitle title={titleValue} setTitle={setTitleValue} />

          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={imageUri ? { uri: imageUri } : ImageLib["Default"]}
            />
            {imageUri ? (
              <TouchableHighlight
                style={[
                  styles.imageDeleteButton,
                  { backgroundColor: theme.surface.overlay },
                ]}
                underlayColor={theme.surface.cardSoft}
                onPress={() => {
                  setImageUri(null);
                }}
              >
                <Image style={styles.imageDeleteIcon} source={AssetLib.Cross} />
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                style={[
                  styles.camButton,
                  { backgroundColor: theme.surface.overlay },
                ]}
                underlayColor={theme.surface.cardSoft}
                onPress={pickImage}
              >
                <Image style={styles.camIcon} source={AssetLib.Camera} />
              </TouchableHighlight>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Beschreibung
            </Text>
            <RecipeFormDescription
              description={descriptionValue}
              setDescription={setDescriptionValue}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Zutaten
            </Text>
            <RecipeFormIngredientsList
              editable={true}
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          </View>

          <View style={styles.section}>
            <RecipeFormInstructions
              instructions={instructions}
              setInstructions={setInstructions}
            />
          </View>

          <AddRecipe
            mode={props.recipe ? "edit" : "create"}
            disabled={!isValid}
            onCancel={() => {
              props.onClose(false);
            }}
            onConfirm={async () => {
              await saveRecipe();
              props.onClose(true);
            }}
          />
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
  },
  icon: {
    width: 24,
    height: 24,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 22,
  },
  camButton: {
    position: "absolute",
    padding: 14,
    borderRadius: 16,
  },
  camIcon: {
    width: 24,
    height: 24,
  },
  imageDeleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 12,
    borderRadius: 20,
  },
  imageDeleteIcon: {
    width: 20,
    height: 20,
  },
});
