import {FC, useContext, useEffect, useState} from 'react';
import TranslatorContext from '../../modules/translator/TranslatorContext';
import NextLink from "../links/NextLink";
import Router from 'next/router';
import axios from 'axios';

const RegisterForm1: FC = () => {
  const translator = useContext(TranslatorContext);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [pharmacy, setPharmacy] = useState<string>('');
  const [uid, setUid] = useState<string>('');
  const [terms, setTerms] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);

  useEffect(() => {
    axios
      .get('/api/authenticated')
      .then((response) => {
        if (!response.data.authenticated) {
          Router.push('/login');
        } else {
          if (!response.data.valid) {
            return;
          } else {
            Router.push('/');
          }
        }
      })
      .catch(() => Router.push('/login'));
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, phone, city, pharmacy, uid, terms }),
      });

      if (response.ok) {
        Router.push('/');
        setIsAlertSuccess(true);
        // Optionally, clear the form or redirect the user
      } else {
        setIsAlertSuccess(false);
        // Handle registration error (e.g., display error message)
      }
    } catch (error) {
      setIsAlertSuccess(false);
      // Handle network error
    } finally {
      setIsAlertVisible(true);
    }
  };


  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="messages"></div>
      <div className="row gx-4">
        {
          isAlertVisible ? (
            (
              <div className="col-md-12">
                <div className={`alert alert-${isAlertSuccess ? 'success' : 'danger'}`} role="alert">
                  {translator.t(`forms.registerForm._response.${isAlertSuccess ? 'success' : 'danger'}`)}
                </div>
              </div>
            )
          ) : null
        }

        <div className="col-12 col-lg-6">
          <div className="form-floating mb-4">
            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} type="text" placeholder={translator.t('forms.registerForm.firstName.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-firstName">{translator.t('forms.registerForm.firstName.label')}</label>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="form-floating mb-4">
            <input value={lastName} onChange={(event) => setLastName(event.target.value)} type="text" placeholder={translator.t('forms.registerForm.lastName.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-lastName">{translator.t('forms.registerForm.lastName.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder={translator.t('forms.registerForm.phone.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-phone">{translator.t('forms.registerForm.phone.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={city} onChange={(event) => setCity(event.target.value)} type="text" placeholder={translator.t('forms.registerForm.city.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-city">{translator.t('forms.registerForm.city.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={pharmacy} onChange={(event) => setPharmacy(event.target.value)} type="text" placeholder={translator.t('forms.registerForm.pharmacy.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-pharmacy">{translator.t('forms.registerForm.pharmacy.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={uid} onChange={(event) => setUid(event.target.value)} type="text" placeholder={translator.t('forms.registerForm.uid.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-uid">{translator.t('forms.registerForm.uid.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={translator.t('forms.registerForm.email.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-email">{translator.t('forms.registerForm.email.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check text-left mb-4">
            <input
              id="terms"
              checked={terms}
              onClick={() => setTerms((terms) => !terms)}
              type="checkbox"
              placeholder={translator.t('forms.registerForm.terms.placeholder')}
              className="form-check-input"
              required
            />
            <label className="form-check-label" htmlFor="terms">
              <NextLink
                title={translator.t('forms.registerForm.terms.label')}
                href="/terms-and-conditions"
                className="hover"
              />
            </label>
          </div>
        </div>

        <div className="col-12 text-center">
          <input type="submit" value={translator.t('forms.registerForm.submit.title')} className="btn btn-primary rounded-pill btn-send mb-3" />
          <p className="text-muted">
            <strong>*</strong> {translator.t('forms.registerForm.submit.subtitle')}
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm1;
