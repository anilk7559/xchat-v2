import * as React from 'react';
import { Table } from 'reactstrap';
import Moment from 'react-moment';
import Link from 'next/link';
import { paymentService } from '@services/payment.service';
import { toast } from 'react-toastify';
import MainPaginate from '@components/paginate/main-paginate';
import FormFilter from './form-filter';

function TablePayments() {
  const [query, setQuery] = React.useState({
    page: 1,
    take: 10,
    sortBy: 'createdAt',
    sortType: 'desc',
    userId: ''
  });

  const [totalPayment, setTotalPayment] = React.useState(0);
  const [dataPayment, setDataPayment] = React.useState({} as any);

  const onFilter = (values: any) => {
    setQuery({
      ...query,
      userId: values.userId,
      page: 1
    });
  };

  const loadPayments = async () => {
    try {
      const resp = await paymentService.getList(query);
      setTotalPayment(resp.data.count);
      setDataPayment(resp.data.items);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Die Ladeerstellung ist fehlgeschlagen!');
    }
  };

  React.useEffect(() => {
    loadPayments();
  }, [query]);

  return (
    <>
      <FormFilter key="form" filter={onFilter} />
      <>
        <Table responsive striped borderless key="table">
          <thead>
            <tr>
              <th>
                <a>Lüfter</a>
              </th>
              <th>
                <a>Preis</a>
              </th>
              <th>
                <a>Tor</a>
              </th>
              <th>
                <a>Beschreibung</a>
              </th>
              <th>
                <a>Erstellen bei	</a>
              </th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {dataPayment && dataPayment.length > 0 ? (
              dataPayment.map((item: any, index: number) => (
                <tr key={index as any}>
                  <td>{item.user && item.user.username ? item.user.username : ''}</td>
                  <td>{item.price ? item.price : 0}</td>
                  <td>{item?.gateway}</td>
                  <td>{item.description && item.description}</td>
                  <td>
                    <Moment format="YYYY-MM-DD">{item.createdAt}</Moment>
                  </td>
                  <td>
                    <Link href="/payments/detail/[id]" as={`/payments/detail/${item._id}`}>
                      <i className="fa fa-eye" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr key="non sell item">
                <td>Kein Artikel zum Anzeigen vorhanden</td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalPayment > 0 && totalPayment > query.take
              && (
                <MainPaginate
                  currentPage={query.page}
                  pageTotal={totalPayment}
                  pageNumber={query.take}
                  setPage={(page) => setQuery({ ...query, page })}
                />
              )}
      </>
    </>
  );
}

export default TablePayments;
