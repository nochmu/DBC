"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const DBDriver = require("../../src/dbc/DriverSQLite");
function createDataSource() {
    return DBDriver.createDataSource();
}
let testCases = [];
function testCase(input, expected) {
    if (typeof expected == 'string' || typeof expected == 'number') {
        expected = { a: expected };
    }
    if (!Array.isArray(expected)) {
        expected = [expected];
    }
    testCases.push({ input: input, expected: expected });
}
// Test Cases:
testCase("SELECT 'Hello World!' as a", "Hello World!");
testCase("SELECT 1+2 as a", 3);
//----------------------------------
describe('dbc.sqlite', function () {
    let ds;
    beforeEach(function () {
        ds = createDataSource();
    });
    describe('Single Query', function () {
        for (let tc of testCases) {
            let sql = tc['input'];
            let expected = tc['expected'];
            it(sql, function (done) {
                ds.execute(sql)
                    .then(result => {
                    let res = result.fetchAll();
                    assert.deepStrictEqual(res, expected);
                    done();
                })
                    .catch(error => {
                    throw new Error(error);
                });
            });
        }
        ;
    });
});
//# sourceMappingURL=TestSQLite.js.map