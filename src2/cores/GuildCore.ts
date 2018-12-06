import {AbstractCore} from "../abstracts/AbstractCore";
import {DiscordCore} from "./DiscordCore";
import {Guild, GuildChannel} from "discord.js";

export class GuildCore extends AbstractCore{

    global_value: string = 'guild';

    name: string = 'Guilds Core';

    object: DiscordCore;

    async startCore(): Promise<any> {
        this.object = global.discord;
    }

    /**
     * Tries to get the default channel
     * @param {module:discord.js.Guild} guild
     * @returns {Promise<module:discord.js.GuildChannel>}
     */
    async getDefaultChannel ( guild : Guild ) : Promise<GuildChannel>
    {
        // get "original" default channel
        if(guild.channels.has(guild.id))
            return guild.channels.get(guild.id)

        // Check for a "general" channel, which is often default chat
        if(guild.channels.exists("name", "general"))
            return guild.channels.find("name", "general");

        // Now we get into the heavy stuff: first channel in order where the bot can speak
        // hold on to your hats!
        return guild.channels
            .filter(c => c.type === "text" &&
                c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
            .first();
    }

}
