/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { setTotalUnreadNotification } from '@redux/notification/actions';
import { selectTotalUnreadNotification } from '@redux/notification/selector';
import { notificationService } from '@services/notification.service';
import { useEffect, useRef, useState } from 'react';
import {
  Overlay,
  Popover
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import NotificationHeaderPopup from './notifcation-header-popup';

function NotificationHeaderIcon() {
  const [showPopup, setShowPopup] = useState(false);
  const wrapperRef = useRef(null);
  const deboundRef = useRef(null);
  const [target, setTarget] = useState(null);
  const [srcUrl, setSrcUrl] = useState('/images/bell.gif');
  const ref = useRef(null);

  // const [count, setCount] = useState(0);
  const count = useSelector(selectTotalUnreadNotification);
  const dispatch = useDispatch();

  const countUnread = async () => {
    const res = await notificationService.countUnread();
    // setCount(res.data.count);
    dispatch(setTotalUnreadNotification(res.data.count));
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      deboundRef.current = true;
      setShowPopup(false);
      setTimeout(() => {
        deboundRef.current = false;
      }, 100);
    }
  };

  useEffect(() => {
    countUnread();
  }, []);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={ref}>
      <a
        href="#"
        style={{ position: 'relative' }}
        onClick={(evt) => {
          if (!showPopup && !deboundRef.current) {
            setShowPopup(true);
            setTarget(evt.target);
          }
        }}
      >
        {count > 0 ? (
          <>
            <img onMouseOver={() => setSrcUrl('/images/bell-blue.gif')} onMouseOut={() => setSrcUrl('/images/bell.gif')} alt="" src={srcUrl} width={30} height={30} />
            <span style={{
              position: 'absolute', top: '-6px', left: '20px', fontSize: '80%'
            }}
            >
              {count}
            </span>
          </>
        ) : (
          <i className="fa fa-bell" />
        )}

      </a>

      <Overlay
        show={showPopup}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
      >
        <Popover id="popover-positioned-bottom" className="custom-width">
          <Popover.Body>
            <div ref={wrapperRef}>
              <NotificationHeaderPopup />
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default NotificationHeaderIcon;
