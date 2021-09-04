import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import * as RNIap from 'react-native-iap';

import style from "./style";
import Header from "../../modules/header";
import I18n from "../../utils/i18n.js";
import Theme from "../../themes";

const PremiumScreen = props => {

    const _buyProduct = async (el) => {
        const { receipt } = await RNIap.requestSubscription(el.productId);
    }

    const _renderPremiumSlots = product => {
        return product.map(el => {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={el.productId}
                    style={{ marginBottom: 8 }}
                    onPress={() => {
                        _buyProduct(el);
                    }} >
                    <View style={{ ...style.premiumWrapper, backgroundColor: Theme(props.settings.darkMode).questionSlotBackground }}>
                        <View style={style.iconWrapper}>
                            <FontAwesomeIcon icon={faCrown} size={22} color={Theme(props.settings.darkMode).textDefault} />
                        </View>
                        <View style={style.titleWrapper}>
                            <View style={style.title}>
                                <Text style={{ ...style.titleText, color: Theme(props.settings.darkMode).textDefault }}>
                                    {
                                        el.productId == "com.erencode.topla.monthly" ? I18n.t("iap_monthly_title") : el.title
                                    }
                                </Text>
                            </View>
                            <View style={style.price}>
                                <Text style={{ ...style.priceText, color: props.settings.darkMode == 'dark' ? "#0DA6FF" : "#0F7CBB" }}>{el.localizedPrice}</Text>
                            </View>
                        </View>
                        <View style={style.productBar}></View>
                        <View style={style.productDescWrapper}>
                            <Text style={{ ...style.productDesc, color: Theme(props.settings.darkMode).textDefault }}>{el.description}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    return (
        <SafeAreaView style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).container }}>
            <Header /*backShown onBack={() => { props.navigation.goBack() }}*/ />
            <View style={style.headerContainer}>
                <Text style={{ ...style.headerText, color: Theme(props.settings.darkMode).text }}>{I18n.t("settings_premium")}</Text>
                <View style={{ ...style.headerBar, backgroundColor: Theme(props.settings.darkMode).bar }}></View>
            </View>
            <ScrollView style={style.content}>
                {_renderPremiumSlots(props.API.products)}
            </ScrollView>
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        settings: state.settings,
        API: state.API,
    }
};

export default connect(mapStateToProps)(PremiumScreen);