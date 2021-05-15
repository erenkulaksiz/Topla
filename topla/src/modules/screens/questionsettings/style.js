import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    headerContainer: {
        width: "100%",
        marginTop: 12,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
    },
    headerText: {
        fontSize: 28,
        color: "#0F7CBB",
        marginBottom: 8,
        fontWeight: "bold",
    },
    headerBar: {
        width: "100%",
        marginLeft: 16,
        marginRight: 16,
        height: 2,
        backgroundColor: "#0F7CBB",
    },
    headerTextWrapperRight: {
        flexDirection: "row-reverse",
        alignItems: "center",
        flex: 1,
    },
    headerTextQuestionSettings: {
        fontSize: 12,
    },
    content: {
        padding: 16,
    }
});