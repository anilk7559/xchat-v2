import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import { sellItemService } from '@services/sell-item.service';
import { Col, Row } from 'react-bootstrap';
import TableSellItems from '../../src/components/sell-item/table-list';

interface IProps {
type: string
}
function SellItemListing({ type }: IProps) {
  const [totalUnapproveItems, setTotalUnapproveItems] = useState(0);

  const loadSellItems = async () => {
    try {
      const resp = await sellItemService.getList({ mediaType: type, isApproved: false });
      setTotalUnapproveItems(resp.data.count);
    } catch (e) {
      const err = await e;
      toast.error(err?.messsage || 'Load media content failed!');
    }
  };

  useEffect(() => {
    loadSellItems();
  }, [type]);
  return (
    <main className="main">
      <Head>
        <title>Artikelliste verkaufen</title>
      </Head>
      <Row>
        <Col md={4}>
          <h4 className="title-table">
          Verwaltung von Medieninhalten
          </h4>
        </Col>
        <Col md={8}>
          <h4 className="title-table">
          Nicht genehmigte Artikel
            {' '}
            {type}
            :
            {' '}
            {totalUnapproveItems}
          </h4>
        </Col>
      </Row>
      <Container fluid className="content">
        <TableSellItems type={type} />
      </Container>
    </main>
  );
}

SellItemListing.getInitialProps = (ctx: any) => {
  const { type } = ctx.query;
  return { type };
};

const mapStateToProps = (state: any) => ({ sellItems: state.sellItems });

export default connect(mapStateToProps, null)(SellItemListing);
