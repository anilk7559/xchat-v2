/* eslintdisable react/nounusedproptypes */

import * as React from 'react';
import {
  Col, Row, Button, FormGroup, Label, Input
} from 'reactstrap';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { connect } from 'react-redux';
import { loadUsers } from '../../redux/user/actions';
// import { AsyncTypeahead } from 'reactbootstraptypeahead';

interface FormValue {
  type: string;
  status: string;
}

interface IProps {
  filter: Function;
  modelId: string;
}

// const initialQuery = {
//   sortType: 'desc',
//   sortBy: 'createdAt',
//   page: 1,
//   take: 10,
//   username: '',
//   type: 'model',
//   completedProfile: true
// } as any;

const initialValues = {
  // modelId: '',
  type: '',
  status: ''
} as any;

// eslintdisablenextline react/functioncomponentdefinition

const FormFilter: React.FunctionComponent<IProps> = ({ filter, modelId }) => {
  // const [queryUser, setQuery] = React.useState(initialQuery);
  // const [ref, setRef] = React.useState() as any;
  // let arrUser = user.list.items;

  // React.useEffect(() => {
  //   if (queryUser.username) {
  //     loadUsers(queryUser);
  //   }

  // }, [queryUser]);
  // const handleSearch = (query: any) => {
  //   setQuery({
  //     ...queryUser,
  //     username: query
  //   });
  // };

  // const selectModel = (model: any, props: FormikProps<FormValue>) => {
  //   if (model && model.length) {
  //     props.setFieldValue('modelId', model[0]._id);
  //   } else {
  //     return;
  //   }
  // };

  const onFilter = (values: any) => {
    filter({ modelId, ...values });
    // const instance = ref.getInstance();
    // instance.clear();
    // instance.focus();
  };

  return (

    <Formik
      onSubmit={(values: FormValue, formikActions: FormikHelpers<FormValue>) => {
        onFilter(values);
        formikActions.setSubmitting(false);
        // formikActions.resetForm();
      }}
      initialValues={initialValues}
      render={(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form>
            {/* <Col md={6}>
                <FormGroup>
                  <Label>Model</Label>
                  <AsyncTypeahead
                    {...{ isLoading: user.status === 'loading', options: arrUser }}
                    id="modelid"
                    labelKey="username"
                    minLength={2}
                    onSearch={(query: any) => handleSearch(query)}
                    placeholder="Search model"
                    onChange={(s: any) => selectModel(s, props)}
                    ref={ref => setRef(ref)}
                    renderMenuItemChildren={(option: any) => [
                      <img
                        src={option.avatarUrl}
                        width="30px"
                        style={{ display: 'inlineblock' }}
                        key={'img' + option._id}
                      />,
                      <p
                        style={{ margin: 'unset', display: 'inlineblock', marginLeft: '3px' }}
                        key={'text' + option._id}>
                        {option.username}
                      </p>
                    ]}
                  />
                </FormGroup>
              </Col> */}
            <Col md={3}>
              <FormGroup>
                <Label>Type</Label>
                <Input
                  invalid={props.touched.type && !!props.errors.type}
                  type="select"
                  name="type"
                  id="type"
                  onChange={props.handleChange}
                  value={props.values.type}
                >
                  <option value="">All</option>
                  <option value="send_message">Send message</option>
                  <option value="purchase_media">Purchase media</option>
                  <option value="share_love">Send Tip</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Status</Label>
                <Input
                  invalid={props.touched.status && !!props.errors.status}
                  type="select"
                  name="status"
                  id="status"
                  onChange={props.handleChange}
                  value={props.values.status}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
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
};

const mapStateToProps = (state: any) => ({ user: state.user });
export default connect(mapStateToProps, { loadUsers })(FormFilter);
