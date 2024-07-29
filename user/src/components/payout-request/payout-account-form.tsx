import { payoutAccountAccount } from '@services/payout.service';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface FormValues {
  type: string; // ['paypal', 'paxum', 'bank']
  email: string;
  bankName: string;
  bankAddress: string;
  iban: string;
  swift: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
}

function PayoutAccountForm() {
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({
    type: 'bank'
  });

  const schema = Yup.object().shape({
    type: Yup.string().required(),
    email: Yup.string().when('type', {
      is: (type) => type !== 'bank',
      then: Yup.string().email('E-Mail-Format ist nicht korrekt').required('E-Mail wird benötigt!')
    }),
    bankName: Yup.string().when('type', {
      is: 'bank',
      then: Yup.string().required('Bankname wird benötigt!')
    }),
    bankAddress: Yup.string().when('type', {
      is: 'bank',
      then: Yup.string().required('Bankadresse wird benötigt!')
    }),
    iban: Yup.string().when('type', {
      is: 'bank',
      then: Yup.string().required('IBAN wird benötigt!')
    }),
    swift: Yup.string().when('type', {
      is: 'bank',
      then: Yup.string().required('SWIFT/BIC wird benötigt!')
    }),
    beneficiaryName: Yup.string().when('type', {
      is: 'bank',
      then: Yup.string().required('Name des Begünstigten wird benötigt!')
    }),
    beneficiaryAddress: Yup.string().when('type', {
      is: 'bank',
      then: Yup.string().required('Adresse des Begünstigten wird benötigt!')
    })
  });

  const handleSubmit = async (values: FormValues) => {
    const {
      bankName, bankAddress, iban, swift, beneficiaryName, beneficiaryAddress, type, email
    } = values;
    const data = values.type === 'bank' ? {
      bankInfo: {
        bankName,
        bankAddress,
        iban,
        swift,
        beneficiaryName,
        beneficiaryAddress
      },
      type
    } : { type, email };

    await payoutAccountAccount.update(data);
    toast.success('Das Auszahlungskonto wurde aktualisiert!');
    setTimeout(() => {
      Router.push('/profile/payout-request', '/payout-request', { shallow: true });
    }, 1000);
  };

  const loadPayoutAccount = async () => {
    setLoading(true);
    const resp = await payoutAccountAccount.find();

    const { type, bankInfo, email } = resp.data || {};
    setInitialValues({
      type: type || 'bank',
      email: email || '',
      bankName: bankInfo?.bankName || '',
      bankAddress: bankInfo?.bankAddress || '',
      iban: bankInfo?.iban || '',
      swift: bankInfo?.swift || '',
      beneficiaryName: bankInfo?.beneficiaryName || '',
      beneficiaryAddress: bankInfo?.beneficiaryAddress || ''
    });
    setLoading(false);
  };

  useEffect(() => {
    loadPayoutAccount();
  }, []);

  return (
    <div className="row m-0">
      <div className="col-md-12">
        <div className="card mb-3">
          {loading ? <p>Laden</p> : (
            <Formik
              enableReinitialze
              onSubmit={(values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
                handleSubmit(values);
                formikHelpers.setSubmitting(false);
              }}
              initialValues={initialValues}
              validationSchema={schema}
            >
              {(props: FormikProps<FormValues>) => (
                <form onSubmit={props.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 col-12">
                        <Form.Group>
                          <Form.Label>Zahlungssystem</Form.Label>
                          <Form.Control as="select" name="type" onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.type}>
                            <option value="bank">Überweisung</option>
                            <option value="paypal">Paypal</option>
                            <option value="paxum">Paxum</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      {props.values.type !== 'bank' ? (
                        <div className="col-md-6 col-12">
                          <Form.Group>
                            <Form.Label>E-Mail</Form.Label>

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
                          </Form.Group>
                        </div>
                      ) : (
                        <>
                          <div className="col-md-6 col-12">
                            <Form.Group>
                              <Form.Label>Bank Name</Form.Label>

                              <FormControl
                                placeholder="Geben Sie den Banknamen ein"
                                className="input-type"
                                name="bankName"
                                value={props.values.bankName}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={props.touched.bankName && !!props.errors.bankName}
                              />
                              <div className="invalid-feedback">{props.errors.bankName}</div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 col-12">
                            <Form.Group>
                              <Form.Label>Bankadresse</Form.Label>

                              <FormControl
                                placeholder="Geben Sie die Bankadresse ein"
                                className="input-type"
                                name="bankAddress"
                                value={props.values.bankAddress}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={props.touched.bankAddress && !!props.errors.bankAddress}
                              />
                              <div className="invalid-feedback">{props.errors.bankAddress}</div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 col-12">
                            <Form.Group>
                              <Form.Label>IBAN</Form.Label>

                              <FormControl
                                placeholder="Geben Sie IBAN ein"
                                className="input-type"
                                name="iban"
                                value={props.values.iban}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={props.touched.iban && !!props.errors.iban}
                              />
                              <div className="invalid-feedback">{props.errors.iban}</div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 col-12">
                            <Form.Group>
                              <Form.Label>SWIFT/BIC</Form.Label>

                              <FormControl
                                placeholder="Geben Sie SWIFT/BIC ein"
                                className="input-type"
                                name="swift"
                                value={props.values.swift}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={props.touched.swift && !!props.errors.swift}
                              />
                              <div className="invalid-feedback">{props.errors.swift}</div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 col-12">
                            <Form.Group>
                              <Form.Label>Name des Begünstigten</Form.Label>

                              <FormControl
                                placeholder="Geben Sie den Namen des Begünstigten ein."
                                className="input-type"
                                name="beneficiaryName"
                                value={props.values.beneficiaryName}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={props.touched.beneficiaryName && !!props.errors.beneficiaryName}
                              />
                              <div className="invalid-feedback">{props.errors.beneficiaryName}</div>
                            </Form.Group>
                          </div>
                          <div className="col-md-6 col-12">
                            <Form.Group>
                              <Form.Label>Adresse des Begünstigten</Form.Label>

                              <FormControl
                                placeholder="Geben Sie die Adresse des Begünstigten ein."
                                className="input-type"
                                name="beneficiaryAddress"
                                value={props.values.beneficiaryAddress}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={props.touched.beneficiaryAddress && !!props.errors.beneficiaryAddress}
                              />
                              <div className="invalid-feedback">{props.errors.beneficiaryAddress}</div>
                            </Form.Group>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <Button className="mr-3" variant="outline-primary" onClick={() => Router.back()}>
                    Abbrechen
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Laden...' : 'Absenden'}
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}

export default PayoutAccountForm;
