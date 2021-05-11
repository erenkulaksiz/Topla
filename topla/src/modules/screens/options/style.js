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
        margin: 16,
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 12,

        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 6,
    }
});