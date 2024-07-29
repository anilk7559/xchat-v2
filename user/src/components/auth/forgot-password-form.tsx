import { Formik, FormikHelpers, FormikProps } from 'formik';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authService } from 'src/services/auth.service';
import * as Yup from 'yup';

interface IFormValues {
  email: string;
}

const Loader = dynamic(() => import('src/components/common-layout/loader/loader'), { ssr: false });

const schema = Yup.object().shape({
  email: Yup.string().email('E-Mail-Format ist nicht korrekt').required('E-Mail wird benötigt')
});


function ForgotPasswordForm() {
  const [requesting, setRequesting] = useState(false);
  const forgotPassword = async (data: any) => {
    await authService
      .forgot(data)
      .then((resp) => {
        toast.success(resp?.data?.data?.message || 'Anfrage erfolgreich gesendet! Bitte überprüfen Sie Ihre E-Mail.');
        Router.push('/auth/login');
      })
      .catch(async (e) => {
        const error = await Promise.resolve(e);
        return toast.error(error?.data?.message || 'Es ist ein Fehler aufgetreten!');
      });
    setRequesting(false);
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: '' }}
      onSubmit={(values: IFormValues, formikHelpers: FormikHelpers<IFormValues>) => {
        setRequesting(true);
        forgotPassword(values);
        formikHelpers.setSubmitting(false);
      }}
    >
      {(props: FormikProps<IFormValues>) => (
        <form onSubmit={props.handleSubmit}>
          <Form.Group>
            <Form.Label className="input-label">E-Mail-Adresse</Form.Label>
            <FormControl
              isInvalid={props.touched.email && !!props.errors.email}
              name="email"
              className="form-control"
              type="text"
              id="email"
              placeholder="user@example.com"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.email}
            />
            <div className="invalid-feedback">{props.errors.email}</div>
          </Form.Group>

          <Form.Group className="mt-5">
            <button type="submit" className="xchat-btn-fill" disabled={requesting}>
              {requesting ? <Loader /> : 'E-Mail senden'}
            </button>
          </Form.Group>
        </form>
      )}
    </Formik>
  );
}

export default ForgotPasswordForm;
