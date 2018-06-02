import { AbstractCommand } from "../abstracts/AbstractCommand";

export class InviteCommand extends AbstractCommand {

    readonly command : string = 'invite <max_usages=1>';

    readonly description: string = 'Create an invite for one person';

    readonly example: string = `${process.env.COMMAND_STARTER} invite // Creates you a one time use invite
${process.env.COMMAND_STARTER} invite 10 // Creates you a invite that can be used 10 times`;

    processCommand ( parameters ) : void
    {
        var max_usages = parameters.max_usages;
        if (max_usages <= 0) {
            max_usages = 1
        }
        global.guild.getDefaultChannel( this.message.guild )
            .then(guildChannel => {
                guildChannel.createInvite({maxUses:max_usages,maxAge:86400,unique:true})
                    .then(invite => {
                        this.message.author.send(`One time invite that's valid for one day: ${invite.url}`)
                    })
            });
    }
}