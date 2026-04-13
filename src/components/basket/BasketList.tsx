import { useMemo, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useBasketItemContext } from "../../context/basketItems/BasketItemsContextProvider";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";
import BasketItem from "./basketItem/BasketItem";
import BasketListItemModal from "./BasketListItemModal";
import { BasketDisplayGroup, buildBasketSections } from "./basketViewModel";

export default function BasketList() {
  const theme = useBaskitTheme();
  const { basketItems, loading, error, reload, setGroupChecked } =
    useBasketItemContext();
  const [modalGroup, setModalGroup] = useState<BasketDisplayGroup | null>(null);

  const sections = useMemo(
    () => buildBasketSections(basketItems),
    [basketItems]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={[styles.placeholder, { color: theme.text.secondary }]}>
          Einkaufsliste wird geladen...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.placeholder, { color: theme.text.secondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            {
              backgroundColor: theme.accentColor.active,
            },
          ]}
          onPress={() => {
            reload();
          }}
        >
          <Text style={{ color: theme.button.foreground }}>Erneut laden</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.placeholder, { color: theme.text.secondary }]}>
          Keine Eintraege im Basket.
        </Text>
        <Text style={[styles.help, { color: theme.text.muted }]}>
          Fuege Zutaten aus einem Rezept oder eigene Positionen hinzu.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.text.muted }]}>
              {section.subtitle}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <BasketItem
            ingredient={item.aggregate}
            sourceCount={item.sourceGroupCount}
            subtitle={item.subtitle}
            onCheckChanged={(checked) => {
              setGroupChecked(item.sourceRows, checked);
            }}
            onLongPress={() => {
              setModalGroup(item);
            }}
          />
        )}
      />

      {modalGroup && (
        <BasketListItemModal
          group={modalGroup}
          onClose={() => {
            setModalGroup(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    textTransform: "uppercase",
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  placeholder: {
    fontSize: 16,
    textAlign: "center",
  },
  help: {
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
