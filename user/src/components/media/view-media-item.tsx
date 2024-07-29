import { authService } from '@services/auth.service';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

interface IProps {
  mediaItem: any;
  isOpenMedia: boolean;
  closeMedia: Function;
  titleModal?: string;
}
function ViewMediaItem({
  mediaItem, isOpenMedia, closeMedia, titleModal = ''
}:IProps) {
  const [mediaUrl, setMediaUrl] = useState(mediaItem?.fileUrl || '');
  const authUser = useSelector((state: any) => state.auth.authUser);

  useEffect(() => {
    if (mediaItem.fileUrl) {
      const url = new URL(mediaItem.fileUrl);
      if (authUser && mediaItem.fileUrl.indexOf('userId=') === -1) url.searchParams.append('userId', authUser._id);
      if (mediaItem.fileUrl.indexOf('mediaId=') === -1) url.searchParams.append('mediaId', mediaItem._id);
      if (mediaItem.fileUrl.indexOf('access_token=') === -1) url.searchParams.append('access_token', authService.getToken());
      setMediaUrl(url.href);
    }
  }, [mediaItem]);
  return (
    <Modal
      dialogClassName="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom mw-80"
      aria-labelledby="contained-modal-title-vcenter"
      className="modal modal-lg-fullscreen fade modal-uploader model-content-image"
      show={isOpenMedia}
      onHide={() => closeMedia()}
    >
      <Modal.Header>
        <Modal.Title className="text-align-start media-name" data-toggle="tooltip" title={titleModal || 'View media'}>{titleModal || 'View media'}</Modal.Title>
        <Button className="fa fa-xmark" type="button" aria-label="Close" onClick={() => closeMedia()} />
      </Modal.Header>
      <Modal.Body className="flex my-0 mx-auto">
        <div className="content-view-detail">
          {mediaItem.type === 'photo' ? (
            <img alt="" src={mediaUrl} className="w-100 h-auto" />
          ) : (
            <video controls autoPlay src={mediaUrl} className="w-100 h-100" />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ViewMediaItem;
