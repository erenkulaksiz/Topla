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
    premiumWrapper: {
        width: "100%",
        paddingLeft: 18,
        paddingRight: 18,
        padding: 12,
        borderRadius: 12,
    },
    iconWrapper: {
        width: "100%",
    },
    titleWrapper: {
        marginTop: 8,
        width: "100%",
        flexDirection: "row",
    },
    title: {
        flex: 1,
        justifyContent: "center",
    },
    price: {
        textAlign: "right",
        alignItems: "flex-end",
        justifyContent: "center",
        alignContent: "center",
    },
    titleText: {
        fontSize: 20,

    },
    priceText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    productBar: {
        marginTop: 8,
        width: "100%",
        height: 2,
        backgroundColor: "#000",
        opacity: 0.2,
    },
    productDescWrapper: {
        marginTop: 8,
    },
    productDesc: {
        fontSize: 16,
    }
});