import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Navbar from 'components/admin/Navbar';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get('/api/admin/authenticated')
      .then((response) => {
        if (!response.data.authenticated) {
          Router.push('/admin/login');useEffect(() => {
            axios
              .get('/api/admin/authenticated')
              .then((response) => {
                if (!response.data.authenticated) {
                  Router.push('/admin/login');
                } else {
                }
              })
              .catch(() => Router.push('/admin/login'));
          }, []);
        } else {
        }
      })
      .catch(() => Router.push('/admin/login'));
  }, []);

  const addQuestion = () => {
    {/* @ts-ignore */ }
    setQuestions([...questions, { type: 'freeResponse', content: '', options: [] }]);
  };
{/* @ts-ignore */ }
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };
{/* @ts-ignore */ }
  const changeQuestionType = (index, type) => {
    const updatedQuestions = [...questions];
    {/* @ts-ignore */ }
    updatedQuestions[index].type = type;
    if (type === 'freeResponse') {
        {/* @ts-ignore */ }
      updatedQuestions[index].options = [];
      {/* @ts-ignore */ }
    } else if (!updatedQuestions[index].options.length) {
        {/* @ts-ignore */ }
      updatedQuestions[index].options = [''];
    }
    setQuestions(updatedQuestions);
  };
{/* @ts-ignore */ }
  const handleQuestionChange = (index, content) => {
    const updatedQuestions = [...questions];
    {/* @ts-ignore */ }
    updatedQuestions[index].content = content;
    setQuestions(updatedQuestions);
  };
{/* @ts-ignore */ }
  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    {/* @ts-ignore */ }
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };
{/* @ts-ignore */ }
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    {/* @ts-ignore */ }
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };
{/* @ts-ignore */ }
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    {/* @ts-ignore */ }
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };
{/* @ts-ignore */ }
const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading

    try {
      await axios.post('/api/admin/new-form', { title, questions });
      Router.push('/admin/surveys'); // Redirect on success
    } catch (error) {
      console.error('Error submitting form', error);
      setIsLoading(false); // Stop loading on error
    }
  };



  const questionTypeOptions = ['freeResponse', 'multipleChoice', 'checkbox'];

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create New Survey</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter survey title"
              required
            />
          </div>
          {questions.map((question, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <select
                /* @ts-ignore */
                  value={question.type}
                  onChange={(e) => changeQuestionType(index, e.target.value)}
                  className="rounded-md border-gray-300 p-2"
                >
                  {questionTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-700">Remove</button>
              </div>
              <input 
                type="text" 
                placeholder="Question"
                /* @ts-ignore */ 
                value={question.content}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              />
              {/* @ts-ignore */ }
              {['checkbox', 'multipleChoice'].includes(question.type) && (
                <div className="mt-2 space-y-2">
                    {/* @ts-ignore */ }
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input 
                        type="text" 
                        placeholder="Option"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                      <button type="button" onClick={() => removeOption(index, optionIndex)} className="text-red-500 hover:text-red-700 ml-2">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(index)} className="text-blue-500 hover:text-blue-700">Add Option</button>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50">Add Question</button>
          <button 
            type="submit" 
            disabled={isLoading} // Disable button when loading
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? 'Loading...' : 'Submit Survey'} {/* Change button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
}
