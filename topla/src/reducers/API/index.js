import Config from 'react-native-config';
import {
    getBuildNumber,
} from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import { NativeModules, Platform } from 'react-native';

const API_URL = Config.DEV_MODE == 'true' ? Config.API_DEV_URL : Config.API_URL;

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const INITIAL_STATE = {
    apiError: "",
    apiStatus: 200,
    DATA: {},
    APP: {
        // Sunucudan çekilecek son uygulama ile ilgili bilgiler burada olacak
        latestVersion: 0,
    },
    products: [],
    retries: 0,
    iapInitData: {},
    iapPurchases: [],
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
                        language_code: deviceLanguage,
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
                        console.log("Got products: ", data.APP_PRODUCTS)
                        state.DATA = data;
                        state.APP = {
                            latestVersion: data.APP_LATEST_VERSION,
                            softUpdateVer: data.APP_SOFT_UPDATE_VER,
                            hardUpdateVer: data.APP_HARD_UPDATE_VER,
                            products: data.APP_PRODUCTS,
                        }
                    } else {
                        console.log("@API_REGISTER ERROR");
                    }
                    if (response.status == 404) {
                        throw [data, response.status];
                    }
                })
            }).catch(err => {
                console.log("[ERROR on REDUCER]: ", err);
                state = {
                    ...state,
                    apiError: err[0],
                    apiStatus: err[1],
                }
            });

            return state

        case 'API_LOG':
            console.log("@API_LOG w/ URL: ", API_URL);

            const log = async () => {
                console.log("ACTION_DESC: ", action.payload.ACTION_DESC);
                const response = await fetch(API_URL + '/log', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uuid: action.payload.uuid,
                        bundle_id: action.payload.bundleId,
                        platform: Platform.OS,
                        language_code: deviceLanguage,
                        app_version: getBuildNumber(),
                        country_code: RNLocalize.getCountry(),
                        timezone: RNLocalize.getTimeZone(),
                        action: action.payload.ACTION,
                        action_desc: action.payload.ACTION_DESC,
                        timestamp: Date.now(),
                        API_TOKEN: action.payload.API_TOKEN,
                        hasPremium: action.payload.hasPremium,
                    }),
                }).then(response => {
                    console.log("response status ", response.status);
                    response.json().then((data) => {
                        console.log("API_SEND_LOG RESULT: ", data);
                        if (response.status == 404) {
                            throw [data, response.status];
                        }
                    })
                }).catch(function (error) {
                    throw error;
                });
                return response
            }

            log().catch(err => {
                console.log("[ERROR]: ", err);
            });

            return state

        case 'API_SET_PRODUCTS':
            console.log("@API_SET_PRODUCTS");
            state.products = action.payload;

            return state

        case 'API_CHECK_RECEIPT':
            console.log("@API_CHECK_RECEIPT");

            console.log("Sending: ", action.payload.data);

            const receipt = async () => {
                const response = await fetch(API_URL + '/receipt', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: action.payload.data,
                        platform: action.payload.platform,
                        uuid: action.payload.uuid,
                        API_TOKEN: action.payload.API_TOKEN,
                    }),
                }).then(response => {
                    console.log("response status ", response.status);
                    response.json().then(data => {
                        console.log("@api check receipt response: ", data);

                        if (data.purchaseStatus == "success" && data.success == true) {
                            console.log(data.reason);

                        }

                    })
                }).catch(function (error) {
                    throw error;
                });
                return response
            }

            receipt().catch(err => {
                console.log("[ERROR]: ", err);
            });

            return state

        case 'API_IAP_INIT':
            console.log("@API_IAP_INIT");

            const init = async () => {
                const response = await fetch(API_URL + '/iapinit', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: action.payload.data,
                        platform: action.payload.platform,
                        uuid: action.payload.uuid,
                        API_TOKEN: action.payload.API_TOKEN,
                    }),
                }).then(response => {
                    console.log("response status ", response.status);
                    response.json().then(data => {
                        console.log("@api iap init response: ", data);

                        state.iapInitData = data;

                        if (data.success) {
                            console.log("User has subscription, API_IAP_INIT");
                        } else if (data.success == false) {
                            console.log("Error with subscription, reason: ", data.reason);
                        }

                    })
                }).catch(function (error) {
                    throw error;
                });
                return response
            }

            init().catch(err => {
                console.log("[ERROR]: ", err);
            });

            return state

        case 'API_RETRY':
            state.retries += 1;
            console.log("RETRIES: ", state.retries);

            return state

        case 'API_RETRY_RESET':
            console.log("RETRIES RESET");
            state.retries = 0;

            return state

        case 'IAP_PURCHASES':
            state.iapPurchases = action.payload;
            console.log("purchases: ", state.iapPurchases);

            return state

        default:
            return state
    }
};