// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getRequestConfig } from 'next-i18next/dist/commonjs/config/getRequestConfig';

// 检测是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 创建 i18n 实例
const i18nInstance = i18n.createInstance();

// 基本配置
const i18nConfig = {
  fallbackLng: 'zh',
  lng: 'zh',
  ns: ['common', 'header', 'footer', 'home', 'ctiMarket'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  load: 'languageOnly',
  supportedLngs: ['zh', 'en'], // 替换 whitelist (已弃用)
  initImmediate: false
};

// 初始化 i18n
if (isBrowser) {
  // 浏览器环境下的配置
  import('i18next-browser-languagedetector').then((LanguageDetector) => {
    import('i18next-http-backend').then((Backend) => {
      i18nInstance
        .use(Backend.default)
        .use(LanguageDetector.default)
        .use(initReactI18next)
        .init({
          ...i18nConfig,
          backend: {
            loadPath: '..../public/locales/{{lng}}/{{ns}}.json',
          },
          detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupQuerystring: 'lng',
            checkWhitelist: true
          },
        });
    });
  });
} else {
  // 服务端环境下的配置
  i18nInstance
    .use(resourcesToBackend((language, namespace) => 
      import(`../public/locales/${language}/${namespace}.json`)
        .then(module => module.default)
    ))
    .use(initReactI18next)
    .init(i18nConfig);
}

export default i18nInstance;