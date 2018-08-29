"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const DBDriver = require("../../src/dbc/DriverFake");
function createDataSource(testCases) {
    return DBDriver.createDataSource(testCases);
}
let testCases = [];
function testCase(input, expected) {
    testCases.push({ input: input, expected: expected });
}
// Test Cases:
testCase("hello_world", "Hello World!");
testCase("current_date", "2016-07-04 09:15");
//----------------------------------
describe('dbc.fake', function () {
    let ds;
    beforeEach(function () {
        ds = createDataSource(testCases);
    });
    describe('Single Query', function () {
        for (let tc of testCases) {
            let sql = tc['input'];
            let expected = tc['expected'];
            it(sql, function (done) {
                ds.execute(sql)
                    .then(result => {
                    let res = result;
                    assert.strictEqual(res, expected);
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
//# sourceMappingURL=testDriverFake.js.map