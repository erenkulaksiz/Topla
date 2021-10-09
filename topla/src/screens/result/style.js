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
        marginBottom: 8,
        fontWeight: "bold",
    },
    headerBar: {
        width: "100%",
        height: 2,
    },
    content: {
        padding: 16,
        paddingTop: 4,
    },
    infoBox: {
        padding: 12,
        marginLeft: 18,
        marginRight: 18,
        marginTop: 8,
        elevation: 2,
        backgroundColor: "white",
        borderRadius: 8,
    },
    infoTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    infoBar: {
        width: "100%",
        height: 2,
        opacity: 0.2,
        backgroundColor: "#000",
    },
    infoContent: {
        marginTop: 8,
    },
    bottomButtonWrapper: {
        position: "absolute",
        flexDirection: "row",
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        bottom: 16,
    },
    bottomButton: {
        width: "90%",
        height: 46,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F7CBB",
        borderRadius: 32,
        flexDirection: "row",
        flex: 1,
    },
});