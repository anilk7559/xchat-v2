import { Row, Col } from 'react-bootstrap';

interface IProps {
  photos: any;
  openModalUpload: Function;
}

function ProfilePhoto({ photos, openModalUpload }: IProps) {
  const noPhoto = !photos || !photos.length ? (
    <Col xs={12}>
      <h3>No photo uploaded</h3>
    </Col>
  ) : null;

  const openModal = (state: any, item: any, index: any) => {
    openModalUpload(state, item, index);
  };

  return (
    <Row className="row-profile-photo">
      <Col xs={12}>
        <h4>Profile Photo</h4>
      </Col>
      {noPhoto}
      {photos?.map((photo: any, index: number) => (
        <Col xs={2} key={photo._id} className="item-img">
          <div className="box-img">
            <div className="box-edit" onClick={() => openModal(true, photo, index)}>
              <i className="fa fa-edit" />
            </div>
            <img src={photo.thumbUrl} alt="" width="100%" height="100%" />
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default ProfilePhoto;
