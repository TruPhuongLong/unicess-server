import jwt from 'jsonwebtoken'
import {
    ObjectId
} from 'mongodb';
import bcrypt from 'bcrypt';

import {
    JWT_KEY
} from '../lib/contance';
import {
    ROLES
} from '../lib/role.contance';
import {
    User
} from '../models/user';
import {
    checkAuth,
    checkAdmin,
    checkAdminPrimary
} from '../lib/middlewares/auth.middleware';
import UserControler from '../controlers/user-controler';

const userRouter = router => {

    //POST / signup: test ok
    router.post('/api/signup', UserControler.signup(ROLES.regular.new))

    //POST / login: test ok
    router.post('/api/login', UserControler.login('regular'));

    //GET /get list regular users
    router.get('/api/users', [checkAuth, checkAdmin], UserControler.gets('regular'))

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



    //===============Admin===============
    // POST / login: test ok
    router.post('/api/admin/login', UserControler.login('admin'));

    //POST / signup: test ok
    router.post('/api/admin/signupWithPermit', [checkAuth, checkAdminPrimary], UserControler.signup(ROLES.admin.secondary));

    //PUT change password. /test ok
    router.put('/api/admin/:userId', [checkAuth, checkAdmin], UserControler.put)

    //DELETE adminSecondary , can't delete adminPrimary, and only adminPrimary can do this: test ok.
    router.delete('/api/admin/:userEmail', [checkAuth, checkAdminPrimary], UserControler.remove);

    //GET /get list secondary admin users 
    router.get('/api/admin/users', [checkAuth, checkAdminPrimary], UserControler.gets('admin'))

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

module.exports = {
    userRouter
}