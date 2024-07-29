import { City, Country, State } from 'country-state-city';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { pick } from 'lodash';
import moment from 'moment';
import getConfig from 'next/config';
import { Component } from 'react';
import {
  Button, Col, Form, FormControl, Image, Row
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Upload from 'src/components/upload/Upload';
import { updateDocument } from 'src/redux/auth/actions';
import * as Yup from 'yup';

const exampleIDCard = '/images/example_ID_card.jpg';
const exampleHoldingID = '/images/example_holding_ID.jpg';

interface FormValues {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  birthday: string;
  twitter: string;
  instagram: string;
  number: string;
  expiredDate: string;
  isConfirm: boolean;
  isExpired: boolean;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required('Vorname ist erforderlich'),
  lastName: Yup.string().required('Nachname ist erforderlich'),
  address: Yup.string().required('Adresse ist erforderlich'),
  city: Yup.string(),
  state: Yup.string(),
  country: Yup.string().required('Land ist erforderlich'),
  zipCode: Yup.string().required('Postleitzahl ist erforderlich'),
  birthday: Yup.string().required('Geburtstag ist erforderlich'),  
  twitter: Yup.string().notRequired(),
  instagram: Yup.string().notRequired(),
  number: Yup.string().notRequired(),
  expiredDate: Yup.string().notRequired(),
  isExpired: Yup.boolean(),
  isConfirm: Yup.boolean()
});

class VerificationDocumentComponent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      type: props.authUser.verificationDocument?.type || 'ID',
      uploadHolding: false,
      uploadFrontSide: false,
      uploadBackSide: false,
      frontSideUrl: this.props.authUser.verificationDocument?.frontSideUrl,
      backSideUrl: this.props.authUser.verificationDocument?.backSideUrl,
      holdingUrl: this.props.authUser.verificationDocument?.holdingUrl || '',
      countries: [],
      states: [],
      cities: []
    };
  }

  componentDidMount() {
    this.getCountry();
  }

  // eslint-disable-next-line consistent-return
  componentDidUpdate(prevProps: any) {
    const { requesting, success, error } = this.props.updateDocumentStore;
    if (prevProps.updateDocumentStore?.requesting && !requesting && success && !error) {
      return toast.success('Verifizierungsdokumente erfolgreich aktualisiert; bitte warten Sie auf die Genehmigung durch den Administrator.');
    }

    if (prevProps.updateDocumentStore?.requesting && !requesting && !success && error) {
      return toast.error(error?.data?.message || 'Verifizierungsdokumentaktualisierung fehlgeschlagen!');
    }
  }

  getCountry() {
    this.setState(
      {
        countries: Country.getAllCountries().map((i) => ({ isoCode: i.isoCode, name: i.name }))
      },
      () => {
        const { verificationDocument } = this.props.authUser;
        if (verificationDocument?.country) {
          this.getStateAndCity(verificationDocument.country);
        }
      }
    );
  }

  async getStateAndCity(country: string) {
    const countryCode = this.getCodeByCountry(country);
    // State data
    const stateData = await State.getStatesOfCountry(countryCode).map((i) => ({ isoCode: i.isoCode, name: i.name }));
    // City data
    const cityData = await City.getCitiesOfCountry(countryCode).map((i) => ({ name: i.name }));

    this.setState({ states: stateData, cities: cityData });
  }

  getCodeByCountry(country: string) {
    const { countries } = this.state;
    const selectedCountry = countries.filter((c) => c.name === country);
    return selectedCountry[0]?.isoCode;
  }

  // eslint-disable-next-line consistent-return
  updateVerificationDocument(values: any) {
    if (!values.isConfirm) {
      return toast.error('Bitte bestätigen Sie, dass Sie sexuell explizite / pornografische Inhalte veröffentlichen werden!');
    }
    if (!values.isExpired && !values.expiredDate) {
      return toast.error('Bitte geben Sie das Ablaufdatum des Dokuments ein!');
    }
    if (
      !this.state.uploadFrontSide
      || (!this.state.uploadBackSide && this.state.type === 'ID')
      || !this.state.uploadHolding
    ) {
      return toast.error('Bitte laden Sie alle Fotos des Dokuments hoch!');
    }
    if (values.zipCode) {
      // eslint-disable-next-line no-param-reassign
      values.zipCode = values.zipCode.toString();
    }
    if (values.number) {
      // eslint-disable-next-line no-param-reassign
      values.number = values.number.toString();
    }
    const data = Object.assign(
      pick(values, [
        'firstName',
        'lastName',
        'address',
        'city',
        'state',
        'country',
        'zipCode',
        'birthday',
        'twitter',
        'instagram',
        'type',
        'number',
        'expiredDate',
        'isConfirm',
        'isExpired'
      ]),
      { type: this.state.type }
    );
    this.props.updateDocument(data);
  }

  uploadPhoto(state: string, photoUrl: string, value: any) {
    this.setState({ [state]: true, [photoUrl]: value.data.url });
    return toast.success('Foto erfolgreich hochgeladen!');
  }

  render() {
    const { verificationDocument } = this.props.authUser;
    const { countries, states, cities } = this.state;
    // eslint-disable-next-line no-nested-ternary
    const certText = this.state.type === 'ID' ? 'ID' : this.state.type === 'passport' ? 'Passport' : 'Driving Lisence';
    const { publicRuntimeConfig: config } = getConfig();
    const validateMaxBirhOfDay = moment().subtract(18, 'year').endOf('day').format('YYYY-MM-DD');
    const validateMinBirhOfDay = moment().subtract(100, 'year').endOf('day').format('YYYY-MM-DD');

    return (
      <div>
        <Formik
          validationSchema={schema}
          initialValues={{
            firstName: verificationDocument?.firstName,
            lastName: verificationDocument?.lastName,
            address: verificationDocument?.address,
            country: verificationDocument?.country,
            state: verificationDocument?.state,
            city: verificationDocument?.city,
            zipCode: verificationDocument?.zipCode,
            birthday: verificationDocument?.birthday,
            twitter: verificationDocument?.twitter,
            instagram: verificationDocument?.instagram,
            number: verificationDocument?.number,
            expiredDate: verificationDocument?.expiredDate,
            isExpired: verificationDocument?.isExpired,
            isConfirm: verificationDocument?.isConfirm
          }}
          onSubmit={(values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
            this.updateVerificationDocument(values);
            formikHelpers.setSubmitting(false);
          }}
          render={(props: FormikProps<FormValues>) => (
            <form className="form-signin form-update-profile" onSubmit={props.handleSubmit}>
              <div className="card-body">
                <Row>
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Vorname
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        isInvalid={props.touched.firstName && !!props.errors.firstName}
                        name="firstName"
                        className="form-control form-control-md"
                        type="text"
                        placeholder="Geben Sie Ihren Vornamen ein"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.firstName}
                      />
                      <div className="invalid-feedback">{props.errors.firstName}</div>
                    </Form.Group>
                  </Col>
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Nachname
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        isInvalid={props.touched.lastName && !!props.errors.lastName}
                        name="lastName"
                        className="form-control form-control-md"
                        type="text"
                        placeholder="Bitte geben Sie Ihren Nachnamen ein."
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.lastName}
                      />
                      <div className="invalid-feedback">{props.errors.lastName}</div>
                    </Form.Group>
                  </Col>
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Geburtsdatum
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        isInvalid={props.touched.birthday && !!props.errors.birthday}
                        name="birthday"
                        className="form-control form-control-md"
                        type="date"
                        min={validateMinBirhOfDay}
                        max={validateMaxBirhOfDay}
                        placeholder="Geben Sie Ihr Geburtsdatum ein."
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.birthday}
                      />
                      <div className="invalid-feedback">{props.errors.birthday}</div>
                    </Form.Group>
                  </Col>
                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Adresse
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        isInvalid={props.touched.address && !!props.errors.address}
                        name="address"
                        className="form-control form-control-md"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.address}
                      />
                      <div className="invalid-feedback">{props.errors.address}</div>
                    </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                    <Form.Group>
                      <Form.Label>
                       Land
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        isInvalid={props.touched.country && !!props.errors.country}
                        name="country"
                        as="select"
                        className="form-control form-control-md"
                        type="text"
                        onChange={(e) => {
                          this.getStateAndCity(e.target.value);
                          props.handleChange(e);
                        }}
                        onBlur={props.handleBlur}
                        value={props.values.country}
                      >
                        <option value="">Mein Land</option>
                        {countries.length
                        && countries.map((i) => (
                          <option value={i.name} key={i.isoCode}>
                            {i.name}
                          </option>
                        ))}
                      </FormControl>
                      <div className="invalid-feedback">{props.errors.country}</div>
                    </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                    <Form.Group>
                      <Form.Label>Staat</Form.Label>
                      <FormControl
                        isInvalid={props.touched.state && !!props.errors.state}
                        as="select"
                        name="state"
                        className="form-control form-control-md"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.state}
                      >
                        <option value="">Mein Staat</option>
                        {states.length
                        && states.map((i, index) => (
                          <option value={i.name} key={`${i.name}_${index}` as any}>
                            {i.name}
                          </option>
                        ))}
                      </FormControl>
                      <div className="invalid-feedback">{props.errors.state}</div>
                    </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Stadt
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        as="select"
                        isInvalid={props.touched.city && !!props.errors.city}
                        name="city"
                        className="form-control form-control-md"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.city}
                      >
                        <option value="">Mein Stadt</option>
                        {cities.length
                        && cities.map((i, index) => (
                          <option value={i.name} key={`${i.name}_${index}` as any}>
                            {i.name}
                          </option>
                        ))}
                      </FormControl>
                      <div className="invalid-feedback">{props.errors.city}</div>
                    </Form.Group>
                  </Col>
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Postleitzahl
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <FormControl
                        isInvalid={props.touched.zipCode && !!props.errors.zipCode}
                        name="zipCode"
                        className="form-control form-control-md"
                        min="0"
                        type="number"
                        placeholder="Geben Sie Ihre Postleitzahl ein."
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.zipCode}
                      />
                      <div className="invalid-feedback">{props.errors.zipCode}</div>
                    </Form.Group>
                  </Col>
                  {/* <Col md={12} xs={12}>
                  <Form.Group>
                    <Form.Label>Twitter</Form.Label>
                    <FormControl
                      name="twitter"
                      className="form-control form-control-md"
                      type="text"
                      placeholder="Type your twitter"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.twitter}
                    />
                  </Form.Group>
                </Col> */}
                  {/* <Col md={12} xs={12}>
                  <Form.Group>
                    <Form.Label>Instagram</Form.Label>
                    <FormControl
                      name="instagram"
                      className="form-control form-control-md"
                      type="text"
                      placeholder="Type your instagram"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.instagram}
                    />
                  </Form.Group>
                </Col> */}
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>Dokumenttyp</Form.Label>
                      <FormControl
                        as="select"
                        value={this.state.type}
                        onChange={(e: any) => this.setState({ type: e.target.value })}
                      >
                        <option value="ID">Identifikation</option>
                        <option value="passport">Reisepass</option>
                        <option value="driverCard">Führerschein</option>
                      </FormControl>
                    </Form.Group>
                  </Col>
                  {/* <Col md={6} xs={12} /> */}
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>
                        {certText}
                        {' '}
                        Nummer
                        <span className="text-required required-red"> *</span>
                      </Form.Label>
                      <FormControl
                        name="number"
                        className="form-control form-control-md"
                        type="number"
                        min="0"
                        placeholder={`Geben Sie Ihre ${certText}-Nummer ein.`}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.number}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Label>
                        {certText}
                        {' '}
                        Ablaufdatum
                        <span className="text-required required-red"> *</span>
                      </Form.Label>
                      <FormControl
                        name="expiredDate"
                        className="form-control form-control-md"
                        type="date"
                        placeholder={`Bitte geben Sie ein ${
                        // eslint-disable-next-line no-nested-ternary
                          this.state.type === 'driverCard'
                            ? 'Führerschein'
                            : this.state.type === 'passport'
                              ? 'Reisepass'
                              : 'Identifikation'
                        } Ablaufdatum hier eingeben`}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.expiredDate}
                        disabled={props.values.isExpired}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} xs={12} />
                  <Col md={6} xs={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        name="isExpired"
                        id="isExpired"
                        label="No expiration date"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        checked={props.values.isExpired}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Foto von
                        {' '}
                        {certText !== 'ID' ? `Ihr ${certText}` : `Die Vorderseite Ihres ${certText}`}
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <br />
                      {this.state.frontSideUrl ? (
                        <Image
                          src={this.state.frontSideUrl}
                          style={{ borderRadius: 10 }}
                          fluid
                          width={250}
                          height={150}
                        />
                      ) : (
                        <Image src={exampleIDCard} style={{ borderRadius: 10 }} fluid width={250} height={150} />
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Upload
                        isChecked={true}
                        url={`${config.API_ENDPOINT}/users/certification/photo?position=frontSide`}
                        onComplete={(e: any) => this.uploadPhoto('uploadFrontSide', 'frontSideUrl', e)}
                        config={{
                          multiple: false,
                          accept: 'image/*'
                        }}
                      />
                    </Form.Group>
                  </Col>
                  {this.state.type === 'ID' && (
                  <>
                    <Col md={12} xs={12}>
                      <Form.Group>
                        <Form.Label>
                        Foto von der Rückseite Ihres
                          {' '}
                          {certText}
                          {' '}
                          <span className="text-required required-red">*</span>
                        </Form.Label>
                        <br />
                        {this.state.backSideUrl ? (
                          <Image src={this.state.backSideUrl} style={{ borderRadius: 10 }} width={250} height={160} />
                        ) : (
                          <Image src={exampleIDCard} style={{ borderRadius: 10 }} width={250} height={160} />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12} xs={12}>
                      <Form.Group>
                        <Upload
                        isChecked={true}
                          url={`${config.API_ENDPOINT}/users/certification/photo?position=backSide`}
                          onComplete={(e: any) => this.uploadPhoto('uploadBackSide', 'backSideUrl', e)}
                          config={{
                            multiple: false,
                            accept: 'image/*'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </>
                  )}
                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Form.Label>
                      Foto, auf dem Sie Ihr
                        {' '}
                        {certText}
                        {' '}
                        <span className="text-required required-red">*</span>
                      </Form.Label>
                      <br />
                      {this.state.holdingUrl ? (
                        <Image src={this.state.holdingUrl} style={{ borderRadius: 10 }} width={250} height={160} />
                      ) : (
                        <Image src={exampleHoldingID} style={{ borderRadius: 10 }} width={250} height={160} />
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Upload
                      isChecked={true}
                        url={`${config.API_ENDPOINT}/users/certification/photo?position=holding`}
                        onComplete={(e: any) => this.uploadPhoto('uploadHolding', 'holdingUrl', e)}
                        config={{
                          multiple: false,
                          accept: 'image/*'
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        name="isConfirm"
                        id="isConfirm"
                        label="Ich werde sexuell explizite / pornografische Inhalte veröffentlichen"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        checked={props.values.isConfirm}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <Button variant="primary" type="submit">
              Aktualisieren Sie das Verifizierungsdokument.
              </Button>
            </form>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authUser: state.auth.authUser,
  updateDocumentStore: state.auth.updateDocumentStore
});

const mapDispatch = { updateDocument };

export default connect(mapStateToProps, mapDispatch)(VerificationDocumentComponent);
