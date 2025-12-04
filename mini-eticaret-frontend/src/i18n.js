import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import trJSON from './locales/tr.json';

i18n
    .use(initReactI18next) // React ile bağla
    .init({
        resources: {
            tr: { translation: trJSON }, // Türkçe çevirileri yükle
            // ingilizce ve polonca da eklenecek
            // en: { translation: enJSON },
            // pl: { translation: plJSON }
        },
        lng: "tr", // Varsayılan dil
        fallbackLng: "tr", // Dil bulunamazsa kullanılacak dil
        interpolation: {
            escapeValue: false // React zaten XSS koruması yapar
        }
    });

export default i18n;