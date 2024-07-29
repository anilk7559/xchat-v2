import * as React from 'react';
import { connect } from 'react-redux';
import {
  Form, FormControl, Button, Alert
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { uploadPhoto } from '../../src/redux/media/actions';

interface FormValues {
  photo: any;
  name: string;
  description: string;
}

const schema = Yup.object().shape({
  photo: Yup.mixed().required('Datei fehlt'),
  name: Yup.string()
    .min(2, 'Zu kurz!')
    .max(50, 'Zu lang!')
    .required('Name ist erforderlich'),
  description: Yup.string()
    .required('Beschreibung ist erforderlich')
});

class UploadPhoto extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSuccess: false
    };
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.uploadPhotoSuccess && nextProps.data.data) {
      this.setState({ isSuccess: true });
      toast.success('Foto hochgeladen');
      return Router.push('/media/photos');
    }
  }

  render() {
    const error = (!this.state.isSuccess && this.props.error)
      ? (<Alert variant="danger">Ungültiges Formular. Bitte überprüfe es nocheinmal!</Alert>)
      : null;
    return (
      <div>
        {error}
        <Formik
          validationSchema={schema}
          onSubmit={(values: FormValues, formikActions: FormikHelpers<FormValues>) => {
            setTimeout(() => {
              const formData = new FormData();
              const reader = new FileReader();
              reader.onload = (e: any) => formData.append('base64', e.target.result);
              formData.append('file', values.photo);
              formData.append('name', values.name);
              formData.append('description', values.description);
              // formData.append('categoryIds', this.state.categoryIds)
              this.props.uploadPhoto(formData);
              formikActions.setSubmitting(false);
              formikActions.resetForm();
            }, 500);
          }}
          initialValues={{ name: '', photo: undefined, description: '' }}
          render={(props: FormikProps<FormValues>) => (
            <form onSubmit={props.handleSubmit}>
              <Form.Group>
                <Form.Label>Foto</Form.Label>
                <FormControl
                  isInvalid={props.touched.photo && !!props.errors.photo}
                  type="file"
                  name="photo"
                  id="photo"
                  onChange={(event: any) => {
                    props.setFieldValue('Foto', event.currentTarget.files[0]);
                  }}
                />
                <div className="invalid-feedback">{props.errors.photo as any}</div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <FormControl isInvalid={props.touched.name && !!props.errors.name} type="text" name="name" id="name" placeholder="Please enter the name" onChange={props.handleChange} value={props.values.name} />
                <div className="invalid-feedback">{props.errors.name}</div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Beschreibung</Form.Label>
                <FormControl isInvalid={props.touched.description && !!props.errors.description} type="text" name="description" id="description" placeholder="Please enter your address" onChange={props.handleChange} value={props.values.description} />
                <div className="invalid-feedback">{props.errors.description}</div>
              </Form.Group>
              <Button type="submit" variant="outline-primary">Aktualisieren </Button>
            </form>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state.media });

const mapDispatch = { uploadPhoto };

export default connect(
  mapStateToProps,
  mapDispatch
)(UploadPhoto);
