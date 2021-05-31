import React from 'react';
import { Text, View, TouchableOpacity, Image } from "react-native";
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import I18n from "../../utils/i18n.js";

const QuestionSlot = props => {
    return (
        <View style={style.container}>
            <View style={style.element}>
                <Image
                    style={style.elementLogo}
                    source={require('../../tc.png')}
                />
                <Text style={style.elementHardness}>{I18n.t("question_hardnessLevel")} <Text style={{ color: props.question.titleColor, fontWeight: "bold" }}>{props.question.name}</Text></Text>
                <View style={style.elementBar} />
                <Text style={style.elementContent}>{I18n.t("question_content")}</Text>
                <Text style={{ flex: 1, fontSize: 12 }}>{props.question.content}</Text>
                <Text style={style.elementBasamak}>{I18n.t("question_digit")}</Text>
                <Text style={{ flex: 1 }}>{props.question.digit}</Text>
            </View>
            <TouchableOpacity style={style.play} onPress={() => { props.onPlay() }}>
                <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
            </TouchableOpacity>
        </View>
    );
}

export default QuestionSlot;