import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";
import { normalizeIngredient } from "../../helper/NormalizeIngredient";
import { IIngredient } from "../../types";

export default function AddCustomItem(props: {
  confirmData: (ingredient: IIngredient) => void;
}) {
  const theme = useBaskitTheme();
  const unitInput = useRef<TextInput | null>(null);
  const nameInput = useRef<TextInput | null>(null);
  const [countValue, setCountValue] = useState<number | null>(null);
  const [unitValue, setUnitValue] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState<string>("");

  const clearMe = () => {
    setCountValue(null);
    setUnitValue(null);
    setNameValue("");
  };

  const submit = () => {
    const normalized = normalizeIngredient({
      count: countValue,
      unit: unitValue,
      name: nameValue,
    });
    if (!normalized) return;
    props.confirmData(normalized);
    clearMe();
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={[
            styles.text,
            {
              color: theme.text.primary,
              backgroundColor: theme.surface.cardSoft,
            },
          ]}
          keyboardType="numeric"
          value={countValue && countValue > 0 ? countValue.toString() : ""}
          placeholder="2"
          placeholderTextColor={theme.text.muted}
          onChangeText={(text: string) => {
            setCountValue(Number.parseFloat(text));
          }}
          onSubmitEditing={() => {
            unitInput.current?.focus();
          }}
        />
        <TextInput
          style={[
            styles.text,
            {
              color: theme.text.primary,
              backgroundColor: theme.surface.cardSoft,
            },
          ]}
          ref={unitInput}
          value={unitValue ?? ""}
          placeholder="TL"
          placeholderTextColor={theme.text.muted}
          onChangeText={setUnitValue}
          onSubmitEditing={() => {
            nameInput.current?.focus();
          }}
        />
        <TextInput
          style={[
            styles.text,
            styles.nameInput,
            {
              color: theme.text.primary,
              backgroundColor: theme.surface.cardSoft,
            },
          ]}
          ref={nameInput}
          value={nameValue}
          placeholder="Paprikapulver"
          placeholderTextColor={theme.text.muted}
          onChangeText={setNameValue}
          onSubmitEditing={submit}
        />
      </View>
      <TouchableHighlight
        disabled={nameValue.trim().length === 0}
        style={[
          styles.button,
          {
            backgroundColor:
              nameValue.trim().length === 0
                ? theme.surface.cardSoft
                : theme.accentColor.active,
          },
        ]}
        onPress={submit}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableHighlight>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 28,
    color: "white",
  },
  text: {
    minWidth: 52,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
  },
  nameInput: {
    flex: 1,
  },
});
