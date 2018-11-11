import {
    expect
} from 'chai';

import {
    getMinMax,
    getSingleArrayNumber
} from '../src/lib/funcHelp';
import {
    ERROR
} from '../src/lib/error.contance';

//Note: expect error with syntax: expect(() => getMinMax(2)).to.throw('some err message');

describe('funcHelp.test.js', function () {

    // test getSingleArray
    describe('getSingleArray', () => {
        it('not support object', () => {
            expect(getSingleArrayNumber(1, {
                a: 4
            }, [2, 3])).to.eql(undefined)
        })
        it('not a number', () => {
            expect(getSingleArrayNumber(1, 'hg', [2, 3])).to.eql(undefined)
        })
        it('will get array: [1,2,3,4,5,6]', () => {
            expect(getSingleArrayNumber(1, [2, '3', [4, 5, 6]])).to.eql([1, 2, 3, 4, 5, 6])
        })
    })

    //test getMinMax
    describe('getMinMax', function () {
        it('pass only one argument will return {}', (done) => {
            expect(getMinMax(2)).to.eql({});
            done()
        })
        it('contain not number will return {}', () => {
            expect(getMinMax(2, 'lhl5', 4)).to.eql({})
        })
        it('expect min: 2, max 9', () => {
            const arr = ['2', 9, 4, 6]
            const {min, max} = getMinMax(5, arr)
            expect(arr).to.eql(['2', 9, 4, 6]) // not change arr origin
            expect(min).to.eql(2);
            expect(max).to.eql(9);
        })
    });
});