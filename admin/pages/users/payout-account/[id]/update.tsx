import { payoutAccountService } from '@services/payout-account.service';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import PayoutAccountForm from 'src/components/user/payout-account-form';
import { Container } from 'reactstrap';
import Loading from 'src/components/loading/loading';

function PayoutAccount() {
  const [payoutAccount, setPayoutAccount] = useState({});
  const [loadingPayoutAcoount, setLoadingPayoutAcoount] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const router = useRouter();
  const userId = router.query.id;

  const findPayoutAccount = async () => {
    setLoadingPayoutAcoount(true);
    try {
      const resp = await payoutAccountService.find(userId as string);
      setPayoutAccount(resp.data);
    } catch (e) {
      const error = await e;
      toast.error(error?.messsage || 'Fehler, der Benutzer des Auszahlungskontos wurde nicht gefunden');
      Router.push('/users/listing');
    } finally {
      setLoadingPayoutAcoount(false);
    }
  };

  const updateVerification = async (data: any) => {
    setLoadingUpdate(true);
    try {
      await payoutAccountService.createAndUpdate(Object.assign(data, { modelId: userId as string }));
      toast.success('Das Auszahlungskonto wurde aktualisiert');
      Router.push('/users/listing');
    } catch (e) {
      const error = await e;
      toast.error(error?.messaga || 'Auszahlungskonto konnte nicht aktualisiert werden');
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    findPayoutAccount();
  }, []);
  return (
    <main className="main">
      <Head>
        <title>Muster-Auszahlungskonto</title>
      </Head>
      <h4 className="title-table">Muster-Auszahlungskonto</h4>
      <Container fluid className="content">
        {loadingPayoutAcoount && <Loading />}
        {!loadingPayoutAcoount && payoutAccount && (
          <PayoutAccountForm submit={updateVerification} payoutAccount={payoutAccount} loadingUpdate={loadingUpdate} />
        )}
      </Container>
    </main>
  );
}
export default PayoutAccount;
