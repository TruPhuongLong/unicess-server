import {
    expect
} from 'chai';

import {
    queryWithRange,
    pagination
} from '../src/services/query.service.pure';
import {
    QUERY
} from '../src/lib/query.contance';

describe('query.service.pure', () => {

    //FUNC queryWithRange
    describe('queryWithRange', () => {
        it('will return empty object ', () => {
            //test only support one pair key: value
            expect(queryWithRange({
                a: 22,
                b: 33
            })).to.eql({})
            expect(queryWithRange({})).to.eql({})

            // we will pass property not support in QUERY_CONTANCE
            expect(queryWithRange({
                notExistsProperty: 22
            })).to.eql({})

            //parse vaulue to Number fail will return {}
            expect(queryWithRange({
                createAt: 'ii44hh'
            })).to.eql({})

            expect(queryWithRange({
                createAt: `ii44hh${QUERY.separateForRange}55`
            })).to.eql({})
        })

        it('will return query with exact value, not in range, because we not pass separate symbol', () => {
            // need to pass property exists in QUERY: in this case is createAt 
            expect(queryWithRange({
                createAt: 44
            })).to.eql({
                createAt: 44
            })
            expect(queryWithRange({
                createAt: '44'
            })).to.eql({
                createAt: 44
            })
        })

        it('will return query with range', () => {
            expect(queryWithRange({
                createAt: `55${QUERY.separateForRange}33`
            })).to.eql({
                createAt: {
                    $gte: 33,
                    $lte: 55
                }
            })
        })
    })

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
})