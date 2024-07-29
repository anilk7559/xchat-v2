import * as React from 'react';
import {
  Col, Row, Button, FormGroup, Label, Input
} from 'reactstrap';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { connect, useDispatch } from 'react-redux';
import { loadUsers } from '../../redux/user/actions';

const Typeahead = AsyncTypeahead as any;

interface FormValue {
  userId: string;
  isApproved: any;
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
  completedProfile: true,
  isApproved: ''
} as any;

const initialValues = {
  userId: '',
  isApproved: ''
} as any;

function FormFilter({ filter, user }: IProps) {
  const [queryUser, setQuery] = React.useState(initialQuery);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (queryUser.username) {
      dispatch(loadUsers(queryUser));
    }
  }, [queryUser]);

  const arrUser = user.list.items;

  const handleSearch = (query: any) => {
    setQuery({
      ...queryUser,
      username: query
    });
  };

  const selectModel = (model: any, props: FormikHelpers<FormValue>) => {
    if (model && model.length) {
      props.setFieldValue('userId', model[0]._id);
    } else { /* empty */ }
  };

  return (
    <Formik
      onSubmit={(values: FormValue, formikActions: FormikHelpers<FormValue>) => {
        filter(values);
        formikActions.setSubmitting(false);
        // formikActions.resetForm();
      }}
      initialValues={initialValues}
      render={(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label>Modell</Label>
                <Typeahead
                  {...{ isLoading: user.status === 'loading', options: arrUser }}
                  id="my-typeahead-id"
                  labelKey="username"
                  minLength={1}
                  onSearch={handleSearch}
                  placeholder="suchModell"
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
            <Col md={4}>
              <FormGroup className="form-filter">
                <Label>Freigabestand</Label>
                <Input
                  invalid={props.touched.isApproved && !!props.errors.isApproved}
                  type="select"
                  name="isApproved"
                  id="isApproved"
                  onChange={props.handleChange}
                  value={props.values.isApproved}
                >
                  <option value="">Alle</option>
                  <option value="true">Genehmigt</option>
                  <option value="false">Nicht genehmigt</option>
                </Input>
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
}
const mapStateToProps = (state: any) => ({ user: state.user });
export default connect(mapStateToProps)(FormFilter);
