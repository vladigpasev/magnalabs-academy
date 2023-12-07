import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from 'components/admin/Navbar';

export default function SurveySettings() {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios.post(`/api/admin/get-survey`, { id })
        .then(response => {
          setSurvey(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching survey data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleActivate = () => {
    axios.post(`/api/admin/activate-form`, { id })
      .then(() => {
        //@ts-ignore
        setSurvey({ ...survey, active: true }); // Update survey state to reflect activation
      })
      .catch(error => {
        console.error('Error activating survey:', error);
      });
  };

  if (loading) {
    return <div className="text-center mt-4"><p>Loading...</p></div>;
  }

  if (!survey) {
    return <div className="text-center mt-4"><p>No survey data found.</p></div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 mt-4">
        {/* @ts-ignore */ }
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{survey.title}</h2>
        <button 
          onClick={handleActivate} 
          /* @ts-ignore */
          disabled={survey.active} 
          /* @ts-ignore */
          className={`mb-4 px-4 py-2 rounded text-white font-bold ${survey.active ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Activate
        </button>
        <div className="space-y-4">
            {/* @ts-ignore */}
          {survey.questions.map((question, index) => (
            <div key={index} className="border p-4 rounded-lg bg-white shadow">
              <div>{question.questiontype}</div>
              <h3 className="text-lg font-medium text-gray-700">Question {index + 1}: {question.questiontext}</h3>
              <ul className="list-disc list-inside">
                {/* @ts-ignore */}
                {question.options.map((option, optIndex) => (
                  <li key={optIndex} className="text-gray-600">Option: {option.optiontext}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
