import * as React from 'react';
import { connect, useDispatch } from 'react-redux';
import { Container, Alert } from 'reactstrap';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { findPayment } from '../../src/redux/payments/actions';
import Loading from '../../src/components/loading/loading';
import PaymentDetail from '../../src/components/payments/detail';

interface IProps {
  payment: any;
}

function Payment({ payment }: IProps) {
  const router = useRouter();

  const distpatch = useDispatch();

  const getPaymentDetail = () => {
    if (router.query && router.query.id) {
      distpatch(findPayment(router.query.id));
    } else {
      Router.push('/payments/listing');
    }
  };

  React.useEffect(() => {
    getPaymentDetail();
  }, []);

  // TODO - should show loading?
  return (
    <main className="main">
      <Head>
        <title>Payment Detail</title>
      </Head>
      <h4 className="title-table">
        Payment Detail
      </h4>
      <Container fluid className="content">
        {!payment.status && payment.status === 'loading' && <Loading /> }
        {!payment.status && payment.status === 'error'
          ? (<Alert color="danger">Loading Error</Alert>)
          : (
            <PaymentDetail data={payment.data} />
          )}
      </Container>
    </main>
  );
}

const mapStateToProps = (state: any) => ({
  payment: state.singlePayment
});
const mapDispatch = { findPayment };

export default connect(
  mapStateToProps,
  mapDispatch
)(Payment);
