import {AbstractCore} from "../abstracts/AbstractCore";
import {DatabaseCore} from "./DatabaseCore";

export class GuildCore extends AbstractCore{

    global_value: string = 'guilds';

    name: string = 'Guilds Core';

    object: DatabaseCore;

    async startCore(): Promise<any> {
        this.object = global.db;

        await this.createTables();
    }

    async createTables() : Promise<any> {
        return new Promise(resolve => {
            // TODO: Create tables needed for guilds

            resolve();
        })
    }

}
