import { AbstractCommand } from "../abstracts/AbstractCommand";
import {User} from "discord.js";

export class NicknameCommand extends AbstractCommand {

    readonly command : string = 'nickname <mention="reset"> <new_nickname="reset">';

    readonly description: string = 'Changing peoples nickname';

    processCommand ( parameters ) : void
    {
        var mention = parameters.mention
        var new_nickname = parameters.new_nickname
        var users = this.message.mentions.users;
        var guild = this.message.guild;

        if (users.array().length <= 0 && new_nickname === 'reset') {
            if (mention === 'reset') {
                this.setNickName(this.message.author, this.message.author.username);
            } else {
                this.setNickName(this.message.author, mention);
            }
        } else if ( mention !=='reset' && new_nickname !== "reset" && users.array().length <= 0 ) {
            // TODO: Add some smart mapping to the user
            throw new Error(`No users mentioned`);
        } else {
            var user = users.first();
            var guildMember = guild.member(user);
            if ( guildMember.kickable ) {
                if (new_nickname === 'reset') {
                    this.setNickName(user, user.username);
                } else {
                    this.setNickName(user, new_nickname);
                }
            }
        }
    }

    private setNickName (user :User, nickname : string)
    {
        var guild = this.message.guild;
        var guildMember = guild.member(user);
        guildMember.setNickname(nickname)
            .catch(reason => {
                throw new Error(reason)
            })
    }
}