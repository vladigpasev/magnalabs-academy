// pages/admin/surveys/[id]/responses.js

import Router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const SurveyResponses = () => {
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        axios
            .get('/api/admin/authenticated')
            .then((response) => {
                if (!response.data.authenticated) {
                    Router.push('/admin/login');
                } else {
                    return;
                }
            })
            .catch(() => Router.push('/admin/login'));
    }, []);

    useEffect(() => {
        if (id) {
            axios.get(`/api/admin/get-responses?id=${id}`)
                .then(response => {
                    setResponses(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching survey responses:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    const handleExportClick = async () => {
        const newWindow = window.open(`/api/admin/export-responses?id=${id}`, '_blank');
      
        if (newWindow) {
          // Check if the browser allows us to close the window
          try {
            // Wait for a short period to ensure the file starts downloading
            await new Promise(resolve => setTimeout(resolve, 1000)); // 2 seconds
            newWindow.close();
          } catch (e) {
            console.error("Couldn't close the new window automatically:", e);
          }
        }
      };
      
    return (
        <div className="container mx-auto p-4">
            <Link href={`/admin/surveys/${id}`}>Back to survey questions</Link>
            <br /><br />
            {/* <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">Survey #{id} Responses</h1> */}
            <button
                onClick={handleExportClick}
                className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Export to Excel
            </button>

            {responses.map((userResponse, index) => (
                <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    {/*@ts-ignore*/}
                    <h2 className="text-xl font-semibold mb-2">{userResponse.firstName} {userResponse.lastName}</h2>
                    {/*@ts-ignore*/}
                    <p className="text-sm text-gray-600 mb-1">Email: {userResponse.email}</p>
                    {/*@ts-ignore*/}
                    <p className="text-sm text-gray-600 mb-1">City: {userResponse.city}</p>
                    {/*@ts-ignore*/}
                    <p className="text-sm text-gray-600 mb-1">Pharmacy: {userResponse.pharmacy}</p>
                    {/*@ts-ignore*/}
                    <p className="text-sm text-gray-600 mb-4">Phone: {userResponse.phone}</p>
                    <div className="border-t border-gray-300 pt-2">
                        {/*@ts-ignore*/}
                        {userResponse.responses.map((resp, responseIndex) => (
                            <p key={responseIndex} className="text-sm mb-1">
                                <span className="font-semibold">{resp.question}</span>: {resp.response}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SurveyResponses;
