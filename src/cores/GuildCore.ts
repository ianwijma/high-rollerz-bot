import {AbstractCore} from "../abstracts/AbstractCore";
import {DatabaseCore} from "./DatabaseCore";
import {QueryBuilder} from "knex";

export class GuildCore extends AbstractCore{

    global_value: string = 'guilds';

    name: string = 'Guilds Core';

    object: DatabaseCore;

    table: QueryBuilder;

    async startCore(): Promise<any> {
        this.object = global.db;

        await this.createTables();
    }

    async createTables() : Promise<any> {

    }

}
