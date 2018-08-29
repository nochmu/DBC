import mocha = require('mocha');
import {expect} from 'chai';
import dbc = require('../../dbc');
const DBCDriver = require("./DriverPostgres");


function createDataSource(): dbc.DataSource
{
    return DBCDriver.createDataSource("postgres", "postgres", 'localhost', 'postgres');
}


//----------------------------------
describe('dbc.postgres', function()
{
    let ds: dbc.DataSource;
    beforeEach(function()
    {
        ds = createDataSource();
    });


    describe('Query: SELECT * FROM DUAL', function()
    {
        it('as Array', function(done)
        {
            ds.query("SELECT 'Hello World!' as msg")
                .then((result:dbc.ResultSet) =>
                {
                    let columns = result.getColumns();
                    let rows = result.getRows();
                    expect(columns).be.deep.equal(['msg']);
                    expect(rows).be.deep.equal([['Hello World!']]);

                    done();
                })
                .catch(error =>
                {
                    throw new Error(error);
                });

        });

        it('as Object', function(done)
        {
            ds.query("SELECT 'Hello World!' as msg")
                .then((result:dbc.ResultSet)=>
                {
                    let columns = result.getColumns();
                    let rowObjects = result.getObjects();

                    expect(rowObjects).be.deep.equal([{"msg": "Hello World!"}]);

                    done();
                })
                .catch(error =>
                {
                    throw new Error(error);
                });

        });
    });
});

