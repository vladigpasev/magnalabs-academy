import { sql } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

interface Option {
  value: string;
}

interface Question {
  content: string;
  type: string;
  options: Option[];
}

interface Form {
  title: string;
  description: string;
  questions: Question[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authentication
  function auth () {
    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;
        if (!token) throw new Error();

        jwt.verify(token, process.env.JWT_SECRET);
        return (true);
    } catch (err) {
        return (false);
    }
}
const isAuthenticated = auth();

  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const client = await sql.connect();

  try {
    const { title, description, questions }: Form = req.body;

    // Validate the form structure here if necessary

    // Insert the form into the Forms table and retrieve the form ID
    const formInsertResult = await client.sql`INSERT INTO forms (title, createddate) VALUES (${title}, NOW()) RETURNING formid;`;
    const formId = formInsertResult.rows[0].formid;

    // Iterate over each question and insert them into the Questions table
    for (const question of questions) {
        const questionInsertResult = await client.sql`INSERT INTO questions (formid, questiontext, questiontype) VALUES (${formId}, ${question.content}, ${question.type}) RETURNING questionid;`;
        const questionId = questionInsertResult.rows[0].questionid;
      
        // If the question has options, insert them into the QuestionOptions table
        if (question.options && question.options.length > 0) {
          for (const option of question.options) {
            if (option) { // Ensure that the option value is not null or undefined
                //@ts-ignore
              await client.sql`INSERT INTO questionoptions (questionid, optiontext) VALUES (${questionId}, ${option});`;
            }
          }
        }
      }
      

    client.release();
    res.status(200).json({ message: 'Form created successfully' });
  } catch (error) {
    console.error(error);
    client.release();
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
