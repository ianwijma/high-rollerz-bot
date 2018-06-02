import {AbstractCore} from "../abstracts/AbstractCore";
import Knex = require("knex");

export class MemoryDatabaseCore extends AbstractCore{

    global_value: string = 'memdb';

    name: string = 'Memory Database Core';

    object: Knex;

    async startCore(): Promise<any> {
        this.object = Knex({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            },
            useNullAsDefault: true
        });

        await this.createTables();
    }

    async createTables() : Promise<any> {
        return new Promise(resolve => {
            // TODO: Create tables needed for guild

            resolve();
        })
    }

}
