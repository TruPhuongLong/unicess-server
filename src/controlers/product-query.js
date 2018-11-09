import {PRODUCT_QUERY} from '../lib/contance'

//QUERY:
export function productQuery(q) {
    const queryObj = {};

    const productNameQueryObj = productNameQuery(q);
    const productPriceQueryObj = productPriceQuery(q);
    const productCreateAtQueryObj = productCreateAtQuery(q);

    Object.assign(queryObj, productNameQueryObj, productPriceQueryObj, productCreateAtQueryObj)
    return queryObj;
}

function productNameQuery(q){
    const queryObj = {};
    const name = q[PRODUCT_QUERY.name];
    name && Object.assign(queryObj, {name: name});
    return queryObj;
}

function productPriceQuery(q){
    const queryObj = {};
    const price = q[PRODUCT_QUERY.price];
    if(price){
        if(price.indexOf(PRODUCT_QUERY.separate) !== -1){
            const arrPrice = price.split(PRODUCT_QUERY.separate);
            Object.assign(queryObj, {price: {$gte: arrPrice[0], $lte: arrPrice[1]}})
        }else{
            Object.assign(queryObj, {price: price})
        }        
    }
    return queryObj;
}

function productCreateAtQuery(q){
    const queryObj = {};
    const createAt = q[PRODUCT_QUERY.createAt];
    if(createAt){
        if(createAt.indexOf(PRODUCT_QUERY.separate) !== -1){
            const arrCreateAt = createAt.split(PRODUCT_QUERY.separate);
            Object.assign(queryObj, {arrCreateAt: {$gte: arrCreateAt[0], $lte: arrCreateAt[1]}})
        }else{
            Object.assign(queryObj, {createAt: createAt})
        }        
    }
    return queryObj;
}