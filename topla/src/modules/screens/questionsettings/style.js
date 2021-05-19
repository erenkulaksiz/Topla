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
        flexDirection: "row",
    },
    headerText: {
        fontSize: 28,
        color: "#0F7CBB",
        marginBottom: 8,
        fontWeight: "bold",
    },
    headerBar: {
        width: "100%",
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
        padding: 16,
        flex: 1,
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
        width: "100%",
        padding: 24,
        borderRadius: 8,
        backgroundColor: "#dedede"
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
        width: "100%",
        height: 35,
        flexDirection: "row",
        alignItems: "center",
    },
    settingTitle: {
        fontSize: 18,
    },
    setting_incrementWrapper: {
        flex: 1,
        backgroundColor: "gray",
    },
    setting_increment: {
        height: "100%",
        width: "70%",
        backgroundColor: "red",
    }
});