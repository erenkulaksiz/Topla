import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        height: 64,
        backgroundColor: "#FFF",
    },
    logo: {
        width: 80,
        height: 40,
    },
    left: {
        flex: 33,
    },
    middle: {
        alignItems: "center",
        justifyContent: "center",
        flex: 33,
    },
    right: {
        flex: 33,
    },
    backWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    back: {
        marginLeft: 24,
        padding: 12,
        backgroundColor: "#EEEE",
        borderRadius: 24,
    }
});