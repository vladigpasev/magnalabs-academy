import { FC, useContext, useState } from 'react';
import TranslatorContext from '../../modules/translator/TranslatorContext';
import {doc, getDoc} from 'firebase/firestore';
import Firestore from '../../modules/firebase/Firestore';
import {useRouter} from 'next/router';

const ResetPasswordForm1: FC = () => {
  const translator = useContext(TranslatorContext);
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const docRef = doc(Firestore, "users", username);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const user = docSnap.data();
        if ('email' in user) {
          fetch('/api/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              locale: translator.locale,
            }),
          }).then((response) => {
            if (response.status === 200) {
              setUsername('');
              setIsAlertSuccess(true);
              setIsAlertVisible(true);
              setTimeout(() => {
                router.push({
                  pathname: '/login',
                });
              }, 3000);
            }
            else {
              setIsAlertSuccess(false);
              setIsAlertVisible(true);
            }
          });
        }
        else {
          setIsAlertSuccess(false);
          setIsAlertVisible(true);
        }
      }
      else {
        setIsAlertSuccess(false);
        setIsAlertVisible(true);
      }
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
                <div className={`alert alert-${isAlertSuccess ? 'success' : 'danger'}`} role="alert">
                  {translator.t(`forms.resetPasswordForm._response.${isAlertSuccess ? 'success' : 'danger'}`)}
                </div>
              </div>
            )
          ) : null
        }

        <div className="col-12">
          <div className="form-floating mb-4">
            <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder={translator.t('forms.resetPasswordForm.username.placeholder')} className="form-control" required />
            <label htmlFor="contact_form-username">{translator.t('forms.resetPasswordForm.username.label')}</label>
          </div>
        </div>

        <div className="col-12 text-center">
          <input type="submit" value={translator.t('forms.resetPasswordForm.submit.title')} className="btn btn-primary rounded-pill btn-send mb-3" />
          <p className="text-muted">
            <strong>*</strong> {translator.t('forms.resetPasswordForm.submit.subtitle')}
          </p>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm1;
