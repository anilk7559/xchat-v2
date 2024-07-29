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
  modelId: string;
  type: string;
  status: string;
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
  type: 'model',
  completedProfile: true
} as any;

const initialValues = {
  modelId: '',
  type: '',
  status: ''
} as any;

const FormFilterByModel: React.FunctionComponent<IProps> = ({ filter, user }) => {
  const [queryUser, setQuery] = React.useState(initialQuery);
  const [ref, setRef] = React.useState() as any;
  const arrUser = user.list.items;

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (queryUser.username) {
      dispatch(loadUsers(queryUser));
    }
  }, [queryUser]);

  const handleSearch = (query: any) => {
    setQuery({
      ...queryUser,
      username: query
    });
  };

  const selectModel = (model: any, props: FormikProps<FormValue>) => {
    if (model && model.length) {
      props.setFieldValue('modelId', model[0]._id);
    }
  };

  const onFilter = (values: any) => {
    filter(values);
    const instance = ref.getInstance();
    instance.clear();
    instance.focus();
  };

  return (
    <Formik
      onSubmit={(values: FormValue, formikActions: FormikHelpers<FormValue>) => {
        onFilter(values);
        formikActions.setSubmitting(false);
        formikActions.resetForm();
      }}
      initialValues={initialValues}
    >
      {(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Modell</Label>
                <Typeahead
                  {...{ isLoading: user.status === 'loading', options: arrUser }}
                  id="model-id"
                  labelKey="username"
                  minLength={2}
                  onSearch={(query: any) => handleSearch(query)}
                  placeholder="Suchmodell"
                  onChange={(s: any) => selectModel(s, props)}
                  ref={(value) => setRef(value)}
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
    </Formik>
  );
};
const mapStateToProps = (state: any) => ({ user: state.user });
export default connect(mapStateToProps)(FormFilterByModel);
