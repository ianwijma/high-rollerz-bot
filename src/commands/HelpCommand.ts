import { AbstractCommand } from "../abstracts/AbstractCommand";
import {MessageHandler} from "../MessageHandler";
import {
    each as _each
} from 'lodash'

export class HelpCommand extends AbstractCommand {

    readonly command : string = 'help <command="1">';

    readonly description: string = 'Help request';

    processCommand ( parameters ) : void
    {
        var messageHelper = new MessageHandler();
        var commands = messageHelper.getCommandsObject()
        var commandName = parameters.command;
        var message = "**HELP**\n";

        if (commandName.trim() !== '1') {
            if ( commandName in commands && commands[commandName].show_in_help ) {
                var commandInfo = commands[commandName];
                message = `**${commandInfo.name.toUpperCase()}**\n`;
                message += commandInfo.description
            } else {
                message = `can not find command '${commandName}'`;
            }
        } else {
            message = "**HELP**\n";
            _each(commands, commandInfo => {
                if ( commandInfo.show_in_help ) {
                    message += `${commandInfo.name} - ${commandInfo.description}\n`;
                }
            })
        }

        this.message.author.send(message,{code:true,split:true})
    }
}