import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        padding: 4,
        marginBottom: 16,
        alignItems: "flex-start",
    },
    element: {
        padding: 16,
        borderRadius: 12,
        width: "100%",

        marginBottom: 12,

        // Shadow
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 4,
    },
    play: {
        justifyContent: "center",
        alignItems: "center",
        width: 54,
        height: 54,
        backgroundColor: "#0F7CBB",
        borderRadius: 64,
        elevation: 5,
        position: "absolute",
        bottom: -8,
        right: 18,
    },
    elementLogo: {
        width: 30,
        height: 8,
        opacity: 0.33,
    },
    elementHardness: {
        fontSize: 20,
        marginTop: 8,
    },
    elementBar: {
        width: "100%",
        marginTop: 12,
        height: 2,
        backgroundColor: "#000",
        opacity: 0.1,
    },
    elementContent: {
        marginTop: 8,
        fontSize: 18,
    },
    elementBasamak: {
        marginTop: 8,
        fontSize: 18,
    }
});