//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

//@ts-ignore
export default function handler(req, res) {
    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;
        if (!token) throw new Error();

        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true });
    } catch (err) {
        res.status(200).json({ authenticated: false });
    }
}
