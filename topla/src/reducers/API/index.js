import Config from 'react-native-config';
import {
    getBuildNumber,
} from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import { NativeModules, Platform } from 'react-native';
import { set } from 'lodash';

const API_URL = (Config.DEV_MODE ? Config.API_DEV_URL : Config.API_URL)

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const INITIAL_STATE = {
    contact: {
        message: "",
        email: "",
        reason: "",
    },
    apiError: "",
    DATA: {},
    apiStatus: 200,
    APP: {
        // Sunucudan çekilecek son uygulama ile ilgili bilgiler burada olacak
        latestBuild: 1,
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'API_REGISTER':
            console.log("@API_REGISTER w/ URL: ", API_URL);

            const registerDevice = async () => {
                return await fetch(API_URL + '/device', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uuid: action.payload.uuid,
                        bundle_id: action.payload.bundleId,
                        platform: Platform.OS,
                        channel: "organic",
                        language_code: deviceLanguage,
                        adjust_attr: "test aaa adjust",
                        app_version: getBuildNumber(),
                        country_code: RNLocalize.getCountry(),
                        timezone: RNLocalize.getTimeZone(),
                        model: action.payload.model,
                    }),
                }).catch(function (error) {
                    throw error;
                });
            }

            //if (state.connection) {
            registerDevice().then(response => {
                console.log("response status ", response.status);
                response.json().then((data) => {
                    console.log("@api response: ", data);
                    if (data.success) {
                        console.log("@API_REGISTER SUCCESSFUL");
                        state.DATA = data;
                    } else {
                        console.log("@API_REGISTER ERROR");
                    }
                    if (response.status == 404) {
                        throw [data, response.status];
                    }
                })
            }).catch(err => {
                console.log("[ERROR]: ", err);
                state.apiError = err[0];
                state.apiStatus = err[1];
            });

            return state

        case 'API_SEND_MESSAGE':
            console.log("@API_MESSAGE w/ URL: ", API_URL);

            const sendMessage = async () => {
                const response = await fetch(API_URL + '/message', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uuid: action.payload.uuid,
                        bundle_id: action.payload.bundleId,
                        platform: Platform.OS,
                        channel: "organic",
                        language_code: deviceLanguage,
                        adjust_attr: "test aaa adjust",
                        app_version: getBuildNumber(),
                        country_code: RNLocalize.getCountry(),
                        timezone: RNLocalize.getTimeZone(),
                        model: action.payload.model,
                        message: action.payload.message,
                        email: action.payload.email,
                        topic: action.payload.topic,
                        API_TOKEN: action.payload.API_TOKEN,
                    }),
                }).then(response => {
                    console.log("response status ", response.status);
                    response.json().then((data) => {
                        console.log("API_SEND_MESSAGE RESULT: ", data);
                        if (response.status == 404) {
                            throw [data, response.status];
                        }
                    })
                }).catch(function (error) {
                    throw error;
                });
                return response
            }

            sendMessage().catch(err => {
                console.log("[ERROR]: ", err);
            });

            return state

        case 'SET_API_CONTACT':
            state.contact = { ...state.contact, ...action.payload };
            console.log("state.contact: ", state.contact);
            console.log("state: ", state);
            return { ...state }

        default:
            return state
    }
};