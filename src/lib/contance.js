const JWT_KEY = "secret key";

const DEFAULT_PASSWORD = '123456';

const ROLES = {
    admin: {
        primary: 'primary',
        secondary: 'secondary'
    },
    regular: 'regular',
}

const UPLOAD_FILE_KEY = 'files';

module.exports = {
    JWT_KEY,
    DEFAULT_PASSWORD,
    ROLES,
    UPLOAD_FILE_KEY,
}