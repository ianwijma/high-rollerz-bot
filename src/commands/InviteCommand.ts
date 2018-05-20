import { AbstractCommand } from "../abstracts/AbstractCommand";
import {Guild, GuildChannel} from "discord.js";

export class InviteCommand extends AbstractCommand {

    readonly command : string = 'invite <max_usages=1>';

    readonly description: string = 'Create an invite for one person';

    processCommand ( parameters ) : void
    {
        var max_usages = parameters.max_usages;
        this.getDefaultChannel()
            .then(guildChannel => {
                guildChannel.createInvite({maxUses:max_usages,maxAge:86400,unique:true})
                    .then(invite => {
                        this.message.channel.send(`One time invite that's valid for one day: ${invite.url}`)
                    })
            });
    }

    async getDefaultChannel () : Promise<GuildChannel>
    {
        var guild : Guild = this.message.guild;
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