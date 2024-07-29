import * as React from 'react';
import { Table } from 'reactstrap';
import Link from 'next/link';
import { earningService } from '@services/earning.service';
import MainPaginate from '@components/paginate/main-paginate';
import { toast } from 'react-toastify';
import FormFilterByModel from './form-filter-by-model';

interface IProps {
  id: string;
}

const initialQuery = {
  page: 1,
  take: 10,
  sortBy: 'createdAt',
  sortType: 'desc',
  modelId: '',
  type: '',
  status: ''
} as any;

function TableEarning({ id }: IProps) {
  const [query, setQuery] = React.useState({ ...initialQuery, modelId: id || '' });
  const [totalEarning, setTotalEarning] = React.useState(0);
  const [dataEarning, setDataEarning] = React.useState({} as any);

  const onFilter = (values: any) => {
    setQuery({
      ...query,
      modelId: values.modelId,
      type: values.type,
      status: values.status,
      page: 1
    });
  };

  const loadEarning = async () => {
    try {
      const resp = await earningService.getList(query);
      setTotalEarning(resp.data.count);
      setDataEarning(resp.data.items);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Die Ladeerstellung ist fehlgeschlagen!');
    }
  };

  React.useEffect(() => {
    loadEarning();
  }, [query]);

  return (
    <>
      <FormFilterByModel key="form" filter={onFilter} />
      <Table responsive striped borderless key="table">
        <thead>
          <tr>
            <th>
              <a>Modell</a>
            </th>
            <th>
              <a>Gesamtverdienst</a>
            </th>
            <th>
              <a>Bezahlt</a>
            </th>
            <th>
              <a>Unbezahlt</a>
            </th>
            <th>
              <a>Aktionen</a>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataEarning && dataEarning.length > 0 ? (
            dataEarning.map((item: any, index: number) => (
              <tr key={index as any}>
                <td>{item?.model?.username || <span className="badge badge-danger">No name</span>}</td>
                <td>{item.totalEarning.toFixed(2)}</td>
                <td>{item.totalPaid.toFixed(2)}</td>
                <td>{(item.totalEarning - item.totalPaid).toFixed(2)}</td>
                <td>
                  <Link href="/earnings/models/[modelId]/details" as={`/earnings/models/${item.model._id}/details`}>

                    <i className="fa fa-eye" />
                  </Link>
                </td>
                <td />
              </tr>
            ))
          ) : (
            <tr key="non-earning">
              <td>Kein Artikel zum Anzeigen</td>
            </tr>
          )}
        </tbody>
      </Table>
      {totalEarning > 0 && totalEarning > query.take
          && (
            <MainPaginate
              currentPage={query.page}
              pageTotal={totalEarning}
              pageNumber={query.take}
              setPage={(page) => setQuery({ ...query, page })}
            />
          )}
    </>
  );
}
export default TableEarning;
