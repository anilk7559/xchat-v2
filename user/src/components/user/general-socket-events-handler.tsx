import {
  loadNotificationAll,
  loadNotificationUnread
} from '@redux/notification/actions';
import { conversationService } from '@services/conversation.service';
import { connect, ConnectedProps } from 'react-redux';
import { toast } from 'react-toastify';
import { setBalanceToken } from 'src/redux/auth/actions';
import {
  newConversation,
  updateHaveBeenBlocked,
  updateHaveBeenUnBlocked,
  updateLastMessage,
  updateTotalUnreadMessage
} from 'src/redux/conversation/actions';
import { newMessage } from 'src/redux/message/actions';
import { SocketEvent } from 'src/socket';

const mapDispatch = {
  dpUpdateLastMessage: updateLastMessage,
  dpNewMessage: newMessage,
  dpNewConversation: newConversation,
  dpSetBalanceToken: setBalanceToken,
  dpUpdateHaveBeenBlocked: updateHaveBeenBlocked,
  dpUpdateHaveBeenUnBlocked: updateHaveBeenUnBlocked,
  dpUpdateTotalUnreadMessage: updateTotalUnreadMessage,
  dploadNotificationUnread: loadNotificationUnread,
  dploadNotificationAll: loadNotificationAll
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

function GeneralSocketEventsHandler({
  dpUpdateLastMessage,
  dpNewMessage,
  dpNewConversation,
  dpSetBalanceToken,
  dpUpdateHaveBeenBlocked,
  dpUpdateHaveBeenUnBlocked,
  dpUpdateTotalUnreadMessage,
  dploadNotificationUnread,
  dploadNotificationAll
}: PropsFromRedux) {
  const onMessage = (data: any) => {
    dpNewMessage(data);
    dpUpdateLastMessage(data);
    // fetch total unread message
    const fetcher = async () => {
      try {
        const resp = await conversationService.getTotalUnreadmessage();
        dpUpdateTotalUnreadMessage(resp.data);
      } catch (e) {
        const error = await e;
        toast.error(error?.message || 'Das Laden der Gesamtanzahl ungelesener Nachrichten ist fehlgeschlagen.');
      }
    };

    fetcher();
  };

  // const onUpdateCompletedProfile = (data: any) => dpSetCompletedProfile(data.isCompletedProfile);
  const shareLoveSuccess = (data) => {
    const { username, token } = data;
    toast.success(`${username} Tipp erhalten ${token} token(s)`);
    dploadNotificationUnread();
    dploadNotificationAll();
  };

  const onPurchasedItem = ({
    username,
    item
  }) => {
    dploadNotificationUnread();
    dploadNotificationAll();
    toast.success(`${username} Artikel gekauft ${item.name}`);
  };

  return (
    <>
      <SocketEvent event="new_message" handler={onMessage} />
      <SocketEvent event="new_conversation" handler={dpNewConversation} />
      <SocketEvent event="balance_updated" handler={dpSetBalanceToken} />
      {/* <SocketEvent event="update_completed_profile" handler={onUpdateCompletedProfile} /> */}
      <SocketEvent event="have_been_blocked_event" handler={dpUpdateHaveBeenBlocked} />
      <SocketEvent event="have_been_unblocked_event" handler={dpUpdateHaveBeenUnBlocked} />
      <SocketEvent event="share_love_success" handler={shareLoveSuccess} />
      <SocketEvent event="purchased_item" handler={onPurchasedItem} />
    </>
  );
}

export default connector(GeneralSocketEventsHandler);
