import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


import {
    User
} from '../models/user';
import {
    JWT_KEY
} from '../lib/contance';
import {
    ROLES
} from '../lib/role.contance'

//SIGNUP /test ok
const signup = role => (req, res, next) => {
    console.log('=== user - signup')
    const {
        user
    } = req.body;
    console.log(user)
    let newUser = new User(user);
    newUser.role = role;
    newUser.save()
        .then(_user => {
            const {
                email,
                name,
                role
            } = _user;
            const user = {
                email,
                name,
                role
            }
            res.send({
                user: user
            });
        })
        .catch(error => {
            res.status(400).send(error);
        })
}

//LOGIN /test ok
const login = (role) => (req, res, next) => {
    const {
        user
    } = req.body;
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
        const {
            _id,
            name,
            email,
            role
        } = _user;
        const userOutput = {
            _id,
            name,
            email,
            role
        };
        const token = jwt.sign(userOutput, JWT_KEY, {
            expiresIn: "15d"
        });
        res.send({
            user: userOutput,
            token
        });
    })
}

//PUT
const put = (req, res, next) => {
    const userId = req.params.userId;

    //validate id:
    if (!ObjectId.isValid(userId)) {
        res.status(404).send();
    }

    // good to go:
    const {
        user
    } = req.body;

    // bcrypt password:
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            console.log(`=== UserSchema.pre save have error when encrupt password`)
            return next(err)
        }
        //req.userData._id is get from access_token, not get id from req.params.userId !importance
        User.findByIdAndUpdate(req.userData._id, {
            $set: {
                password: hash,
                editAt: Date.now()
            }
        }, {
                new: true
            })
            .then(user => {
                if (!user) {
                    res.status(404).send();
                }
                res.status(200).send();
            })
            .catch(error => res.status(400).send(error));
    })
}

//DELETE
const remove = (req, res, next) => {
    console.log(`=== user remove`)
    const userEmail = req.params.userEmail;
    console.log(userEmail)

    //only admin can remove, and only remove someone with role: ROLES.admin.secondary
    User.findOneAndRemove({
        email: userEmail,
        role: ROLES.admin.secondary
    })
        .then(user => res.send(user))
        .catch(error => res.status(404).send(error))
}

//GET / test ok.
const gets = (role) => (req, res, next) => {
    let query = {}
    if(role === 'admin'){
        Object.assign(query, {role: ROLES.admin.secondary});
    }else{
        Object.assign(query, {$or: [{role: ROLES.regular.new}, {role: ROLES.regular.usually}]})
    }
    User.find(query)
        .then(users => {
            console.log(users)
            return users.map(_user => {
                const { _id, email, name, role } = _user;
                return { _id, email, name, role };
            })
        })
        .then(users => {
            res.send(users);
        })
        .catch(error => {
            res.send(error);
        })
}

module.exports = {
    signup,
    login,
    put,
    remove,
    gets
}