import TableDetail from '@components/earnings/table-detail';
import Head from 'next/head';
import { Container } from 'reactstrap';

type IProps = {
  modelId: string;
};

function EarningByModelListing({
  modelId
}: IProps) {
  return (
    <main className="main">
      <Head>
        <title>Verdienstdetails</title>
      </Head>
      <h4 className="title-table">
        Verdienstdetails
      </h4>
      <Container fluid className="content">
        <TableDetail id={modelId} />
      </Container>
    </main>
  );
}

EarningByModelListing.getInitialProps = (ctx) => ({
  modelId: ctx.query.modelId
});

export default EarningByModelListing;
