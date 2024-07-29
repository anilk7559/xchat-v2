import React from 'react';
import Head from 'next/head';
import nextCookie from 'next-cookies';
import { Provider } from 'react-redux';
import DefaultLayout from '@components/layouts/default';
import { authService } from '@services/auth.service';
import { wrapper } from '@redux/store';
import { setLogin } from '@redux/auth/actions';
import App from 'next/app';
import { END } from 'redux-saga';
import { NextPageContext } from 'next';
import { redirectLogin } from '@lib/utils';

import '../styles/style.scss';

function Application({
  Component, ...rest
}) {
  const Layout = Component.Layout || DefaultLayout;
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Layout>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
            key="viewport"
          />
        </Head>
        <Component {...props.pageProps} />
      </Layout>
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

    if (resp?.data?.role !== 'admin') {
      redirectLogin(ctx);
    }
    store.dispatch(setLogin(resp.data));
  } catch (e) {
    redirectLogin(ctx);
  }
}

Application.getInitialProps = wrapper.getInitialAppProps((store) => async (context) => {
  const { Component, ctx } = context;
  // won't check auth for un-authenticated page such as login, register
  // use static field in the component
  const { authenticate } = Component as any;
  if (authenticate !== false) {
    await auth(ctx, store);
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
