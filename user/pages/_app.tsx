import '../styles/index.scss';

import { redirectLogin } from '@lib/utils';
import { wrapper } from '@redux/store';
import { APIRequest } from '@services/api-request';
import { NextPageContext } from 'next';
import App from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import nextCookie from 'next-cookies';
import { SSRProvider } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { END } from 'redux-saga';
import MainLayout from 'src/components/layouts/main';
import { setLogin } from 'src/redux/auth/actions';
import { loadConfigSuccess, setMenu } from 'src/redux/system';
import { systemService } from 'src/services';
import { authService } from 'src/services/auth.service';
import { Socket } from 'src/socket';
// import { appWithTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TranslationProvider } from '../context/TranslationContext';



function Application({
  Component,
  ...rest
}: any) {
  const Layout = Component.Layout || MainLayout;
  const { store, props } = wrapper.useWrappedStore(rest);
  const router = useRouter();
  const [lang, setLang] = useState('en'); // Default to English

  useEffect(() => {
    // Fetch language from the URL or use default
    const { locale } = router;
    setLang(locale || 'en');
  }, [router]);

  return (
    <Provider store={store}>
      <SSRProvider>
      <TranslationProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <Socket>
          <Layout lang={lang}>
            <Component {...props.pageProps} lang={lang} />
          </Layout>
        </Socket>
        </TranslationProvider>
      </SSRProvider>
    </Provider>
  );
}

async function auth(ctx: NextPageContext, store) {
  try {
    const state = store.getState();
    if (state.auth && state.auth.loggedIn) {
      return;
    }
    const { accessToken } = nextCookie(ctx);
    if (!accessToken) {
      // log out and redirect to login page
      // TODO - reset app state?
      redirectLogin(ctx);
      return;
    }
    authService.setAuthHeaderToken(accessToken);
    const resp = await authService.me({
      Authorization: `Bearer ${accessToken}`
    });

    store.dispatch(setLogin(resp.data));
  } catch (e) {
    redirectLogin(ctx);
  }
}

const loadUser = async (ctx: NextPageContext, store) => {
  try {
    const { accessToken } = nextCookie(ctx);
    if (!accessToken) return;
    authService.setAuthHeaderToken(accessToken);
    const resp = await authService.me({
      Authorization: `Bearer ${accessToken}`
    });

    store.dispatch(setLogin(resp.data));
  // eslint-disable-next-line no-empty
  } catch {
  }
};

Application.getInitialProps = wrapper.getInitialAppProps((store) => async (context) => {
  const { Component, ctx } = context;
  if (typeof window === 'undefined') {
    const { serverRuntimeConfig } = getConfig();
    APIRequest.API_ENDPOINT = serverRuntimeConfig.API_ENDPOINT;
  }

  // check auth
  const { accessToken } = nextCookie(ctx);
  const { authenticate } = Component as any;
  if (authenticate) {
    await auth(ctx, store);
  } else if (accessToken) {
    await loadUser(ctx, store);
  }
  if (typeof window === 'undefined') {
    const configRes = await systemService?.getConfig();
    const menus = await systemService?.getMenus('footer');
    store.dispatch(loadConfigSuccess(configRes.data));
    store.dispatch(setMenu({
      section: 'footer',
      menus: menus.data
    }));
  }

  // Wait for all page actions to dispatch
  const pageProps = {
    // https://nextjs.org/docs/advanced-features/custom-app#caveats
    ...(await App.getInitialProps(context)).pageProps
  };

  // Stop the saga if on server
  if (typeof window === 'undefined') {
    store.dispatch(END);
    await (store as any).sagaTask.toPromise();
  }

  return {
    pageProps
  };
});

export default Application;
