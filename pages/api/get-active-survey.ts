import { sql } from '@vercel/postgres';
//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

//@ts-ignore
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    // Change to a GET request for fetching data
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token_user;
    if (!token) throw new Error('No token provided');

    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id, valid } = decoded;

    // Check if the token's valid flag is false
    if (!valid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch the active survey from the database
    const formResult = await sql`SELECT * FROM forms WHERE active = true LIMIT 1;`;
    const survey = formResult.rows[0];
    if (!survey) {
      return res.status(404).json({ error: 'Active survey not found' });
    }

    // Fetch related questions for the active survey
    const questionsResult = await sql`SELECT * FROM questions WHERE formid = ${survey.formid};`;
    const questions = questionsResult.rows;

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