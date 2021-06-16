import React from 'react';
import { Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';

import I18n from "../../utils/i18n.js";
import style from './style';
import Theme from '../../themes'

const QuestionSlot = props => {
    return (
        <View style={style.container}>
            <View style={{
                ...style.element,
                backgroundColor: Theme(props.reducer.settings.darkMode).questionSlotBackground,
                shadowColor: props.reducer.settings.darkMode ? "#FFF" : "#919191"
            }}>
                <Image
                    style={style.elementLogo}
                    source={require('../../tc.png')}
                />
                <Text style={{ ...style.elementHardness, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("question_hardnessLevel")} <Text style={{ color: props.question.titleColor, fontWeight: "bold" }}>{props.question.name}</Text></Text>
                <View style={style.elementBar} />
                <Text style={{ ...style.elementContent, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("question_content")} <Text style={{ flex: 1, fontSize: 12 }}>{props.question.content}</Text></Text>
                <Text style={{ ...style.elementBasamak, color: Theme(props.reducer.settings.darkMode).textDefault }}>{I18n.t("question_digit")} <Text style={{ flex: 1 }}>{props.question.digit}</Text></Text>
            </View>
            <TouchableOpacity style={style.play} activeOpacity={0.7} onPress={() => { props.onPlay() }}>
                <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
            </TouchableOpacity>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer
    }
};

export default connect(mapStateToProps)(QuestionSlot);