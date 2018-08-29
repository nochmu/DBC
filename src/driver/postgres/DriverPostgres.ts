import * as dbc from "../../dbc";
import * as pg from "pg";




class ConnectionAttributes
{
    username : string;
    password : string;
    host : string;
    database : string;
}

class DataSourcePostgres implements dbc.DataSource
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

    _getConnection() : pg.Client
    {
        if(this.connection == null){

            let att   = {
                host          : this.connectionAttributes.host,
                user      : this.connectionAttributes.username,
                password : this.connectionAttributes.password,
                database: this.connectionAttributes.database
            };

            this.connection = new pg.Client(att);
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
        let conn :  pg.Client = this._getConnection();
        let sqlQuery = {
            text:sql,
            rowMode: 'array'
        };

        let prom:Promise<dbc.ResultSet>  = new Promise((resolve, reject) => {
            conn.query(sqlQuery, function (error, res)
            {
                if (error) reject(error);
                else {
                    let result : ResultSet = new ResultSet(res);
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
    throw new Error("bind/dir not supported");
}
function trans_bind_type(type:dbc.Type):number
{
    return type;
}
function trans_bind_val(val)
{
    return val;
}




class ResultSet extends dbc.ResultDefault implements dbc.ResultSet
{
    result:pg.QueryResult;

    constructor(nativeResult: pg.QueryResult)
    {
        super();
        this.result = nativeResult;
    }

    getObjects():object[]
    {
        return this._objectsFromRows();
    }

    getRows(): [][]
    {
        return this.result.rows
    }

    getColumns() : string[]
    {
        return this.result.fields.map(f=>f.name);
    }

    getBinds() : object
    {

        throw new Error("not yet implemented");
    }

}




export function createDataSource(user:string, password:string, host:string, database:string):dbc.DataSource
{
    let connData = new ConnectionAttributes();
    connData.username = user;
    connData.password = password;
    connData.host = host;
    connData.database = database;
    let ds = new DataSourcePostgres(connData);
    return ds;
}

export default createDataSource;