import {AbstractCore} from "../abstracts/AbstractCore";
import {DiscordCore} from "./DiscordCore";
import {DatabaseCore} from "./DatabaseCore";
import {QueryInterface} from "knex";

export class AutoChannelCore extends AbstractCore{

    global_value: string = 'autochannel';

    name: string = 'Auto Channel Core';

    object: DiscordCore;

    database: DatabaseCore;

    table: QueryInterface;

    table_name : string = 'auto-channel';

    channels: Array<any>;

    async startCore(): Promise<any> {
        this.object = global.discord;
        this.database = global.db;
        this.table = await this.initializeDatabase();
        this.channels = await this.initializeChannelsToWatch();
        this.initializeListeners();
    }

    private async initializeDatabase () {
        return this.database.createTable(this.table_name, table => {
            table.increments('id');
            table.integer('channel_id');
            table.integer('guild_id');
            table.string('cloned_channel_ids').defaultTo('');
            table.boolean('active').defaultTo(true);
            table.timestamps();

            table.unique(['channel_id','guild_id']);
            table.index(['channel_id','guild_id']);
        })
    }

    private initializeChannelsToWatch () : Promise<string[]> {
        return new Promise(resolve => {
            this.database.getTable(this.table_name).select(['channel_id', 'cloned_channel_ids']).where('active', true)
                .then(resolve);
        })
    }

    private initializeListeners () {

    }

    async setAutoChannel ( guild_id : string, channel_id : string ) {
        var table = this.database.getTable(this.table_name);
        var data = {
            'guild_id':     parseInt(guild_id),
            'channel_id':   parseInt(channel_id),
            'active':   true,
        };
        var where = table.where(data);

        return new Promise(resolve => {
            where.then(rows => {
                if ( rows.length !== 1) {
                    table.insert(data)
                        .then(() => resolve(true));
                }  else {
                    table.update(data)
                        .then(() => resolve(true));
                }
            })
        })
    }

    async unsetAutoChannel ( guild_id : string, channel_id : string ) {
        var table = this.database.getTable(this.table_name);
        var data = {
            'guild_id':     parseInt(guild_id),
            'channel_id':   parseInt(channel_id),
            'active':       true,
        };
        var where = table.where(data);

        data.active =       false;

        return new Promise(resolve => {
            where.then(rows => {
                if ( rows.length !== 1) {
                    resolve(false);
                }  else {
                    table.update(data)
                        .then(() => resolve(true));
                }
            })
        })
    }

}
