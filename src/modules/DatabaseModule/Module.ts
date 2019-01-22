import {AbstractModule} from "../../abstracts/AbstractModule";
import Knex = require("knex");

export class Module extends AbstractModule{

    databasePrefix: string = 'database';
    eventPrefix: string = 'database';
    moduleName: string = 'Database';

    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            global.db = Knex({
                client: 'sqlite3',
                connection: {
                    filename: '../database/database.sqlite'
                },
                useNullAsDefault: true
            });


            // TODO: Create sql database
            // TODO: Create memory database

            resolve();
            reject();
        });
    }


}