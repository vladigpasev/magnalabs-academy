import {FC, useContext, useEffect, useState} from "react";
import SurveyDataContext, {
  Survey,
  SurveyQuestionType,
  SurveyQuestionValueType
} from "../../modules/surveyData/SurveyDataContext";
import TranslatorContext from "../../modules/translator/TranslatorContext";
import Input1 from "../inputs/Input1";
import Submit1 from "../submits/Submit1";
import {doc, getDoc, onSnapshot, setDoc} from 'firebase/firestore';
import Firestore from '../../modules/firebase/Firestore';
import UserContext from '../../modules/user/UserContext';

interface SurveyForm1Props {
  className?: string;
}

const defaultValues: {
  [key in SurveyQuestionType]: SurveyQuestionValueType|null
} = {
  text: null,
  radio: null,
};

const FORM_ID = 'surveyForm';

const SurveyForm1: FC<SurveyForm1Props> = ({ className = '' }) => {
  const { surveyData } = useContext(SurveyDataContext);
  const translator = useContext(TranslatorContext);
  const { user, setUser } = useContext(UserContext);
  const [activeSurvey, setActiveSurvey] = useState<Survey|null>(null);
  const [existingAnswers, setExistingAnswers] = useState<{
    [questionId: string]: SurveyQuestionValueType|null;
  }|null>(null);
  const [answers, setAnswers] = useState<{
    [questionId: string]: SurveyQuestionValueType|null;
  }>({});

  useEffect(() => {
    if (surveyData === null) {
      return;
    }
    const newActiveSurvey = surveyData.surveys.find(survey => survey.id === surveyData.activeSurveyId);
    if (!newActiveSurvey) {
      return;
    }
    setActiveSurvey(newActiveSurvey);
  }, [surveyData]);

  useEffect(() => {
    if (activeSurvey === null) {
      return;
    }
    const newAnswers = activeSurvey.questions.reduce((answers, question) => ({
      ...answers,
      [question.id]: defaultValues[question.type],
    }), {});
    setAnswers(newAnswers);
  }, [activeSurvey]);

  useEffect(() => {
    if (user === null || activeSurvey === null) {
      return;
    }
    const docRef = doc(Firestore, "answers", `${user.username}-${activeSurvey.id}`);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setExistingAnswers(docSnap.data());
      }
      else {
        setExistingAnswers(null);
      }
    });
    return () => unsub();
  }, [user, activeSurvey]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (user === null || activeSurvey === null) {
      return;
    }
    setDoc(doc(Firestore, "answers", `${user.username}-${activeSurvey.id}`), answers, {
      merge: true,
    });
  };

  if (activeSurvey === null || Object.keys(answers).length === 0) {
    return null;
  }

  if (existingAnswers !== null) {
    return (
      <h1
        className="text-center"
      >
        { translator.t(`forms.${FORM_ID}.completed`) }
      </h1>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {
          activeSurvey.questions.map((question, index) => (
            <div
              key={question.id}
            >
              <div
                className="col-12"
              >
                <Input1
                  id={question.id}
                  formId={FORM_ID}
                  value={answers[question.id]}
                  setValue={(newValue) => {
                    setAnswers({
                      ...answers,
                      [question.id]: newValue,
                    })
                  }}
                  inputType={question.type}
                  options={question.options}
                  isRequired={question?.isRequired}
                  index={index + 1}
                />
              </div>
              <div
                className="col-12 m-0 p-0"
              >
                <hr
                  className="m-0 p-0 my-7"
                />
              </div>
            </div>
          ))
        }
        <div className="col-12 text-center">
          <Submit1
            formId={FORM_ID}
          />
        </div>
      </div>
    </form>
  );
};

export default SurveyForm1;
