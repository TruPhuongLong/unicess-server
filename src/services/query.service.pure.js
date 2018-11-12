import {
  QUERY
} from '../lib/query.contance';
import {
  getMinMax
} from '../lib/funcHelp';
import {
  isString, isNumber
} from 'util';


// test ok
const pagination_Pure = defaultPagination => query => {
  let skip = parseInt(query.skip, 10);
  skip = skip ? skip : 0;
  let limit = parseInt(query.limit, 10);
  limit = limit ? limit : defaultPagination; //100
  return {
    skip,
    limit
  };
};

export const pagination = pagination_Pure(QUERY.defaultPagination);




export function validateQuery(query) {
  //null
  if (!query) return false;

  //if not null get array keys
  const keys = Object.keys(query)

  // onlly support one key: value
  if (keys.length !== 1) return false;

  // key must be in QUERY_CONSTANCE
  const prop = keys[0]
  if (!(prop in QUERY)) return false;

  return true;
}




//test ok / return like that: const {error, data} = validateQueryValue_Pure(..)(..)
const validateQueryValue_Pure = (separateForRange) => (value) => {
  if (!value) return { error: new Error('value is empty or null') }

  var value = isString(value) ? value : value.toString();

  if (value.indexOf(separateForRange) !== -1) {
    const values = value.split(QUERY.separateForRange);
    const { min, max } = getMinMax(values)
    if (min && max) {
      return { data: { min, max } }
    }
  } else {
    const valueNumber = Number(value);
    if (!isNaN(valueNumber)) {
      return { data: valueNumber }
    }
  }
  return { error: new Error('value must be range or number') }
}

//return like that: const {error, data} = validateQueryValue(..)
export const validateQueryValue = validateQueryValue_Pure(QUERY.separateForRange)





export const queryWithRange = (query) => {
  const queryObj = {};

  //validate query
  if (!validateQuery(query)) return queryObj;

  // convert value to string.
  const keys = Object.keys(query);
  const prop = keys[0]
  const value = isString(query[prop]) ? query[prop] : query[prop].toString();

  // validate query value
  // data alway is: number or {min, max} if data != null.
  const { error, data } = validateQueryValue(value);
  if (error) return queryObj;
  if (isNumber(data)) {
    Object.assign(queryObj, {
      [prop]: data
    });
  } else {
    Object.assign(queryObj, {
      [prop]: {
        $gte: data.min,
        $lte: data.max
      }
    });
  }
  return queryObj;
}