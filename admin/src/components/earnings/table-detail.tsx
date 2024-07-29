import * as React from 'react';
import { Table } from 'reactstrap';
import Moment from 'react-moment';
import { earningService } from '@services/earning.service';
import { toast } from 'react-toastify';
import MainPaginate from '@components/paginate/main-paginate';
import classNames from 'classnames';
import FormFilter from './form-filter';

interface IProps {
  id: any;
}

const initialQuery = {
  page: 1,
  take: 10,
  sortBy: 'createdAt',
  sortType: 'desc',
  type: '',
  status: ''
} as any;

function TableEarningByModel({ id }: IProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [totalEarningByModel, setTotalEarningByModel] = React.useState(0);
  const [dataEarningByModel, setDataEarningByModel] = React.useState({} as any);

  const loadEarningByModel = async () => {
    try {
      const resp = await earningService.getListByModel({ ...query, modelId: id });
      setTotalEarningByModel(resp.data.count);
      setDataEarningByModel(resp.data.items);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden der Datennachricht ist fehlgeschlagen!');
    }
  };

  const onFilter = (values: any) => {
    setQuery({
      ...query,
      modelId: id,
      type: values.type,
      status: values.status,
      page: 1
    });
  };

  React.useEffect(() => {
    loadEarningByModel();
  }, [query]);

  const typeEarning = (typeEarn: string) => (
    <span
      className={classNames('badge', {
        'badge-primary': typeEarn === 'send_message',
        'badge-danger': typeEarn === 'share_love',
        'badge-success': typeEarn !== 'send_message' && typeEarn !== 'share_love'
      })}
      style={{ textTransform: 'capitalize' }}
    >
      {(typeEarn === 'share_love' ? 'Send tip' : typeEarn).replace('_', ' ')}
    </span>
  );

  const statusItem = (status: string) => (
    <span
      className={classNames('badge', {
        'badge-warning': status === 'pending',
        'badge-success': status === 'approved'
      })}
      style={{ textTransform: 'capitalize' }}
    >
      {status}
    </span>

  );

  return (
    <>
      <FormFilter key="form" filter={onFilter} modelId={id} />
      <Table responsive striped borderless key="table">
        <thead>
          <tr>
            <th>
              <a>Modell</a>
            </th>
            <th>
              <a>Lüfter</a>
            </th>
            <th>
              <a>Type</a>
            </th>
            <th>
              <a>Typ</a>
            </th>
            <th>
              <a>Kommission
              </a>
            </th>
            <th>
              <a>Erhalten</a>
            </th>
            <th>
              <a>Status</a>
            </th>
            <th>
              <a>Erstellen bei
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataEarningByModel && dataEarningByModel.length > 0 ? (
            dataEarningByModel.map((item: any, index: number) => (
              <tr key={index as any}>
                <td>{item?.model?.username || <span className="badge badgedanger">No name</span>}</td>
                <td>{item?.user?.username || <span className="badge badgedanger">No name</span>}</td>
                <td>{typeEarning(item.type)}</td>
                <td>{item.token}</td>
                <td>{item.commission}</td>
                <td>{item.balance}</td>
                <td>{statusItem(item.status)}</td>
                <td>
                  <Moment format="YYYY-MM-DD">{item.createdAt}</Moment>
                </td>
              </tr>
            ))
          ) : (
            <tr key="nonearning">
              <td>Kein Artikel zum Anzeigen</td>
            </tr>
          )}
        </tbody>
      </Table>
      {totalEarningByModel > 0 && totalEarningByModel > query.take
              && (
                <MainPaginate
                  currentPage={query.page}
                  pageTotal={totalEarningByModel}
                  pageNumber={query.take}
                  setPage={(page) => setQuery({ ...query, page })}
                />
              )}
    </>
  );
}

export default TableEarningByModel;
