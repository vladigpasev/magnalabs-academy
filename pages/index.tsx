import { useEffect, useState } from "react";
import SurveyForm1 from "../src/components/surveyForms/SurveyForm1";
import axios from "axios";
import Router from "next/router";

export default function Index() {
  const [userId, setUserId] = useState();
  useEffect(() => {
    axios
      .get('/api/authenticated')
      .then((response) => {
        if (!response.data.authenticated) {
          Router.push('/login');
        } else {
          if (!response.data.valid) {
            Router.push('/register');
          } else {
            setUserId(response.data.user_id);
            return;
          }
        }
      })
      .catch(() => Router.push('/login'));
  }, []);

  return (
    <div className="row">
      <div className="col-lg-10 mx-auto mt-n20">
        <div className="card">
          <div className="card-body p-9 p-lg-11">
            {userId && <SurveyForm1 userId={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
