import PageTitle from '@components/page-title';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { withAuth } from 'src/redux/withAuth';

import styles from './index.module.scss';
import { useTranslationContext } from 'context/TranslationContext';

const PurchaseTokenList = dynamic(() => import('src/components/token/token-packages'));

function TopupTokens() {
  const {t} = useTranslationContext()
  return (
    <div className={classNames('funds_token_box', styles.funds_token_box)}>
      <PageTitle title="Topup tokens" />
      <div className={classNames('chats', styles.chats)}>
        <div className="chat-body p-3">
          <div className="row m-0 mb-4">
            <p className={classNames('heading_title', styles.heading_title)}>
              <span className={classNames('heading_left', styles.heading_left)}>{t?.tokenMsg}</span>
              <span className={classNames('heading_right', styles.heading_right)}>{t?.tokenInfo}</span>
            </p>
          </div>
          <PurchaseTokenList />
        </div>
      </div>
    </div>
  );
}

export default withAuth(TopupTokens);
