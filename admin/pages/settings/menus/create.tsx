import { Container } from 'reactstrap';
import Head from 'next/head';
import { menuService } from '@services/menu.service';
import { toast } from 'react-toastify';
import Router from 'next/router';
import MenuForm from 'src/components/menu/form';

function MenuCreate() {
  const submitMenu = async (data) => {
    try {
      await menuService.create(data);
      toast.success('Das Menü wurde erfolgreich erstellt!');
      Router.push('/settings/menus/listing');
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Menü erstellen ist fehlgeschlagen!');
    }
  };
  return (
    <Container fluid className="content">
      <Head>
        <title>Menü erstellen</title>
      </Head>
      <MenuForm submit={submitMenu} />
    </Container>
  );
}
export default MenuCreate;
