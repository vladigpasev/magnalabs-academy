//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';
import { createClient } from '@vercel/postgres';
//@ts-ignore
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

// Check for authentication
const isAuthenticated = auth();

  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = createClient();
  await client.connect();

  try {
    const { id } = req.body;

    // Begin transaction
    await client.query('BEGIN');

    // Set all forms to inactive
    await client.sql`UPDATE forms SET active = false`;

    // Activate the selected form
    await client.sql`UPDATE forms SET active = true WHERE formid = ${id}`;

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({ message: 'Form activated successfully' });
  } catch (error) {
    console.error(error);

    // Rollback transaction in case of error
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    } finally {
      await client.end(); // Ensure the client is closed in the finally block
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
}
