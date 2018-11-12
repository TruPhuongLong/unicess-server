import {  queryWithExactKey, queryWithRange, pagination, } from '../services/query.service';
import { QUERY } from '../lib/query.contance';
import {ProductSchema} from '../models/product';

//QUERY:
export function productQuery(query) {
    const queryObj = {};

    const productPriceQueryObj = queryWithRange(ProductSchema)(query);
    const productCreateAtQueryObj = queryWithRange(query, QUERY.createAt);

    Object.assign(queryObj, productNameQueryObj, productPriceQueryObj, productCreateAtQueryObj)
    return queryObj;
}

