import Head from 'next/head';
import React from 'react';
import { Container } from 'reactstrap';
import TableEarnings from 'src/components/earnings/table-list';

function EarningListing({ modelId }: any) {
  return (
    <main className="main">
      <Head>
        <title>Auflistung der Einnahmen</title>
      </Head>
      <h4 className="title-table">Bilanzpolitik</h4>
      <Container fluid className="content">
        <TableEarnings id={modelId} />
      </Container>
    </main>
  );
}

EarningListing.getInitialProps = async (ctx: any) => {
  const { modelId } = ctx.query;
  return { modelId };
};

export default EarningListing;
