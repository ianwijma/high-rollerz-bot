import {AbstractCore} from "../abstracts/AbstractCore";
import Knex = require("knex");
import {CreateTableBuilder, QueryBuilder} from "knex";

export class DatabaseCore extends AbstractCore{

    global_value: string = 'db';

    name: string = 'Database Core';

    object: Knex;

    database_tables: Array<QueryBuilder> = [];

    database_path: string = 'database/database.sqlite';

    async startCore(): Promise<any> {
        this.object = Knex({
            client: 'sqlite3',
            connection: {
                filename: this.database_path
            },
            useNullAsDefault: true
        });

        await this.createTables();
    }

    /**
     *
     * @param table_name
     * @param {(tableBuilder: Knex.CreateTableBuilder) => any} table_callback
     * @returns {Promise<Knex.QueryBuilder>}
     */
    async createTable (table_name, table_callback : (tableBuilder: CreateTableBuilder) => any ) : Promise<QueryBuilder> {
        // @ts-ignore
        return new Promise(resolve => {
            this.object.schema.hasTable(table_name)
                .then(has_table => {{
                    if (has_table) {
                        this.getTable(table_name)
                            .then(value => resolve(value));
                    } else {
                        console.log(`Trying to create table with name ${table_name}`);
                        this.object.schema.createTableIfNotExists(table_name, table_callback)
                            .then(value => resolve(value));
                    }
                }})
        });
    }

    getTable (table_name) : QueryBuilder|null {
        return this.object.table(table_name);
    }

    async createTables() : Promise<any> {
        return new Promise(resolve => {
            // TODO: Create tables needed for guild

            resolve();
        })
    }

}
