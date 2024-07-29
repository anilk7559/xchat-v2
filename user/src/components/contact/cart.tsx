import Router from 'next/router';
import { Button } from 'react-bootstrap';

interface IProps {
  contact: any
}
function ContactCart({ contact }: IProps) {
  return (
    <div className="card contact-card">
      <div
        className="avatar"
        onClick={() => {
          contact.isFriend
            && Router.push(
              { pathname: '/models/[username]', query: { username: contact.username } },
              `/models/${contact.username}`
            );
        }}
      >
        <img className="avatar-img" src={contact.avatarUrl || '/images/user3.jpg'} alt="" />
        <span><i className="far fa-heart" /></span>
        <div className="contact-name" />
      </div>
      <div className="desc"><h6 className="text-center">{contact.bio}</h6></div>
      <div className="group-btn">
        <Button className="btn primary ">Chatten</Button>
        <Button className="btn primary custom">Profil prüfen</Button>
      </div>
    </div>
  );
}

export default ContactCart;
