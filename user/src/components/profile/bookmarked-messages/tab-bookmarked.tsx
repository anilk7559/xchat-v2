/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import MediaContent from '@components/chat-box/content/media-content';
import { mediaService } from '@services/media.service';
import Router from 'next/router';
import { useState } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

interface IProps {
  bookmarked: any;
  removeBookmarked: Function
}

const mapStates = (state: any) => ({
  authUser: state.auth.authUser
});

const connector = connect(mapStates);

function TabBookmarked({
  bookmarked,
  removeBookmarked
}: IProps) {
  const [show, setShow] = useState(false);

  const handleDownloadFile = (mediaId: string) => {
    mediaService
      .download(mediaId)
      .then((resp) => {
        const a = document.createElement('a');
        a.href = resp.data.href;
        a.target = '_blank';
        a.click();
      })
      .catch(() => toast.error('Systemfehler'));
  };

  return (
    <tr key={bookmarked?._id}>
      <td>
        {bookmarked?.metadata && bookmarked?.metadata.senderId === bookmarked?.user._id ? bookmarked?.recipients[0].username : bookmarked?.sender[0].username }
      </td>
      <td>
        {bookmarked?.sender && bookmarked?.sender[0]?.username}
      </td>
      {bookmarked?.type === 'text'
       && (
       <td className={`${show ? '' : 'text'}`} onClick={() => setShow(!show)}>
         {bookmarked?.metadata?.text}
       </td>
       )}
      {bookmarked?.type === 'file'
        && (
        <td className="file">
          <div className="document">
            <div className="btn btn-primary btn-icon rounded-circle text-light mr-2">
              <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="document-body">
              <h6>
                <a href="#" onClick={() => handleDownloadFile(bookmarked?.files[0]?._id)} className="text-reset">
                  {bookmarked?.files[0]?.name}
                </a>
              </h6>
              <ul className="list-inline small mb-0">
                <li className="list-inline-item">
                  <span className="text-muted">
                    {Number(bookmarked?.files[0]?.size) / 1000}
                    {' '}
                    KB
                  </span>
                </li>
                <li className="list-inline-item">
                  <span className="text-muted text-uppercase">
                    {bookmarked?.files[0]?.mimeType?.substring(bookmarked?.files[0]?.mimeType?.indexOf('/') as any + 1)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </td>
        )}
      {bookmarked?.type === 'photo'
          && (
          <td>
            <MediaContent type={bookmarked?.files[0]?.type} items={bookmarked?.files} />
          </td>
          )}
      {bookmarked?.type === 'video'
          && (
          <td className="maxh-300">
            <MediaContent type={bookmarked?.files[0]?.type} items={bookmarked?.files} />
          </td>
          )}
      <td>
        <Moment format="HH:mm DD/MM/YYYY">{bookmarked?.createdAt}</Moment>
      </td>
      <td>
        <a className="pointer" onClick={() => Router.push(`/conversation/${bookmarked?.conversation?._id}`)}>
          <i className="fa fa-eye" />
        </a>
        <a
          className="pointer"
          href="#"
          onClick={() => {
            if (window.confirm('Sind Sie sicher?')) {
              removeBookmarked(bookmarked?._id);
            }
          }}
        >
          <i className="fa fa-trash ml-2" />
        </a>
      </td>
    </tr>

  );
}

export default connector(TabBookmarked);
