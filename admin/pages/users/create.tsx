import { Container } from 'reactstrap';
import Router from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { userService } from '@services/user.service';
import * as React from 'react';
import UserForm from '../../src/components/user/form';

function UserCreate() {
  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState('user');

  const createUser = async (data) => {
    setLoadingCreate(true);
    try {
      await userService.create(data);
      toast.success('Benutzer wurde erstellt');
      Router.push('/users/listing');
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Erstellen des Benutzers ist fehlgeschlagen');
    } finally {
      setLoadingCreate(false);
    }
  };

  const getCurrentRole = (role) => {
    setCurrentRole(role.target.value);
  };

  return (
    <>
      <Head>
        <title>Benutzer erstellen</title>
      </Head>
      <h4 className="title-table">{currentRole === 'admin' ? 'Admin Create' : 'Benutzer erstellen'}</h4>
      <Container fluid className="content">
        <UserForm
          submit={createUser}
          data={{
            username: '',
            email: '',
            role: '',
            type: '',
            isActive: false,
            emailVerified: false,
            phoneNumber: '',
            address: '',
            password: '',
            avatar: '',
            avatarUrl: '',
            balance: 0,
            isCompletedProfile: false,
            isBlocked: false,
            _id: ''
          }}
          getCurrentRole={getCurrentRole}
          loadingCreate={loadingCreate}
        />
      </Container>
    </>
  );
}
export default UserCreate;
