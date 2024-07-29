import { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import MainPaginate from 'src/components/paginate/main-paginate';

import UserListItem from './user-list-item';

type IProps = {
  data: {
    items: any[];
    count: number;
  };
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  showBio?: boolean;
  onPageChange: Function;
}
function UserListing({
  data,
  currentPage,
  pageSize,
  loading = false,
  showBio = false,
  onPageChange
}: IProps) {
  const pagination = useMemo(() => {
    if (data.count > 0 && data.count > pageSize) {
      return <MainPaginate currentPage={currentPage} pageTotal={data.count} pageNumber={pageSize} setPage={(page) => onPageChange(page)} />;
    }
    return null;
  }, [currentPage]);

  if (loading) {
    return (
      <div className="mgT20">
        <p>Searching...</p>
      </div>
    );
  }

  if (!loading && !data.items.length) {
    return (
      <div className="mgT20">
        <Alert variant="danger">Entschuldigung, wir konnten keine Modelle finden, die Ihren Kriterien entsprechen. Bitte versuchen Sie eine andere Suche.</Alert>
      </div>
    );
  }

  return (
    <>
      <div className="row m-0 mt-4">
        {data.items.map((user: any) => <UserListItem key={user._id} user={user} showBio={showBio} />)}
      </div>
      {pagination}
    </>
  );
}

export default UserListing;
