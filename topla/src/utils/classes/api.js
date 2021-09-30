import React from 'react';
import { NativeModules, Platform } from 'react-native';
import Config from 'react-native-config';
import * as RNLocalize from 'react-native-localize';
import { getBuildNumber } from 'react-native-device-info';

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const API_URL = Config.DEV_MODE == 'true' ? Config.API_DEV_URL : Config.API_URL;

class Api extends React.Component {
    constructor() {
        super();
    }

    registerDevice = async ({ uuid, bundleId, model }) => {
        console.log("API_HANDLER, REGISTER w/ URL: ", API_URL);
        return await fetch(API_URL + '/device', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                bundle_id: bundleId,
                platform: Platform.OS,
                language_code: deviceLanguage,
                app_version: getBuildNumber(),
                country_code: RNLocalize.getCountry(),
                timezone: RNLocalize.getTimeZone(),
                model: model,
            }),
        });
    }

    checkReceipt = async ({ data, platform, uuid, API_TOKEN }) => {
        return await fetch(API_URL + '/receipt', {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: data,
                platform: platform,
                uuid: uuid,
                API_TOKEN: API_TOKEN,
            }),
        })
    }

    IAPinit = async ({ data, platform, uuid, API_TOKEN }) => {
        return await fetch(API_URL + '/iapinit', {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: data,
                platform: platform,
                uuid: uuid,
                API_TOKEN: API_TOKEN,
            }),
        })
    }

}
const api = new Api();

export default api;
