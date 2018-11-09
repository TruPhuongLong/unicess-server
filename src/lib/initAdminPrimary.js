import { User } from '../models/user';
import { DEFAULT_PASSWORD, ROLES } from './contance';

export const initAdminPrimary = () => {
    const adminPrimary = new User({
        name: 'admin',
        email: 'admin@gmail.com',
        password: DEFAULT_PASSWORD,
        role: ROLES.admin.primary,
    })
    adminPrimary.save()
        .then(_user => {
            const { email, name, role } = _user;
            const user = { email, name, role }
            console.log(`create admin success, ${JSON.stringify(user)}`)
        })
        .catch(error => {
            console.log(`create admin fail, ${error}`)
        })
}