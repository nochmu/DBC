import * as dbc from "../../dbc";
import * as mysql from "mysql";
import {MysqlError} from "mysql";
import {FieldInfo} from "mysql";



class ConnectionAttributes
{
    username : string;
    password : string;
    host : string;
    database : string;
}

class DataSourceMySQL implements dbc.DataSource
{
    private connectionAttributes : ConnectionAttributes ;
    private connection;

    constructor(connectData:ConnectionAttributes)
    {
        this.connectionAttributes = connectData;
    }

    end()
    {
        this.connection.end();
    }

    _getConnection() : mysql.Connection
    {
        if(this.connection == null){
            let att : mysql.ConnectionConfig  = {
                host          : this.connectionAttributes.host,
                user      : this.connectionAttributes.username,
                password : this.connectionAttributes.password,
                database: this.connectionAttributes.database
            };

            this.connection = mysql.createConnection(att);
            this.connection.connect();
        }
        if(this.connection == null){
            throw new Error("Establishing database connection: unknown error");
        }
        else
        {
            return this.connection;
        }

    }



    async execute(sql: string, bind:object={}) : Promise<dbc.ResultSet>
    {
        throw new Error("not yet implemented");
    }

    async query(sql: string, bind: object={}): Promise<dbc.ResultSet>
    {
        let conn :  mysql.Connection = this._getConnection();

        let prom:Promise<dbc.ResultSet>  = new Promise((resolve, reject) => {

            conn.query(sql, function (error:(mysql.MysqlError|null), results:any, fields:mysql.FieldInfo[])
            {
                if (error) reject(error);
                else {
                    let result : ResultSet = new ResultSet(results, fields);
                    resolve(result);
                }
            });
        })


        return prom;
    }
}


function trans_bind(bind:object):object
{
    let b2 = {};
    for(let k in bind)
    {
        let bind_var = bind[k];
        let bind_var2 = {};
        if(typeof bind_var === 'string'){
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
    throw new Error("bind/dir not supported");
}
function trans_bind_type(type:dbc.Type):number
{
    if(type == dbc.Type.STRING)
        return mysql.Types.STRING;
}
function trans_bind_val(val)
{
    return val;
}




class ResultSet extends dbc.ResultDefault implements dbc.ResultSet
{
    result:any;
    fields:mysql.FieldInfo[];

    constructor(nativeResult:any, fields:mysql.FieldInfo[])
    {
        super();
        this.result = nativeResult;
        this.fields = fields;
    }

    getObjects():object[]
    {
        return this.result;
    }

    getRows(): [][]
    {
        return this._rowsFromObjects();
    }

    getColumns() : string[]
    {
        return this.fields.map(ele=> ele.name);
    }

    getBinds() : object
    {

        return this.result.outBinds;
    }

}




export function createDataSource(user:string, password:string, host:string, database:string):dbc.DataSource
{
    let connData = new ConnectionAttributes();
    connData.username = user;
    connData.password = password;
    connData.host = host;
    connData.database = database;
    let ds = new DataSourceMySQL(connData);
    return ds;
}

export default createDataSource;