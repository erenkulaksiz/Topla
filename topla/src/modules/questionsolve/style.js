import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        width: "100%",
    },
    questionTitleWrapper: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: 32,
        paddingBottom: 32,
        borderRadius: 12,
    },
    questionTitle: {
        fontSize: 26,
        fontWeight: "bold",
    },
    buttonsWrapper: {
        height: "100%",
        width: "100%",
        paddingTop: 12
    },
    button: {
        width: "100%",
        padding: 12,
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    dragRecieverBox: {
        height: 64,
        width: 64,
        borderWidth: 2,
        borderColor: "gray",
        padding: 12,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    dragSenderBox: {
        flex: 1,
        padding: 24,
        margin: 8,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
    answerBoxes: {
        width: "100%",
        marginTop: 24,
        marginLeft: 24,
        marginRight: 24,
        padding: 14,
        backgroundColor: "#eee",
        borderRadius: 12,
        flexDirection: "row",
    },
    elements: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between"
    }
});