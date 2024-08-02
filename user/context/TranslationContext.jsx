// context/TranslationContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDictionary } from 'getDictionary';
import { useRouter } from 'next/router';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [t, setT] = useState(null)
  const [locale, setLocale] = useState(null)
  const [modelId, setModelId] = useState(null)
    const router = useRouter();
  const lang = getDictionary(router.locale).then(data => setT(data))


  useEffect(()=> {
   const locale = localStorage.getItem('locale')
    setLocale(locale)
  }, [t])

  return (
    <TranslationContext.Provider value={{
      lang, t, modelId, setModelId, locale, setLocale
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  return useContext(TranslationContext);
};
