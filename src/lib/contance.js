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

const HEADER_ACCESS_TOKEN = 'x-access-token';

//Product query:
const PRODUCT_QUERY = {
    name: 'name', 
    price: 'price', // '22*!*!*44' // min*!*!*max
    createAt: 'createAt', //'02/03/2017*!*!*03/05/2018 'min*!*!*max
    separate: '*!*!*',
}

module.exports = {
    JWT_KEY,
    DEFAULT_PASSWORD,
    ROLES,
    UPLOAD_FILE_KEY,
    HEADER_ACCESS_TOKEN,
    PRODUCT_QUERY
}