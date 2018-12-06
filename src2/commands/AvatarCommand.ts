import { AbstractCommand } from "../abstracts/AbstractCommand";

export class AvatarCommand extends AbstractCommand {

    readonly command : string = 'avatar <mention="none">';

    readonly description: string = 'Returns the avatar of an user';

    readonly example: string = `${process.env.COMMAND_STARTER} avatar // Gets your avatar
${process.env.COMMAND_STARTER} avatar @ianwijma // Gets the mentioned users avatar`;

    processCommand () : void
    {
        var guild = this.message.guild;
        var users = this.message.mentions.users;

        var user = this.message.author;
        if (users.array().length > 0) {
            user = users.first();
        }
        var guildMember = guild.member(user);
        var url = user.avatarURL;

        this.message.channel.send(url, {
            embed: {
                title: guildMember.displayName,
                image: {
                    url: user.avatarURL,
                    height: 512,
                    width: 512,
                },
                footer: {
                    text: user.tag
                }
            }
        });
    }
}