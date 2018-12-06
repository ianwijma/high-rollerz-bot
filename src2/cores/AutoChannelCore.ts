import {AbstractCore} from "../abstracts/AbstractCore";
import {DiscordCore} from "./DiscordCore";
import {DatabaseCore} from "./DatabaseCore";
import {QueryInterface} from "knex";
import {schedule as cron} from "node-cron";
import {
    each as _each
} from 'lodash';
import {Collection, VoiceChannel} from "discord.js";

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
            table.string('channel_id');
            table.string('guild_id');
            table.string('cloned_channel_ids').defaultTo('');
            table.integer('channel_limit').defaultTo(0);
            table.boolean('active').defaultTo(true);
            table.timestamps();

            table.unique(['channel_id','guild_id']);
            table.index(['channel_id','guild_id']);
        })
    }

    private initializeChannelsToWatch () : Promise<string[]> {
        return new Promise(resolve => {
            this.database.getTable(this.table_name).select(['channel_id', 'cloned_channel_ids', 'channel_limit']).where('active', true)
                .then(resolve);
        })
    }

    private initializeListeners () {
        cron('*/10 * * * * *', () => {
            this.clonePopulatedChannels() // TODO: Fixed cloning of channels without the need for one.
        })
    }

    private clonePopulatedChannels () {
        var channel_ids = [];
        _each(this.channels, channel => {
            channel_ids.push(channel.channel_id);
            if (channel.cloned_channel_ids.length > 0) {
                channel_ids = channel_ids.concat(channel.cloned_channel_ids.split(','));
            }
        });
        var main_channels = global.discord.getVoiceChannels(channel_ids);
        _each(this.channels, channel => {
            var needs_additional_channel = false;
            var main_channel = main_channels.get(channel.channel_id);
            var cloned_channel_index = main_channel.position;
            var cloned_channel_parent = main_channel.parent.id;
            var sheep_channels : Collection<string,VoiceChannel>|null = null;
            if (channel.cloned_channel_ids.length > 0) {
                sheep_channels = global.discord.getVoiceChannels(channel_ids.concat(channel.cloned_channel_ids.split(',')));
            }

            var sheep_channels_to_remove : VoiceChannel[] = [];
            if ( main_channel.members.array().length > 0 ) {
                needs_additional_channel = true;
                if ( sheep_channels !== null) {
                    var can_make_more = channel.limit === 0 ? true : sheep_channels.array().length <= channel.limit;
                    if (can_make_more) {
                        sheep_channels.array().forEach(channel => {
                            console.log('Loop!');
                            // Checking if another channel is needed
                            if ( channel.members.array().length <= 0 && needs_additional_channel ) {
                                console.log('Sheep member count'+channel.members.array().length);
                                needs_additional_channel = false;
                            } else if ( channel.members.array().length <= 0 ) {
                                sheep_channels_to_remove.push(channel);
                            }

                            cloned_channel_index++;
                        });
                    } else {
                        needs_additional_channel = false;
                    }
                }
            }
            if (needs_additional_channel) {
                var sheep_index = sheep_channels !== null ? sheep_channels.array().length : 1;
                main_channel.clone(
                    main_channel.name+' 🐏'+sheep_index,
                    true,
                    false,
                    `Main channel and sheep channels full, sheep_index:${sheep_index}`
                ).then(channel => {
                    this.addSheepToAutoChannel(main_channel.guild.id, main_channel.id, channel.id);
                    channel.setParent(cloned_channel_parent).then(() => {
                        console.log(`Wanted parent ${cloned_channel_parent} --- got ${channel.parent.id}`);
                        channel.setPosition(cloned_channel_index + 1).then(() => {
                            console.log(`Wanted positions ${cloned_channel_index + 1} --- got ${channel.position}`)
                        });
                    });
                })
            } else {
                var deleted_channels = [];
                sheep_channels_to_remove.forEach(channel => {
                    if (channel.deletable) {
                        channel.delete('Unneeded sheep channel')
                        deleted_channels.push(channel.id);
                    }
                });
                this.removeSheepsFromAutoChannel(main_channel.guild.id, main_channel.id, deleted_channels)
            }
        })
    }

    async addSheepToAutoChannel ( guild_id : string, channel_id : string, sheep_channel_id : string ) {
        var table =         this.database.getTable(this.table_name);
        var where =         table.where({
            'guild_id':     guild_id,
            'channel_id':   channel_id,
        });
        var data = {
            'guild_id':     guild_id,
            'channel_id':   channel_id,
            'updated_at':   new Date().toString(),
        };

        return new Promise(resolve => {
            where.then(rows => {
                if ( rows.length === 1) {
                    var row = rows[0];
                    var current_sheeps = row.cloned_channel_ids.split(',');
                    var new_sheeps = [sheep_channel_id];
                    current_sheeps.forEach(current_sheep_channel_id => {
                        if (current_sheep_channel_id.trim() !== '') {
                            new_sheeps.push(current_sheep_channel_id)
                        }
                    })
                    // @ts-ignore
                    data.cloned_channel_ids = new_sheeps.join(',');
                    table.update(data)
                        .then(() => {
                            this.initializeChannelsToWatch().then(channels => {
                                this.channels = channels;
                                resolve(true)
                            });
                        });
                }
            })
        })
    }

    async removeSheepsFromAutoChannel ( guild_id : string, channel_id : string, sheep_channel_ids : string|string[] ) {
        if (typeof sheep_channel_ids === 'string') {
            sheep_channel_ids = [sheep_channel_ids];
        }

        var table =         this.database.getTable(this.table_name);
        var where =         table.where({
            'guild_id':     guild_id,
            'channel_id':   channel_id,
        });
        var data = {
            'guild_id':     guild_id,
            'channel_id':   channel_id,
            'updated_at':   new Date().toString(),
        };

        return new Promise(resolve => {
            where.then(rows => {
                if ( rows.length === 1) {
                    var row = rows[0];
                    var current_sheeps = row.cloned_channel_ids.split(',');
                    var new_sheeps = [];
                    current_sheeps.forEach(sheep_channel_id => {
                        if (sheep_channel_ids.indexOf(sheep_channel_id) !== -1 && sheep_channel_id.trim() !== '') {
                            new_sheeps.push(sheep_channel_id);
                        }
                    });
                    // @ts-ignore
                    data.cloned_channel_ids = new_sheeps.join(',');
                    table.update(data)
                        .then(() => {
                            this.initializeChannelsToWatch().then(channels => {
                                this.channels = channels;
                                resolve(true)
                            });
                        });
                }
            })
        })
    }

    async setAutoChannel ( guild_id : string, channel_id : string, channel_limit : string ) {
        var table =         this.database.getTable(this.table_name);
        var where =         table.where({
            'guild_id':     guild_id,
            'channel_id':   channel_id,
        });
        var date =          new Date().toString();
        var data = {
            'guild_id':     guild_id,
            'channel_id':   channel_id,
            'channel_limit':   parseInt(channel_limit),
            'active':       true,
        };

        return new Promise(resolve => {
            where.then(rows => {
                if ( rows.length === 1) {
                    // @ts-ignore
                    data.updated_at = date;
                    table.update(data)
                        .then(() => {
                            this.initializeChannelsToWatch().then(channels => {
                                this.channels = channels;
                                resolve(true)
                            });
                        });
                }  else {
                    // @ts-ignore
                    data.created_at = date;
                    table.insert(data)
                        .then(() => {
                            this.initializeChannelsToWatch().then(channels => {
                                this.channels = channels;
                                resolve(true)
                            });
                        });

                }
            })
        })
    }

    async unsetAutoChannel ( guild_id : string, channel_id : string ) {
        var table = this.database.getTable(this.table_name);
        var where = table.where({
            'guild_id':     guild_id,
            'channel_id':   channel_id,
        });
        var data = {
            'guild_id':     guild_id,
            'channel_id':   channel_id,
            'updated_at':   new Date().toString(),
            'channel_limit':   -1,
            'active':       false,
        };

        return new Promise(resolve => {
            where.then(rows => {
                if ( rows.length !== 1) {
                    resolve(false);
                }  else {
                    table.update(data)
                        .then(() => {
                            this.initializeChannelsToWatch().then(channels => {
                                this.channels = channels;
                                resolve(true)
                            });
                        });

                }
            })
        })
    }

}
