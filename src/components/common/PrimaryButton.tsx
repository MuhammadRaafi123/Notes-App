import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

interface Props {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient
        colors={["#6696B4", "#96BDCF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 10,

    elevation: 4,
  },

  text: {
    color: "#fff",

    fontWeight: "700",

    fontSize: 17,
  },
});