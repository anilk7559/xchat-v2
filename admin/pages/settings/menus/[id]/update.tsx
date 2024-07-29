import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { menuService } from '@services/menu.service';
import Router, { useRouter } from 'next/router';
import Loading from 'src/components/loading/loading';
import MenuForm from 'src/components/menu/form';

function MenuUpdate() {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(null);
  const router = useRouter();

  const findMenu = async () => {
    const { id } = router.query;
    setLoading(true);
    const resp = await menuService.findOne(id as string);
    setLoading(false);
    setMenu(resp.data);
  };

  const updateMenu = async ({
    title,
    path,
    section,
    openNewTab,
    internal,
    ordering
  }) => {
    try {
      const { id } = router.query;
      setLoading(true);
      await menuService.update(id as string, {
        title,
        path,
        section,
        openNewTab,
        internal,
        ordering
      });
      toast.success('Das Menü wurde aktualisiert');
      Router.push('/settings/menus/listing');
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Update-Menü ist fehlgeschlagen');
    }
  };
  useEffect(() => {
    findMenu();
  }, []);
  return (
    <Container fluid className="content">
      <Head>
        <title>Menü aktualisieren</title>
      </Head>
      {loading && <Loading />}
      {!loading && <MenuForm submit={updateMenu} data={menu} />}
    </Container>
  );
}
export default MenuUpdate;
