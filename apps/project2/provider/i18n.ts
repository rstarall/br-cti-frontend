'use client'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import sidebarEn from '../public/locales/en/sidebar.json';
import sidebarZh from '../public/locales/zh/sidebar.json';
import walletEn from '../public/locales/en/wallet.json';
import walletZh from '../public/locales/zh/wallet.json';

// 避免在服务器端多次初始化
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          sidebar: sidebarEn,
          wallet: walletEn,
        },
        zh: {
          sidebar: sidebarZh,
          wallet: walletZh,
        },
      },
      lng: 'zh', // Default language
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      // Add these options for better SSR support
      react: {
        useSuspense: false,
      },
      // Ensure consistent behavior between server and client
      initImmediate: false,
    });
}

export default i18n;
