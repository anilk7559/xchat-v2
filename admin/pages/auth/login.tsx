import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import {
  Form, FormControl, Button, Alert
} from 'react-bootstrap';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
// Action
import { login } from 'src/redux/auth/actions';
import BlankLayout from 'src/components/layouts/blank';
import Head from 'next/head';
import Link from 'next/link';

interface IProps {
  login: Function;
  loginFailure: boolean;
  isLoggedIn: boolean;
}

interface IStates {
  email: string;
  password: string;
}

interface FormValues {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string().email().required('Email is Required'),
  password: Yup.string().required('Password is required')
});

class Login extends React.Component<IProps, IStates> {
  static authenticate = false;

  static Layout = BlankLayout;

  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  // TODO - should use componentWillUpdate
  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      Router.push('/');
    }
  }

  render() {
    const loginError = this.props.loginFailure ? (
      <Alert variant="danger">
        Ungültige E-Mail/Passwort. Bitte überprüfe es nocheinmal!
      </Alert>
    ) : null;
    return (
      <div className="logreg-forms">
        <Head>
          <title>Login</title>
        </Head>
        <Formik
          validationSchema={schema}
          initialValues={{ email: '', password: '' }}
          onSubmit={(
            values: FormValues,
            formikActions: FormikHelpers<FormValues>
          ) => {
            setTimeout(() => {
              this.props.login(values);
              formikActions.setSubmitting(false);
              formikActions.resetForm();
            }, 500);
          }}
          render={(props: FormikProps<FormValues>) => (
            <form className="form-signin" onSubmit={props.handleSubmit}>
              <h1
                className="h3 mb-3 font-weight-normal"
                style={{ textAlign: 'center' }}
              >
                Anmelden
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
              <Form.Group>
                <FormControl
                  isInvalid={
                      props.touched.password && !!props.errors.password
                    }
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Passwort"
                  value={props.values.password}
                  onChange={props.handleChange}
                />
                <div className="invalid-feedback">
                  {props.errors.password}
                </div>
              </Form.Group>

              <Link legacyBehavior href="/forgot-password">
                <a>Passwort vergessen?</a>
              </Link>

              <Button className="btn btn-success btn-block" type="submit">
                <i className="fas fa-sign-in-alt" />
                {' '}
                Anmelden
              </Button>
              <br />
              {loginError}
            </form>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state.auth });
const mapDispatch = { login };

const LoginContainer = connect(mapStateToProps, mapDispatch)(Login);
LoginContainer.Layout = BlankLayout;
export default LoginContainer;
