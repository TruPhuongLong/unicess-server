import {
    isNumber,
    isArray,
    isObject
} from "util";

import {
    ERROR
} from './error.contance';


//Recursive to get singleArray.
/**Note: this code will not work. because array is object
 * 
 * if (isObject(item)) {
        throw new Error('not support object')
    } else if (isArray(item)) {
        recursive(item)
    } 
 */
export function getSingleArrayNumber(...rest) {
    // console.log(rest)
    const initArray = []

    function recursive(arr) {
        //Note check array before check object !important.
        arr.forEach(item => {
            if (isArray(item)) {
                recursive(item)
            } else if (isObject(item)) {
                throw new Error('not support object')
            } else {
                const n = Number(item);
                if (isNaN(n)) {
                    throw new Error('not a number')
                } else {
                    initArray.push(n)
                }
            }
        })
    }
    try {
        recursive(rest)
        return initArray;
    } catch (error) {
        // console.log(error.toString())
        return;
    }
}

// can pass arguments like that: 
// getMinMax(1,2,3)
// getMinMax([3,4,5])
// getMinMax(4, [3,4,5])
// getMinMax(4, [3,4,5, [2,3]])
export function getMinMax(...rest) {
    const singleArray = getSingleArrayNumber(...rest);
    try {
        if(!singleArray) throw new Error('some thing went wrong')
        if (singleArray.length < 2) throw new Error(ERROR.numOfArgumentsLessThan2);
        singleArray.sort((a, b) => {
            return a > b
        })
        return {
            min: singleArray[0],
            max: singleArray[singleArray.length - 1]
        }
    } catch (error) {
        return {}
    }

}