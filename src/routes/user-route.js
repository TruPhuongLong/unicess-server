import { User } from '../models/user';

const userRouter = router => {

    //POST / signup:
    router.post('/api/signup', (req, res) => {
        const body = req.body;
        let newUser = new User(body);
        newUser.save()
            .then(user => {
                const { email, name } = user;
                res.send({ email, name });
            })
            .catch(error => {
                res.status(400).send(error);
            })
    })

    //POST / login:
    router.post('/api/login', (req, res) => {
        const body = req.body;
        User.authenticate(body.email, (err, user) => {
            if (err) {
                res.status(400).send(err);
            }
            if (!user) {
                res.status(404).send();
            }
            const { _id, name, email } = user;
            const _user = { _id, name, email };
            res.send({ _user });
        })
    });

    //GET /list users
    router.get('/api/users', (req, res) => {
        User.find()
            .then(users => {
                return users.map(user => {
                    const { _id, email, name } = user;
                    return { _id, email, name };
                })
            })
            .then(users => {
                res.send(users);
            })
            .catch(error => {
                res.send(error);
            })
    })
}

module.exports = {userRouter}