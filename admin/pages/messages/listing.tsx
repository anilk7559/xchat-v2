import * as React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { Container } from 'reactstrap';
import TableMessages from '../../src/components/messages/table-list';

function MessageListing() {
  return (
    <main className="main">
      <Head>
        <title>Auflistung der Nachrichten
</title>
      </Head>
      <h4 className="title-table">Nachrichtenverwaltung</h4>
      <Container fluid className="content">
        <TableMessages />
      </Container>
    </main>
  );
}
const mapStateToProps = (state: any) => ({ messages: state.messages });

export default connect(mapStateToProps, null)(MessageListing);
