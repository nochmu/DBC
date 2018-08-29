import {IConnection, IConnectionAttributes, IPromise} from "oracledb";
import * as oracledb from "oracledb";
import * as dbc from "../../dbc";


class DBCOracleConnectionAttributes
{
    username : string;
    password : string;
    dbString : string;
    privilege : string;
}

class DataSourceOracle implements dbc.DataSource
{
    connectionAttributes : DBCOracleConnectionAttributes ;

    constructor(connectData:DBCOracleConnectionAttributes)
    {
        this.connectionAttributes = connectData;
    }

    end()
    {

    }

    _getConnection() : IPromise<IConnection>
    {
        let att: IConnectionAttributes = {
            user: this.connectionAttributes.username,
            password: this.connectionAttributes.password,
            connectString: this.connectionAttributes.dbString
        };

        if(this.connectionAttributes.privilege)
        {
            // see: http://oracle.github.io/node-oracledb/doc/api.html#oracledbconstantsprivilege
            att['privilege'] = oracledb[this.connectionAttributes.privilege];
        }


        let dbcon : IPromise<IConnection> =  oracledb.getConnection(att);
        return dbcon;
    }



    async execute(sql: string, bind:object={}) : Promise<dbc.ResultSet>
    {
        let db = await this._getConnection();
        bind = trans_bind(bind);
        let opts = { };
        let stmtProm = db.execute(sql, bind, opts);
        let stmt = await stmtProm;

        let result : dbc.ResultSet = new OracleResult(stmt);

        return result;
    }

    async query(sql: string, bind: object={}): Promise<dbc.ResultSet>
    {
        return this.execute(sql, bind);
    }
}


function trans_bind(bind:object):object
{
    let b2 = {};
    for(let k in bind)
    {
        let bind_var = bind[k];
        let bind_var2 = {};
        if(typeof bind_var == 'string'){
            let val = bind_var;
            bind_var = {dir:dbc.BIND_IN, type:dbc.Type.STRING, maxSize:val.length, value:val};
        }
        if(bind_var instanceof Object){
            bind_var2['dir'] = trans_bind_dir(bind_var['dir']);
            bind_var2['type'] = trans_bind_type(bind_var['type']);
            bind_var2['maxSize'] = bind_var['maxSize'];
            bind_var2['val'] = trans_bind_val(bind_var['value']);
        }else
        {
            throw new Error("invalid bind_var"+bind_var);
        }
        b2[k] = bind_var2;
    }
    return b2;
}

function trans_bind_dir(dir:string):number
{
    if(dir == dbc.BIND_IN)
        return oracledb.BIND_IN;
    if(dir == dbc.BIND_OUT)
        return oracledb.BIND_OUT;
    if(dir == dbc.BIND_INOUT)
        return oracledb.BIND_INOUT;
}
function trans_bind_type(type:dbc.Type):number
{
    if(type == dbc.Type.STRING)
        return oracledb.STRING;
}
function trans_bind_val(val)
{
    return val;
}




class OracleResult extends dbc.ResultDefault implements dbc.ResultSet
{
    result;

    constructor(nativeResult)
    {
        super();
        this.result = nativeResult;
    }

    getRows(): []
    {
        return this.result.rows;
    }

    getColumns() : string[]
    {
        return this.result.metaData.map(ele=> ele.name);
    }

    getBinds() : object
    {

        return this.result.outBinds;
    }

}

export class DataSourceArgs extends dbc.DataSourceArgs
{
    user:string;
    password:string;
    host:string;
    port:number;
    database:string;
    privilege?:string;
}
export function createDataSource(args:DataSourceArgs):dbc.DataSource
{
    let connData = new DBCOracleConnectionAttributes();
    connData.username = args.user;
    connData.password = args.password;
    connData.dbString = args.host+':'+args.port+'/'+args.database;
    connData.privilege = args.privilege;
    let ds = new DataSourceOracle(connData);
    return ds;
}

export default createDataSource;