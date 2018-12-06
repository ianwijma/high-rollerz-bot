import {AbstractCore} from "../abstracts/AbstractCore";
import {DiscordCore} from "./DiscordCore";
import { Message } from "discord.js";
import {DatabaseCore} from "./DatabaseCore";
import CircularJSON from "circular-json";

export class MessageCore extends AbstractCore{

    global_value: string = 'message';

    name: string = 'Message Core';

    object: DiscordCore;

    database: DatabaseCore;

    table_name: string = 'messages';

    async startCore(): Promise<any> {
        this.object = global.discord;
        this.database = global.db;

        await this.initializeDatabase();
        this.startListeners();
    }

    private async initializeDatabase () {
        return this.database.createTable(this.table_name, table => {
            table.increments('id');
            table.string('channel_id');
            table.string('guild_id');
            table.string('user_id');
            table.string('message_id');
            table.string('guild_member_id');
            table.string('message_content_original');
            table.string('message_content_current');
            table.string('message_content_history');
            table.string('message_object');

            table.boolean('is_deleted').defaultTo(false);
            table.boolean('is_edited').defaultTo(false);

            table.timestamps();

            table.unique(['channel_id','guild_id','user_id','message_id']);
            table.index(['channel_id','guild_id','user_id','message_id']);
        })
    }

    private startListeners() {
        /**
         * @var Message message
         */
        this.object.eventbus.on('message', message => {
            this.handleNew(message)
        });
        this.object.eventbus.on('messageDelete', message => {
            this.handleDelete(message)
        });
        this.object.eventbus.on('messageUpdate', (oldMessage, newMessage) => {
            this.handleUpdate(oldMessage, newMessage)
        });
    }

    private async handleNew ( message : Message ) {
        var table = this.database.getTable(this.table_name);
        var data = {
            channel_id: message.channel.id,
            guild_id: message.guild.id,
            user_id: message.author.id,
            message_id: message.id,
            guild_member_id: message.member.id,
            message_content_original: message.toString(),
            message_content_current: message.toString(),
            message_content_history: JSON.stringify([message.toString()]),
            // @ts-ignore
            message_object: CircularJSON.stringify(message),
        };
        return table.insert(data);
    }

    private handleDelete ( message : Message ) {
        var table = this.database.getTable(this.table_name);
        var where = table.where({
            channel_id: message.channel.id,
            guild_id: message.guild.id,
            user_id: message.author.id,
            message_id: message.id
        });

        return new Promise(resolve => {
            where.then(rows => {
                var update_data = {
                    channel_id: message.channel.id,
                    guild_id: message.guild.id,
                    user_id: message.author.id,
                    message_id: message.content,
                    is_deleted: true,
                };
                if (rows.length === 1) {
                    table.update(update_data).then( () => resolve(true));
                } else {
                    this.handleNew(message).then( () => {
                        table.update(update_data).then( () => resolve(true));
                    });
                }
            })
        })
    }

    private handleUpdate ( oldMessage : Message, newMessage : Message ) {
        var table = this.database.getTable(this.table_name);
        var where = table.where({
            channel_id: oldMessage.channel.id,
            guild_id: oldMessage.guild.id,
            user_id: oldMessage.author.id,
            message_id: oldMessage.id
        });

        return new Promise(resolve => {
            where.then(rows => {
                var update_data = {
                    channel_id: newMessage.channel.id,
                    guild_id: newMessage.guild.id,
                    user_id: newMessage.author.id,
                    message_id: newMessage.id,
                    message_content_current: newMessage.toString(),
                    is_edited: true
                };
                if (rows.length === 1) {
                    var row = rows[0];
                    var history = JSON.parse(row.message_content_history);
                    history.push( newMessage.toString() );
                    // @ts-ignore
                    update_data.message_content_history = JSON.stringify( history );
                    table.update(update_data).then( () => resolve(true));
                } else {
                    this.handleNew(oldMessage).then( () => {
                        table.update(update_data).then( () => resolve(true));
                    });
                }
            })
        })
    }

}
