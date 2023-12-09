import { sql } from '@vercel/postgres';
//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';
//@ts-ignore
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token_user;
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = decoded;

    // Verify if the user is authenticated
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get data from the request body
    const { firstName, lastName, email, phone, city, pharmacy, uid } = req.body;

    // Construct the query
    const query = {
      text: `
        UPDATE users 
        SET 
          valid = true,
          user_name = $1,
          surname = $2,
          phone = $3,
          city = $4,
          pharmacy = $5,
          pharmacy_uid = $6,
          email = $7,
          updated_at = NOW()
        WHERE id = $8
      `,
      values: [firstName, lastName, phone, city, pharmacy, uid, email, user_id],
    };

    // Connect to the database and run the query
    const client = await sql.connect();
    await client.query(query);
    client.release();

    // Update the token with 'valid' set to true
    const newToken = jwt.sign({ user_id, valid: true }, process.env.JWT_SECRET, {
      expiresIn: '1d' // or your desired expiration time
    });

    // Set the new token in the cookie
    res.setHeader('Set-Cookie', cookie.serialize('token_user', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 86400, // 1 hour
      sameSite: 'strict',
      path: '/'
    }));

    // Send the response
    res.status(200).json({ message: 'User updated successfully', token: newToken });
  } catch (err) {
    //@ts-ignore
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}