import React from 'react';
import { Container } from 'reactstrap';
import Router from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { packageService } from '@services/package.service';
import PackageForm from '../../src/components/packages/form';

function PackageCreate() {
  const savePackages = async (data) => {
    try {
      await packageService.create(data);
      toast.success('Paket wurde erstellt');
      Router.push('/packages/listing');
    } catch (e) {
      const error = await e;
      toast.error(error?.message || 'Fehler beim Erstellen des Pakets');
    }
  };
  return (
    <>
      <Head>
        <title>Paket erstellen</title>
      </Head>
      <h4 className="title-table">Paket erstellen</h4>
      <Container fluid className="content">
        <PackageForm submit={savePackages} />
      </Container>
    </>
  );
}
export default PackageCreate;
