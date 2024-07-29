import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { dashBoardService } from '@services/dashboard.service';
import { toast } from 'react-toastify';
import {
  Container, Row, Col, Card, Spinner
} from 'react-bootstrap';
import Link from 'next/link';

const Dashboard = () => {
  const [listDashboard, setListDashboard] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const dashboard = async () => {
    try {
      setLoading(true);
      const resp = await dashBoardService.getDashboard();
      setListDashboard(resp.data);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden des Daten-Dashboards ist fehlgeschlagen!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dashboard();
  }, []);

  return (
    <main className="main">
      <Head>
        <title>Armaturenbrett</title>
      </Head>
      <h4 className="title-table">Armaturenbrett </h4>
      <Container fluid className="content">
        {loading && <Spinner animation="border" variant="primary" />}
        {!loading && listDashboard && (
          <Row>
            <Col xs={6} md={4}>
              <Link href="/users/listing">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark"> GESAMTNUTZER</Card.Title>
                    <Card.Text className="text-orange" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-line mr-2" />
                      {listDashboard?.totalFans || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/users/listing">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark"> AKTIVE BENUTZER</Card.Title>
                    <Card.Text className="text-orange" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-line mr-2" />
                      {listDashboard?.totalActiveUsers || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/users/listing">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark"> INAKTIVE BENUTZER</Card.Title>
                    <Card.Text className="text-orange" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-line mr-2" />
                      {listDashboard?.totalInactiveUsers || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/users/listing">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark"> GESAMTMODELLE</Card.Title>
                    <Card.Text className="text-orange" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-pie mr-2" />
                      {listDashboard?.totalModels || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/sell-items/listing?type=photo">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark">FOTOS INSGESAMT</Card.Title>
                    <Card.Text className="text-green" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-area mr-2" />
                      {listDashboard?.totalPhotos || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/sell-items/listing?type=photo">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark">FOTOVERKAUF</Card.Title>
                    <Card.Text className="text-green" style={{ fontSize: '24px' }}>
                      <span>
                        <i className="fa fa-chart-area mr-2" />
                        {listDashboard?.totalPhotoSales?.count || 0}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/sell-items/listing?type=photo">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark">GESAMTVERKAUFSFOTO:</Card.Title>
                    <Card.Text className="text-green" style={{ fontSize: '24px' }}>
                      <span>
                        <i className="fa fa-chart-area mr-2" />
                        $
                        {listDashboard?.totalPhotoSales?.totalPrice || 0}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/sell-items/listing?type=video">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark">VIDEOS GESAMT</Card.Title>
                    <Card.Text className="text-blue" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-bar mr-2" />
                      {listDashboard?.totalVideos || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/sell-items/listing?type=video">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark">VIDEOVERKAUF:</Card.Title>
                    <Card.Text className="text-blue" style={{ fontSize: '24px' }}>
                      <span>
                        <i className="fa fa-chart-bar mr-2" />
                        {listDashboard?.totalVideoSales?.count || 0}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/sell-items/listing?type=video">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark">GESAMTES VERKAUFSVIDEO:</Card.Title>
                    <Card.Text className="text-blue" style={{ fontSize: '24px' }}>
                      <span>
                        <i className="fa fa-chart-bar mr-2" />
                        $
                        {listDashboard?.totalVideoSales?.totalPrice || 0}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/payouts/listing">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark"> AUSGABE VON AUSZAHLUNGEN</Card.Title>
                    <Card.Text className="text-red" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-pie mr-2" />
                      {listDashboard?.totalIssuedPayouts || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={6} md={4}>
              <Link href="/payouts/listing">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-uppercase text-dark"> AUSSTEHENDE AUSZAHLUNGEN</Card.Title>
                    <Card.Text className="text-red" style={{ fontSize: '24px' }}>
                      <i className="fa fa-chart-pie mr-2" />
                      {listDashboard?.totalPendingPayouts || 0}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        )}
      </Container>
    </main>
  );
};

export default Dashboard;
