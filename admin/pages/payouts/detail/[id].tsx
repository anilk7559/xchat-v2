import Loading from '@components/loading/loading';
import { findPayout } from '@redux/payouts/actions';
import Router from 'next/router';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { Alert, Container } from 'reactstrap';
import { connect } from 'react-redux';
import PayoutDetail from 'src/components/payouts/detail';

interface Props {
  payout: any;
  findPayout: Function;
}

function Payout({ payout, findPayout }: Props) {
  const FindPayout = () => {
    if (Router.query && Router.query.id) {
      findPayout(Router.query.id);
    } else {
      return Router.push('/payouts/listing');
    }
  };
  useEffect(() => {
    FindPayout();
  }, []);

  return (
    <main className="main">
      <Head>
        <title>Payout Detail</title>
      </Head>
      <h4 className="title-table">Payout Detail</h4>
      <Container fluid className="content">
        {!payout.status || payout.status === 'loading' ? (
          <Loading />
        ) : payout.status === 'error' ? (
          <Alert color="danger">Loading Error</Alert>
        ) : (
          <PayoutDetail data={payout.data} />
        )}
      </Container>
    </main>
  );
}
const mapStateToProps = (state: any) => ({
  payout: state.singlePayout
});
const mapDispatch = { findPayout };

export default connect(mapStateToProps, mapDispatch)(Payout);
