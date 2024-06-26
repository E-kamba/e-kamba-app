import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { COLORS, SIZES } from "../Theme";

const Search = ({ navigation }) => {
    return ( <
        View style = { styles.container } >
        <
        Headergeral / > { /* searchbar */ } <
        View style = {
            {
                flexDirection: 'row',
                paddingHorizontal: 24,
                paddingVertical: 4,
                gap: 12,
            }
        } >
        <
        View style = {
            {
                flex: 1,
                height: 52,
                borderColor: '#bcaaa4',
                borderWidth: 0.5,
                padding: 12,
                borderRadius: 30,
                gap: 12,
                alignItems: 'center',
                flexDirection: 'row',
            }
        } >
        <
        AntDesign name = "search1"
        size = { 24 }
        color = "#bcaaa4" / >
        <
        TextInput style = {
            {
                flex: 1,
            }
        }
        placeholder = "Procurar"
        onChangeValue = {
            () => { setSearch() } }
        /> <
        /View> <
        TouchableOpacity style = {
            {
                backgroundColor: COLORS.title,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 30
            }
        } >
        <
        FontAwesome name = "sliders"
        size = { 24 }
        color = "#fff" / >
        <
        /TouchableOpacity> <
        /View> <
        /View>
    )
}

export default Search;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        width: '100%',
        height: SIZES.height,
    },
})