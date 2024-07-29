import * as React from 'react';
import {
  Col, Row, Button, FormGroup, Label, Input, FormFeedback
} from 'reactstrap';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

interface FormValue {
  name: string;
  description: string;
  price: number;
  token: number;
  ordering: number;
}

interface IProps {
  submit: Function;
  data?: {
    name?: string;
    description?: string;
    price?: number;
    token?: number;
    ordering?: number;
  };
}

const PackageForm: React.FunctionComponent<IProps> = ({ submit, data = {} }) => {
  const initialValues = data
    || ({
      name: '',
      description: '',
      price: 0,
      token: 0,
      ordering: 0
    } as any);

  const schema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('The name is required'),
    description: Yup.string(),
    price: Yup.number().min(1, 'Enter a price greater than or equal to 1').required('Price is required'),
    token: Yup.number().min(1, 'Enter a price greater than or equal to 1').required('Token is required'),
    ordering: Yup.number()
  });

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values: FormValue) => {
        submit(values);
      }}
      initialValues={initialValues}
      render={(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  invalid={props.touched.name && !!props.errors.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Bitte geben Sie den Namen ein"
                  onChange={props.handleChange}
                  value={props.values.name}
                />
                <FormFeedback>{props.errors.name}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Preis</Label>
                <Input
                  invalid={props.touched.price && !!props.errors.price}
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Bitte geben Sie den Preis ein"
                  onChange={props.handleChange}
                  value={props.values.price}
                />
                <FormFeedback>{props.errors.price}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Zeichen</Label>
                <Input
                  invalid={props.touched.token && !!props.errors.token}
                  type="number"
                  name="token"
                  id="token"
                  placeholder="Bitte geben Sie den Token ein"
                  onChange={props.handleChange}
                  value={props.values.token}
                />
                <FormFeedback>{props.errors.token}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Bestellung</Label>
                <Input
                  invalid={props.touched.ordering && !!props.errors.ordering}
                  type="number"
                  name="ordering"
                  id="ordering"
                  placeholder="Bitte geben Sie die Bestellnummer ein"
                  onChange={props.handleChange}
                  value={props.values.ordering}
                />
                <FormFeedback>{props.errors.ordering}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Beschreibung</Label>
                <Input
                  invalid={props.touched.description && !!props.errors.description}
                  type="textarea"
                  rows={5}
                  name="description"
                  id="description"
                  placeholder="Bitte geben Sie die Beschreibung ein"
                  onChange={props.handleChange}
                  value={props.values.description}
                />
                <FormFeedback>{props.errors.description}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>

          <Button type="submit" color="primary" outline className="float-right">
          Einreichen
          </Button>
        </form>
      )}
    />
  );
};

export default PackageForm;
