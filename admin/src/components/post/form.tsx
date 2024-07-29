import * as React from 'react';
import {
  Col, Row, Button, FormGroup, Label, Input, FormFeedback
} from 'reactstrap';
import { Formik, FormikProps } from 'formik';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import * as Yup from 'yup';

const SunEditor = dynamic(() => import('src/components/base/custom-sun-editor'), {
  ssr: false
});

interface FormValue {
  title: string;
  alias: string;
  content: string;
}

interface IProps {
  submit: Function;
  data?: {
    title?: string;
    alias?: string;
    content?: string;
    type?: string;
  };
}

const PostForm: React.FunctionComponent<IProps> = ({
  submit,
  data = null
}) => {
  const textValue = React.useRef(data?.content || '');
  const initialValues = data
    || ({
      title: '',
      alias: '',
      content: '',
      type: 'post'
    } as any);

  const schema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('The title is required'),
    alias: Yup.string(),
    content: Yup.string()
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={schema}
      onSubmit={(values: FormValue) => {
        if (!textValue.current?.length) {
          return toast.error('Bitte geben Sie Inhalte ein');
        }
        return submit({
          ...values,
          content: textValue.current
        });
      }}
      initialValues={initialValues}
    >
      {(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Titel</Label>
                <Input
                  invalid={props.touched.title && !!props.errors.title}
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Bitte geben Sie den Titel ein"
                  onChange={props.handleChange}
                  value={props.values.title}
                />
                <FormFeedback>{props.errors.title}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Alias</Label>
                <Input
                  invalid={props.touched.alias && !!props.errors.alias}
                  type="text"
                  name="alias"
                  id="alias"
                  placeholder="Bitte geben Sie den Alias ​​ein"
                  onChange={props.handleChange}
                  value={props.values.alias}
                />
                <FormFeedback>{props.errors.alias}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Inhalt</Label>
                <SunEditor
                  onChange={(text) => {
                    textValue.current = text;
                  }}
                  content={props.values.content || ''}
                />
              </FormGroup>
            </Col>
          </Row>

          <Button type="submit" color="primary" outline className="float-right">
          Einreichen
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default PostForm;
