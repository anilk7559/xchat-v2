import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  Form, FormControl, FormGroup, FormLabel, Button, Row, Col
} from 'react-bootstrap';
import Router from 'next/router';
import { pick } from 'lodash';

interface FormValue {
  type: string; // ['paypal', 'paxum', 'bank']
  email: string;
  bankName: string;
  bankAddress: string;
  iban: string;
  swift: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
}

interface IProps {
  submit: Function;
  payoutAccount: any;
  loadingUpdate: boolean;
}

function PayoutAccountForm({ payoutAccount, submit, loadingUpdate }: IProps) {
  const { type, bankInfo, email } = payoutAccount;
  const initialValues = {
    type: type || 'bank',
    email: email || '',
    bankName: bankInfo?.bankName || '',
    bankAddress: bankInfo?.bankAddress || '',
    iban: bankInfo?.iban || '',
    swift: bankInfo?.swift || '',
    beneficiaryName: bankInfo?.beneficiaryName || '',
    beneficiaryAddress: bankInfo?.beneficiaryAddress || ''
  };

  const schema = Yup.object().shape({
    type: Yup.string().required(),
    email: Yup.string().email('Email format is not right').notRequired(),
    bankName: Yup.string().required('Bank name is required!'),
    bankAddress: Yup.string().required('Bank address is required!'),
    iban: Yup.string().required('Iban is a required!'),
    swift: Yup.string().required('SWIFT/BIC is a required!'),
    beneficiaryName: Yup.string().required('Beneficiary name is required!'),
    beneficiaryAddress: Yup.string().required('Beneficiary address is required!')
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={schema}
      onSubmit={(value) => {
        let tmoBankInfo = {};
        if (value.type === 'bank') {
          tmoBankInfo = pick(value, ['bankName', 'bankAddress', 'iban', 'swift', 'beneficiaryName', 'beneficiaryAddress']);
          // eslint-disable-next-line no-param-reassign
          value.email = '';
        }
        const data = { tmoBankInfo, ...pick(value, ['type', 'email']) };
        submit(data);
      }}
      initialValues={initialValues}
    >
      {(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <FormGroup as={Row} className="form-group">
            <FormLabel column sm={{ span: 2, offset: 2 }}>
            Banküberweisung
            </FormLabel>
            <Col sm={6}>
              <Form.Control as="select" name="type" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.type}>
                <option value="bank">Wire Transfer</option>
                <option value="paypal">Paypal</option>
                <option value="paxum">Paxum</option>
              </Form.Control>
            </Col>
          </FormGroup>
          {props.values.type !== 'bank' ? (
            <FormGroup as={Row} className="form-group">
              <FormLabel column sm={{ span: 2, offset: 2 }}>
                Email
              </FormLabel>
              <Col sm={6}>
                <FormControl
                  placeholder="example@email.com"
                  className="input-type"
                  name="email"
                  value={props.values.email}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={props.touched.email && !!props.errors.email}
                />
                <div className="invalid-feedback">{props.errors.email}</div>
              </Col>
            </FormGroup>
          ) : (
            <>
              <FormGroup as={Row} className="form-group">
                <FormLabel column sm={{ span: 2, offset: 2 }}>
                Bank Name
                </FormLabel>
                <Col sm={6}>
                  <FormControl
                    placeholder="Enter bank name"
                    className="input-type"
                    name="bankName"
                    value={props.values.bankName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={props.touched.bankName && !!props.errors.bankName}
                  />
                  <div className="invalid-feedback">{props.errors.bankName}</div>
                </Col>
              </FormGroup>
              <FormGroup as={Row} className="form-group">
                <FormLabel column sm={{ span: 2, offset: 2 }}>
                Bankadresse
                </FormLabel>
                <Col sm={6}>
                  <FormControl
                    placeholder="Bankadresse eingeben"
                    className="input-type"
                    name="bankAddress"
                    value={props.values.bankAddress}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={!!props.errors.bankAddress && props.touched.bankAddress}
                  />
                  <div className="invalid-feedback">{props.errors.bankAddress}</div>
                </Col>
              </FormGroup>
              <FormGroup as={Row} className="form-group">
                <FormLabel column sm={{ span: 2, offset: 2 }}>
                IBAN
                </FormLabel>
                <Col sm={6}>
                  <FormControl
                    placeholder="Enter IBAN"
                    className="input-type"
                    name="iban"
                    value={props.values.iban}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={!!props.errors.iban && props.touched.iban}
                  />
                  <div className="invalid-feedback">{props.errors.iban}</div>
                </Col>
              </FormGroup>
              <FormGroup as={Row} className="form-group">
                <FormLabel column sm={{ span: 2, offset: 2 }}>
                  SWIFT/BIC
                </FormLabel>
                <Col sm={6}>
                  <FormControl
                    placeholder="SWIFT/BIC eingeben"
                    className="input-type"
                    name="swift"
                    value={props.values.swift}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={!!props.errors.swift && props.touched.swift}
                  />
                  <div className="invalid-feedback">{props.errors.swift}</div>
                </Col>
              </FormGroup>
              <FormGroup as={Row} className="form-group">
                <FormLabel column sm={{ span: 2, offset: 2 }}>
                Name des Begünstigten
                </FormLabel>
                <Col sm={6}>
                  <FormControl
                    placeholder="Enter beneficiary name"
                    className="input-type"
                    name="beneficiaryName"
                    value={props.values.beneficiaryName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={!!props.errors.beneficiaryName && props.touched.beneficiaryName}
                  />
                  <div className="invalid-feedback">{props.errors.beneficiaryName}</div>
                </Col>
              </FormGroup>
              <FormGroup as={Row} className="form-group">
                <FormLabel column sm={{ span: 2, offset: 2 }}>
                Begünstigten-Adresse
                </FormLabel>
                <Col sm={6}>
                  <FormControl
                    placeholder="Empfängeradresse eingeben"
                    className="input-type"
                    name="beneficiaryAddress"
                    value={props.values.beneficiaryAddress}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={!!props.errors.beneficiaryAddress && props.touched.beneficiaryAddress}
                  />
                  <div className="invalid-feedback">{props.errors.beneficiaryAddress}</div>
                </Col>
              </FormGroup>
            </>
          )}

          <Row>
            <Col sm={{ span: 6, offset: 4 }}>
              <Button className="btn btn-outline-danger" onClick={() => Router.back()} variant="outline-danger">
                Stornieren
              </Button>
                &nbsp;
              <Button type="submit" className="btn btn-outline-danger btn-green" variant="outline-danger" disabled={loadingUpdate}>
              Einreichen
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
}

export default PayoutAccountForm;
