import TableHeaderBasic from '@components/common-layout/table/header-basic';
import {
  Table
} from 'react-bootstrap';
import { IBookmarked } from 'src/interfaces/bookmarked';

import TabBookmarked from './tab-bookmarked';

interface IProps {
  columns: Array<any>;
  listBookmarked: IBookmarked;
  sort: string;
  sortType: string;
  removeBookmarked: Function;
  onChangPage: Function;
}

function TableBookmarked({
  columns,
  listBookmarked,
  removeBookmarked,
  sort,
  sortType,
  onChangPage
}: IProps) {
  return (
    <Table
      id="table-bookmarked-text"
      className="mt-3"
      responsive
      striped
      borderless
      hover
    >
      <TableHeaderBasic columns={columns} handleSort={onChangPage} sort={sort} sortType={sortType} />
      <tbody>
        {listBookmarked.map((bookmarked) => (
          <TabBookmarked bookmarked={bookmarked} removeBookmarked={removeBookmarked} />
        ))}
      </tbody>
    </Table>
  );
}

export default TableBookmarked;
