import { FC, useContext, useState } from 'react';
import TranslatorContext from '../../modules/translator/TranslatorContext';

const ContactForm1: FC = () => {
  const translator = useContext(TranslatorContext);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locale: translator.locale,
        name,
        email,
        message
      }),
    }).then((response) => {
      setName('');
      setEmail('');
      setMessage('');
      setIsAlertSuccess(response.status === 200);
      setIsAlertVisible(true);
    });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="messages"></div>
      <div className="row gx-4">
        {
          isAlertVisible ? (
            (
              <div className="col-md-12">
                <div className={`alert alert-${isAlertSuccess ? 'success' : 'danger'} alert-icon`} role="alert">
                  <i className={`uil uil-${isAlertSuccess ? 'check-circle' : 'exclamation-circle'}`} /> {translator.t(`forms.contactForm._response.${isAlertSuccess ? 'success' : 'danger'}`)}
                </div>
              </div>
            )
          ) : null
        }

        <div className="col-md-6">
          <div className="form-floating mb-4">
            <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder={translator.t('forms.contactForm.name.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-name">{translator.t('forms.contactForm.name.label')}</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating mb-4">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={translator.t('forms.contactForm.email.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-email">{translator.t('forms.contactForm.email.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={translator.t('forms.contactForm.message.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-message">{translator.t('forms.contactForm.message.label')}</label>
          </div>
        </div>

        <div className="col-12 text-center">
          <input type="submit" value={translator.t('forms.contactForm.submit.title')} className="btn btn-primary rounded-pill btn-send mb-3" />
          <p className="text-muted">
            <strong>*</strong> {translator.t('forms.contactForm.submit.subtitle')}
          </p>
        </div>
      </div>
    </form>
  );
};

export default ContactForm1;
