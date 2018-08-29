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
class DataSourceSQLite {
    constructor() {
        //  this.db = new sqlite3.Database(':memory:');
        this.db = dblite(':memory');
    }
    end() {
    }
    execute(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = this.db;
            let prom = new Promise(function (resolve, reject) {
                let sqlQuery = sql;
                let params = {};
                let fields = db.query(sqlQuery, params, function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
                /*
                            // @ts-ignore
                            db.all(sql, function(err, row){
                                if(err){
                                    reject(err);
                                }else {
                                    resolve(row);
                                }
                            });
                            */
            });
            let stmt = yield prom;
            let result = {
                getRows: function () {
                    // @ts-ignore
                    return stmt;
                }
            };
            return result;
        });
    }
    query(stmt, binds) {
        return undefined;
    }
}
function createDataSource() {
    return new DataSourceSQLite();
}
exports.createDataSource = createDataSource;
exports.default = createDataSource;
//# sourceMappingURL=DriverSQLite.js.map