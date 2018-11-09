import jwt from 'jsonwebtoken';
import { JWT_KEY, ROLES } from '../contance';

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        const decodeToken = jwt.verify(token, JWT_KEY);
        req.userData = decodeToken;
        console.log(`checkAuth success - user is: ${JSON.stringify(req.userData)}`)
        next();
    } catch (error) {
        res.status(401).json({ message: 'auth fail' });
    }
}

const checkAdmin = (req, res, next) => {
    if (req.userData.role === ROLES.admin.primary || req.userData.role === ROLES.admin.secondary) {
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