import MainLoader from '@components/common-layout/main-loader/main-loader';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { isMobileSafari, isSafari } from 'react-device-detect';
import { connect, ConnectedProps } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import Footer from 'src/components/common-layout/footer/footer';

const AdultConfirmModal = dynamic(() => import('@components/common-layout/adult-confirm'), { ssr: false });
const Header = dynamic(() => import('src/components/common-layout/header/header'));
const GeneralSocketEventsHandler = dynamic(() => import('@components/user/general-socket-events-handler'), { ssr: false });

type Props = {
  children: any;
}

const mapStates = (state) => ({
  favicon: state.system.config?.siteFavicon
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

function MainLayout({
  children,
  favicon
}: Props & PropsFromRedux) {
  const [routerChange, setRouterChange] = useState(false);

  const handleStateChange = () => {
    Router.events.on('routeChangeStart', async () => setRouterChange(true));
    Router.events.on('routeChangeComplete', async () => setRouterChange(false));
  };

  useEffect(() => {
    handleStateChange();
    console.log('state change')
  }, []);

  return (
    <>
      {favicon && (
      <Head>
        {favicon.includes('.ico') ? <link rel="shortcut icon" href={favicon} /> : <link rel="icon" type="image/png" href={favicon} />}
      </Head>
      )}
      {routerChange ? <MainLoader /> : (
        <>
          <Header />
          <div className={classnames('main-layout', { safari: isSafari || isMobileSafari })}>
            {/* <MainSidebar />  */}
            {children }
          </div>
          <AdultConfirmModal />
          <Footer />
          <GeneralSocketEventsHandler />
          <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        </>
      )}

    </>
  );
}

export default connector(MainLayout);
