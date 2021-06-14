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
        elevation: 2,
    },
    questionTitle: {
        fontSize: 26,
        fontWeight: "bold",
    },
    buttonsWrapper: {
        marginTop: 12,
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
    }
});