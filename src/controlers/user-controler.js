import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { ROLES, JWT_KEY } from '../lib/contance';

//SIGNUP /test ok
const signup = role => (req, res, next) => {
    console.log('=== user - signup')
    const { user } = req.body;
    console.log(user)
    let newUser = new User(user);
    newUser.role = role;
    newUser.save()
        .then(_user => {
            const { email, name, role } = _user;
            const user = { email, name, role }
            res.send({ user: user });
        })
        .catch(error => {
            res.status(400).send(error);
        })
}

//LOGIN /test ok
// note: role is string regular or admin, not get from ROLES object.
const login = (role) => (req, res, next) => {
    const { user } = req.body;
    User.authenticate(role)(user, (err, _user) => {
        console.log(`=== authenticate - run call back`)
        if (err) {
            return res.status(400).send(err);
            console.log(`=== /api/login - err`)
        }
        if (!_user) {
            console.log(`=== authenticate - get user but null`)
            return res.status(404).send();
        }
        const { _id, name, email, role } = _user;
        const userOutput = { _id, name, email, role };
        const token = jwt.sign(userOutput, JWT_KEY, { expiresIn: "15d" });
        res.send({ user: userOutput, token });
    })
}


module.exports = {
    signup,
    login
}