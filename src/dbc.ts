import {getRulesDirectories} from "../node_modules/tslint/lib/configuration";

module  dbc
{


    export enum Type{
        STRING, BOOLEAN, NUMBER, DATE, ARRAY, OBJECT
    };

    export const BIND_OUT = 'dbc_bind_out';
    export const BIND_IN = 'dbc_bind_in';
    export const BIND_INOUT = 'dbc_bind_inout';

    /**
     * @note The DataSource is created by the driver implementation.
     */
    export interface DataSource
    {
        execute(stmt:string, binds?:object) : Promise<ResultSet>;

        query(stmt:string, binds?:object) : Promise<ResultSet>;

        /**
         * no more data are needed. After calling this method, the data source is invalid.
         */
        end();
    }

    export interface ResultSet
    {
        getRows() : any[][];
        fetchRow() : any[];
        getObjects() : any[];
        fetchObject() : object;
        getColumns() : string[]
        getBinds():object;
    }



    interface Statement
    {

    }

    /***** */

    class DBStatementImpl implements Statement
    {


    }

    export abstract class ResultDefault implements ResultSet
    {
        abstract getRows() : [][];
        abstract getColumns() : string[];
        abstract getBinds() : object;

        fetchRow() : []
        {
            return this.getRows()[0];
        }

        fetchObject() : object
        {
            return this.getObjects()[0];
        }

        protected _objectsFromRows():object[]
        {
            let objs : object[]  = [];
            let rows = this.getRows();
            let columns = this.getColumns();
            objs = rows.map(ele => {
                let obj = {};
                for(let i=0; i < columns.length; i++){
                    let col = columns[i];
                    obj[col] = ele[i];
                }
                return obj;
            });

            return objs;
        }

        protected _rowsFromObjects():[][]
        {
            let rows : any[][];
            let objs : object[] = this.getObjects();
            let columns = this.getColumns();
            rows = objs.map((ele) =>{
                let row:any[] = [];
                for(let i=0; i < columns.length; i++){
                    let col = columns[i];
                    let val : any = ele[col];
                    row.push(val);
                }
                return row;
            });

            // @ts-ignore
            return rows;
        }

        getObjects() : object[]
        {
            return this._objectsFromRows();
        }

    }

    let driverMap = {
        'oracle' : './driver/oracle/DriverOracle'
    }
    type DataSourceFactory = (args:DataSourceArgs)=>DataSource;
    export class DataSourceArgs
    {

    }
    export function createDataSource(driver:string, args:DataSourceArgs) : DataSource
    {
        let crtDS : DataSourceFactory = require(driverMap[driver]).default;
        if(crtDS === null){
            throw new Error('unknown driver:"'+driver+'"');
        }
        if( typeof crtDS !== 'function'){
            throw new Error('illegal driver:"'+crtDS+'"');
        }
        let ds:DataSource = crtDS(args);
        return ds;
    }

}



export = dbc;