import { redirect } from '@lib/utils';
import Router from 'next/router';
import { connect } from 'react-redux';

import { setLogin } from './auth/actions';

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});
const mapDispatch = { setLogin };

// Gets the display name of a JSX component for dev tools
const getDisplayName = (com: any) => com.displayName || com.name || 'Component';

interface IProps {
  componentProps: any;
}

export const withAuth = (WrappedComponent: any) => {
  function WithAuthCheck({
    componentProps
  }: IProps) {
    return (
      <WrappedComponent {...componentProps} />
    );
  }

  WithAuthCheck.getInitialProps = async (ctx) => {
    const { store } = ctx;
    // TODO - check store, if have user data already, we won't fetch in server anymore.
    const state = store.getState();
    const { authUser, isLoggedIn } = state.auth;

    if (!isLoggedIn) {
      return redirect('/auth/login', ctx);
    }
    if ((!authUser.isApproved || !authUser.isCompletedProfile) && ctx.pathname !== '/profile/update') {
      if (typeof window === 'undefined') {
        ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/profile/update?requireUpdate=1' });
        ctx.res.end && ctx.res.end();
      } else {
        Router.push('/profile/update?requireUpdate=1');
        return {};
      }
    }
    const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
    return {
      componentProps
    };
  };

  WithAuthCheck.displayName = `withAuth${getDisplayName(WrappedComponent)}`;
  return connect(
    mapStateToProps,
    mapDispatch
  )(WithAuthCheck);
};
