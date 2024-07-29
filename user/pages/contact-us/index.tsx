import PageTitle from '@components/page-title';
import dynamic from 'next/dynamic';

const ContactUsForm = dynamic(() => import('@components/contact-us-form'));

function ContactUsPage() {
  return (
    <main className="main scroll">
      <PageTitle title="Kontaktieren Sie uns" />
      <div className="chats">
        <div className="chat-body p-3">
          <ContactUsForm />
        </div>
      </div>
    </main>
  );
}

ContactUsPage.authenticate = false;
ContactUsPage.noredirect = true;

export default ContactUsPage;
