import { FC, useContext, useState } from 'react';
import TranslatorContext from '../../modules/translator/TranslatorContext';
import UserContext, {User} from "../../modules/user/UserContext";
import UserProvider from '../../modules/user/UserProvider';
import { doc, setDoc, getDoc } from "firebase/firestore";
import Firestore from "../../modules/firebase/Firestore";

const LoginForm1: FC = () => {
  const translator = useContext(TranslatorContext);
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (
      UserProvider.getUsernames().includes(username) &&
      password === 'magna'
    ) {
      setIsAlertSuccess(true);
      setIsAlertVisible(true);
      setTimeout(() => {
        const docRef = doc(Firestore, "users", username);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const user = docSnap.data();
            if (
              'firstName' in user &&
              'lastName' in user &&
              'email' in user &&
              'phone' in user &&
              'city' in user &&
              'pharmacy' in user &&
              'uid' in user
            ) {
              setUser({
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                city: user.city,
                pharmacy: user.pharmacy,
                uid: user.uid,
              });
            }
            else {
              setUser({
                username: user.username,
                password: user.password,
              });
            }
          }
          else {
            const newUser: User = {
              username,
              password,
            };
            setDoc(doc(Firestore, "users", username), newUser, {
              merge: true,
            }).then(() => {
              setUser(newUser)
            });
          }
        });
      }, 3000);
    }
    else {
      setIsAlertSuccess(false);
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
