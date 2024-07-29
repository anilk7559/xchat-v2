import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import { NumericFormat } from 'react-number-format';
import TableFooterBasic from 'src/components/common-layout/table/footer-basic';
import TableHeaderBasic from 'src/components/common-layout/table/header-basic';

interface IProps {
  invoices: any;
  total: any;
  handleGetInvoice: Function;
  // Parent's state
  page: number;
  take: number;
  sort: string;
  sortType: string;
  // --- end ---
}

function PaymentHistory({
  invoices,
  total,
  handleGetInvoice,
  page,
  take,
  sort,
  sortType
}: IProps) {
  const columns = [
    { name: 'Beschreibung', value: 'description' },
    { name: 'Gateway', value: 'gateway' },
    { name: 'Preis', value: 'price' },
    { name: 'Erstellt am', value: 'createdAt' }
  ];

  return (
    <>
      <Table
        id="table-payment-history"
        responsive
        striped
        borderless
        hover
      >
        <TableHeaderBasic columns={columns} handleSort={handleGetInvoice} sort={sort} sortType={sortType} />
        <tbody>
          {invoices && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.description}</td>
                <td>{invoice.gateway.toUpperCase()}</td>
                <td>
                  <NumericFormat
                    thousandSeparator
                    value={invoice.price}
                    displayType="text"
                    prefix="$"
                    decimalScale={2}
                  />
                </td>
                <td>
                  <Moment format="HH:mm DD/MM/YYYY">{invoice.createdAt}</Moment>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Keine Zahlung verfügbar</td>
            </tr>
          )}
        </tbody>
      </Table>
      <TableFooterBasic changePage={handleGetInvoice} page={page} take={take} total={total} />
    </>
  );
}

export default PaymentHistory;
