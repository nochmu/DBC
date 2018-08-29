import assert = require('assert');
import mocha = require('mocha');
import DBDriver = require("../../src/dbc/DriverSQLite");
import {DataSource} from "../../src/dbc/DBC";

function createDataSource(): DataSource
{
    return DBDriver.createDataSource()
}
let testCases = [];
function testCase(input, expected){
    if(typeof expected =='string' || typeof expected == 'number'){
        expected = {a:expected};
    }
    if(!Array.isArray(expected)){
        expected = [expected];
    }
    testCases.push({input:input, expected:expected});
}

// Test Cases:
testCase("SELECT 'Hello World!' as a", "Hello World!");
testCase("SELECT 1+2 as a", 3);

//----------------------------------
describe('dbc.sqlite', function()
{
    let ds : DataSource;
    beforeEach(function()
    {
        ds = createDataSource();
    });

    describe('Single Query', function()
    {
        for(let tc of testCases)
        {
            let sql = tc['input'];
            let expected = tc['expected'];
            it(sql, function(done)
            {
                ds.execute(sql)
                    .then(result => {
                        let res = result.fetchAll();
                        assert.deepStrictEqual(res, expected)
                        done();
                    })
                    .catch(error => {
                        throw new Error(error);
                    });

            });
        };

    });


});



