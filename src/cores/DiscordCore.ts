import {AbstractCore} from "../abstracts/AbstractCore";
import {Client} from "discord.js";

export class DiscordCore extends AbstractCore{

    global_value: string = 'discord';

    name: string = 'Discord Core';

    object: Client;

    eventbus: Client;

    async startCore(): Promise<any> {
        this.eventbus = this.object = new Client();

        await this.startDiscord();
    }

    async startDiscord() {
        return new Promise(resolve => {
            this.object.on('ready', () => {
                resolve()
            });

            this.object.login(process.env.DISCORD_BOT_TOKEN);
        })
    }

}
