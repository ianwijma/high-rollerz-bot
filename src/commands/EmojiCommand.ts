import { AbstractCommand } from "../abstracts/AbstractCommand";
import Request from 'request'

export class EmojiCommand extends AbstractCommand {

    readonly command : string = 'emoji <emoji_name> <message_id>';

    readonly description: string = 'new emoji stuff';

    readonly example: string = `${process.env.COMMAND_STARTER} newemoji test 446777354291773452 // Seeks in the mssage for a image and create a new emoji from it :test:`;

    processCommand ( parameters ) : void
    {
        var emoji_name = parameters.emoji_name;
        var message_id = parameters.message_id;
        var user = this.message.author;
        var guild = this.message.guild;
        var guild_member = guild.member(user);

        if (guild.owner.id !== guild_member.id) {
            throw Error('Ask the server owners to execute this command.');
        }

        if (message_id.trim() === 'remove') {
            guild.deleteEmoji(emoji_name, 'Remove emoji')
                .then(() => {
                    this.message.channel.send(`Emoji ":${emoji_name}:" removed`)
                })
        } else {
            this.message.channel.fetchMessage(message_id)
                .then(message => {
                    var attachment = message.attachments.first();
                    if (attachment) {
                        var request = Request.defaults({encoding:null});
                        request.get(attachment.url, (_, __, body) => {
                            guild.createEmoji(
                                body,
                                emoji_name,
                                [],
                                'New Emoji'
                            ).then(() => {
                                this.message.channel.send(`Emoji added: ${global.emoji.getEmoji(emoji_name)}`);
                            });
                        })
                    }
                })
        }


    }
}