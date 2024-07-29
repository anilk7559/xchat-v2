import * as React from 'react';
import {
  Modal, Form, FormControl, Button
} from 'react-bootstrap';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { connect } from 'react-redux';
import { payoutService } from 'src/services';
import { toast } from 'react-toastify';
import { setStatusRequest } from '../../redux/payouts/actions';

interface IProps {
  data?: any;
  handleSetStatusRequest: Function;
  modalShow?: boolean;
  setModal?: Function;
  action: string;
}

const ModalUpdatePayout: React.FunctionComponent<IProps> = ({
  data = null,
  handleSetStatusRequest = () => {},
  modalShow = false,
  setModal = () => {},
  action
}) => {
  const handleUpdate = async (values: any) => {
    try {
      if (!window.confirm(`Confirm ${action} this payout request?`)) {
        return false;
      }

      const resp = await payoutService.updateStatus(action, data._id, values);
      if (resp && resp.data && resp.data.success) {
        setModal && setModal(false);
        handleSetStatusRequest({ status: resp.data.action });
        return toast.success('Update erfolgreich!');
      }
      return false;
    } catch (e) {
      const errorData = await e;
      return toast.error(errorData?.data?.msg || errorData.message);
    }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={modalShow && modalShow}
      onHide={() => setModal && setModal(false)}
    >
      <Modal.Body>
        <h4 style={{ textTransform: 'capitalize' }}>{action}</h4>
        <Formik
          onSubmit={(values: any, formikActions: FormikHelpers<any>) => {
            setTimeout(() => {
              handleUpdate(values);
              formikActions.setSubmitting(false);
              formikActions.resetForm();
            }, 500);
          }}
          initialValues={{
            note: ''
          }}
        >
          {(props: FormikProps<any>) => (
            <form onSubmit={props.handleSubmit}>
              <Form.Group>
                <Form.Label>Notiz</Form.Label>
                <FormControl
                  className="input-type"
                  type="text"
                  name="note"
                  id="note"
                  placeholder="Bitte geben Sie die Notiz ein"
                  onChange={props.handleChange}
                  value={props.values.note}
                />
              </Form.Group>
              <Button type="submit" variant="outline-danger">
              Schicken
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
const mapDispatch = {
  handleSetStatusRequest: setStatusRequest
};

export default connect(
  null,
  mapDispatch
)(ModalUpdatePayout);
