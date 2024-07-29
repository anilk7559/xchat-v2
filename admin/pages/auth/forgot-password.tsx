import * as React from 'react';
import Router from 'next/router';
import {
  Form, FormControl, Button
} from 'react-bootstrap';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import BlankLayout from 'src/components/layouts/blank';
import Head from 'next/head';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { authService } from '@services/auth.service';

interface FormValues {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string().email().required('Email is Required')
});

const ForgotPassword = () => {
  const handleForgotPassword = async (values) => {
    try {
      await authService.adminForgotPassword(values);
      toast.success('Ihnen wurde eine E-Mail zum Zurücksetzen Ihres Passworts gesendet');
      Router.push('/login');
    } catch (e) {
      const error = await e;
      toast.error(error?.data?.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!');
    }
  };

  return (
    <div className="logreg-forms">
      <Head>
        <title>Passwort vergessen</title>
      </Head>
      <Formik
        validationSchema={schema}
        initialValues={{ email: '' }}
        onSubmit={(
          values: FormValues,
          formikActions: FormikHelpers<FormValues>
        ) => {
          setTimeout(() => {
            handleForgotPassword(values);
            formikActions.setSubmitting(false);
            formikActions.resetForm();
          }, 500);
        }}
      >
        {(props: FormikProps<FormValues>) => (
          <form className="form-signin" onSubmit={props.handleSubmit}>
            <h1
              className="h3 mb-3 font-weight-normal"
              style={{ textAlign: 'center' }}
            >
              Passwort vergessen
            </h1>
            <Form.Group>
              <FormControl
                isInvalid={props.touched.email && !!props.errors.email}
                type="text"
                className="form-control"
                name="email"
                placeholder="E-Mail-Adresse"
                value={props.values.email}
                onChange={props.handleChange}
              />
              <div className="invalid-feedback">{props.errors.email}</div>
            </Form.Group>
            <Button className="btn btn-success btn-block" type="submit">
              Submit
            </Button>

            <Link legacyBehavior href="/login">
              <a>Anmeldung</a>
            </Link>
            <br />
          </form>
        )}
      </Formik>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </div>
  );
};

ForgotPassword.authenticate = false;
ForgotPassword.Layout = BlankLayout;

export default ForgotPassword;
