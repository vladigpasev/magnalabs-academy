//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

import { sql } from '@vercel/postgres';

{/* @ts-ignore */}
export default async function handler(req, res) {
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

  try {
    // Fetch forms from the database
    const { rows } = await sql`
    SELECT * FROM forms 
    ORDER BY 
        CASE 
            WHEN active = true THEN 0 
            ELSE 1 
        END, 
        formid desc;
`;

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
