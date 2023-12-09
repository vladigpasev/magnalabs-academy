import { db } from '@vercel/postgres';
//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';
//@ts-ignore
async function login(req, res) {
    if (req.method !== 'POST') {
        console.log('You should make a post request!');
        return res.status(405).json({ error: 'You should make a post request!' });
    }

    const { username, password } = req.body;

    try {
        // Create a connection to the database
        const client = await db.connect();

        const { rows } = await client.sql`SELECT * FROM users WHERE username = ${username} AND password = ${password};`;

        if (rows.length === 0) {
            // User not found or password is incorrect
            console.log('Invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Assuming 'valid' is a column in your users table
        const user = rows[0];
        const valid = user.valid;
        const user_id = user.id;

        // User is found, generate JWT token
        // Include the 'valid' field in the token payload
        const token = jwt.sign({ user_id: user_id, valid: valid }, process.env.JWT_SECRET, { expiresIn: '1d' });


        // Set the token in a cookie using cookie.serialize
        res.setHeader('Set-Cookie', cookie.serialize('token_user', token, {
            httpOnly: true,
            maxAge: 86400, // 1 day in seconds
            path: '/',
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict'
        }));

        console.log('Logged in successfully');
        return res.status(200).json({ message: 'Logged in successfully', valid:valid });
    } catch (error) {
        console.error(error);
        console.log('Internal server error');
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default login;
