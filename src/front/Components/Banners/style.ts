import { StyleSheet } from "react-native";
import { SIZES } from "../../Theme";

export const styles = StyleSheet.create({
    container: {
        height: 220,
        width: SIZES.width,
        flexDirection: "row",
        gap: 2,
        paddingHorizontal: 12,
        paddingVertical: 12
    }
})
