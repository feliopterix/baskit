import { useEffect, useState } from "react";
import {
  TouchableHighlight,
  Image,
  StyleSheet,
  View,
  ColorValue,
} from "react-native";
import { AssetLib } from "../../AssetLib";
import { useBaskitTheme } from "../../context/theme/ThemeContextProvider";

export default function Checkbox(props: {
  children,
  defaultValue?: boolean;
  value?: boolean;
  disabled: boolean,
  hidden?: boolean
  tintColor?: ColorValue;
  onValueChanged?: (checked: boolean) => void;
  onLongPress?: () => void;
}) {
  const theme = useBaskitTheme();
  const [checked, setChecked] = useState<boolean>(props.value ?? props.defaultValue ?? false);

  useEffect(() => {
    if (typeof props.value === "boolean") {
      setChecked(props.value);
      return;
    }

    if (typeof props.defaultValue === "boolean") {
      setChecked(props.defaultValue);
    }
  }, [props.value, props.defaultValue]);

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={"transparent"}
        style={[
          styles.checkbox,
          {
            backgroundColor: props.hidden
              ? "transparent"
              : checked
                ? theme.surface.cardSoft
                : theme.surface.card,
            borderColor: checked ? theme.accentColor.active : theme.accentColor.passive,
            opacity: props.disabled ? 0.62 : 1,
          },
        ]}
        onPress={() => {
          if(props.disabled) return;
          const nextValue = !checked;
          setChecked(nextValue);
          if(props.onValueChanged) props.onValueChanged(nextValue);
        }}
        onLongPress={() => {
          if(props.onLongPress) props.onLongPress();
        }}
      >
        <View style={styles.content}>
          <Image
            style={{
              width: 28,
              height: 28,
              display: props.hidden ? "none" : "flex",
              tintColor: props.disabled
                ? theme.text.muted
                : props.tintColor ?? theme.accentColor.active,
              opacity: props.hidden ? 0 : 1,
            }}
            source={AssetLib.Unchecked}
          ></Image>
          {checked && (
            <Image
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                top: 3,
                left: 7,
                display: props.hidden ? "none" : "flex",
                tintColor: props.disabled
                  ? theme.text.muted
                  : props.tintColor ?? theme.button.foreground,
              }}
              source={AssetLib.Check}
            ></Image>
          )}
          {props.hidden && (
            <View
              style={{ width: 28, height: 28 }}
            ></View>
          )}
          {props.children}
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: "100%",
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
