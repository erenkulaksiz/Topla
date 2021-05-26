import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, TouchableOpacity, ScrollView, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import Header from "../../header";

class QuestionSettings extends React.Component {

    _navigateToQuestion = question => {
        this.props.navigation.navigate('QuestionScreen', { question: question })
    }

    _incrementOptions = () => {
        this.props.dispatch({ type: "INCREMENT_QUESTION_OPTIONS" });
    }

    _decrementOptions = () => {
        this.props.dispatch({ type: "DECREMENT_QUESTION_OPTIONS" });
    }

    _incrementQuestionCount = () => {
        this.props.dispatch({ type: "INCREMENT_QUESTION_COUNT" });
    }

    _decrementQuestionCount = () => {
        this.props.dispatch({ type: "DECREMENT_QUESTION_COUNT" });
    }

    render() {

        return (
            <View style={style.container}>
                <Header backShown onBack={() => this.props.navigation.goBack()} />
                <View style={style.headerContainer}>
                    <View>
                        <Text style={style.headerText}>Soru Ayarları</Text>
                    </View>
                    <View style={style.headerTextWrapperRight}>
                        <Text style={style.headerTextQuestionSettings}>Varsayılan Ayarlar - {this.props.route.params.question.name}</Text>
                    </View>
                </View>
                <View style={style.headerBar}></View>
                <ScrollView style={style.content}>
                    <View style={style.questionSettingsWrapper}>
                        <View style={style.elementLogoWrapper}>
                            <Image
                                style={style.elementLogo}
                                source={require('../../../tc.png')}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={style.settingsWrapper}>
                            <View style={style.setting}>
                                <Text style={style.settingTitle}>Soru Sayısı: </Text>
                                <View style={style.setting_incrementWrapper}>
                                    <View style={style.setting_increment}>
                                        <TouchableOpacity style={style.decrement} onPress={() => this._decrementQuestionCount()}>
                                            <Text style={{ fontSize: 18 }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={style.incrementCenter}>
                                            <Text style={{ fontSize: 16 }}>{this.props.reducer.questionSettings.questionCount}</Text>
                                        </View>
                                        <TouchableOpacity style={style.increment} onPress={() => this._incrementQuestionCount()}>
                                            <Text style={{ fontSize: 18 }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={style.bar}></View>
                            <View style={style.setting}>
                                <Text style={style.settingTitle}>Seçenek Sayısı: </Text>
                                <View style={style.setting_incrementWrapper}>
                                    <View style={style.setting_increment}>
                                        <TouchableOpacity style={style.decrement} onPress={() => this._decrementOptions()}>
                                            <Text style={{ fontSize: 18 }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={style.incrementCenter}>
                                            <Text style={{ fontSize: 16 }}>{this.props.reducer.questionSettings.optionCount}</Text>
                                        </View>
                                        <TouchableOpacity style={style.increment} onPress={() => this._incrementOptions()}>
                                            <Text style={{ fontSize: 18 }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={style.bar}></View>
                            <View style={style.setting}>
                                <CheckBox
                                    disabled={false}
                                    value={this.props.reducer.questionSettings.operations.addition}
                                    onValueChange={(newValue) => this.props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...this.props.reducer.questionSettings.operations, addition: newValue } })}
                                />
                                <Text style={style.label}>Toplama</Text>
                            </View>
                            <View style={style.setting}>
                                <CheckBox
                                    disabled={false}
                                    value={this.props.reducer.questionSettings.operations.subtraction}
                                    onValueChange={(newValue) => this.props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...this.props.reducer.questionSettings.operations, subtraction: newValue } })}
                                />
                                <Text style={style.label}>Çıkarma</Text>
                            </View>
                            <View style={style.setting}>
                                <CheckBox
                                    disabled={false}
                                    value={this.props.reducer.questionSettings.operations.multiplication}
                                    onValueChange={(newValue) => this.props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...this.props.reducer.questionSettings.operations, multiplication: newValue } })}
                                />
                                <Text style={style.label}>Çarpma</Text>
                            </View>
                            <View style={style.setting}>
                                <CheckBox
                                    disabled={false}
                                    value={this.props.reducer.questionSettings.operations.division}
                                    onValueChange={(newValue) => this.props.dispatch({ type: "SET_QUESTION_SETTINGS_OPERATIONS", payload: { ...this.props.reducer.questionSettings.operations, division: newValue } })}
                                />
                                <Text style={style.label}>Bölme</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={style.bottomButtonWrapper}>
                    <TouchableOpacity style={style.bottomButton} onPress={() => this._navigateToQuestion(this.props.route.params.question)}>
                        <FontAwesomeIcon icon={faPlay} size={12} color={"#fff"} />
                        <Text style={{ fontSize: 15, color: "#fff", marginLeft: 8 }}>Çözmeye Başla</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSettings);