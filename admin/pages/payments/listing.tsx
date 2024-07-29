import * as React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { Container } from 'reactstrap';
import TablePayments from '../../src/components/payments/table-list';

function PaymentListing() {
  return (
    <main className="main">
      <Head>
        <title>Zahlungsauflistung</title>
      </Head>
      <h4 className="title-table">Zahlungsmanagement</h4>
      <Container fluid className="content">
        <TablePayments />
      </Container>
    </main>
  );
}
const mapStateToProps = (state: any) => ({ payments: state.payments });

export default connect(mapStateToProps, null)(PaymentListing);
