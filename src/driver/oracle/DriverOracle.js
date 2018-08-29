"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const oracledb = require("oracledb");
const dbc = require("../../dbc");
class DBCOracleConnectionAttributes {
}
class DataSourceOracle {
    constructor(connectData) {
        this.connectionAttributes = connectData;
    }
    end() {
    }
    _getConnection() {
        let att = {
            user: this.connectionAttributes.username,
            password: this.connectionAttributes.password,
            connectString: this.connectionAttributes.dbString
        };
        if (this.connectionAttributes.privilege) {
            // see: http://oracle.github.io/node-oracledb/doc/api.html#oracledbconstantsprivilege
            att['privilege'] = oracledb[this.connectionAttributes.privilege];
        }
        let dbcon = oracledb.getConnection(att);
        return dbcon;
    }
    execute(sql, bind = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this._getConnection();
            bind = trans_bind(bind);
            let opts = {};
            let stmtProm = db.execute(sql, bind, opts);
            let stmt = yield stmtProm;
            let result = new OracleResult(stmt);
            return result;
        });
    }
    query(sql, bind = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(sql, bind);
        });
    }
}
function trans_bind(bind) {
    let b2 = {};
    for (let k in bind) {
        let bind_var = bind[k];
        let bind_var2 = {};
        if (typeof bind_var == 'string') {
            let val = bind_var;
            bind_var = { dir: dbc.BIND_IN, type: dbc.Type.STRING, maxSize: val.length, value: val };
        }
        if (bind_var instanceof Object) {
            bind_var2['dir'] = trans_bind_dir(bind_var['dir']);
            bind_var2['type'] = trans_bind_type(bind_var['type']);
            bind_var2['maxSize'] = bind_var['maxSize'];
            bind_var2['val'] = trans_bind_val(bind_var['value']);
        }
        else {
            throw new Error("invalid bind_var" + bind_var);
        }
        b2[k] = bind_var2;
    }
    return b2;
}
function trans_bind_dir(dir) {
    if (dir == dbc.BIND_IN)
        return oracledb.BIND_IN;
    if (dir == dbc.BIND_OUT)
        return oracledb.BIND_OUT;
    if (dir == dbc.BIND_INOUT)
        return oracledb.BIND_INOUT;
}
function trans_bind_type(type) {
    if (type == dbc.Type.STRING)
        return oracledb.STRING;
}
function trans_bind_val(val) {
    return val;
}
class OracleResult extends dbc.ResultDefault {
    constructor(nativeResult) {
        super();
        this.result = nativeResult;
    }
    getRows() {
        return this.result.rows;
    }
    getColumns() {
        return this.result.metaData.map(ele => ele.name);
    }
    getBinds() {
        return this.result.outBinds;
    }
}
class DataSourceArgs extends dbc.DataSourceArgs {
}
exports.DataSourceArgs = DataSourceArgs;
function createDataSource(args) {
    let connData = new DBCOracleConnectionAttributes();
    connData.username = args.user;
    connData.password = args.password;
    connData.dbString = args.host + ':' + args.port + '/' + args.database;
    connData.privilege = args.privilege;
    let ds = new DataSourceOracle(connData);
    return ds;
}
exports.createDataSource = createDataSource;
exports.default = createDataSource;
//# sourceMappingURL=DriverOracle.js.map