import React, { useState } from 'react';
import { SafeAreaView, useWindowDimensions } from "react-native";
import { connect } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
//import Config from 'react-native-config';

import style from "./style";
import I18n from "../../utils/i18n.js";
import Header from "../../modules/header";
import Theme from "../../themes";
import ChildPlaySlotScreen from "../childplayslot";
import LearnScreen from "../learn";
import GamesScreen from "../games";
//import RoadwaysScreen from "../roadways";

const HomeScreen = props => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'speedTest', title: I18n.t("home_games") },
        //{ key: 'childPlay', title: I18n.t("home_childPlay") },
        //{ key: 'learn', title: I18n.t("home_learn") },
    ]);

    const _render = {
        speedTest: () => <GamesScreen {...props} />,
        //childPlay: () => <ChildPlaySlotScreen />,
        //learn: () => <LearnScreen />
    }

    const renderScene = SceneMap({
        speedTest: _render.speedTest,
        //childPlay: _render.childPlay,
        //learn: _render.learn,
    });

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header />
            <GamesScreen {...props} />
            {
                /*
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
                */
            }

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