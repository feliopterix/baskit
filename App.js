import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import {
  Router,
  Database,
  DBContextProvider,
  migrateDatabase,
} from "./src";
import { BasketItemContextProvider } from "./src/context/basketItems/BasketItemsContextProvider";
import { IsAndroid } from "./src/helper/IsAndroid";
import { Asset } from "expo-asset";
import {
  ThemeContextProvider,
  baskitTheme,
} from "./src/context/theme/ThemeContextProvider";

const db = new Database("baskitDB", "1.0");

export default function App() {
  const [ready, setReady] = useState(false);
  const [dbInitialized, setDBInizialized] = useState(false);

  const [fontsLoaded] = useFonts({
    "SFCompactRoundedSemibold": IsAndroid ? Asset.fromModule(require("./assets/fonts/SF-Compact-Rounded-Semibold.otf"))
    : require("./assets/fonts/SF-Compact-Rounded-Semibold.otf"),
  });


  useEffect(() => {
    const init = async () => {
      await SplashScreen.preventAutoHideAsync();

      await db.InitDB();

      await migrateDatabase(db).catch((e) => console.error(e));

      db.OnReady();

      setDBInizialized(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (dbInitialized && fontsLoaded) {
      SplashScreen.hideAsync();
      setReady(true);
      // db.executeQuery('drop table recipes')
      // db.executeQuery('drop table items')
    }
  }, [dbInitialized, fontsLoaded]);

  if (!ready) {
    return <></>;
  }

  return (
    <DBContextProvider db={db}>
      <BasketItemContextProvider>
        <ThemeContextProvider>
          <SafeAreaProvider>
            <SafeAreaView
              style={[
                styles.container,
                { backgroundColor: baskitTheme.surface.background },
              ]}
            >
              <Router />
            </SafeAreaView>
          </SafeAreaProvider>
        </ThemeContextProvider>
      </BasketItemContextProvider>
    </DBContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
