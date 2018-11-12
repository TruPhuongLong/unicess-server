import {
    expect
} from 'chai';

import {
    queryWithRange,
    pagination,
    validateQuery,
    validateQueryValue,
    queryWithExactKey,
    validateKeyInModel,
    validateSupportRange
} from '../src/services/query.service';
import {
    QUERY
} from '../src/lib/query.contance';
import { UserObject, UserSchema } from '../src/models/user';

describe('query.service.pure', () => {

    //FUNC pagination /test ok
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
        const validateQueryUserObject = validateQuery(UserSchema);
        it('input: object with > 1 pair key-value, output: false ', () => {
            expect(validateQueryUserObject({
                a: 22,
                b: 33
            })).to.eql(false)
        })
        it('input: object with 0 key-value, output: false ', () => {
            expect(validateQueryUserObject({})).to.eql(false)
        })
        it('input: null, output: false ', () => {
            expect(validateQueryUserObject()).to.eql(false)
        })
        it('input: key not in QUERY constance, output: false ', () => {
            expect(validateQueryUserObject({ notExists: 9 })).to.eql(false)
        })
        it('input: key in QUERY constance, output: true ', () => {
            expect(validateQueryUserObject({ createAt: 9 })).to.eql(true)
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
        const queryWithRangeUserObject = queryWithRange(UserSchema);
        describe('input: query invalid, output: {} ', () => {
            it('input: object with > 1 pair key-value, output: {} ', () => {
                expect(queryWithRangeUserObject({
                    a: 22,
                    b: 33
                })).to.eql({})
            })
            it('input: object with 0 key-value, output: {} ', () => {
                expect(queryWithRangeUserObject({})).to.eql({})
            })
            it('input: null, output: false ', () => {
                expect(queryWithRangeUserObject()).to.eql({})
            })
            it('input: key not in QUERY constance, output: {} ', () => {
                expect(queryWithRangeUserObject({ notExists: 9 })).to.eql({})
            })

        })

        describe('input: key valid, value not valid; output: {}', () => {
            it('input: \'ggg\' query object valid, but query value invalid, output: {} ', () => {
                const query = queryWithRangeUserObject({ createAt: 'ggg' })
                expect(query).to.eql({})
            })
            it('input: not have separater and not number , output: {} ', () => {
                expect(queryWithRangeUserObject({ createAt: 'hhh' })).to.eql({})
            })
            it('input: have separater , not format number , output: {} ', () => {
                expect(queryWithRangeUserObject({ createAt: `ggg8${QUERY.separateForRange}5` })).to.eql({})
            })
        })


        it('input: \'5\', output: {} ', () => {
            const query = queryWithRangeUserObject({ createAt: '5' })
            expect(query).to.eql({ createAt: 5 })
        })

        it(`input: { createAt: '8${QUERY.separateForRange}5' } , output: {createAt: {$gte: 5, $lte: 8}} `, () => {
            expect(queryWithRangeUserObject({ createAt: `8${QUERY.separateForRange}5` })).to.eql({ createAt: { $gte: 5, $lte: 8 } })
        })
    })


    //validateSupportRange
    describe('validateSupportRange', () => {
        it('input: xyz; output: false', () => {
            const isNumber = validateSupportRange(UserSchema)('xyz')
            expect(isNumber).to.eql(false);
        })
        it('input: createAt (have type is Number); output: true', () => {
            const isNumber = validateSupportRange(UserSchema)('createAt')
            expect(isNumber).to.eql(true);
        })
        it('input: email (have type is String); output: false', () => {
            const isNumber = validateSupportRange(UserSchema)('email')
            expect(isNumber).to.eql(false);
        })
    })


    //validateKeyInModel
    describe('validateKeyInModel', () => {
        it('input: xyz; output: false', () => {
            expect(validateKeyInModel(UserSchema)('xyz')).to.eql(false);
        })

        it('input: email; output: true', () => {
            expect(validateKeyInModel(UserSchema)('email')).to.eql(true);
        })
    })


    //queryWithExactKey
    describe('queryWithExactKey', () => {
        const queryWithExactKeyUserSchema = queryWithExactKey(UserSchema);
        it('input: queries = null, undefine; output: {}', () => {
            const queryObj = queryWithExactKeyUserSchema(null, 'aaa')
            expect(queryObj).to.eql({})
        })
        it('input: queries = {a: 1, b: 2}, key: !== a, !== b; output: {}', () => {
            const queryObj = queryWithExactKeyUserSchema({ a: 1, b: 2 }, 'aaa')
            expect(queryObj).to.eql({})
        })
        it('input: queries = {a: 1, b: 2}, key: a, but a not in UserObject; output: {}', () => {
            const queryObj = queryWithExactKeyUserSchema({ a: 1, b: 2 }, 'a')
            expect(queryObj).to.eql({})
        })
        it('input: queries = {email: \'example@.gmail.com\', b: 2}, key: email, email in UserObject; output: {email: \'example@.gmail.com\'}', () => {
            const queryObj = queryWithExactKeyUserSchema({ email: 'example@gmail.com', b: 2 }, 'email')
            expect(queryObj).to.eql({ email: 'example@gmail.com' })
        })
    })
})