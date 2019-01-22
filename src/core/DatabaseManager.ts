import Knex = require("knex");
import {AbstractModule} from "../abstracts/AbstractModule";
import {CreateTableBuilder} from "knex";
import Bookshelf = require("bookshelf");


let db:Knex;
let mem:Knex;

export default {

    db: function () : Knex {
        if (!db) {
            db = Knex({
                client: 'sqlite3',
                connection: {
                    filename: '../database/database.sqlite'
                },
                useNullAsDefault: true
            });
        }

        return db;
    },

    ormMem: function () : Bookshelf {
        let db = this.mem();
        let bs = Bookshelf(db);
        this.loadBookshelfPlugins(bs);
        return bs;
    },

    ormDb: function () : Bookshelf {
        let db = this.db();
        let bs = Bookshelf(db);
        this.loadBookshelfPlugins(bs);
        return bs;
    },

    loadBookshelfPlugins: function(bs:Bookshelf) {
        // Build in plugins
        bs.plugin('visibility');
        bs.plugin('pagination');
        // community plugins
        bs.plugin(require('bookshelf-uuid'));
        bs.plugin(require('bookshelf-secure-password'));
    },

    mem: function () : Knex {
        if (!db) {
            mem = Knex({
                client: 'sqlite3',
                connection: {
                    filename: ':memory:'
                },
                useNullAsDefault: true
            });
        }

        return mem;
    },

    createTable: function (database: Knex, module: AbstractModule, tableName: string) : Promise<CreateTableBuilder> {
        return new Promise(resolve => {
            let moduleTableprefix = module.databasePrefix;
            let moduleTableName = `${moduleTableprefix}_${tableName}`;

            // Check if the table already exists.
            database.schema.hasTable(moduleTableName)
                .then(exists => {
                    if (!exists) {
                        database.schema.createTable(moduleTableName,resolve)
                    }
                })
        });
    }

}