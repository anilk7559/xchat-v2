import * as React from 'react';
import {
  Col, Row, Button, FormGroup, Label
} from 'reactstrap';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { connect, useDispatch } from 'react-redux';
import { loadUsers } from '../../redux/user/actions';

const Typeahead = AsyncTypeahead as any;

interface FormValue {
  userId: string;
  modelId: string;
}

interface IProps {
  filter: Function;
  user: any;
}

const initialQuery = {
  sortType: 'desc',
  sortBy: 'createdAt',
  page: 1,
  take: 10,
  username: '',
  type: ''
} as any;

const initialValues = {
  userId: '',
  modelId: ''
} as any;

const FormFilter: React.FunctionComponent<IProps> = ({ filter, user }) => {
  const [queryUser, setQuery] = React.useState(initialQuery);
  const arrUser = user.list.items;

  const distpatch = useDispatch();
  React.useEffect(() => {
    if (queryUser.username && queryUser.type) {
      distpatch(loadUsers(queryUser));
    }
  }, [queryUser]);

  const handleSearch = (query: any, type: any) => {
    setQuery({
      ...queryUser,
      username: query,
      type
    });
  };

  const selectUser = (users: any, props: FormikProps<FormValue>) => {
    if (users && users.length) {
      props.setFieldValue('userId', users[0]._id);
    }
  };

  const selectModel = (model: any, props: FormikProps<FormValue>) => {
    if (model && model.length) {
      props.setFieldValue('modelId', model[0]._id);
    }
  };

  return (
    <Formik
      onSubmit={(values: FormValue, formikActions: FormikHelpers<FormValue>) => {
        filter(values);
        formikActions.setSubmitting(false);
        formikActions.resetForm();
      }}
      initialValues={initialValues}
      render={(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Lüfter</Label>
                <Typeahead
                  {...{ isLoading: user.status === 'loading', options: arrUser }}
                  id="user-id"
                  labelKey="username"
                  minLength={2}
                  onSearch={(query: any) => handleSearch(query, 'user')}
                  placeholder="Search fan"
                  onChange={(s: any) => selectUser(s, props)}
                  useCache
                  renderMenuItemChildren={(option: any) => [
                    <img
                      alt=""
                      src={option.avatarUrl}
                      width="30px"
                      style={{ display: 'inline-block' }}
                      key={`img${option._id}`}
                    />,
                    <p
                      style={{ margin: 'unset', display: 'inline-block', marginLeft: '3px' }}
                      key={`text${option._id}`}
                    >
                      {option.username}
                    </p>
                  ]}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Modell</Label>
                <Typeahead
                  {...{ isLoading: user.status === 'loading', options: arrUser }}
                  id="model-id"
                  labelKey="username"
                  minLength={1}
                  onSearch={(query: any) => handleSearch(query, 'model')}
                  placeholder="Search model"
                  onChange={(s: any) => selectModel(s, props)}
                  renderMenuItemChildren={(option: any) => [
                    <img
                      alt=""
                      src={option.avatarUrl}
                      width="30px"
                      style={{ display: 'inline-block' }}
                      key={`img${option._id}`}
                    />,
                    <p
                      style={{ margin: 'unset', display: 'inline-block', marginLeft: '3px' }}
                      key={`text${option._id}`}
                    >
                      {option.username}
                    </p>
                  ]}
                />
              </FormGroup>
            </Col>
          </Row>

          <Button type="submit" color="primary" outline>
            Filter
          </Button>
        </form>
      )}
    />
  );
};
const mapStateToProps = (state: any) => ({ user: state.user });
export default connect(mapStateToProps)(FormFilter);
