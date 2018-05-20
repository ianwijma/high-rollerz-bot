import { AbstractCommand } from "../abstracts/AbstractCommand";
import {Guild, GuildChannel, GuildMember} from "discord.js";

export class KickCommand extends AbstractCommand {

    readonly command : string = 'kick <mention> <send_invite_url_after_kick="true">';

    readonly description: string = 'Kicking people from the server';

    processCommand ( parameters ) : void
    {
        var send_invite_url_after_kick = parameters.send_invite_url_after_kick;
        // var mention = parameters.mention;
        var guild = this.message.guild;
        var guildName = guild.name;

        var users = this.message.mentions.users;

        if (users.array().length <= 0) {
            // TODO: Add some smart mapping to the user
            throw new Error(`No users mentioned`);
        }

        users.forEach(user => {
            var guildMember = guild.member(user);
            if (guildMember.id !== this.message.author.id && guildMember.kickable) {

                if (send_invite_url_after_kick === 'true') {

                    this.sendInvite(guildName,guildMember)
                        .then(() => {
                            guildMember.kick()
                                .then(() => {
                                    this.message.channel.send(`User ${user.username} kicked`)
                                })
                        })
                        .catch(e => {
                            this.message.channel.send(e,{code:true});
                        });
                } else {
                    guildMember.kick()
                        .then(() => {
                            this.message.channel.send(`User ${user.username} kicked`)
                        });
                }
            }
        })
    }

    async sendInvite ( guildName: string, guildMember : GuildMember)
    {
        return new Promise(resolve => {
            this.getDefaultChannel()
                .then(channel => {
                    channel.createInvite({
                        maxUses: 1,
                        unique: true
                    }).then(invite => {
                        resolve( guildMember.user.sendMessage(`[${guildName}]: You have been kicked, here is your one time invite url: ${invite.url}`) );
                    })
                })
        })
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