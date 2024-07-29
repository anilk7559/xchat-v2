import {
  Col, Row, Button, FormGroup, Label, Input
} from 'reactstrap';
import { Formik, FormikProps, FormikHelpers } from 'formik';

interface FormValue {
  username: string;
  phoneNumber: string;
  isCompletedProfile: any;
  isCompletedDocument: any;
  isApproved: any;
  emailVerified: any;
  type: string;
  gender: string;
}

const initialValues = {
  username: '',
  phoneNumber: '',
  isCompletedProfile: '',
  isApproved: '',
  type: '',
  gender: '',
  emailVerified: ''
} as any;

function FormFilter({ filter }) {
  return (
    <Formik
      onSubmit={(values: FormValue, formikActions: FormikHelpers<FormValue>) => {
        filter(values);
        formikActions.setSubmitting(false);
      }}
      initialValues={initialValues}
      render={(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form className="form-filter">
            <Col md={3}>
              <FormGroup>
                <Label>Nutzername</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Zum Filtern den Benutzernamen eingeben"
                  onChange={props.handleChange}
                  value={props.values.username}
                />
              </FormGroup>
            </Col>
            <Col md={9}>
              <Row form className="form-filter">
                <Col xs={4} md={4}>
                  <FormGroup>
                    <Label>Konto Typ</Label>
                    <Input
                      invalid={props.touched.type && !!props.errors.type}
                      type="select"
                      name="type"
                      id="type"
                      onChange={props.handleChange}
                      value={props.values.type}
                    >
                      <option value="">Alle</option>
                      <option value="user">LÜFTER</option>
                      <option value="model">Modell</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs={4} md={4}>
                  <FormGroup>
                    <Label>Profilstatus</Label>
                    <Input
                      invalid={props.touched.isCompletedProfile && !!props.errors.isCompletedProfile}
                      type="select"
                      name="isCompletedProfile"
                      id="isCompletedProfile"
                      onChange={props.handleChange}
                      value={props.values.isCompletedProfile}
                    >
                      <option value="">Alle</option>
                      <option value="true">Vollständig</option>
                      <option value="false">Unvollständig</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs={4} md={4}>
                  <FormGroup>
                    <Label>Email überprüft</Label>
                    <Input
                      invalid={props.touched.emailVerified && !!props.errors.emailVerified}
                      type="select"
                      name="emailVerified"
                      id="emailVerified"
                      onChange={props.handleChange}
                      value={props.values.emailVerified}
                    >
                      <option value="">Alle</option>
                      <option value="true">Vollständig</option>
                      <option value="false">Unvollständig</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs={4} md={4}>
                  <FormGroup>
                    <Label>Dokumentstatus</Label>
                    <Input
                      invalid={props.touched.isCompletedDocument && !!props.errors.isCompletedDocument}
                      type="select"
                      name="isCompletedDocument"
                      id="isCompletedDocument"
                      onChange={props.handleChange}
                      value={props.values.isCompletedDocument}
                    >
                      <option value="">Alle</option>
                      <option value="true">Vollständig</option>
                      <option value="false">Unvollständig</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs={4} md={4}>
                  <FormGroup>
                    <Label>Verifizierungsstatus</Label>
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
                <Col xs={4} md={4}>
                  <FormGroup>
                    <Label>Geschlecht</Label>
                    <Input
                      invalid={props.touched.gender && !!props.errors.gender}
                      type="select"
                      name="gender"
                      id="gender"
                      onChange={props.handleChange}
                      value={props.values.gender}
                    >
                      <option value="">Alle</option>
                      <option value="male">Männlich</option>
                      <option value="female">Weiblich</option>
                      <option value="transgender">Transgender</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
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

export default FormFilter;
