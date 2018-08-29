/**
 * Fake implementation to prove the basic structure
 */

import {DataSource} from '../../dbc';



class DataSourceFake implements DataSource
{
    testCases : [{input,expected}];

    constructor(testCases)
    {
        this.testCases = testCases;
    }

    end()
    {
    }

    async execute(sql: string)
    {
        let testCase  = this.testCases.find(e => e.input == sql);
        return testCase.expected;
    }

}



export function createDataSource(testCases):DataSource
{
    return new DataSourceFake(testCases);
}

export default createDataSource;