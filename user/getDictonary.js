const dictionaries = {
    en: () => import('./public/locales/en/common.json').then((r) => r.default),
    de: () => import('./public/locales/de/common.json').then((r) => r.default),
  };
  
  export const getDictionary = (lang) => {
    return dictionaries[lang]();
  };
  