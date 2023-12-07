//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';
import { sql } from '@vercel/postgres';
//@ts-ignore
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  function auth() {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.token;
      if (!token) throw new Error();

      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Check for authentication
  const isAuthenticated = auth();
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.body;

    // Fetch the specific survey from the database
    const formResult = await sql`SELECT * FROM forms WHERE formid = ${id};`;
    const survey = formResult.rows[0]; // Accessing the first row of the result
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Fetch related questions for the survey
    const questionsResult = await sql`SELECT * FROM questions WHERE formid = ${id};`;
    const questions = questionsResult.rows; // Assuming that the result has a 'rows' property

    // Fetch options for each question
    const questionsWithOptions = await Promise.all(questions.map(async (question) => {
      const optionsResult = await sql`SELECT * FROM questionoptions WHERE questionid = ${question.questionid};`;
      return { ...question, options: optionsResult.rows };
    }));

    res.status(200).json({ ...survey, questions: questionsWithOptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}