/* eslint-disable consistent-return */
import React from 'react';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import Dropzone from './Dropzone';
import Progress from './Progress';
import { authService } from '../../services/auth.service';

interface IUploadConfig {
  multiple?: boolean;
  accept?: string;
}
interface UploadProps {
  url: string;
  onComplete?: Function;
  onCompletedAll?: Function;
  onFilesAdded?: Function;
  config?: IUploadConfig;
  title?: string;
  hideActions?: boolean;
  customFields?: any; // add custom field in form data
  previewImage?: string;
}

let zoneRef: any;
const Upload: React.FunctionComponent<UploadProps> = ({
  url,
  onComplete = () => {},
  onCompletedAll = () => {},
  onFilesAdded = () => {},
  config = null,
  title = null,
  hideActions = false,
  customFields = {},
  previewImage = null
}) => {
  const [files, setFiles] = React.useState([]);
  const [upFiles, setupFiles] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({});
  const [successfullUploaded, setSuccessfullUploaded] = React.useState(false);
  const onChange = (data: any) => {
    setupFiles(true);
    const notMulti = config && !config.multiple;
    setFiles(notMulti ? data : files.concat(data));
    onFilesAdded && onFilesAdded(files);
  };

  const uploadFiles = async () => {
    setUploadProgress({});
    setUploading(true);
    const promises = [] as any;
    files.forEach((file: any) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      promises.push(sendRequest(file));
    });
    try {
      const res = await Promise.all(promises);
      onCompletedAll && onCompletedAll(res);
      setSuccessfullUploaded(true);
      setUploading(false);
    } catch (e) {
      toast.error('Hochladen fehlgeschlagen!, bitte überprüfen');
      // Not Production ready! Do some error handling here instead...
      setSuccessfullUploaded(true);
      setUploading(false);
    }
  };

  const sendRequest = (file: any) => new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const copy = { ...uploadProgress };
        copy[file.name] = {
          state: 'pending',
          percentage: (event.loaded / event.total) * 100
        };
        setUploadProgress(copy);
      }
    });

    req.addEventListener('load', () => {
      const success = req.status >= 200 && req.status < 300;
      if (!success) {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: 'error', percentage: 0 };
        setUploadProgress(copy);
        return reject(req.response);
      }

      const copy = { ...uploadProgress };
      copy[file.name] = { state: 'done', percentage: 100 };
      setUploadProgress(copy);
      const res = req.response;
      onComplete && onComplete(res);
      resolve(res);
    });

    req.upload.addEventListener('error', () => {
      const copy = { ...uploadProgress };
      copy[file.name] = { state: 'error', percentage: 0 };
      setUploadProgress(copy);
      reject(req.response);
    });
    const formData = new FormData();
    formData.append('file', file, file.name);

    // check if have custom fields
    if (customFields) {
      Object.keys(customFields).forEach((key) => formData.append(key, customFields[key]));
    }

    req.responseType = 'json';
    req.open('POST', url);

    const accessToken = authService.getToken() || '';
    if (accessToken) {
      req.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }
    req.send(formData);
  });

  const clear = () => {
    setupFiles(false);
    setFiles([]);
    setSuccessfullUploaded(false);
  };

  const renderProgress = (file: any) => {
    const newUploadProgress = uploadProgress[file.name];
    if (uploading || successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={newUploadProgress ? newUploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="/images/baseline-check_circle_outline-24px.svg"
            style={{
              opacity: newUploadProgress && newUploadProgress.state === 'done' ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  };
  const renderActions = () => {
    if (successfullUploaded) {
      return <Button onClick={clear.bind(this)}>Clear</Button>;
    }
    return (
      <Button type="button" className="btn btn-primary" disabled={!files.length || uploading} onClick={uploadFiles}>
        Hochladen
      </Button>
    );
  };

  const removeItem = (evt: any, index: any) => {
    evt.preventDefault();
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if (!newFiles.length) {
      zoneRef.resetFileInput();
    }
    setupFiles(false);
  };

  const setRef = (ref) => {
    zoneRef = ref;
  };

  return (
    <div className="Upload">
      {title && <span className="Title">Daten hochladen </span>}
      <div className="Content">
        <div className={upFiles && 'None'}>
          <Dropzone
            onFilesAdded={onChange.bind(this)}
            disabled={uploading || successfullUploaded}
            config={config}
            ref={(ref) => setRef(ref)}
            previewImage={previewImage}
          />
        </div>
        <div className="Files">
          {files && files.length > 0 && files.map((file: any, index: number) => {
            const img = URL.createObjectURL(file);
            return (
              <div key={file.name} className="Row">
                {file.type.indexOf('image') > -1 && (
                <>
                  <a href="#" onClick={(evt) => removeItem(evt, index)} className="trash">
                    <i className="fa fa-trash" />
                  </a>
                  <span className="thumb">
                    <img src={img} alt="img" />
                  </span>
                  <span className="Filename">{file.name}</span>
                </>
                )}
                {renderProgress(file)}

              </div>
            );
          })}
        </div>
      </div>
      {!hideActions && <div className="Actions">{renderActions()}</div>}
    </div>
  );
};
export default Upload;
