import {AbstractCore} from "../abstracts/AbstractCore";
import {DiscordCore} from "./DiscordCore";

export class EmojiCore extends AbstractCore{

    global_value: string = 'emoji';

    name: string = 'Emoji Core';

    object: DiscordCore;

    async startCore(): Promise<any> {
        this.object = global.discord;
    }

    getEmoji (emoji_name) : string {
        if ( emoji_name.startsWith(':') ) {
            emoji_name = emoji_name.substring(1)
        }

        if ( emoji_name.endsWith(':') ) {
            emoji_name = emoji_name.slice(0, -1)
        }

        return global.discord.object.emojis.find('name', emoji_name).toString()
    }

}
