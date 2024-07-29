import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import Footer from '../common-layout/footer/footer';

const AdultConfirmModal = dynamic(() => import('@components/common-layout/adult-confirm'), { ssr: false });

type Props = {
  children: ReactNode
};

const mapStates = (state) => ({
  favicon: state.system.config?.siteFavicon
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;
console.log("connect")
function BlankWithFooterLayout({
  children,
  favicon
}: Props & PropsFromRedux) {
  return (
    <div className="main">
      {favicon && (
      <Head>
        {favicon.includes('.ico') ? <link rel="shortcut icon" href={favicon} /> : <link rel="icon" type="image/png" href={favicon} />}
      </Head>
      )}
      <main role="main">{children}</main>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <AdultConfirmModal />
      <Footer />
    </div>
  );
}

export default connector(BlankWithFooterLayout);
