import {
    expect
} from 'chai';

import {
    queryWithRange,
    pagination,
    validateQuery,
    validateQueryValue
} from '../src/services/query.service.pure';
import {
    QUERY
} from '../src/lib/query.contance';

describe('query.service.pure', () => {

    //FUNC pagination
    describe('pagination', () => {
        it('expect skip: 3, limit: 20', () => {
            const {
                skip,
                limit
            } = pagination({
                skip: 3,
                limit: 20
            })
            expect(skip).to.eql(3);
            expect(limit).to.eql(20);
        })
        it(`expect skip: 0, limit: ${QUERY.defaultPagination}`, () => {
            const {
                skip,
                limit
            } = pagination({
                skip: 'h',
                limit: 'g'
            })
            expect(skip).to.eql(0);
            expect(limit).to.eql(QUERY.defaultPagination);
        })
    })

    //FUNC validateQuery test ok.
    describe('validateQuery', () => {
        it('input: object with > 1 pair key-value, output: false ', () => {
            expect(validateQuery({
                a: 22,
                b: 33
            })).to.eql(false)
        })
        it('input: object with 0 key-value, output: false ', () => {
            expect(validateQuery({})).to.eql(false)
        })
        it('input: null, output: false ', () => {
            expect(validateQuery()).to.eql(false)
        })
        it('input: key not in QUERY constance, output: false ', () => {
            expect(validateQuery({ notExists: 9 })).to.eql(false)
        })
        it('input: key in QUERY constance, output: true ', () => {
            expect(validateQuery({ createAt: 9 })).to.eql(true)
        })
    })

    //FUNC validateQueryValue
    describe('validateQueryValue', () => {
        it('input: null, undifine, \'\', output: cb(Error) ', () => {
            var { error, data } = validateQueryValue('');
            expect(error).to.not.eql(null)

            var { error, data } = validateQueryValue(null);
            expect(error).to.not.eql(null)

            var { error, data } = validateQueryValue(undefined);
            expect(error).to.not.eql(null)
        })

        it('input: without separater, not a number, output: err', () => {
            const { error, data } = validateQueryValue('ggg');
            expect(error).to.not.eql(null)
        })

        it('input: \'5\' or 5, output: 5', () => {
            const { error, data } = validateQueryValue('5');
            expect(data).to.eql(5)
        })

        it(`input: gg${QUERY.separateForRange}5, output: err`, () => {
            const { error, data } = validateQueryValue(`gg${QUERY.separateForRange}5`);
            expect(error).to.not.eql(null)
        })

        it(`input: 8${QUERY.separateForRange}5, output: min 5, max 8`, () => {
            const { error, data } = validateQueryValue(`8${QUERY.separateForRange}5`);
            expect(data.min).to.eql(5)
            expect(data.max).to.eql(8)
        })
    })


    //FUNC queryWithRange
    describe('queryWithRange', () => {
        describe('input: query invalid, output: {} ', () => {
            it('input: object with > 1 pair key-value, output: {} ', () => {
                expect(queryWithRange({
                    a: 22,
                    b: 33
                })).to.eql({})
            })
            it('input: object with 0 key-value, output: {} ', () => {
                expect(queryWithRange({})).to.eql({})
            })
            it('input: null, output: false ', () => {
                expect(queryWithRange()).to.eql({})
            })
            it('input: key not in QUERY constance, output: {} ', () => {
                expect(queryWithRange({ notExists: 9 })).to.eql({})
            })

        })

        describe('input: key valid, value not valid; output: {}', () => {
            it('input: \'ggg\' query object valid, but query value invalid, output: {} ', () => {
                const query = queryWithRange({createAt: 'ggg'})
                expect(query).to.eql({})
            })
            it('input: not have separater and not number , output: {} ', () => {
                expect(queryWithRange({ createAt: 'hhh' })).to.eql({})
            })
            it('input: have separater , not format number , output: {} ', () => {
                expect(queryWithRange({ createAt: `ggg8${QUERY.separateForRange}5` })).to.eql({})
            })
        })
        

        it('input: \'5\', output: {} ', () => {
            const query = queryWithRange({createAt: '5'})
            expect(query).to.eql({createAt: 5})
        })

        it(`input: { createAt: '8${QUERY.separateForRange}5' } , output: {createAt: {$gte: 5, $lte: 8}} `, () => {
            expect(queryWithRange({ createAt: `8${QUERY.separateForRange}5` })).to.eql({createAt: {$gte: 5, $lte: 8}})
        })
    })
})