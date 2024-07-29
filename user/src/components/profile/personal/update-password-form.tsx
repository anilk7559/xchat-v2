import { authService } from '@services/auth.service';
import { useTranslationContext } from 'context/TranslationContext';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { omit } from 'lodash';
import {
  Col, Form, FormControl, Row
} from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface FormValues {
  password: string;
  newPassword: string;
  repeatPassword: string;
}
const validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const schema = Yup.object().shape({
  password: Yup.string().required('Aktuelles Passwort ist erforderlich'),
  newPassword: Yup.string()
    .required('Neues Passwort ist erforderlich')
    .test('Passwort-gleich, Neues Passwort ist dasselbe wie das aktuelle Passwort', function validatePw(value) {
      return this.parent.password !== value;
    })
    .matches(
      validatePassword,
      'Das Passwort muss mindestens 8 Zeichen lang sein, mindestens 1 Zahl, 1 Großbuchstaben, 1 Kleinbuchstaben und 1 Sonderzeichen enthalten'
    ),
  repeatPassword: Yup.string()
    .matches(
      validatePassword,
      'Das Passwort muss mindestens 8 Zeichen lang sein, mindestens 1 Zahl, 1 Großbuchstaben, 1 Kleinbuchstaben und 1 Sonderzeichen enthalten'
    )
    .oneOf([Yup.ref('Neues Passwort')], 'Das wiederholte Passwort muss mit dem neuen Passwort übereinstimmen')
    .required('Wiederholtes Passwort ist erforderlich')

});

const mapStateToProps = (state: any) => ({
  authUser: state.auth.authUser
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function UpdatePasswordForm({
  authUser
}: PropsFromRedux) {

  const {t} = useTranslationContext()
  const updatePassword = async (data) => {
    try {
      await authService.updatePassword(data);
      toast.success('Passwort erfolgreich aktualisiert!');
    } catch (e) {
      const err = await e;
      toast.error(err?.data?.message || 'Fehler beim Aktualisieren des Passworts!');
    }
  };

  return (
    <div>
      <Formik
        validationSchema={schema}
        initialValues={{
          password: '',
          newPassword: '',
          repeatPassword: ''
        }}
        onSubmit={(values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
          if (values.newPassword !== values.repeatPassword) {
            toast.error('Das wiederholte Passwort unterscheidet sich vom neuen Passwort');
            return;
          }
          const data = {
            ...omit(values, ['Wiederholtes Passwort']),
            email: authUser.email
          };
          updatePassword(data);
          formikHelpers.setSubmitting(false);
        }}
      >
        {(props: FormikProps<FormValues>) => (
          <form onSubmit={props.handleSubmit}>
            <div className="card-body">
              <Row>
                <Col md={6} xs={12}>
                  <Form.Group>
                    <Form.Label>{t?.passwordPage?.old}</Form.Label>
                    <FormControl
                      isInvalid={props.touched.password && !!props.errors.password}
                      name="password"
                      className="form-control form-control-md"
                      type="password"
                      placeholder={t?.passwordPage?.old}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.password}
                    />
                    <div className="invalid-feedback">{props.errors.password}</div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} xs={12}>
                  <Form.Group>
                    <Form.Label>{t?.passwordPage?.new}</Form.Label>
                    <FormControl
                      isInvalid={props.touched.newPassword && !!props.errors.newPassword}
                      name="newPassword"
                      className="form-control form-control-md"
                      type="password"
                      placeholder={t?.passwordPage?.new}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.newPassword}
                    />
                    <div className="invalid-feedback">{props.errors.newPassword}</div>
                  </Form.Group>
                </Col>
                <Col md={6} xs={12}>
                  <Form.Group>
                    <Form.Label>{t?.passwordPage?.confirm}</Form.Label>
                    <FormControl
                      isInvalid={props.touched.repeatPassword && !!props.errors.repeatPassword}
                      name="repeatPassword"
                      className="form-control form-control-md"
                      type="password"
                      placeholder={t?.passwordPage?.confirm}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.repeatPassword}
                    />
                    <div className="invalid-feedback">{props.errors.repeatPassword}</div>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="card-footer d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
              {t?.passwordPage?.save}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

UpdatePasswordForm.authenticate = true;

export default connector(UpdatePasswordForm);
