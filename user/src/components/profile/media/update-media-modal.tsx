import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
  Button, Form, FormControl, Modal
} from 'react-bootstrap';
import * as Yup from 'yup';

interface IProps {
  isModalShow: boolean;
  setModalShow: Function;
  item: any;
  handleUpdate: Function;
}

interface FormValues {
  name: string;
  description: string;
  price: number;
  free: boolean;
}

const schema = Yup.object().shape({
  name: Yup.string().min(2, 'Der Name ist zu kurz!').max(50, 'Der Name ist zu lang!').required('Name ist erforderlich'),
  price: Yup.number().min(0).required('Preis ist erforderlich.'),
  description: Yup.string().required('Beschreibung ist erforderlich.'),
  free: Yup.boolean().required()
});

function UpdateMediaModal({
  isModalShow, setModalShow, item, handleUpdate
}: IProps) {
  const onCheck = (e: any, props: FormikProps<FormValues>) => {
    props.setFieldValue('free', e.currentTarget.checked);
    props.setFieldValue('price', e.currentTarget.checked ? 0 : item.price);
  };

  return (
    <Modal
      dialogClassName="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom"
      aria-labelledby="contained-modal-title-vcenter"
      className="modal modal-lg-fullscreen fade modal-uploader"
      size="lg"
      show={isModalShow}
      onHide={() => setModalShow(false)}
    >
      <Modal.Header>
        <h5 className="modal-title">Medien aktualisieren</h5>
        <Button className="fa fa-xmark" type="button" aria-label="Close" onClick={() => setModalShow(false)} />
      </Modal.Header>

      <Formik
        validationSchema={schema}
        onSubmit={(values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
          setTimeout(() => {
            handleUpdate({ id: item._id, data: values });
            formikHelpers.setSubmitting(false);
            setModalShow(false);
          }, 500);
        }}
        initialValues={{
          name: item?.name || '',
          description: item?.description || '',
          price: item?.price || 0,
          free: item?.free || false
        }}
        render={(props: FormikProps<FormValues>) => (
          <form onSubmit={props.handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <FormControl
                      className="form-control form-control-md"
                      isInvalid={props.touched.name && !!props.errors.name}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Bitte geben Sie den Namen ein."
                      onChange={props.handleChange}
                      value={props.values.name}
                    />
                    <div className="invalid-feedback">{props.errors.name}</div>
                  </Form.Group>
                </div>
                <div className="col-12">
                  <Form.Group>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        name="free"
                        className="custom-control-input"
                        id="free"
                        onClick={(e) => onCheck(e, props)}
                        defaultChecked={props.values.free}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="free"
                      >
                        <span>
                          {props.values.free ? 'Free' : 'Paid'}
                        </span>
                      </label>
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Group>
                    <Form.Label>Token</Form.Label>
                    <FormControl
                      disabled={props.values.free}
                      className="form-control form-control-md"
                      isInvalid={props.touched.price && !!props.errors.price}
                      type="number"
                      name="price"
                      id="price"
                      min={1}
                      step={1}
                      placeholder={props.values.free ? '0' : 'Bitte geben Sie die Anzahl der Token ein.'}
                      onChange={props.handleChange}
                      value={props.values.price}
                    />
                    <div className="invalid-feedback">{props.errors.price}</div>
                  </Form.Group>
                </div>
                <div className="col-12">
                  <Form.Group>
                    <Form.Label>Beschreibung</Form.Label>
                    <FormControl
                      className="form-control"
                      isInvalid={props.touched.description && !!props.errors.description}
                      type="text"
                      as="textarea"
                      rows={3}
                      name="description"
                      id="description"
                      placeholder="Beschreibung"
                      onChange={props.handleChange}
                      value={props.values.description}
                    />
                    <div className="invalid-feedback">{props.errors.description}</div>
                  </Form.Group>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="link" className="text-muted" onClick={() => setModalShow(false)}>
              Schließen
              </Button>
              <Button type="submit" variant="primary">
              Aktualisieren
              </Button>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
}

export default UpdateMediaModal;
