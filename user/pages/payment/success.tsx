import PageTitle from '@components/page-title';
import dynamic from 'next/dynamic';
import BlankWithFooterLayout from 'src/components/layouts/blank-with-footer';

const PaymentSuccessForm = dynamic(() => import('@components/payment/payment-success'));

function PaymentSuccess() {
  return (
    <>
      <PageTitle title="Zahlung erfolgreich!" />
      <PaymentSuccessForm />
    </>
  );
}

PaymentSuccess.authenticate = false;

PaymentSuccess.Layout = BlankWithFooterLayout;

export default PaymentSuccess;
