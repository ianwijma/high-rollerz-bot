import { AbstractCommand } from "../abstracts/AbstractCommand";
import {
    isNaN as _isNaN
} from 'lodash';

export class AutoChannelCommand extends AbstractCommand {

    readonly command : string = 'autochannel <channel_id> <active_or_limit=0>';

    readonly description: string = 'Sets a channel as a auto channel, ' +
        'that will clone itsself when someone is in it. ' +
        'handy to get rid of massive amount of empty channels when no one is using them.';

    readonly example: string = `${process.env.COMMAND_STARTER} autochannel 446777354291773452 // Activates Auto channel on a voice channel
${process.env.COMMAND_STARTER} autochannel 446777354291773452 3 // Activates Auto channel on a voice channel and set the max clones to 3
${process.env.COMMAND_STARTER} autochannel 446777354291773452 false // Deactivates Auto channel on a voice channel`;

    processCommand ( parameters ) : void
    {
        var guild = this.message.guild;
        var user = this.message.author;
        var guild_member = guild.member(user);
        var channel_id = parameters.channel_id;
        var guild_id = guild.id;

        if (guild.owner.id !== guild_member.id) {
            throw Error('Ask the server owners to execute this command.');
        }

        if ( !guild.channels.has(channel_id) ) {
            throw Error(`Channel with id '${channel_id}' does not exists.`);
        }

        if ( !_isNaN( parseInt( parameters.active_or_limit ) )  ) {
            global.autochannel.setAutoChannel(guild_id, channel_id, parameters.active_or_limit)
                .then(() => {
                    if (parseInt(parameters.active_or_limit) <= 0) {
                        this.message.channel.send('Marked Channel as Auto Channel with unlimited clones')
                    } else {
                        this.message.channel.send(`Marked Channel as Auto Channel with a clone max of ${parameters.active_or_limit}`)
                    }
                })
        } else if ( parameters.active_or_limit === 'false' ) {
            global.autochannel.unsetAutoChannel(guild_id, channel_id)
                .then(success => {
                    if (success) {
                        this.message.channel.send('Unmarked Channel as Auto Channel.')
                    } else {
                        this.message.channel.send('Failed to unmarked channel as Auto Channel, it can be that it\'s already inactive.')
                    }
                })
        }

    }
}