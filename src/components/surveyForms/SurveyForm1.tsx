import { FC, useEffect, useState } from "react";
import axios from 'axios';

interface SurveyQuestion {
  questionid: number;
  questiontext: string;
  questiontype: 'freeResponse' | 'checkbox' | 'multipleChoice';
  options: Array<{ optionid: number; optiontext: string }>;
}

interface Survey {
  formid: number;
  title: string;
  questions: SurveyQuestion[];
}

interface SurveyForm1Props {
  className?: string;
  userId: string;
}

const SurveyForm1: FC<SurveyForm1Props> = ({ className = '', userId }) => {
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [errors, setErrors] = useState<{ [questionId: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    message: ''
  });

  useEffect(() => {
    axios.get('/api/get-active-survey')
      .then(response => {
        const fetchedSurvey = response.data;
        setActiveSurvey(fetchedSurvey);
        //@ts-ignore
        const initialAnswers = fetchedSurvey.questions.reduce((acc, question) => ({
          ...acc,
          [question.questionid]: question.questiontype === 'multipleChoice' ? [] : '',
        }), {});
        setAnswers(initialAnswers);
      })
      .catch(error => console.error('Error fetching active survey:', error));
  }, []);
//@ts-ignore
  const handleCheckboxChange = (questionId, option, isChecked) => {
    const updatedAnswers = isChecked 
      ? [...answers[questionId], option]
      //@ts-ignore
      : answers[questionId].filter(item => item !== option);
    setAnswers({ ...answers, [questionId]: updatedAnswers });
  };
//@ts-ignore
  const renderInput = (question) => {
    switch (question.questiontype) {
      case 'freeResponse':
        return (
          <input
            type="text"
            className="form-control"
            value={answers[question.questionid] || ''}
            onChange={(e) => setAnswers({ ...answers, [question.questionid]: e.target.value })}
          />
        );
      case 'checkbox':
        return (
          <div>
            
            {
            //@ts-ignore
            question.options?.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${question.questionid}`}
                  id={`option-${option.optionid}`}
                  value={option.optiontext}
                  checked={answers[question.questionid] === option.optiontext}
                  onChange={(e) => setAnswers({ ...answers, [question.questionid]: e.target.value })}
                />
                <label className="form-check-label" htmlFor={`option-${option.optionid}`}>
                  {option.optiontext}
                </label>
              </div>
            ))}
          </div>
        );
      case 'multipleChoice':
        return (
          <div>
            {//@ts-ignore
            question.options?.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`option-${option.optionid}`}
                  value={option.optiontext}
                  checked={answers[question.questionid]?.includes(option.optiontext)}
                  onChange={(e) => handleCheckboxChange(question.questionid, option.optiontext, e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`option-${option.optionid}`}>
                  {option.optiontext}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const validateAnswers = () => {
    let isValid = true;
    let newErrors = {};
//@ts-ignore
    for (const question of activeSurvey.questions) {
      const answer = answers[question.questionid];
      if (question.questiontype === 'freeResponse' && !answer) {
        //@ts-ignore
        newErrors[question.questionid] = 'This field is required';
        isValid = false;
      } else if ((question.questiontype === 'checkbox' || question.questiontype === 'multipleChoice') && (!answer || answer.length === 0)) {
        //@ts-ignore
        newErrors[question.questionid] = 'Please select at least one option';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearForm = () => {
    const clearedAnswers = Object.keys(answers).reduce((acc, questionId) => ({
      ...acc,
      [questionId]: null,
    }), {});
    setAnswers(clearedAnswers);
  };
//@ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId || !activeSurvey) {
      console.error('Submission failed: User or Survey not defined');
      return;
    }

    if (!validateAnswers()) {
      setSubmissionStatus({ success: false, message: 'Please correct the errors before submitting.' });
      return;
    }

    try {
      const submissionData = {
        userId: userId,
        formId: activeSurvey.formid,
        answers
      };

      await axios.post('/api/submit-form', submissionData);
      setSubmissionStatus({ success: true, message: 'Успешно подадохте формата!' });
      clearForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus({ success: false, message: 'Възникна грешка' });
    }
  };

  if (!activeSurvey) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={`row ${className}`}>
      {submissionStatus.success && (
        <div className="alert alert-success" role="alert">
          {submissionStatus.message}
        </div>
      )}
      {activeSurvey.questions.map((question, index) => (
        <div key={question.questionid} className="col-12">
          <label htmlFor={`question-${question.questionid}`}>
            {index + 1}. {question.questiontext}
          </label>
          {renderInput(question)}
          {errors[question.questionid] && <div className="error-message text-red-500">{errors[question.questionid]}</div>}
          <hr className="my-4" />
        </div>
      ))}
      <div className="col-12 text-center">
      <button type="submit" className="btn btn-primary">Подай</button>
      </div>
    </form>
  );
};

export default SurveyForm1;
