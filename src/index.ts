import { Client } from 'discord.js';
import { MessageHandler } from './MessageHandler';
import { EmojiHelper } from './lib/EmojiHelper';

export class App {

    constructor () {
        global.discord = new Client();
    }

    public start () {
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

}