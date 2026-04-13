import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableHighlight,
} from "react-native";
import Checkbox from "../checkbox/Checkbox";
import { IIngredient } from "../../types";

export default function RecipeFormIngredient(props: {
  confirmData: (ingredient: IIngredient) => void
}) {
  const unitInput = useRef<TextInput | null>(null);
  const nameInput = useRef<TextInput | null>(null);

  const [countValue, setCountValue] = useState<number | null>(null);
  const [unitValue, setUnitValue] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState<string>("");

  const clearMe = () => {
    setCountValue(null);
    setUnitValue(null);
    setNameValue("");
  }

  return (
    <>
      <View style={styles.container}>
        <Checkbox hidden={true} disabled={true} defaultValue={true}>
          <TextInput
            style={styles.text}
            keyboardType="numeric"
            value={countValue > 0 ? countValue.toString() : null}
            placeholder="2"
            placeholderTextColor={"rgba(100, 100, 100, 0.5)"}
            onChangeText={(text: string) => {
              setCountValue(Number.parseFloat(text));
            }}
            onSubmitEditing={() => {
              unitInput.current?.focus()
            }}
          />
          <TextInput
            style={styles.text}
            ref={unitInput}
            value={unitValue}
            placeholder="TL"
            placeholderTextColor={"rgba(100, 100, 100, 0.5)"}
            onChangeText={setUnitValue}
            onSubmitEditing={() => {
              nameInput.current?.focus()
            }}
            />
          <TextInput
            style={styles.text}
            ref={nameInput}
            value={nameValue}
            placeholder="Paprikapulver"
            placeholderTextColor={"rgba(100, 100, 100, 0.5)"}
            onChangeText={setNameValue}
            onSubmitEditing={() => {
              props.confirmData({count: countValue, unit: unitValue, name: nameValue});
              clearMe();
            }}
          />
        </Checkbox>
      </View>
        <TouchableHighlight disabled={nameValue.length === 0} style={styles.button} onPress={() => {
          props.confirmData({count: countValue, unit: unitValue, name: nameValue});
        }}>
          <Text style={{...styles.buttonText, color: nameValue.length === 0 ? "rgba(100, 100, 100, 0.7)" : "white" }}>Hinzufügen</Text>
        </TouchableHighlight>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flex: 0.33,
    paddingLeft: 4,
    paddingRight: 4,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 4,
    backgroundColor: "rgba(40, 40, 40, 0.8)",
  },
  buttonText: {
    height: 42,
    top: 11,

    fontSize: 16,

    color: "white",
  },
  text: {
    color: "white",
    fontSize: 22,
    marginLeft: 8,
  },
});
