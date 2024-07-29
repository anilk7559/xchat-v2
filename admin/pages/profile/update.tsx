import * as React from 'react';
import { connect } from 'react-redux';
import { Form, FormControl, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Container } from 'reactstrap';
import { getGlobalConfig } from '@components/config/config';
import { Head } from 'next/document';
import { updateMe } from '../../src/redux/user/actions';

class UpdateProfile extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = this.props.user
      ? this.props.user
      : {
        name: '',
        address: '',
        phoneNumber: '',
        avatar: '',
        avatarUrl: ''
      };
  }

  handleChange(field: string, e: any) {
    const newData = { ...this.state } as any;
    newData[field] = e.target.value;
    this.setState(newData);
  }

  onAvatarChange(e: any) {
    this.setState({
      avatar: e.target.files[0]
    });
  }

  uploadAvatar() {
    const formData = new FormData();
    const config = getGlobalConfig();
    if (this.state.avatar) {
      formData.append('avatar', this.state.avatar);
      fetch(`${config.NEXT_PUBLIC_apiEndpoint}/users/avatar`, {
        method: 'POST',
        headers: {
          // TODO - check me
          Authorization: process.browser ? `Bearer ${localStorage.getItem('accessToken')}` : ''
        },
        body: formData
      })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response;
          }
          throw response.clone().json();
        })
        .then((response) => {
          if (response.status === 204 || response.status === 205) {
            return null;
          }
          return response.json();
        })
        .then((res: any) => {
          if (res.data) {
            toast.success('Avatar hochgeladen');
            this.setState({ avatarUrl: res.data.url });
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => {
          toast.error('Fehler beim Hochladen!');
        });
    } else {
      toast.error('Bitte wählen Sie Ihren Avatar aus!');
    }
  }

  // TODO - should use componentWillUpdate
  componentWillReceiveProps(nextProps: any) {
    if (!nextProps.updateFailure) {
      toast.success('Aktualisiert');
    }
  }

  update(e: any) {
    e.preventDefault();
    this.props.updateMe(this.state);
  }

  render() {
    return (
      <main className="main">
        <Head>
          <title>Profil aktualisieren</title>
        </Head>
        <h4 className="title-table">
        Lüfter aktualisieren
        </h4>
        <Container className="content">
          <div>
            {this.props.updateFailure && <div className="error">Ungültige E-Mail/Passwort. Bitte überprüfe es nocheinmal!</div>}
            <div className="form-group files">
              <label>Wählen Sie Avatar aus</label>
              <input
                className="form-control"
                type="file"
                name="avatar"
                onChange={this.onAvatarChange.bind(this)}
              />
            </div>
            <button onClick={this.uploadAvatar.bind(this)} className="btn btn-primary">
              Upload Avatar
            </button>
            <div>
              <img src={this.state.avatarUrl} alt="" className="img-reponsive" />
            </div>

            <form onSubmit={this.update.bind(this)}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <FormControl
                  type="text"
                  placeholder="Bitte geben Sie den Namen ein"
                  onChange={this.handleChange.bind(this, 'name')}
                  value={this.state.name}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Adresse</Form.Label>
                <FormControl
                  type="text"
                  placeholder="Bitte geben Sie Ihre Adresse ein"
                  onChange={this.handleChange.bind(this, 'adresse')}
                  value={this.state.address}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Telefonnummer</Form.Label>
                <FormControl
                  type="text"
                  placeholder="Bitte geben sie ihre Telefonnummer ein"
                  onChange={this.handleChange.bind(this, 'Telefonnummer')}
                  value={this.state.phoneNumber}
                />
              </Form.Group>
              <Button variant="outline-success" type="submit">
              Aktualisieren
                {' '}
              </Button>
            </form>
          </div>
        </Container>
      </main>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state.user });

const mapDispatch = { updateMe };
// connect must go inside withReduxSaga otherwise connect will not be able to find the store.
export default connect(mapStateToProps, mapDispatch)(UpdateProfile);
