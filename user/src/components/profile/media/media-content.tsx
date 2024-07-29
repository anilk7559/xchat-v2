import Loading from '@components/common-layout/loading/loading';
import { sellItemService } from '@services/sell-item.service';
import { useEffect, useState } from 'react';
import {
  Button,
  Col, Row, Tab, Tabs
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import MainPaginate from 'src/components/paginate/main-paginate';
import UpdateMediaModal from 'src/components/profile/media/update-media-modal';

interface IProps {
  openMedia: Function;
}

function MediaContent({
  openMedia
}: IProps) {
  const [type, setType] = useState('');
  const [itemsPhoto, setItemsPhoto] = useState([] as any);
  const [totalPhoto, setTotalPhoto] = useState(0);
  const [pagePhoto, setPagePhoto] = useState(1);
  const [itemsVideo, setItemsVideo] = useState([] as any);
  const [totalVideo, setTotalVideo] = useState(0);
  const [pageVideo, setPageVideo] = useState(1);
  const [isUpdateShow, setIsUpdateShow] = useState(false);
  const [itemUpdate, setItemUpdate] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const take = 9;
  const [photoFolders, setPhotoFolders] = useState([])
  const [videoFolders, setVideoFolders] = useState([])
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [pendingPhotoFolders, setPendingPhotoFolders] = useState([])
  const [pendingVideoItems, setPendingVideoItems] = useState([]);
  const [pendingVideoFolders, setPendingVideoFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);


  const getSellItemPhoto = async () => {
    try {
      setLoading(true);
      const resp = await sellItemService.getMySellItem({ page: pagePhoto, mediaType: 'photo', take });
      setPhotoFolders(resp?.data?.folders)
      setItemsPhoto(resp.data.folders[0]?.sellItems);
      setTotalPhoto(resp.data?.folders?.length);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden meines Verkaufsartikelfotos ist fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };
  const getPendingItemPhoto = async () => {
    try {
      setLoading(true);
      const resp = await sellItemService.getMyPendingItem({ page: pagePhoto, mediaType: 'photo', take });
      setPendingPhotoFolders(resp?.data?.folders)
      setPendingPhotos(resp.data.folders[0]?.sellItems);
      setTotalPhoto(resp.data?.folders?.length);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden meines Verkaufsartikelfotos ist fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };
  const getPendingItemVideo = async () => {
    try {
      setLoading(true);
      const resp = await sellItemService.getMyPendingVideoItem({ page: pagePhoto, mediaType: 'video', take });
      setPendingVideoFolders(resp?.data?.folders)
      setPendingVideoItems(resp.data.folders[0]?.sellItems);
      setTotalVideo(resp.data?.folders?.length);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden meines Verkaufsartikelfotos ist fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const getSellItemVideo = async () => {
    try {
      setLoading(true);
      const resp = await sellItemService.getMySellItem({ page: pageVideo, mediaType: 'video', take });
      setItemsVideo(resp.data.folders[0]?.sellItems);
      setVideoFolders(resp?.data?.folders)
      setTotalVideo(resp.data?.folders?.length);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden meines Verkaufsartikelvideos ist fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  const handelUpdate = async (data: any) => {
    if (type === 'photo') {
      try {
        await sellItemService.updateSellItem(data.id, data.data);
        getSellItemPhoto();
        toast.success('Das Aktualisieren des Artikelfotos war erfolgreich');
      } catch (e) {
        const error = await e;
        toast.success(error?.message || 'Das Aktualisieren des Artikelfotos ist fehlgeschlagen.');
      }
    }
    if (type === 'video') {
      try {
        await sellItemService.updateSellItem(data.id, data.data);
        toast.success('Das Aktualisieren des Artikelvideos war erfolgreich.');
        getSellItemVideo();
      } catch (e) {
        const error = await e;
        toast.success(error?.message || 'Das Aktualisieren des Artikelvideos ist fehlgeschlagen');
      }
    }
  };

  const handleRemove = async (itemId: string, key: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) {
      if (key === 'photo') {
        try {
          await sellItemService.removeSellItem(itemId);
          getSellItemPhoto();
          toast.success('Das Entfernen des Artikelfotos war erfolgreich.');
        } catch (e) {
          const error = await e;
          toast.success(error?.message || 'Das Entfernen des Artikelfotos ist fehlgeschlagen');
        }
      }
      if (key === 'video') {
        try {
          await sellItemService.removeSellItem(itemId);
          toast.success('Das Entfernen des Artikelvideos war erfolgreich.');
          getSellItemVideo();
        } catch (e) {
          const error = await e;
          toast.success(error?.message || 'Das Entfernen des Artikelvideos ist fehlgeschlagen.');
        }
      }
    }
  };

  const handleOpenModalUpdate = (item: string, key: string) => {
    setType(key);
    setItemUpdate(item);
    setIsUpdateShow(true);
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId === selectedFolderId ? null : folderId);
  };

  const handleOpenMedia = (item: any) => {
    openMedia(item);
  };

  const onChangeTab = (key) => {
    if (key === 'photo') {
      setPagePhoto(1);
    }
    if (key === 'video') {
      setPageVideo(1);
    }
  };

  useEffect(() => {
    getSellItemPhoto();
    getPendingItemPhoto();
  }, [pagePhoto]);

  useEffect(() => {
    getSellItemVideo();
    getPendingItemVideo();
  }, [pageVideo]);

  return (
    <div className="card mb-3">
      <UpdateMediaModal
        isModalShow={isUpdateShow}
        setModalShow={setIsUpdateShow}
        item={itemUpdate}
        handleUpdate={handelUpdate}
      />
      <div className="card-body">
        <Tabs defaultActiveKey="photo" transition={false} id="tab-media-content" onSelect={(key: any) => onChangeTab(key)}>
        <Tab eventKey="photo" title={`Fotos (${totalPhoto})`}>
  {loading && <Loading />}
  {!loading && videoFolders?.length > 0 ? (
    <Row className=''>
      {photoFolders?.map((folder: any, index: any) => (
        <article key={folder._id + index} style={{ width: selectedFolderId === folder._id ? '100%' : '30%' }}>
          <section
            onClick={() => handleFolderClick(folder._id)}
            style={{ cursor: 'pointer', margin: '10px', border: selectedFolderId === folder._id ? '': '1px solid #eee', display: selectedFolderId && selectedFolderId !== folder._id ? 'none' : 'block' }}
            className='image-box mt-1 mb-1 active'
          >
            { <img
              style={{ display: selectedFolderId === folder._id ? 'none' : 'block',  objectFit: 'cover' }}
              src={folder?.sellItems?.[0]?.media?.thumbUrl || '/images/default_thumbnail_photo.jpg'}
              alt="media_thumb_photo"
            />}
            <button style={{ width: selectedFolderId === folder._id ? '20%' : '100%', height: '100%', backgroundColor: '#FF337C', color: 'white', border: 'none', padding: '10px' }} className=''>
              {selectedFolderId === folder._id ? "Go back" : folder.name}
            </button>
          </section>

          {selectedFolderId === folder?._id && (
            <Row>
              {folder?.sellItems?.map((item: any, index: any) => (
                <Col xs={12} sm={6} md={4} lg={4} key={item._id + index} data-toggle="tooltip" title={item.name}>
                  <div className="image-box mt-1 mb-1 active">
                    <img
                      alt="media_thumb_photo"
                      src={item?.media?.thumbUrl || '/images/default_thumbnail_photo.jpg'}
                    />
                    <h5>
                      <i className="far fa-eye" /> Vorschau
                    </h5>
                    <a className="edit" onClick={() => handleOpenModalUpdate(item, 'photo')}>
                      <i className="fas fa-pencil-alt" />
                    </a>
                    <a className="remove" onClick={() => handleRemove(item._id, 'photo')}>
                      <i className="fas fa-trash" />
                    </a>
                    <a href="#" className="popup" role="button" onClick={() => handleOpenMedia(item)}></a>
                    <div className="overlay" />
                  </div>
                  <div className="media-name">
                    {item.name}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </article>
      ))}
    </Row>
  ) : (
    <p className="text-alert-danger">Sie haben kein Foto verfügbar!</p>
  )}
  {itemsPhoto?.length > 0 && totalPhoto > 0 && totalPhoto > take && <MainPaginate currentPage={pagePhoto} pageTotal={totalPhoto} pageNumber={take} setPage={setPagePhoto} />}
        </Tab>

        <Tab eventKey="videos" title={`Videos (${totalVideo})`}>
  {loading && <Loading />}
  {!loading && videoFolders?.length > 0 ? (
    <Row>
      {videoFolders?.map((folder: any, index: any) => (
        <article key={folder._id + index} style={{ width: selectedFolderId === folder._id ? '100%' : '30%' }}>
          <section
            onClick={() => handleFolderClick(folder._id)}
            style={{ cursor: 'pointer', margin: '10px', border: selectedFolderId === folder._id ? '' : '1px solid #eee', display: selectedFolderId && selectedFolderId !== folder._id ? 'none' : 'block' }}
            className='image-box mt-1 mb-1 active'
          >
            <video src={folder?.sellItems?.[0]?.media?.fileUrl} style={{ display: selectedFolderId === folder._id ? 'none' : 'block', objectFit: 'cover', width: '100%', height: '13vw' }} />
            <button style={{ width: selectedFolderId === folder._id ? '20%' : '100%', height: '100%', backgroundColor: '#FF337C', color: 'white', border: 'none', padding: '10px' }}>
              {selectedFolderId === folder._id ? "Go back" : folder.name}
            </button>
          </section>

          {selectedFolderId === folder._id && (
            <Row>
              {folder.sellItems.map((item: any, index: any) => (
                <Col xs={12} sm={6} md={4} lg={4} key={item._id + index} data-toggle="tooltip" title={item.name}>
                  <div className="image-box mt-1 mb-1 active">
                    <video style={{ width: '100%', height: '13vw' }} controls src={item.media.fileUrl || '/images/default_thumbnail_video.png'} />
                    <h5>
                      <i className="far fa-eye" /> Vorschau
                    </h5>
                    <a className="edit" onClick={() => handleOpenModalUpdate(item, 'video')}>
                      <i className="fas fa-pencil-alt" />
                    </a>
                    <a className="remove" onClick={() => handleRemove(item._id, 'video')}>
                      <i className="fas fa-trash" />
                    </a>
                    <a href="#" className="popup" role="button" onClick={() => handleOpenMedia(item)}></a>
                    <div className="overlay" />
                  </div>
                  <div className="media-name">
                    {item.name}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </article>
      ))}
    </Row>
  ) : (
    <p className="text-alert-danger">Sie haben kein Video verfügbar!</p>
  )}
  {itemsVideo?.length > 0 && totalVideo > 0 && totalVideo > take && <MainPaginate currentPage={pageVideo} pageTotal={totalVideo} pageNumber={take} setPage={setPageVideo} />}
        </Tab>

          <Tab eventKey="pending" title={`Pending Photos (${pendingPhotos?.length})`}>
  {loading && <Loading />}
  {!loading && pendingPhotos?.length > 0 ? (
    <Row className=''>
      {pendingPhotoFolders?.map((folder: any, index: any) => (
        <article key={folder._id + index} style={{ width: selectedFolderId === folder._id ? '100%' : '30%' }}>
          <section
            onClick={() => handleFolderClick(folder._id)}
            style={{ cursor: 'pointer', margin: '10px', border: selectedFolderId === folder._id ? '': '1px solid #eee', display: selectedFolderId && selectedFolderId !== folder._id ? 'none' : 'block' }}
            className='image-box mt-1 mb-1 active'
          >
            { <img
              style={{ display: selectedFolderId === folder._id ? 'none' : 'block',  objectFit: 'cover' }}
              src={folder?.sellItems?.[0]?.media?.thumbUrl || '/images/default_thumbnail_photo.jpg'}
              alt="media_thumb_photo"
            />}
            <button style={{ width: selectedFolderId === folder._id ? '20%' : '100%', height: '100%', backgroundColor: '#FF337C', color: 'white', border: 'none', padding: '10px' }} className=''>
              {selectedFolderId === folder._id ? "Go back" : folder.name}
            </button>
          </section>

          {selectedFolderId === folder?._id && (
            <Row>
              {folder?.sellItems?.map((item: any, index: any) => (
                <Col xs={12} sm={6} md={4} lg={4} key={item._id + index} data-toggle="tooltip" title={item.name}>
                  <div className="image-box mt-1 mb-1 active">
                    <img
                      alt="media_thumb_photo"
                      src={item?.media?.thumbUrl || '/images/default_thumbnail_photo.jpg'}
                    />
                    <h5>
                      <i className="far fa-eye" /> Vorschau
                    </h5>
                    <a className="edit" onClick={() => handleOpenModalUpdate(item, 'photo')}>
                      <i className="fas fa-pencil-alt" />
                    </a>
                    <a className="remove" onClick={() => handleRemove(item._id, 'photo')}>
                      <i className="fas fa-trash" />
                    </a>
                    <a href="#" className="popup" role="button" onClick={() => handleOpenMedia(item)}></a>
                    <div className="overlay" />
                  </div>
                  {/* <div className="media-name">
                    {item.name}
                  </div> */}
                </Col>
              ))}
            </Row>
          )}
        </article>
      ))}
    </Row>
  ) : (
    <p className="text-alert-danger">Sie haben kein Foto verfügbar!</p>
  )}
  {itemsPhoto?.length > 0 && totalPhoto > 0 && totalPhoto > take && <MainPaginate currentPage={pagePhoto} pageTotal={totalPhoto} pageNumber={take} setPage={setPagePhoto} />}
        </Tab>
        {/* Video pending */}
        <Tab eventKey="pending videos" title={`Pending Videos (${videoFolders?.length})`}>
  {loading && <Loading />}
  {!loading && pendingVideoItems?.length > 0 ? (
    <Row>
      {pendingVideoFolders?.map((folder: any, index: any) => (
        <article key={folder._id + index} style={{ width: selectedFolderId === folder._id ? '100%' : '30%' }}>
          <section
            onClick={() => handleFolderClick(folder._id)}
            style={{ cursor: 'pointer', margin: '10px', border: selectedFolderId === folder._id ? '' : '1px solid #eee', display: selectedFolderId && selectedFolderId !== folder._id ? 'none' : 'block' }}
            className='image-box mt-1 mb-1 active'
          >
            <video src={folder?.sellItems?.[0]?.media?.fileUrl} style={{ display: selectedFolderId === folder._id ? 'none' : 'block', objectFit: 'cover', width: '100%', height: '13vw' }} />
            <button style={{ width: selectedFolderId === folder._id ? '20%' : '100%', height: '100%', backgroundColor: '#FF337C', color: 'white', border: 'none', padding: '10px' }}>
              {selectedFolderId === folder._id ? "Go back" : folder.name}
            </button>
          </section>

          {selectedFolderId === folder._id && (
            <Row>
              {folder.sellItems.map((item: any, index: any) => (
                <Col xs={12} sm={6} md={4} lg={4} key={item._id + index} data-toggle="tooltip" title={item.name}>
                  <div className="image-box mt-1 mb-1 active">
                    <video style={{ width: '100%', height: '13vw' }} controls src={item.media.fileUrl || '/images/default_thumbnail_video.png'} />
                    <h5>
                      <i className="far fa-eye" /> Vorschau
                    </h5>
                    <a className="edit" onClick={() => handleOpenModalUpdate(item, 'video')}>
                      <i className="fas fa-pencil-alt" />
                    </a>
                    <a className="remove" onClick={() => handleRemove(item._id, 'video')}>
                      <i className="fas fa-trash" />
                    </a>
                    <a href="#" className="popup" role="button" onClick={() => handleOpenMedia(item)}></a>
                    <div className="overlay" />
                  </div>
                  <div className="media-name">
                    {item.name}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </article>
      ))}
    </Row>
  ) : (
    <p className="text-alert-danger">Sie haben kein Video verfügbar!</p>
  )}
  {itemsVideo?.length > 0 && totalVideo > 0 && totalVideo > take && <MainPaginate currentPage={pageVideo} pageTotal={totalVideo} pageNumber={take} setPage={setPageVideo} />}
        </Tab>

        </Tabs>

      </div>
    </div>
  );
}

export default MediaContent;
