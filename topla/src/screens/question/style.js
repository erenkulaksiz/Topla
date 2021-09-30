import { StyleSheet } from 'react-native';

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
        flex: 1,
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
        margin: 1,
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
        color: "#fff",
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
    },
    versusContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    versusBox: {
        height: "90%",
        width: "90%",
        overflow: "hidden",
        elevation: 14,
        backgroundColor: "#fff",
        borderRadius: 14,
    },
    overlayReadyWrapper: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 99,
        justifyContent: "center",
        alignItems: "center",
    },
    overlayReady: {
        width: "92%",
        height: "95%",
        elevation: 16,
        backgroundColor: "#fff",
        borderRadius: 24,
        overflow: "hidden",
    },
    bottomButton: {
        position: "absolute",
        width: "90%",
        height: 46,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F7CBB",
        borderRadius: 32,
        flexDirection: "row",
        bottom: 12,
    },
    playerReadyTitleWrapper: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    playerReadyTitle: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 8,
    },
    playerReadyIcon: {
        flex: 70,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    playerReadyButtonWrapper: {
        flex: 30,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    playerReadyButtonText: {
        fontSize: 15,
        marginLeft: 8,
    },
    pageWinnerContainer: {
        flex: 1,
        alignItems: "center",
    },
    pageWinnerTextWrapper: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    pageWinnerTitle: {
        fontSize: 32,
        marginTop: 8,
    },
    pageTimeTextWrapper: {
        width: "100%",
        marginTop: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    pageTimeText: {
        fontSize: 22,
        color: "#000",
    },
    pageWinnerCorrects: {
        width: "100%",
        marginTop: 4,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    pageWinnerProgressWrapper: {
        width: "80%",
        marginTop: 16
    },
    pageWinnerResultText: {
        fontSize: 20
    },
    pageWinnerButtonsWrapper: {
        flex: 1,
        flexDirection: "row",
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pageWinnerButton: {
        justifyContent: "center",
        alignItems: "center",
    },
    pageWinnerButtonIcon: {
        width: 64,
        height: 64,
        padding: 8,
        backgroundColor: "#0F7CBB",
        borderRadius: 64,
        justifyContent: "center",
        alignItems: "center",
    },
    pageWinnerButtonText: {
        color: "#0F7CBB",
        fontSize: 16,
        marginTop: 8,
    },
    playerFinishedWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    playerReadyDesc: {
        width: "100%",
        height: "12%",
        justifyContent: "center",
        alignItems: "center",
    },
    bottomButtonOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center"
    }
});