import Head from 'next/head';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import TablePayouts from '../../src/components/payouts/table-list';

function PayoutListing() {
  return (
    <main className="main">
      <Head>
        <title>Auflistung der Auszahlungen</title>
      </Head>
      <h4 className="title-table">Auflistung der Auszahlungen
</h4>
      <Container fluid className="content">
        <TablePayouts />
      </Container>
    </main>
  );
}
const mapStateToProps = (state: any) => ({ payouts: state.payouts });

export default connect(mapStateToProps, null)(PayoutListing);
