//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

//@ts-ignore
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600,
                sameSite: 'strict',
                path: '/'
            }));

            return res.status(200).json({ message: 'Authentication successful' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
