import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { BlurView } from "expo-blur";
import { AssetLib } from "../../AssetLib";
import { useBasketItemContext } from "../../context/basketItems/BasketItemsContextProvider";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";
import { AssembleIngredient } from "../../helper/AssembleIngredient";
import { BasketDisplayGroup } from "./basketViewModel";

export default function BasketListItemModal(props: {
  group: BasketDisplayGroup;
  onClose: () => void;
}) {
  const theme = useBaskitTheme();
  const { modifyItem } = useBasketItemContext();

  return (
    <BlurView style={styles.overlay} intensity={12}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface.overlay,
            borderColor: theme.surface.cardSoft,
          },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              {AssembleIngredient(props.group.aggregate)}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              {props.group.sourceGroupCount > 1
                ? `${props.group.sourceGroupCount} Quellen`
                : "Eine Quelle"}
            </Text>
          </View>
          <TouchableOpacity onPress={props.onClose}>
            <Image style={styles.closeIcon} source={AssetLib.Cross}></Image>
          </TouchableOpacity>
        </View>

        <FlatList
          data={props.group.sourceRows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View
              style={[
                styles.row,
                {
                  backgroundColor: theme.surface.card,
                  borderColor: theme.surface.cardSoft,
                },
              ]}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: theme.text.primary }]}>
                  {AssembleIngredient(item)}
                </Text>
                <Text style={[styles.rowMeta, { color: theme.text.secondary }]}>
                  {item.sourceRecipeTitle || "Eigen"}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.rowButton,
                  {
                    backgroundColor: item.markedAsDeleted
                      ? theme.accentColor.active
                      : theme.accentColor.passive,
                  },
                ]}
                onPress={async () => {
                  await modifyItem({
                    ...item,
                    markedAsDeleted: !item.markedAsDeleted,
                  });
                  props.onClose();
                }}
              >
                <Text style={{ color: theme.button.foreground }}>
                  {item.markedAsDeleted ? "Wiederherstellen" : "Ausblenden"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    padding: 12,
  },
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  list: {
    gap: 8,
  },
  row: {
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  rowText: {
    marginBottom: 10,
  },
  rowTitle: {
    fontSize: 16,
  },
  rowMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  rowButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
