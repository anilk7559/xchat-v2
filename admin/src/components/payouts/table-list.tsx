import * as React from 'react';
import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { payoutService } from '@services/payout.service';
import MainPaginate from '@components/paginate/main-paginate';
import classNames from 'classnames';
import FormFilter from './form-filter';

function TablePayouts() {
  const [query, setQuery] = React.useState({
    page: 1,
    take: 10,
    sortBy: 'createdAt',
    sortType: 'desc',
    modelId: '',
    status: ''
  });
  const [totalPayout, setTotalPayout] = React.useState(0);
  const [dataPayout, setDataPayout] = React.useState({} as any);

  const onFilter = (values: any) => {
    setQuery({
      ...query,
      modelId: values.modelId,
      status: values.status,
      page: 1
    });
  };

  const loadPayment = async () => {
    try {
      const resp = await payoutService.getList(query);
      setTotalPayout(resp.data.count);
      setDataPayout(resp.data.items);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Die Ladeerstellung ist fehlgeschlagen!');
    }
  };

  React.useEffect(() => {
    loadPayment();
  }, [query]);

  const statusItem = (status: string) => (
    <span
      className={classNames('badge', {
        'badge-warning': status === 'pending',
        'badge-primary': status === 'approved',
        'badge-success': status === 'paid',
        'badge-danger': status !== 'pending' && status !== 'approved' && status !== 'paid'
      })}
      style={{ textTransform: 'capitalize' }}
    >
      {status}
    </span>
  );

  const convertAccountType = (type: string) => (type === 'bank' ? 'Wire Transfer' : type[0].toUpperCase() + type.slice(1));

  return (
    <>
      <FormFilter key="form" filter={onFilter} />
      <>
        <Table responsive striped borderless key="table">
          <thead>
            <tr>
              <th>
                <a>Modell</a>
              </th>
              <th>
                <a>Konto Typ</a>
              </th>
              <th>
                <a>Gesamt</a>
              </th>
              {/* <th>
                  <a>Commission</a>
                </th>
                <th>
                  <a>Received</a>
                </th> */}
              <th>
                <a>Status</a>
              </th>
              <th>
                <a>Erstellen bei</a>
              </th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {dataPayout && dataPayout.length > 0 ? (
              dataPayout.map((item: any, index: number) => (
                <tr key={index as any}>
                  <td>{item?.model?.username}</td>
                  <td>
                    {item.payoutAccount && item.payoutAccount.type && convertAccountType(item.payoutAccount.type)}
                  </td>
                  <td>{item.tokenRequest}</td>
                  {/* <td>{item.commission}</td>
                    <td>{item.balance}</td> */}
                  <td>{statusItem(item.status)}</td>
                  <td>
                    <Moment format="YYYY-MM-DD">{item.createdAt}</Moment>
                  </td>
                  <td>
                    <Link href="/payouts/detail/[id]" as={`/payouts/detail/${item._id}`}>
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
        {totalPayout > 0 && totalPayout > query.take
              && (
                <MainPaginate
                  currentPage={query.page}
                  pageTotal={totalPayout}
                  pageNumber={query.take}
                  setPage={(page) => setQuery({ ...query, page })}
                />
              )}
      </>
    </>
  );
}

export default TablePayouts;
