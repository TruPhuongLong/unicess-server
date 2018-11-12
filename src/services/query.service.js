import {
  isString, isNumber
} from 'util';
import mongoose from 'mongoose';

import {
  QUERY
} from '../lib/query.contance';
import {
  getMinMax
} from '../lib/funcHelp';



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

const pagination = pagination_Pure(QUERY.defaultPagination);

const validateQuery = (modelSchema) => (query) => {
  //null
  if (!query) return false;

  //if not null get array keys
  const keys = Object.keys(query)

  // onlly support one key: value
  if (keys.length !== 1) return false;

  // key must be in QUERY_CONSTANCE
  const key = keys[0]
  if (!(modelSchema.path(key))) return false;

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
const validateQueryValue = validateQueryValue_Pure(QUERY.separateForRange)


// only get query single: 'createAt' or 'price'
// it must check after check validateQuery
const validateSupportRange = (modelSchema) => (key) => {
  if (modelSchema.path(key)) {
    return modelSchema.path(key) instanceof mongoose.Schema.Types.Number;
  }
  console.log('key not contain in Schema')
  return false;
}


// NOte query is object like that: {createAt: 4}, not {createAt: 4, price: 5} !importance
const queryWithRange = (modelSchema) => (query) => {
  const queryObj = {};

  //validate query
  if (!validateQuery(modelSchema)(query)) return queryObj;

  // convert value to string.
  const keys = Object.keys(query);
  const key = keys[0]
  const value = isString(query[key]) ? query[key] : query[key].toString();

  //validate support range:
  if (!validateSupportRange(modelSchema)(key)) return queryObj;

  // validate query value
  // data alway is: number or {min, max} if data != null.
  const { error, data } = validateQueryValue(value);
  if (error) return queryObj;
  if (isNumber(data)) {
    Object.assign(queryObj, {
      [key]: data
    });
  } else {
    Object.assign(queryObj, {
      [key]: {
        $gte: data.min,
        $lte: data.max
      }
    });
  }
  return queryObj;
}

// export only for test
const validateKeyInModel = (modelSchema) => (key) => {
  if (modelSchema.path(key)) return true;
  return false;
}

const queryWithExactKey = (modelSchema) => (queries, key) => {
  const queryObj = {};
  if (!queries) return queryObj;
  const value = queries[key];
  validateKeyInModel(modelSchema)(key) && value && Object.assign(queryObj, { [key]: value });
  return queryObj;
}

module.exports = {
  // for realy use in: User, Product, Order controler.
  queryWithExactKey,
  queryWithRange,
  pagination,


  // below only for test.
  validateKeyInModel,
  validateSupportRange,
  validateQueryValue,
  validateQuery
}


