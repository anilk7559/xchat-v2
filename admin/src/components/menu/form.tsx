import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  FormFeedback
} from 'reactstrap';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { postService } from '@services/post.service';

interface FormValue {
  title: string;
  path: string;
  post: string;
  url: string;
  ordering: string;
  internal: boolean;
  openNewTab: boolean;
}

interface IProps {
  submit: Function;
  data?: {
    title?: string;
    path?: string;
    post?: string;
    url?: string;
    ordering?: string;
    internal?: boolean;
    openNewTab: boolean;
  };
}

function MenuForm({
  data = null,
  submit
}: IProps) {
  const [showSelectPost, setShowSelectPost] = useState(false);
  const [internal, setInternal] = useState(data?.internal || false);
  const [posts, setPosts] = useState([]);

  const initialValues = data
  || ({
    title: '',
    path: '',
    section: 'footer',
    openNewTab: data?.openNewTab || false,
    internal,
    ordering: data?.ordering
  } as any);
  const schema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Zu kurz!')
      .max(50, 'Zu lang!')
      .required('Der Titel ist erforderlich'),
    path: Yup.string()
  });

  const getPosts = async () => {
    const res = await postService.find();
    setPosts(res.data.items);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values: FormValue) => {
        submit(values);
      }}
      initialValues={initialValues}
    >
      {(props: FormikProps<FormValue>) => (
        <form onSubmit={props.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Link zum Beitrag?</label>
            <div className="col-sm-10">
              <div
                className="custom-control custom-switch"
                onClick={() => {
                  const val = !props.values.internal;
                  props.setFieldValue('internal', val);
                  setShowSelectPost(!showSelectPost);
                  setInternal(val);
                }}
              >
                <Input
                  type="checkbox"
                  name="internal"
                  className="custom-control-input"
                  checked={props.values.internal}
                />
                <label
                  className="custom-control-label"
                />
              </div>
            </div>
          </div>

          {internal
          && (
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Select post</label>
            <div className="col-sm-10">
              <select
                className="form-control"
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  const post = posts.find((p) => p._id === id);
                  props.setFieldValue('path', `/posts/${post.alias}`);
                  if (!props.values.title) {
                    props.setFieldValue('title', post.title);
                  }
                }}
              >
                <option value="">----</option>
                {posts.map((post) => (
                  <option key={post._id} value={post._id}>
                    {post.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          )}

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Titel</label>
            <div className="col-sm-10">
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

              <small className="help help-block">Titel des Menüpunkts</small>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Weg</label>
            <div className="col-sm-10">
              <Input
                invalid={props.touched.path && !!props.errors.path}
                type="text"
                name="path"
                id="path"
                placeholder="Bitte geben Sie den Pfad ein"
                onChange={props.handleChange}
                value={props.values.path}
              />
              <FormFeedback>{props.errors.path}</FormFeedback>
              <small className="help help-block">Pfad oder Link zur Seite. Bei Verwendung einer externen URL muss das vollständige Protokoll vorhanden sein (z. B. https://example.com/path)</small>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Bestellung</label>
            <div className="col-sm-10">
              <Input
                invalid={props.touched.ordering && !!props.errors.ordering}
                type="number"
                name="ordering"
                placeholder="Bitte positionieren Sie die Reihenfolge der Menüpunkte"
                onChange={props.handleChange}
                value={props.values.ordering}
              />
              <FormFeedback>{props.errors.ordering}</FormFeedback>
              <small className="help help-block">Geben Sie die Nummer ein, um das Menü in FE anzuzeigen. Aufsteigend sortieren</small>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Open in a new tab?</label>
            <div className="col-sm-10">
              <div
                className="custom-control custom-switch"
                onClick={() => props.setFieldValue('openNewTab', !props.values.openNewTab)}
              >
                <input
                  type="checkbox"
                  name="openNewTab"
                  className="custom-control-input"
                  checked={props.values.openNewTab}
                />
                <label
                  className="custom-control-label"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            outline
            className="float-right"
          >
            Einreichen
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default MenuForm;
