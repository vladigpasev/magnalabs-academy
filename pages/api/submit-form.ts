import { createClient } from '@vercel/postgres';
//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';
//@ts-ignore
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const client = createClient();

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

    await client.connect();

    const { userId, formId, answers } = req.body;

    for (const [questionId, response] of Object.entries(answers)) {
      if (Array.isArray(response)) {
        // Handle multipleChoice responses
        for (const optionText of response) {
          // Insert each selected option with the formId
          await client.sql`
            INSERT INTO responses (formid, questionid, userid, answertext)
            VALUES (${formId}, ${questionId}, ${userId}, ${optionText})
          `;
        }
      } else {
        // Handle freeResponse and checkbox responses
        const answertext = response;
        await client.sql`
          INSERT INTO responses (formid, questionid, userid, answertext)
          VALUES (${formId}, ${questionId}, ${userId}, 
            ${/*@ts-ignore*/ 
          answertext})
        `;
      }
    }

    res.status(200).json({ message: 'Responses submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}
