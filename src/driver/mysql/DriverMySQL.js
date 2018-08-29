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
const dbc = require("../../dbc");
const mysql = require("mysql");
class ConnectionAttributes {
}
class DataSourceMySQL {
    constructor(connectData) {
        this.connectionAttributes = connectData;
    }
    end() {
        this.connection.end();
    }
    _getConnection() {
        if (this.connection == null) {
            let att = {
                host: this.connectionAttributes.host,
                user: this.connectionAttributes.username,
                password: this.connectionAttributes.password,
                database: this.connectionAttributes.database
            };
            this.connection = mysql.createConnection(att);
            this.connection.connect();
        }
        if (this.connection == null) {
            throw new Error("Establishing database connection: unknown error");
        }
        else {
            return this.connection;
        }
    }
    execute(sql, bind = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not yet implemented");
        });
    }
    query(sql, bind = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = this._getConnection();
            let prom = new Promise((resolve, reject) => {
                conn.query(sql, function (error, results, fields) {
                    if (error)
                        reject(error);
                    else {
                        let result = new ResultSet(results, fields);
                        resolve(result);
                    }
                });
            });
            return prom;
        });
    }
}
function trans_bind(bind) {
    let b2 = {};
    for (let k in bind) {
        let bind_var = bind[k];
        let bind_var2 = {};
        if (typeof bind_var === 'string') {
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
    throw new Error("bind/dir not supported");
}
function trans_bind_type(type) {
    if (type == dbc.Type.STRING)
        return 254 /* STRING */;
}
function trans_bind_val(val) {
    return val;
}
class ResultSet extends dbc.ResultDefault {
    constructor(nativeResult, fields) {
        super();
        this.result = nativeResult;
        this.fields = fields;
    }
    getObjects() {
        return this.result;
    }
    getRows() {
        return this._rowsFromObjects();
    }
    getColumns() {
        return this.fields.map(ele => ele.name);
    }
    getBinds() {
        return this.result.outBinds;
    }
}
function createDataSource(user, password, host, database) {
    let connData = new ConnectionAttributes();
    connData.username = user;
    connData.password = password;
    connData.host = host;
    connData.database = database;
    let ds = new DataSourceMySQL(connData);
    return ds;
}
exports.createDataSource = createDataSource;
exports.default = createDataSource;
//# sourceMappingURL=DriverMySQL.js.map