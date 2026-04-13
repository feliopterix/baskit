import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import RecipeButton from "../../components/recipes/RecipeButton";
import RecipeModal from "../../components/recipes/recipemodal/RecipeModal";
import FixedButton from "../../components/fixedbutton/FixedButton";
import RecipeForm from "../../components/form/RecipeForm";
import { IBaskitRecipe } from "../../types";
import useDBQuery from "../../context/database/hooks/useDBQuery";
import { FromDBRecipe } from "../../helper/FromDBRecipe";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function Recipes() {
  const theme = useBaskitTheme();
  const queryRecipes = useDBQuery("recipes");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [changed, setChanged] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<IBaskitRecipe[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<IBaskitRecipe | null>(null);
  const [isAddingRecipe, setIsAddingRecipe] = useState<boolean>(false);

  useEffect(() => {
    if (!changed) return;

    setLoading(true);
    setError(null);

    queryRecipes()
      .then((result) => {
        setRecipes(result.rows._array.map((data) => FromDBRecipe(data)));
        setChanged(false);
      })
      .catch((reason) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "Rezepte konnten nicht geladen werden."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [changed, queryRecipes]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.surface.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Rezepte
        </Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          Erstellen, bearbeiten und direkt in die Einkaufsliste uebernehmen.
        </Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <Text style={{ color: theme.text.secondary }}>
            Rezepte werden geladen...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={{ color: theme.text.secondary }}>{error}</Text>
        </View>
      )}

      {!loading && !error && recipes.length === 0 && (
        <View style={styles.center}>
          <Text style={{ color: theme.text.secondary }}>
            Noch keine Rezepte vorhanden.
          </Text>
        </View>
      )}

      {!loading && !error && recipes.length > 0 && (
        <FlatList
          data={recipes}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RecipeButton
              title={item.title}
              image={item.image}
              description={item.description}
              onPress={() => {
                setActiveRecipe(item);
              }}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <FixedButton
        accessibilityLabel="Neues Rezept anlegen"
        onPress={() => {
          setIsAddingRecipe(true);
        }}
      />

      {activeRecipe && (
        <RecipeModal
          data={activeRecipe}
          onClose={(wasChanged: boolean) => {
            setActiveRecipe(null);
            setChanged(wasChanged);
          }}
        />
      )}

      {isAddingRecipe && (
        <RecipeForm
          onClose={(wasChanged: boolean) => {
            setIsAddingRecipe(false);
            setChanged(wasChanged);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  list: {
    paddingBottom: 96,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
