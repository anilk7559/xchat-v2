import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { packageService } from '@services/package.service';
import Router, { useRouter } from 'next/router';
import Loading from '../../../src/components/loading/loading';
import PackageForm from '../../../src/components/packages/form';

function PackageUpdate() {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState(null);
  const router = useRouter();

  const findPackage = async () => {
    const { id } = router.query;
    setLoading(true);
    const resp = await packageService.findOne(id as string);
    setLoading(false);
    setPackages(resp.data);
  };
  const updatePackage = async ({
    name,
    description,
    price,
    token,
    ordering
  }) => {
    try {
      const { id } = router.query;
      setLoading(true);
      await packageService.update(id as string, {
        name,
        description,
        price,
        token,
        ordering
      });
      toast.success('Paket wurde aktualisiert');
      Router.push('/packages/listing');
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Aktualisierungspaket ist fehlgeschlagen');
    }
  };
  useEffect(() => {
    findPackage();
  }, []);
  return (
    <>
      <Head>
        <title>Paket aktualisieren</title>
      </Head>
      <h4 className="title-table">Paket aktualisieren</h4>
      <Container fluid className="content">
        {loading && <Loading />}
        {!loading && packages && (
          <PackageForm submit={updatePackage} data={packages} />
        )}
      </Container>
    </>
  );
}
export default PackageUpdate;
