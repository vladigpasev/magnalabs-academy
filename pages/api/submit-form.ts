import { createClient } from '@vercel/postgres';
//@ts-ignore
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const client = createClient();

  try {
    await client.connect();

    const { userId, formId, answers } = req.body;

    for (const [questionId, response] of Object.entries(answers)) {
      if (Array.isArray(response)) {
        // Handle multipleChoice responses
        for (const optionText of response) {
          // Insert each selected option
          await client.sql`
            INSERT INTO responses (questionid, userid, answertext)
            VALUES (${questionId}, ${userId}, ${optionText})
          `;
        }
      } else {
        // Handle freeResponse and checkbox responses
        const answertext = response;
        await client.sql`
          INSERT INTO responses (questionid, userid, answertext)
          VALUES (${questionId}, ${userId}, 
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
