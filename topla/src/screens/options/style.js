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
        margin: 16,
        flex: 1,
        borderRadius: 12,

        // Shadow
        shadowColor: "#919191",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonsWrapper: {
        marginTop: 24,
    },
    button: {
        width: "100%",
        padding: 14,
        alignItems: "center",
        flexDirection: "row",
    },
    buttonIcon: {
        padding: 12,
        elevation: 4,
        borderRadius: 16,

        // Shadow
        shadowColor: "#919191",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16
    },
    altContent: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 12,
    },
    altTextWrapper: {
        paddingLeft: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    }
});