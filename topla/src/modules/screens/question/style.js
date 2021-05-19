import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    headerContainer: {
        width: "100%",
        marginTop: 24,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
    },
    headerLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    headerRight: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    headerText: {
        fontSize: 32,
        color: "#0F7CBB",
        marginBottom: 8,
        fontWeight: "bold",
    },
    content: {
        padding: 16,
    },
    timerText: {
        marginLeft: 4,
        fontSize: 18,
        fontWeight: "bold",
    },
    timerFinishText: {
        marginLeft: 8,
    },
    questionCountTitle: {
        fontSize: 24,
    },
    questionCount: {
        fontSize: 24,
        marginLeft: 4,
    },

    // Bars

    barsWrapper: {
        width: "100%",
        marginTop: 8,
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,
    },

    bars: {
        flex: 1,
        height: 4,
        backgroundColor: "#DBDBDB",
        margin: 2,
        borderRadius: 16,
    },

    // Modal
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