"use strict";
var dbc;
(function (dbc) {
    let Type;
    (function (Type) {
        Type[Type["STRING"] = 0] = "STRING";
        Type[Type["BOOLEAN"] = 1] = "BOOLEAN";
        Type[Type["NUMBER"] = 2] = "NUMBER";
        Type[Type["DATE"] = 3] = "DATE";
        Type[Type["ARRAY"] = 4] = "ARRAY";
        Type[Type["OBJECT"] = 5] = "OBJECT";
    })(Type = dbc.Type || (dbc.Type = {}));
    ;
    dbc.BIND_OUT = 'dbc_bind_out';
    dbc.BIND_IN = 'dbc_bind_in';
    dbc.BIND_INOUT = 'dbc_bind_inout';
    /***** */
    class DBStatementImpl {
    }
    class ResultDefault {
        fetchRow() {
            return this.getRows()[0];
        }
        fetchObject() {
            return this.getObjects()[0];
        }
        _objectsFromRows() {
            let objs = [];
            let rows = this.getRows();
            let columns = this.getColumns();
            objs = rows.map(ele => {
                let obj = {};
                for (let i = 0; i < columns.length; i++) {
                    let col = columns[i];
                    obj[col] = ele[i];
                }
                return obj;
            });
            return objs;
        }
        _rowsFromObjects() {
            let rows;
            let objs = this.getObjects();
            let columns = this.getColumns();
            rows = objs.map((ele) => {
                let row = [];
                for (let i = 0; i < columns.length; i++) {
                    let col = columns[i];
                    let val = ele[col];
                    row.push(val);
                }
                return row;
            });
            // @ts-ignore
            return rows;
        }
        getObjects() {
            return this._objectsFromRows();
        }
    }
    dbc.ResultDefault = ResultDefault;
    let driverMap = {
        'oracle': './driver/oracle/DriverOracle'
    };
    class DataSourceArgs {
    }
    dbc.DataSourceArgs = DataSourceArgs;
    function createDataSource(driver, args) {
        let crtDS = require(driverMap[driver]).default;
        if (crtDS === null) {
            throw new Error('unknown driver:"' + driver + '"');
        }
        if (typeof crtDS !== 'function') {
            throw new Error('illegal driver:"' + crtDS + '"');
        }
        let ds = crtDS(args);
        return ds;
    }
    dbc.createDataSource = createDataSource;
})(dbc || (dbc = {}));
module.exports = dbc;
//# sourceMappingURL=dbc.js.map