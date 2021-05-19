import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import en from "./locales/en/en.js";
import tr from "./locales/tr/tr.js";

const locales = RNLocalize.getLocales();

console.log("Locales: ", locales);

if (Array.isArray(locales)) {
    I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
    en,
    tr
};

export default I18n;