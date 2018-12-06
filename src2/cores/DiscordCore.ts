import {AbstractCore} from "../abstracts/AbstractCore";
import {Channel, Client, Collection, VoiceChannel} from "discord.js";

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

    getChannels (channels : string|string[] ) : Collection<string,Channel> {
        if ( typeof channels === 'string' ){
            channels = [channels];
        };

        return this.object.channels.filter(channel => {
            return channels.indexOf(channel.id) !== -1;
        });
    }

    getVoiceChannels (channels : string|string[] ) : Collection<string,VoiceChannel> {
        if ( typeof channels === 'string' ){
            channels = [channels];
        };

        // @ts-ignore: Are always voice channels
        return this.object.channels.filter(channel => {
            return channels.indexOf(channel.id) !== -1 && channel.type === 'voice';
        });
    }

}
