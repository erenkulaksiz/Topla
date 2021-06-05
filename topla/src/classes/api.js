import React, { useEffect } from 'react';
import Config from 'react-native-config';

const API = props => {
    useEffect(() => {
        if (Config.DEV_MODE) {
            console.log("@Loaded API with Dev Mode");
        } else {
            console.log("@Loaded API with Production Build");
        }
    }, []);

    const registerDevice = () => {
        return fetch((Config.DEV_MODE ? Config.API_DEV_URL : Config.API_URL) + '/device', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: props.reducer.deviceInfo.uuid,
                bundle_id: this.packageName,
                platform: Platform.OS,
                channel: "organic",
                push_token: "asdasd",
                language_code: deviceLanguage,
                adjust_attr: "test aaa adjust",
                app_version: getBuildNumber(),
                country_code: RNLocalize.getCountry(),
                timezone: RNLocalize.getTimeZone(),
            }),
        });
    }
}

const API = new Api();

const mapStateToProps = (state) => {
    const { reducer } = state;
    return { reducer }
};

export default connect(mapStateToProps)(API);
