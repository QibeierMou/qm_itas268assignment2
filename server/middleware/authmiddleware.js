import jwt from'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

function auth (req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    }

    function checkRole (roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
            }
        next();
        };
    }

export { auth, checkRole };
