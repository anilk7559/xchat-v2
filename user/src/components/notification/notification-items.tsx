import { readNotifcation } from '@redux/notification/actions';
import { selectNotificationMapping } from '@redux/notification/selector';
import { notificationService } from '@services/notification.service';
import Router from 'next/router';
import { useMemo } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { INotification } from 'src/interfaces/notification';

interface IProps {
  id: string;
}
function NotificationItems({
  id
}: IProps) {
  const dispatch = useDispatch();
  const { mapping } = useSelector(selectNotificationMapping);

  const item = useMemo(() => mapping[id], [id, mapping]) as INotification;

  const handleReadNotificationItem = async () => {
    await notificationService.read(id);
    dispatch(readNotifcation(item._id));
    Router.push('/earning');
  };

  return (
    <div
      className={`p-3 d-flex align-items-center pointer border-bottom notification
      ${item?.read ? 'read opacity-6' : 'unread'}`}
      onClick={() => handleReadNotificationItem()}
    >
      <div className="dropdown-list-image mr-3">
        <img className="rounded-circle avatar mt-2" src={item?.user?.avatarUrl} alt="" />
      </div>
      <div className="font-weight-bold mr-3 ">
        <div className="text-nowrap-mw">
          {item?.text}
        </div>
        <div className="small"><Moment format="LLLL">{item?.createdAt}</Moment></div>
      </div>
      <span className="ml-auto mb-auto">
        <div className="text-right text-muted pt-1"><Moment fromNow>{item?.createdAt}</Moment></div>
        <div className="text-right text-muted pt-1 ml-2">
          {!item?.read && <span className="icon-danger">!</span>}
        </div>
      </span>
    </div>

  );
}

export default NotificationItems;
