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
    },
    headerText: {
        fontSize: 32,
        color: "#0F7CBB",
        marginBottom: 8,
        fontWeight: "bold",
    },
    headerBar: {
        width: "100%",
        height: 2,
        backgroundColor: "#0F7CBB",
    },
    content: {
        padding: 16,
    },
    modalWrapper: {
        justifyContent: "flex-end",
    },
    modal: {
        padding: 12,
        borderRadius: 6,
        backgroundColor: "#FFF",
    },
    modalTitle: {
        fontSize: 24,
        borderBottomWidth: 2,
        borderColor: "#000",
    },
    button: {
        width: "100%",
        padding: 12,
        backgroundColor: "#0F7CBB",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 32,
    },
    buttonText: {
        fontSize: 16,
        color: "#fff"
    },
    modalSeperator: {
        width: "100%",
        height: 2,
        backgroundColor: "#0F7CBB",
        marginBottom: 8,
        marginTop: 8,
    },
    modalTitle: {
        fontSize: 20,
        color: "#0F7CBB",
    }
});