import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const Header = dynamic(() => import('../header/header'));
const Footer = dynamic(() => import('../footer/footer'));
const Sidebar = dynamic(() => import('../sidebar'));

interface DefaultProps {
  children: ReactNode;
}

export default function DefaultLayout({
  children
}: DefaultProps) {
  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <section className="content">
            <div className="container-fluid">{children}</div>
          </section>
        </div>
      </div>
      <Footer />
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );
}
