import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './en.json';

i18n.translations = { en };

i18n.fallbacks = true;
i18n.locale = Localization.locale;

export const { t } = i18n;
export default i18n;
