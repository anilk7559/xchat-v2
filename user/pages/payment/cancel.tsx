import PageTitle from '@components/page-title';
import dynamic from 'next/dynamic';
import BlankWithFooterLayout from 'src/components/layouts/blank-with-footer';

const PaymentCancelForm = dynamic(() => import('@components/payment/payment-cancel'));

function PaymentCancel() {
  return (
    <>
      <PageTitle title="Zahlung abgebrochen!" />
      <PaymentCancelForm />
    </>
  );
}

PaymentCancel.authenticate = false;

PaymentCancel.Layout = BlankWithFooterLayout;

export default PaymentCancel;
