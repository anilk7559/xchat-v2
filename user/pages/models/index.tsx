import ContactSearchForm from '@components/contact/contact-search-form';
import PageTitle from '@components/page-title';
import { withAuth } from '@redux/withAuth';
import { userService } from '@services/user.service';
import { useTranslationContext } from 'context/TranslationContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';

// todo fix dynamic forward ref
// const ContactSearchForm = dynamic(() => import('@components/contact/contact-search-form'), {
//   ssr: false
// });
const LocationSubFilter = dynamic(() => import('@components/user/filter/location-sub-filter'), {
  ssr: false
});
const UserFilter = dynamic(() => import('@components/user/filter/user-filter'), {
  ssr: false
});
const UserListing = dynamic(() => import('@components/user/user-listing'), {
  ssr: false
});

const mapStates = (state: any) => ({
  authUser: state.auth.authUser
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

function ModelList({
  authUser
}: PropsFromRedux) {
  const { t } = useTranslationContext();
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  const [data, setData] = useState({
    items: [],
    count: 0
  });
  const pageSize = 12;
  const [query, setQuery] = useState({
    page: 1,
    take: 12,
    type: authUser.type === 'model' ? 'user' : 'model',
    gender: undefined,
    country: undefined,
    state: undefined,
    city: undefined
  });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
      const updatedQuery = {
        ...query,
        type: authUser.type ==='model'? 'user' :'model',
      };
      setQuery(updatedQuery);
      search(updatedQuery);
  }, [authUser]);

  const search = async (newQuery = {}) => {
    setLoading(true);
    const requestQuery = {
      ...query,
      ...newQuery
    };
    const { friendOnly } = router.query;
    const resp = friendOnly
      ? await userService.getFriends({
        ...requestQuery,
        isFriend: true
      })
      : await userService.find(requestQuery);
    setData(resp?.data);
    setLoading(false);
  };

  const onPageChange = (page) => {
    const newQuery = {
      ...query,
      page
    };
    setQuery(newQuery);
    search({ page });
  };

  const onUserFilter = (value) => {
    if (value === 'location') {
      setShowLocation(true);
    } else {
      setShowLocation(false);
      const newQuery = {
        ...query,
        gender: undefined,
        country: undefined,
        state: undefined,
        city: undefined,
        postCode: undefined // Reset postCode if another filter is selected
      };

      if (value === 'male' || value === 'female' || value === 'transgender') {
        newQuery.gender = value;
      } else if (/^\d{5}$/.test(value)) { // Check if value is a valid 5-digit postCode
        newQuery.postCode = value;
      }

      setQuery(newQuery);
      search(newQuery);
    }
  };

  const onSearchForm = (val) => {
    const newQuery = {
      ...query,
      ...val,
      page: 1
    };
    setQuery(newQuery);
    search(newQuery);
  };

  // country, city, state
  const onLocationFilter = (val) => {
    const newQuery = {
      ...query,
      ...val,
      page: 1
    };
    setQuery(newQuery);
    search(newQuery);
  };

  const { friendOnly } = router.query;
  const pageTitle = friendOnly ? 'Favoriten' : 'Alle Modelle';

  useEffect(() => {
      search({ username: '' });
      if (formRef.current) {
        formRef?.current?.resetForm();
      }
  }, [router]);

  return (
    <main className="main scroll">
      <PageTitle title={pageTitle} />
      <div className="chats">
        <div className="chat-body p-3">
          <Row className="m-0">
            <Col md={4} xs={12}>
              <h4 className="set-font-size my-3">{t?.title}</h4>
            </Col>
            <Col md={8} xs={12} sm={12} className=" mb-2">
              <Row className="m-0">
                <Col md={9} xs={12} className="p-0">
                  <div className="search-filter mb-2">
                    {authUser?.type === 'user' && (
                    <UserFilter onFilter={onUserFilter} />
                    )}
                  </div>
                </Col>
                <Col md={3} xs={12} sm={12} className="search-filter-end p-0">
                  <ContactSearchForm onSubmit={onSearchForm} ref={formRef} />
                </Col>
              </Row>
            </Col>
            {authUser?.type === 'user' && showLocation && (
              <div className="col-md-12 align-self-end mb-2">
                <div className="search-filter location-filter">
                  <LocationSubFilter onChange={onLocationFilter} />
                </div>
              </div>
            )}
          </Row>
          {data && data.count > 0 && (
            <UserListing
              data={data}
              pageSize={pageSize}
              onPageChange={onPageChange}
              loading={loading}
              currentPage={query.page}
            />
          )}
        </div>
      </div>
    </main>
  );
}

ModelList.authenticate = true;

export default withAuth(connector(ModelList));
