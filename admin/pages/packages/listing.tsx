import { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import Head from 'next/head';
import { packageService } from '@services/package.service';
import { formatDate } from '@lib/utils';
import Link from 'next/dist/client/link';

function PackageListing() {
  const [packagesData, setPackagesData] = useState({
    items: [],
    coutn: 0
  });
  const loadPackages = async () => {
    const resp = await packageService.find();
    setPackagesData(resp.data);
  };

  const deletePackages = async (id) => {
    await packageService.remove(id);
    await loadPackages();
  };
  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <main className="main">
      <Head>
        <title>Paketliste</title>
      </Head>
      <h4 className="title-table">Paketverwaltung</h4>
      <Table responsive striped borderless>
        <thead>
          <tr>
            <th>
              <a>Name</a>
            </th>
            <th>
              <a>Preis</a>
            </th>
            <th>
              <a>Zeichen</a>
            </th>
            <th>
              <a>Bestellung</a>
            </th>
            <th>
              <a>Erstellt am</a>
            </th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {packagesData.items.map((item, index) => (
            <tr key={index as any}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.token}</td>
              <td>{item.ordering}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>
                <Link
                  href="/packages/[id]/update"
                  as={`/packages/${item._id}/update`}
                >
                  <i className="fa fa-pencil-alt icon" style={{ margin: '0 5px' }} />
                </Link>
                <a
                  href="#"
                  onClick={() => {
                    if (window.confirm('Are you sure?')) {
                      deletePackages(item._id);
                    }
                  }}
                >
                  <i className="fa fa-trash" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
export default PackageListing;
