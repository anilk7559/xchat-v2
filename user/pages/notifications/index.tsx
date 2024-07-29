import PageTitle from '@components/page-title';
import { withAuth } from '@redux/withAuth';
import dynamic from 'next/dynamic';

const NotificationList = dynamic(() => import('@components/notification/notification-list'));

function NotificationsPage() {
  return (
    <main className="main scroll">
      <PageTitle title="Benachrichtigungen" />
      <div className="container">
        <NotificationList />
      </div>
    </main>
  );
}

export default withAuth(NotificationsPage);
