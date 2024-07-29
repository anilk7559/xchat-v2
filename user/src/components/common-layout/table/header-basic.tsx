interface IProps {
  handleSort: Function;
  theadClassName?: string;
  trClassName?: string;
  columns: any;
  sort: string;
  sortType: string;
}
function TableHeaderBasic({
  columns,
  handleSort,
  theadClassName = '',
  trClassName = '',
  sort,
  sortType
}: IProps) {
  return (
    <thead className={theadClassName || ''}>
      <tr className={trClassName || ''}>
        {columns?.map((column) => (
          <th key={column.name}>
            <span onClick={() => handleSort({ sort: column?.value, sortType: 'desc' })}>{column?.name}</span>
            <a
              href="#"
              onClick={() => handleSort({ sort: column?.value, sortType: 'desc' })}
              className={`arrow ${sort === column?.value && sortType === 'desc' && 'active'}`}
            >
              <i className="fas fa-long-arrow-alt-down" />
            </a>
            <a
              href="#"
              onClick={() => handleSort({ sort: column?.value, sortType: 'asc' })}
              className={`arrow ${sort === column?.value && sortType === 'asc' && 'active'}`}
            >
              <i className="fas fa-long-arrow-alt-up" />
            </a>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeaderBasic;
