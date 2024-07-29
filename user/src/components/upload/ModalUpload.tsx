import { Modal } from 'react-bootstrap';

import Upload from './Upload';

interface IConfig {
  multiple?: boolean;
  accept?: string;
}

interface IProps {
  modalShow: boolean;
  closeModal: (state: boolean) => void;
  url: string;
  config: IConfig;
  onCompleteFile?: Function;
  onCompleteAll?: Function;
  customFields?: any;
}

function ModalUpload({
  modalShow,
  closeModal,
  url,
  config,
  onCompleteFile = () => {},
  onCompleteAll = () => {},
  customFields = null
}: IProps) {
  const onCompleteSingleFile = (data: any) => {
    onCompleteFile && onCompleteFile(data);
  };

  const onCompleteAllFile = (data: any) => {
    onCompleteAll && onCompleteAll(data);
  };

  return (
    <Modal
      dialogClassName="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom"
      aria-labelledby="contained-modal-title-vcenter"
      className="modal modal-lg-fullscreen fade modal-uploader"
      show={modalShow}
      onHide={() => closeModal(false)}
    >
      <Modal.Body>
        <Upload
          url={url}
          isChecked={true}
          onComplete={onCompleteSingleFile}
          onCompletedAll={onCompleteAllFile}
          config={{
            multiple: config.multiple,
            accept: config.accept
          }}
          customFields={customFields}
        />
      </Modal.Body>
    </Modal>
  );
}

export default ModalUpload;
