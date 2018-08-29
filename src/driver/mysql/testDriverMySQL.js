"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DBCDriver = require("./DriverMySQL");
function createDataSource() {
    return DBCDriver.createDataSource("root", "root", 'localhost', 'demo');
}
//----------------------------------
describe('dbc.mysql', function () {
    let ds;
    beforeEach(function () {
        ds = createDataSource();
    });
    describe('Query: SELECT * FROM DUAL', function () {
        it('as Array', function (done) {
            ds.query("SELECT 'Hello World!' as msg")
                .then((result) => {
                let columns = result.getColumns();
                let rows = result.getRows();
                chai_1.expect(columns).be.deep.equal(['msg']);
                chai_1.expect(rows).be.deep.equal([['Hello World!']]);
                done();
            })
                .catch(error => {
                throw new Error(error);
            });
        });
        it('as Object', function (done) {
            ds.query("SELECT 'Hello World!' as msg")
                .then((result) => {
                let columns = result.getColumns();
                let rowObjects = result.getObjects();
                chai_1.expect(rowObjects).be.deep.equal([{ "msg": "Hello World!" }]);
                done();
            })
                .catch(error => {
                throw new Error(error);
            });
        });
    });
});
//# sourceMappingURL=testDriverMySQL.js.map