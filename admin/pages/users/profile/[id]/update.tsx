/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { userService } from '@services/user.service';
import Loading from '@components/loading/loading';
import UserForm from '@components/user/form';

function ProfileUser() {
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('user');

  const router = useRouter();
  const userId = router.query.id;

  const findUser = async () => {
    setLoadingUser(true);
    try {
      const resp = await userService.findOne(userId as string);
      setUser(resp.data);
    } catch (e) {
      const error = await e;
      toast.error(error?.messsage || 'Error, has not found user');
      return Router.push('/users/listing');
    } finally {
      setLoadingUser(false);
    }
  };

  const getCurrentRole = (role) => {
    setCurrentRole(role.target.value);
  };

  const updateProfile = async (data: any) => {
    setLoadingUpdate(true);
    try {
      await userService.update(userId as string, data);
      toast.success('Der Benutzer wurde aktualisiert');
      return Router.push('/users/listing');
    } catch (e) {
      const error = await e;
      toast.error(error?.messaga || 'Das Aktualisieren des Profilbenutzers ist fehlgeschlagen');
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    findUser();
  }, []);
  return (
    <>
      <Head>
        <title>Benutzer aktualisieren</title>
      </Head>
      <h4 className="title-table">{currentRole === 'admin' ? 'Admin Update' : 'User Update'}</h4>
      <Container fluid className="content">
        {loadingUser && <Loading />}
        {!loadingUser && user && (
          <UserForm
            submit={updateProfile}
            data={user}
            loadingUpdate={loadingUpdate}
            getCurrentRole={getCurrentRole}
          />
        )}
      </Container>
    </>
  );
}
export default ProfileUser;
