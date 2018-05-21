import { Client } from 'discord.js';
import { MessageHandler } from './MessageHandler';
import { EmojiHelper } from './lib/EmojiHelper';
import Knex from 'knex';

export class App {

    constructor () {
        global.discord = new Client();
        global.memDb = Knex({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            },
            useNullAsDefault: true
        });
        global.db = Knex({
            client: 'sqlite3',
            connection: {
                filename: 'database/database.sqlite'
            },
            useNullAsDefault: true
        });
    }

    public start () {
        this.startDatabase()
        this.startDiscord()
    }

    private startDiscord () {
        global.discord.on('ready', () => {
            console.log(`Successfully logged in as ${global.discord.user.tag}`);
        });

        global.discord.on('message', message => {
            let messageHandler = new MessageHandler(message);
            messageHandler.handle();
        });

        global.discord.login(process.env.DISCORD_BOT_TOKEN)

        // @ts-ignore
        global.emoji = new EmojiHelper()
    }

    private startDatabase () {

    }

}