import { useTranslationContext } from 'context/TranslationContext';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { connect } from 'react-redux';

const PageTitle = dynamic(() => import('@components/page-title'));
const ListPurchasedItems = dynamic(() => import('src/components/profile/purchase-list/list-purchased-item'));
const ViewMediaItem = dynamic(() => import('@components/media/view-media-item'));

interface IProps {
  authUser: any
}
function PurchasedMediaPage({ authUser }: IProps) {
  const [isOpenMedia, setIsOpenMedia] = useState(false);
  const [mediaItem, setMediaItem] = useState(null);
  const [titleModal, setTitleModal] = useState('');
  const {t} = useTranslationContext()

  const openMedia = (item: any) => {
    setIsOpenMedia(true);
    setMediaItem(item?.media);
    setTitleModal(item?.name);
  };

  const closeModal = () => {
    setIsOpenMedia(false);
    setMediaItem(null);
    setTitleModal('');
  };

  return (
    <main className="main scroll">
      <PageTitle title={t?.mediaPage?.title} />
      <div className="chats">
        <div className="chat-body p-3">
          <div className="row m-0 mb-4">
            <div className="col-md-12">
              <h4 className="font-weight-semibold">{t?.mediaPage?.title}</h4>
            </div>
          </div>
          <div className="row m-0">
            <div className="col-12">
              {authUser?.type === 'user' && <ListPurchasedItems openMedia={openMedia.bind(this)} />}
              {mediaItem && isOpenMedia ? (
                <ViewMediaItem
                  titleModal={titleModal}
                  mediaItem={mediaItem}
                  isOpenMedia={isOpenMedia}
                  closeMedia={closeModal.bind(this)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const mapStateToProps = (state: any) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(PurchasedMediaPage);
