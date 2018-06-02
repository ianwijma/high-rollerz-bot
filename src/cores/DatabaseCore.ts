import {AbstractCore} from "../abstracts/AbstractCore";
import Knex = require("knex");

export class DatabaseCore extends AbstractCore{

    global_value: string = 'db';

    name: string = 'Database Core';

    object: Knex;

    async startCore(): Promise<any> {
        this.object = Knex({
            client: 'sqlite3',
            connection: {
                filename: 'database/database.sqlite'
            },
            useNullAsDefault: true
        });

        await this.createTables();
    }

    async createTables() : Promise<any> {
        return new Promise(resolve => {
            // TODO: Create tables needed for guilds

            resolve();
        })
    }

}
