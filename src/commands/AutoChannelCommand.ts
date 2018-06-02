import { AbstractCommand } from "../abstracts/AbstractCommand";

export class AutoChannelCommand extends AbstractCommand {

    readonly command : string = 'autochannel <channel_id> <active=true>';

    readonly description: string = 'Sets a channel as a auto channel, ' +
        'that will clone itsself when someone is in it. ' +
        'handy to get rid of massive amount of empty channels when no one is using them.';

    processCommand ( parameters ) : void
    {
        var guild = this.message.guild;
        var user = this.message.author;
        var guild_member = guild.member(user);
        var channel_id = parameters.channel_id;
        var guild_id = guild.id;

        if (guild.owner.id !== guild_member.id) {
            this.message.channel.send(`Ask the server owners to execute this command.`);
            return;
        }

        if ( !guild.channels.has(channel_id) ) {
            this.message.channel.send(`Channel with id '${channel_id}' does not exists.`);
            return;
        }

        if ( parameters.active === 'true' ) {
            global.autochannel.setAutoChannel(guild_id, channel_id)
                .then(() => {
                    this.message.channel.send('Channel set as Auto Channel.')
                })
        } else if ( parameters.active === 'false' ) {
            global.autochannel.unsetAutoChannel(guild_id, channel_id)
                .then(success => {
                    if (success) {
                        this.message.channel.send('Channel unset as Auto Channel.')
                    } else {
                        this.message.channel.send('Failed to unset channel as Auto Channel')
                    }
                })
        }

    }
}