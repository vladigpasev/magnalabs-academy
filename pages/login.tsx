import LoginForm1 from "../src/components/loginForms/LoginForm1";
import NextLink from "../src/components/links/NextLink";
import {useContext} from "react";
import TranslatorContext from "../src/modules/translator/TranslatorContext";

export default function Login() {
  const translator = useContext(TranslatorContext);

  return (
    <div className="row">
      <div className="col-lg-7 col-xl-6 col-xxl-5 mx-auto mt-n20">
        <div className="card">
          <div className="card-body p-7 p-lg-11 text-center">
            <LoginForm1/>
          </div>
        </div>
      </div>
    </div>
  );
}
