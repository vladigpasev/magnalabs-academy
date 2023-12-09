//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

//@ts-ignore
export default function handler(req, res) {
    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token_user;
        if (!token) throw new Error();

        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract the 'username' and 'valid' values from the token payload
        const { user_id, valid } = decoded;

        res.status(200).json({ authenticated: true, user_id, valid });
    } catch (err) {
        res.status(200).json({ authenticated: false });
    }
}
