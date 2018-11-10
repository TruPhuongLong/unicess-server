const JWT_KEY = "secret key";

const DEFAULT_PASSWORD = '123456';

const ROLES = {
    admin: {
        primary: 'primary',
        secondary: 'secondary'
    },
    regular: {
        new: 'new',
        usually: 'usually',
    }
}

const UPLOAD_FILE_KEY = 'files';

const HEADER_ACCESS_TOKEN = 'x-access-token';

//core query:
const QUERY_SERVICE = {
    createAt: 'createAt', //'02/03/2017*!*!*03/05/2018 'min*!*!*max
    separate: '*!*!*',
    defaultPagination: 100
}

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
    QUERY_SERVICE,
    PRODUCT_QUERY,
}