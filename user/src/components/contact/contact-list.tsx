import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IProps {
  authUser: any;
  contacts: any;
  selectedContactId: string;
  setSelectedContact: Function;
}

function ContactList({
  authUser,
  contacts,
  selectedContactId,
  setSelectedContact
}: IProps) {
  const [selectedFriend, setSelectedFriend] = useState(selectedContactId);

  useEffect(() => {
    if (selectedContactId) {
      setSelectedFriend(selectedContactId);
    }
  }, [selectedContactId]);

  return (
    <div className="contacts-list">
      {contacts.map((contact) => {
        const friend = contact.user?.type === authUser.type ? contact.added : contact.user;
        if (friend) {
          return (
            <div
              key={contact._id}
              className={contact._id === selectedFriend ? 'contacts-item active' : 'contacts-item'}
            >
              <Link legacyBehavior href={`/contact/detail/?id=${contact._id}`} as="/contact/detail/">
                <a className="contacts-link" onClick={() => setSelectedContact(contact._id)}>
                  <div className="avatar">
                    <img src={friend.avatarUrl || '/images/user2.jpg'} alt="" />
                  </div>
                  <div className="contacts-content">
                    <div className="contacts-info">
                      <h6 className="chat-name text-truncate">{friend.username}</h6>
                    </div>
                    <div className="contacts-texts">
                      <svg className="hw-16 text-muted mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-muted mb-0">
                        {friend?.state}
                        ,
                        {friend?.country}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
export default ContactList;
