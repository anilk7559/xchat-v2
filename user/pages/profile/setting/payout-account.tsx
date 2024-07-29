import PageTitle from '@components/page-title';
import dynamic from 'next/dynamic';
import { withAuth } from 'src/redux/withAuth';

const PayoutAccountForm = dynamic(() => import('src/components/payout-request/payout-account-form'));

function PayoutRequest() {
  return (
    <main className="main scroll">
      <PageTitle title="Payout account" />
      <div className="chats">
        <div className="chat-body p-3">
          <div className="row m-0 mb-4">
            <div className="col-md-12">
              <h4 className="font-weight-semibold">Payout Account</h4>
            </div>
          </div>
          <PayoutAccountForm />
        </div>
      </div>
    </main>
  );
}

export default withAuth(PayoutRequest);
