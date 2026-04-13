import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import Recipes from "./routes/Recipes";
import Basket from "./routes/Basket";
import { useBaskitTheme } from "../context/theme/ThemeContextProvider";

const RecipesRoute = () => <Recipes />;
const BasketListRoute = () => <Basket />;

export default function Router() {
  const theme = useBaskitTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "recipes", title: "Rezepte", focusedIcon: "book-outline" },
    { key: "basketList", title: "Einkaufsliste", focusedIcon: "cart-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    recipes: RecipesRoute,
    basketList: BasketListRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={theme.accentColor.active}
      inactiveColor={theme.text.muted}
      barStyle={{ backgroundColor: theme.surface.card }}
      sceneAnimationEnabled
    />
  );
}
