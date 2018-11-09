import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import { JWT_KEY, ROLES } from '../lib/contance';
import { User } from '../models/user';
import { checkAuth, checkAdmin, checkAdminPrimary } from '../lib/middlewares/auth.middleware';

const userRouter = router => {

    //POST / signup: test ok
    router.post('/api/signup', (req, res) => {
        console.log('=== route user - post - signup')
        const { user } = req.body;
        console.log(user)
        let newUser = new User(user);
        newUser.role = ROLES.regular;
        newUser.save()
            .then(_user => {
                const { email, name, role } = _user;
                const user = { email, name, role }
                res.send({ user: user });
            })
            .catch(error => {
                res.status(400).send(error);
            })
    })

    //POST / login: test ok
    router.post('/api/login', (req, res) => {
        const { user } = req.body;
        User.authenticateOnlyEmail({ email: user.email }, (err, _user) => {
            console.log(`=== /api/login - run call back`)
            if (err) {
                return res.status(400).send(err);
                console.log(`=== /api/login - err`)
            }
            if (!_user) {
                console.log(`=== /api/login - get user but null`)
                return res.status(404).send();
            }
            const { _id, name, email, role } = _user;
            const user = { _id, name, email, role };
            const token = jwt.sign(user, JWT_KEY, { expiresIn: "15d" });
            res.send({ user, token });
        })
    });

    // // GET /logout
    // app.get('/api/logout', function (req, res, next) {
    //     if (req.session) {
    //         // delete session object
    //         req.session.destroy(function (err) {
    //             if (err) {
    //                 return next(err);
    //             } else {
    //                 return res.status(200).send();
    //             }
    //         });
    //     }
    // });

    // //GET /list users
    // router.get('/api/users', (req, res) => {
    //     User.find()
    //         .then(users => {
    //             return users.map(_user => {
    //                 const { _id, email, name, role } = _user;
    //                 return { _id, email, name, role };
    //             })
    //         })
    //         .then(users => {
    //             res.send(users);
    //         })
    //         .catch(error => {
    //             res.send(error);
    //         })
    // })


    //===============Admin===============
    // POST / login: test ok
    router.post('/api/admin/login', (req, res) => {
        const { user } = req.body;
        console.log(`=== /api/admin/login`)
        User.authenticate(user, (err, _user) => {
            if (err) {
                console.log(`=== /api/admin/login - err`)
                return res.status(400).send(err);
            }
            if (!_user) {
                return res.status(404).send();
            }
            const { _id, name, email, role } = _user;
            const user = { _id, name, email, role };
            const token = jwt.sign(user, JWT_KEY, { expiresIn: "15d" });
            return res.send({ user, token });
        })
    });

    //POST / signup: test ok
    router.post('/api/admin/signupWithPermit', [checkAuth, checkAdminPrimary], (req, res) => {
        const { user } = req.body;
        console.log(`=== add new admin is: ${JSON.stringify(user)}`)
        let newUser = new User(user);
        newUser.role = ROLES.admin.secondary;
        newUser.save()
            .then(_user => {
                const { email, name, role } = _user;
                const user = { email, name, role }
                console.log(`=== save success new admin`)
                return res.send({ user });
            })
            .catch(error => {
                console.log(error)
                res.status(400).send(error);
            })
    })

    //PUT change password. /test ok
    router.put('/api/admin/:userId', [checkAuth, checkAdmin], (req, res, next) => {
        const userId = req.params.userId;

        //validate id:
        if (!ObjectId.isValid(userId)) {
            res.status(404).send();
        }

        // good to go:
        const { user } = req.body;

        // bcrypt password:
        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                console.log(`=== UserSchema.pre save have error when encrupt password`)
                return next(err)
            }
            User.findByIdAndUpdate(req.userData._id, { $set: { password: hash, editAt: Date.now() } }, { new: true })
                .then(user => {
                    if (!user) {
                        res.status(404).send();
                    }
                    res.status(200).send();
                })
                .catch(error => res.status(400).send(error));
        })
    })

    //DELETE adminSecondary , can't delete adminPrimary, and only adminPrimary can do this: test ok.
    router.delete('/api/admin/:userEmail', [checkAuth, checkAdminPrimary], (req, res) => {
        console.log(`=== user delete`)
        const userEmail = req.params.userEmail;
        console.log(userEmail)

        User.findOneAndRemove({ email: userEmail, role: ROLES.admin.secondary })
            .then(user => res.send(user))
            .catch(error => res.status(404).send(error))

    });


    // // GET /logout
    // router.get('/api/admin/logout', function (req, res, next) {
    //     if (req.session) {
    //         // delete session object
    //         req.session.destroy(function (err) {
    //             if (err) {
    //                 return next(err);
    //             } else {
    //                 return res.status(200).send();
    //             }
    //         });
    //     }
    // });

}

module.exports = { userRouter }