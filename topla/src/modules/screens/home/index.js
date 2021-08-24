import React, { useState } from 'react';
import { Text, View, Image, SafeAreaView, useWindowDimensions, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
//import Config from 'react-native-config';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGamepad, faPlay, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'

import style from "./style";
import I18n from "../../../utils/i18n.js";
import Header from "../../header";
import Theme from "../../../themes";
import ChildPlayScreen from "../childplay";
import LearnScreen from "../learn";

const HomeScreen = props => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'speedTest', title: I18n.t("home_games") },
        { key: 'childPlay', title: I18n.t("home_childPlay") },
        { key: 'learn', title: I18n.t("home_learn") },
    ]);

    const _navigateToVersus = () => {
        props.navigation.navigate('QuestionSettings', { question: props.questionSettings.questionInitials[5] });
    }

    const _navigateToSpeedTest = () => {
        props.navigation.navigate('QuestionSlotScreen');
    }

    const _render = {
        speedTest: () => <>
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("home_gamesTitle")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            { /*<Text>{JSON.stringify(props.API.DATA)}</Text> */}

            <TouchableOpacity
                style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 24, marginTop: 16, shadowColor: props.settings.darkMode ? "#FFF" : "#919191" }}
                onPress={() => _navigateToVersus()}
                activeOpacity={0.7} >
                <View style={{
                    ...style.element,
                    backgroundColor: Theme(props.settings.darkMode).questionSlotBackground
                }}>
                    <Image style={style.elementLogo} source={require('../../../tc.png')} />
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <View>
                            <FontAwesomeIcon icon={faGamepad} size={30} color={Theme(props.settings.darkMode).textDefault} style={{ marginRight: 8 }} />
                        </View>
                        <Text style={{ ...style.elementTitle, color: Theme(props.settings.darkMode).textDefault, height: "100%" }}>
                            {I18n.t("questionPlay_versus_title") /* Matematik versus */}
                        </Text>
                    </View>

                    <View style={style.elementBar} />
                    <Text style={{ ...style.elementContent, color: Theme(props.settings.darkMode).textDefault }}>
                        {I18n.t("questionPlay_versus_desc")}
                    </Text>
                </View>
                <View
                    style={style.play}
                    activeOpacity={0.7}>
                    <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ paddingLeft: 16, paddingRight: 16, shadowColor: props.settings.darkMode ? "#FFF" : "#919191" }}
                onPress={() => _navigateToSpeedTest()}
                activeOpacity={0.7} >
                <View style={{
                    ...style.element,
                    backgroundColor: Theme(props.settings.darkMode).questionSlotBackground,
                }}>
                    <Image style={style.elementLogo} source={require('../../../tc.png')} />
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <View>
                            <FontAwesomeIcon icon={faTachometerAlt} size={30} color={Theme(props.settings.darkMode).textDefault} style={{ marginRight: 8 }} />
                        </View>
                        <Text style={{ ...style.elementTitle, color: Theme(props.settings.darkMode).textDefault, height: "100%" }}>
                            {I18n.t("questionPlay_speed_title") /* Matematik Hızı Testi */}
                        </Text>
                    </View>
                    <View style={style.elementBar} />
                    <Text style={{ ...style.elementContent, color: Theme(props.settings.darkMode).textDefault }}>
                        {I18n.t("questionPlay_speed_desc")}
                    </Text>
                </View>
                <View
                    style={style.play}
                    activeOpacity={0.7}>
                    <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
                </View>
            </TouchableOpacity>

        </>,
        childPlay: () => <ChildPlayScreen />,
        learn: () => <LearnScreen />
    }

    const renderScene = SceneMap({
        speedTest: _render.speedTest,
        childPlay: _render.childPlay,
        learn: _render.learn,
    });

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={tabProps => <TabBar {...tabProps}
                    style={{ backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}
                    indicatorStyle={{ backgroundColor: '#000' }}
                    labelStyle={{ color: Theme(props.settings.darkMode).textDefault, fontWeight: "bold" }}
                />}
            />
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        questionSettings: state.questionSettings,
        API: state.API,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(HomeScreen);