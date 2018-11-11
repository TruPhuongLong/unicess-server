import {
  QUERY
} from '../lib/query.contance';
import {
  getMinMax
} from '../lib/funcHelp';
import {
  isNumber, isString
} from 'util';

//===Pure===
const pagination_Pure = QUERY => query => {
  let skip = parseInt(query.skip, 10);
  skip = skip ? skip : 0;
  let limit = parseInt(query.limit, 10);
  limit = limit ? limit : QUERY.defaultPagination; //100
  return {
    skip,
    limit
  };
};

const queryWithRange_Pure = (QUERY, getMinMax) => (query) => {
  const queryObj = {};
  const keys = Object.keys(query)

  // onlly support one key: value
  if (keys.length !== 1) return queryObj;

  // key must be in QUERY_CONSTANCE
  const prop = keys[0]
  const value = isString(query[prop]) ? query[prop] : query[prop].toString();

  if (!QUERY.hasOwnProperty(prop)) return queryObj;


  if (value.indexOf(QUERY.separateForRange) !== -1) {
    const values = value.split(QUERY.separateForRange);
    // console.log(values)
    const {
      min,
      max
    } = getMinMax(values)
    // console.log(min, max)

    if (min && max) {
      // console.log('go here')

      Object.assign(queryObj, {
        [prop]: {
          $gte: min,
          $lte: max
        }
      });
    }
  } else {
    const valueNumber = Number(value);
    if(!isNaN(valueNumber)){
      Object.assign(queryObj, {
        [prop]: valueNumber
      });
    }
  }
  return queryObj;
}




// export
export const queryWithRange = queryWithRange_Pure(QUERY, getMinMax);

export const pagination = pagination_Pure(QUERY);