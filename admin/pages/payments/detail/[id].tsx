import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Container, Alert } from 'reactstrap';
import Router from 'next/router';
import { findPayment } from 'src/redux/payments/actions';
import Loading from 'src/components/loading/loading';
import Head from 'next/head';
import PaymentDetail from 'src/components/payments/detail';

interface Props {
  payment: any;
}
function Payment({ payment }: Props) {
  const distpatch = useDispatch();

  const FindPayment = () => {
    if (Router.query && Router.query.id) {
      distpatch(findPayment(Router.query.id));
    } else {
      Router.push('/payments/listing');
    }
  };
  useEffect(() => {
    FindPayment();
  }, []);
  return (
    <main className="main">
      <Head>
        <title>Payment Detail</title>
      </Head>
      <h4 className="title-table">Payment Detail</h4>
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

export default connect(mapStateToProps)(Payment);
