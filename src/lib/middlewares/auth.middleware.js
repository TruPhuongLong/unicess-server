import jwt from 'jsonwebtoken';
import { JWT_KEY, ROLES, HEADER_ACCESS_TOKEN } from '../contance';

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers[HEADER_ACCESS_TOKEN];
        const decodeToken = jwt.verify(token, JWT_KEY);
        req.userData = decodeToken;
        console.log(`checkAuth success - user is: ${JSON.stringify(req.userData)}`)
        next();
    } catch (error) {
        res.status(401).json({ message: 'auth fail' });
    }
}

const checkAdmin = (req, res, next) => {
    if (Object.values(ROLES.admin).indexOf(req.userData.role) !== -1) {
        console.log(`=== checkAdmin success - `)
        next();
    } else {
        res.status(401).json({ message: 'not admin' });
    }
}

const checkAdminPrimary = (req, res, next) => {
    if (req.userData.role === ROLES.admin.primary) {
        console.log(`=== checkAdmin success - `)
        next();
    } else {
        res.status(401).json({ message: 'not admin primary' });
    }
}

module.exports = { checkAuth, checkAdmin, checkAdminPrimary };