import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';

import { JWT_KEY, ROLES } from '../lib/contance';
import { User } from '../models/user';
import { checkAuth, checkAdmin } from '../lib/middlewares/auth.middleware';

const userRouter = router => {

    //POST / signup: test ok
    router.post('/api/signup', (req, res) => {
        console.log('=== route user - post - signup')
        const { user } = req.body;
        console.log(user)
        let newUser = new User(user);
        userInput.createAt = Date.now();
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

    //POST / signup:
    router.post('/api/admin/signupWithPermit', [checkAuth, checkAdmin], (req, res) => {
        const { user } = req.body;
        console.log(`=== add new admin is: ${JSON.stringify(user)}`)
        let newUser = new User(user);
        newUser.createAt = Date.now();
        newUser.role = ROLES.admin;
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

    // //PATH 
    // router.patch('/api/comments/:userId', (req, res)=>{
    //     const userId = req.params.userId;

    //     //validate id:
    //     if(!ObjectId.isValid(userId)){
    //         res.status(404).send();
    //     }

    //     // good to go:
    //     const {user} = req.body;
    //     user.editAt = Date.now();
    //     User.findByIdAndUpdate(userId, {$set: user}, {new: true})
    //     .then(_user => {
    //         if(!_user){
    //             res.status(404).send();
    //         }
    //         res.send(_user);
    //     })
    //     .catch(error => res.status(400).send(error));
    // });
}

module.exports = { userRouter }