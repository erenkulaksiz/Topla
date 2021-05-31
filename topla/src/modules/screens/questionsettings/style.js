import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    headerContainer: {
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
        flex: 1,
        padding: 16,
    },
    bottomButtonWrapper: {
        position: "absolute",
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        bottom: 16,
    },
    bottomButton: {
        position: "absolute",
        width: "90%",
        height: 46,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F7CBB",
        borderRadius: 32,
        flexDirection: "row"
    },
    questionSettingsWrapper: {
        padding: 24,
        borderRadius: 8,
        backgroundColor: "white",
    },
    elementLogoWrapper: {
        height: 13,
        width: 30,
    },
    elementLogo: {
        width: "100%",
        height: "100%",
        opacity: 0.33,
    },
    settingsWrapper: {
        flex: 1,
        marginTop: 8,
    },
    setting: {
        marginTop: 10,
        height: 35,
        flexDirection: "row",
        alignItems: "center",
    },
    bar: {
        height: 2,
        backgroundColor: "#000",
        marginTop: 12,
    },
    settingTitle: {
        fontSize: 18,
    },
    setting_incrementWrapper: {
        flex: 1,
    },
    setting_increment: {
        flexDirection: "row",
        height: "100%",
        width: 120, // TODO: NİZAMİ OLACAK
    },
    settingWrapper: {
        width: "100%",
        justifyContent: "flex-end",
    },
    increment: {
        flex: 33,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    incrementCenter: {
        flex: 33,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    incrementCenter_field: {
        flex: 33,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    decrement: {
        flex: 33,
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    inputfield: {
        padding: 0,
    }
});