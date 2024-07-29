import ListBookmarkedMessage from '@components/profile/bookmarked-messages/list-boookmarked-message';
import { useTranslationContext } from 'context/TranslationContext';
import dynamic from 'next/dynamic';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const PageTitle = dynamic(() => import('@components/page-title'));

function BookmarkedMessages() {
  const {t} = useTranslationContext()
  return (
    <main className="main scroll">
      <Container fluid className="p-3">
        <PageTitle title={t?.bookmarkPage?.title} />
        <Row className="m-2 mgB20">
          <Col md={12} className="mb-4">
            <h4 className="font-weight-semibold">{t?.bookmarkPage?.title}</h4>
          </Col>
          <ListBookmarkedMessage />
        </Row>
      </Container>
    </main>
  );
}

export default BookmarkedMessages;
