import { QUERY_SERVICE } from "../lib/contance";
import {getMinMax} from '../lib/funcHelp';

export const pagination = query => {
  let skip = parseInt(query.skip, 10);
  skip = skip ? skip : 0;
  let limit = parseInt(req.query.limit, 10);
  limit = limit ? limit : QUERY_SERVICE.defaultPagination; //100
  return { skip, limit };
};

function createAtQuery(query) {
  const queryObj = {};
  const createAt = query[QUERY_SERVICE.createAt];
  if (createAt) {
    if (createAt.indexOf(QUERY_SERVICE.separate) !== -1) {
      const arrCreateAt = createAt.split(QUERY_SERVICE.separate);
      const {min, max} = getMinMax(arrCreateAt[0], arrCreateAt[1])
      if (min && max) {
        Object.assign(queryObj, { createAt: { $gte: min, $lte: max } });
      }
    } else {
      Object.assign(queryObj, { createAt: createAt });
    }
  }
  return queryObj;
}
