import Config from 'react-native-config';
import {
    getBuildNumber,
} from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import { NativeModules, Platform } from 'react-native';

const API_URL = (Config.DEV_MODE ? Config.API_DEV_URL : Config.API_URL)

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const INITIAL_STATE = {
    register: {},
    apiError: "",
    DATA: {},
    apiStatus: 200,
    API_TOKEN: null,
    APP: {
        // Sunucudan çekilecek son uygulama ile ilgili bilgiler burada olacak
        latestBuild: 1,
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'API_REGISTER':
            console.log("@API_REGISTER");

            console.log("[!!!] USING URL: ", API_URL);

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
                    console.log("API_REGISTER: ", data);
                    if (data.success) {
                        console.log("@API_REGISTER SUCCESSFUL");
                        console.log("API TOKEN: ", data.API_TOKEN);
                        //state.API = data;
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
            console.log("@API_SEND_MESSAGE");

            //console.log("[!!!] USING URL: ", API_URL);

            console.log("MESSAGE: ", action.payload);

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

            if (state.connection.isConnected) {
                sendMessage().catch(err => {
                    console.log("[ERROR]: ", err);
                });
            } else {
                console.log("NO CONNECTION DETECTED, SEND MESSAGE FAILED");
                return state
            }

            return state
        default:
            return state
    }
};