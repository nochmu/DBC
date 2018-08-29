"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dbc = require("../../dbc");
function createDataSource() {
    let args = {
        user: 'SYS',
        password: 'welcome-1',
        host: 'localhost',
        port: 1531,
        database: 'MYPDB',
        privilege: 'SYSDBA'
    };
    return dbc.createDataSource('oracle', args);
}
//----------------------------------
describe('dbc.oracle', function () {
    let ds;
    beforeEach(function () {
        ds = createDataSource();
    });
    describe('Query: SELECT * FROM DUAL', function () {
        it('as Array', function (done) {
            ds.query('SELECT * FROM DUAL')
                .then((result) => {
                let columns = result.getColumns();
                let rows = result.getRows();
                chai_1.expect(columns).be.deep.equal(['DUMMY']);
                chai_1.expect(rows).be.deep.equal([['X']]);
                done();
            })
                .catch(error => {
                throw new Error(error);
            });
        });
        it('as Object', function (done) {
            ds.query('SELECT * FROM DUAL')
                .then((result) => {
                let columns = result.getColumns();
                let rowObjects = result.getObjects();
                chai_1.expect(columns).be.deep.equal(['DUMMY']);
                chai_1.expect(rowObjects).be.deep.equal([{ "DUMMY": "X" }]);
                done();
            })
                .catch(error => {
                throw new Error(error);
            });
        });
    });
    describe('Execute PL/SQL Block', function () {
        it('should work', function (done) {
            let bind = {
                msg: 'Hello World!',
                out: { dir: dbc.BIND_OUT, type: dbc.Type.STRING, maxSize: 40 },
            };
            ds.execute(`
            DECLARE
                l_msg varchar2(4000) := :msg; 
            BEGIN
                :out := l_msg;  
            END; 
            `, bind)
                .then((result) => {
                console.log(result);
                done();
            })
                .catch(error => {
                throw error;
            });
        });
    });
});
//# sourceMappingURL=testDriverOracle.js.map