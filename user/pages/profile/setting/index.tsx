import PageTitle from '@components/page-title';
import dynamic from 'next/dynamic';
import { connect, ConnectedProps } from 'react-redux';

const DeactiveProfileForm = dynamic(() => import('@components/setting/deactive-profile-form'));
const TokenPerMessageForm = dynamic(() => import('@components/setting/token-per-message-form'));

const mapStateToProps = (state: any) => ({
  authUser: state.auth.authUser
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Setting({ authUser }: PropsFromRedux) {
  return (
    <main className="main scroll">
      <PageTitle title="Settings" />
      <div className="chats">
        <div className="chat-body p-3">
          <div className="row m-0 mb-4">
            <div className="col-md-7">
              <h4 className="font-weight-semibold">Settings</h4>
            </div>
          </div>
          <div className="row m-0">
            {authUser.type === 'model' && (
              <TokenPerMessageForm />
            )}
            <DeactiveProfileForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default connector(Setting);
