import { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import Head from 'next/head';
import { menuService } from '@services/menu.service';
import { formatDate } from '@lib/utils';
import Link from 'next/link';

function MenuListing() {
  const [menus, setMenus] = useState({
    items: [],
    count: 0
  });

  const getMenus = async (page = 1) => {
    const query = {
      page,
      limit: 10
    };
    const res = await menuService.list(query);
    setMenus(res.data);
  };

  const deleteMenu = async (id) => {
    await menuService.remove(id);
    await getMenus();
  };

  useEffect(() => {
    getMenus();
  }, []);

  return (
    <main className="main">
      <Head>
        <title>Menu</title>
      </Head>

      <Table responsive striped borderless>
        <thead>
          <tr>
            <th>
              <a>Titel</a>
            </th>
            <th>
              <a>Weg</a>
            </th>
            <th>
              <a>Bestellung</a>
            </th>
            <th>
              <a>Update am</a>
            </th>
            <th>
              <a>Aktionen</a>
            </th>
          </tr>
        </thead>
        <tbody>
          {menus.items.map((menu) => (
            <tr>
              <td>{menu.title}</td>
              <td>{menu.path}</td>
              <td>{menu.ordering}</td>
              <td>{formatDate(menu.createdAt)}</td>
              <td>
                <Link href="/settings/menus/[id]/update" as={`/settings/menus/${menu._id}/update`}>
                  <i className="fa fa-pencil-alt" />
                </Link>

                <a
                  href="#"
                  onClick={() => {
                    if (window.confirm('Are you sure?')) {
                      deleteMenu(menu._id);
                    }
                  }}
                >
                  <i className="fa fa-trash" />
                </a>
              </td>
            </tr>
          ))}
          {!menus.items.length && (
            <tr>
              <td colSpan={5}>Keine Menüs gefunden, bitte erstellen Sie ein neues!</td>
            </tr>
          )}
        </tbody>
      </Table>
    </main>
  );
}
export default MenuListing;
