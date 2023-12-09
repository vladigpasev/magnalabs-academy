import { FC, useContext, useEffect, useState } from 'react';
import TranslatorContext from '../../modules/translator/TranslatorContext';
import Router from 'next/router';
import axios from 'axios';

const LoginForm1: FC = () => {
  const translator = useContext(TranslatorContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);

  useEffect(() => {
    axios
      .get('/api/authenticated')
      .then((response) => {
        if (!response.data.authenticated) {
          return;
        } else {
          if (!response.data.valid) {
            Router.push('/register');
          } else {
            Router.push('/');
          }
        }
      })
      .catch(() => {return;});
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        if (data.valid) {
          Router.push('/'); // Redirect to root if valid is true
        } else {
          Router.push('/register'); // Redirect to register if valid is false
        }
        setIsAlertSuccess(true);
      } else {
        setIsAlertSuccess(false);
        // Handle login error
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
                  {translator.t(`forms.loginForm._response.${isAlertSuccess ? 'success' : 'danger'}`)}
                </div>
              </div>
            )
          ) : null
        }

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder={translator.t('forms.loginForm.username.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-username">{translator.t('forms.loginForm.username.label')}</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder={translator.t('forms.loginForm.password.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-password">{translator.t('forms.loginForm.password.label')}</label>
          </div>
        </div>

        <div className="col-12 text-center">
          <input type="submit" value={translator.t('forms.loginForm.submit.title')} className="btn btn-primary rounded-pill btn-send mb-3" />
          <p className="text-muted">
            <strong>*</strong> {translator.t('forms.loginForm.submit.subtitle')}
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm1;
