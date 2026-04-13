import { useState } from "react";
import { Image, StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";
import { BlurView } from "expo-blur";
import { AssetLib } from "../../AssetLib";
import BasketList from "../../components/basket/BasketList";
import AddCustomItem from "../../components/basket/AddCustomItem";
import { useBasketItemContext } from "../../context/basketItems/BasketItemsContextProvider";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";
import { IIngredient } from "../../types";

export default function Basket() {
  const theme = useBaskitTheme();
  const { addItem, clearAllItems } = useBasketItemContext();

  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface.background }]}>
      <View style={styles.basketContainer}>
        <View
          style={[
            styles.titleContainer,
            { backgroundColor: theme.surface.card },
          ]}
        >
          <View>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Einkaufsliste
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Abhaken, ausblenden und eigene Positionen ergaenzen.
            </Text>
          </View>
          <TouchableHighlight
            style={[
              styles.clearButton,
              { backgroundColor: theme.accentColor.passive },
            ]}
            underlayColor={theme.accentColor.active}
            onPress={() => {
              setShowClearModal(true);
            }}
          >
            <Image style={styles.clearIcon} source={AssetLib.Trash}></Image>
          </TouchableHighlight>
        </View>
        <View style={styles.listContainer}>
          <BasketList></BasketList>
        </View>
        <View
          style={[
            styles.addCustomContainer,
            { backgroundColor: theme.surface.card },
          ]}
        >
          <AddCustomItem
            confirmData={(ingredient: IIngredient) => {
              addItem(ingredient);
            }}
          ></AddCustomItem>
        </View>
      </View>
      {showClearModal && (
        <View style={styles.clearContainer}>
          <BlurView
            style={[styles.clearModal, { backgroundColor: theme.surface.overlay }]}
            intensity={10}
          >
            <Text style={[styles.clearModalTitle, { color: theme.text.primary }]}>
              Einkaufsliste leeren?
            </Text>
            <Text style={[styles.clearModalText, { color: theme.text.secondary }]}>
              Alle Basket-Eintraege werden entfernt. Dieser Schritt kann nicht
              rueckgaengig gemacht werden.
            </Text>
            <View style={styles.clearModalButtonRow}>
              <TouchableHighlight
                style={[
                  styles.clearModalButtonKeep,
                  { backgroundColor: theme.surface.cardSoft },
                ]}
                underlayColor={theme.surface.card}
                onPress={() => {
                  setShowClearModal(false);
                }}
              >
                <Text style={{ color: theme.text.primary }}>Behalten</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[
                  styles.clearModalButtonDelete,
                  { backgroundColor: theme.accentColor.active },
                ]}
                underlayColor={theme.accentColor.passive}
                onPress={async () => {
                  await clearAllItems();
                  setShowClearModal(false);
                }}
              >
                <Text style={{ color: theme.button.foreground }}>Leeren</Text>
              </TouchableHighlight>
            </View>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  basketContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainer: {
    flex: 1,
  },
  clearContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    padding: 12,
  },
  clearModal: {
    padding: 18,
    borderRadius: 24,
  },
  clearModalTitle: {
    fontSize: 22,
  },
  clearModalText: {
    paddingTop: 8,
    fontSize: 15,
  },
  clearModalButtonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  clearModalButtonKeep: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 14,
  },
  clearModalButtonDelete: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 14,
  },
  titleContainer: {
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 22,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "SFCompactRoundedSemibold",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  clearButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: {
    width: 24,
    height: 24,
  },
  addCustomContainer: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 16,
    borderRadius: 22,
  },
});
