import PageTitle from '@components/page-title';
import SeoMetaHead from '@components/seo-meta-head';
import { systemService } from '@services/system.service';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import BlankWithFooterLayout from 'src/components/layouts/blank-with-footer';

const LoginForm = dynamic(() => import('src/components/auth/login-form'));

type IProps = {
  transparentLogo: string;
  authBgImage: string;
  homeTitle: string;
  homeDescription: string;
  homeKeywords: string;
};

const mapStates = (state: any) => ({
  authUser: state.auth.authUser
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Login({
  transparentLogo = '/images/logo-white.svg',
  authBgImage,
  homeTitle = 'Login',
  homeDescription = '',
  homeKeywords = '',
  authUser
}: IProps & PropsFromRedux) {
  const bg = authBgImage || '/images/auth-bg.jpg';

  useEffect(() => {
    if (authUser) {
      window.location.href = '/conversation';
    }
  }, []);

  return (
    <section className="xchat-template-animation xchat-template-layout4">
      <SeoMetaHead pageTitle={homeTitle} description={homeDescription} keywords={homeKeywords} />
      <PageTitle title="Login" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 col-12 xchat-bg-wrap">
            <div className="xchat-bg-img" style={{ backgroundImage: `url(${bg})` }}>
            {/* <div className="xchat-bg-img" style={{ backgroundImage: `` }}> */}
              {transparentLogo
              && (
              <div className="xchat-header">
                <div className="xchat-transformY-50 xchat-transition-delay-1">
                  <a href="#" className="xchat-logo">
                    <img src={transparentLogo} alt="Logo" width="327" />
                  </a>
                </div>
              </div>
              )}
            </div>
          </div>
          <div className="col-md-6 col-12 xchat-bg-color">
            <div className="xchat-content">
              <a href="/" className="header-logo-mobile">
                <img src={transparentLogo} alt="Logo" width="327" />
              </a>
              <h3 className="text-center text-uppercase">Anmeldung</h3>
              <hr />
              <div className="xchat-form">
                <LoginForm />
              </div>
              <div className="xchat-footer">
                <p>
                Sie haben kein Konto?
                  <Link legacyBehavior href="/auth/register" as="/auth/register" key="register">
                    <a className="switcher-text2 inline-text">
                    Registrieren
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Login.getInitialProps = async () => {
  try {
    const res = await systemService.getConfigByKeys([
      'transparentLogo',
      'homeTitle',
      'homeDescription',
      'homeKeywords',
      'authBgImage'
    ]);
    return res.data;
  } catch (e) {
    return {};
  }
};

Login.Layout = BlankWithFooterLayout;
export default connector(Login);
