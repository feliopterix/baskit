import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { ImageLib } from "../../ImageLib";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function RecipeButton(props: {
  title: string;
  image: string;
  onPress: () => void;
  description?: string;
}) {
  const theme = useBaskitTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
        <Image
          style={styles.image}
          source={
            props.image && props.image !== "Default"
              ? { uri: props.image }
              : ImageLib["Default"]
          }
        />
        <View
          style={[
            styles.textBackground,
            { backgroundColor: theme.surface.overlay },
          ]}
        >
          <Text style={[styles.text, { color: theme.text.primary }]}>
            {props.title}
          </Text>
          {props.description ? (
            <Text
              style={[styles.description, { color: theme.text.secondary }]}
              numberOfLines={2}
            >
              {props.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  textBackground: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 1.4,
    borderRadius: 22,
  },
  button: {
    width: "100%",
    justifyContent: "flex-end",
  },
});
