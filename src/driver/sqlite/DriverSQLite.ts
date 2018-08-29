import * as dbc from '../../dbc';
import * as sqlite3 from 'sqlite3';



class DataSourceSQLite implements dbc.DataSource
{
    db;

    constructor()
    {
      //  this.db = new sqlite3.Database(':memory:');
        this.db = dblite(':memory');
    }

    end()
    {

    }

    async execute(sql: string)
    {
        let db = this.db;

        let prom =  new Promise(function(resolve, reject){

            let sqlQuery = sql;
            let params = {};
            let fields =

            db.query(sqlQuery, params, function(err, rows){
                if(err){
                    reject(err);
                }else {
                    resolve(rows);
                }
            })

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
        let stmt = await prom;

        let result : dbc.ResultSet = {
            getRows : function() : []{
                // @ts-ignore
                return stmt;
            }
        };

        return result;
    }

    query(stmt: string, binds?: object): Promise<dbc.ResultSet>
    {
        return undefined;
    }

}


export function createDataSource():dbc.DataSource
{
    return new DataSourceSQLite();
}

export default createDataSource;