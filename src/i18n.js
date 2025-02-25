// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'zh',
    lng: 'zh',
    ns: ['common', 'header', 'footer','home','ctiMarket'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator'], // 添加 localStorage 作为首选检测方式
      caches: ['localStorage'], // 启用 localStorage 缓存
      lookupQuerystring: 'lng',
      checkWhitelist: true // 检查是否在支持的语言列表中
    },
    load: 'languageOnly',
    whitelist: ['zh', 'en'], //支持的语言
    initImmediate: false
  });

export default i18n;