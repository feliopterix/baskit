import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableHighlight,
  StyleProp,
  ViewStyle,
} from "react-native";
import Checkbox from "../checkbox/Checkbox";
import { IIngredient } from "../../types";

export default function AddCustomItem(props: {
  confirmData: (ingredient: IIngredient) => void,
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
        <TextInput
        style={styles.text}
        keyboardType="numeric"
        value={countValue > 0 ? countValue.toString() : null}
        placeholder="2"
        placeholderTextColor={"rgba(120, 70, 120, 0.5)"}
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
        placeholderTextColor={"rgba(120, 70, 120, 0.5)"}
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
        placeholderTextColor={"rgba(120, 70, 120, 0.5)"}
        onChangeText={setNameValue}
        onSubmitEditing={() => {
            props.confirmData({count: countValue, unit: unitValue, name: nameValue});
            nameInput.current?.blur();
            clearMe();
        }}
        />
      </View>
        <TouchableHighlight disabled={nameValue.length === 0} style={styles.button} onPress={() => {
          props.confirmData({count: countValue, unit: unitValue, name: nameValue});
          clearMe();
        }}>
          <Text style={{...styles.buttonText, color: nameValue.length === 0 ? "rgba(120, 70, 120, 0.5)" : "white" }}>+</Text>
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
    paddingLeft: 8,
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 4,
    backgroundColor: "#8a495f",
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
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  },
});
