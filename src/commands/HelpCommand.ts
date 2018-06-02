import { AbstractCommand } from "../abstracts/AbstractCommand";
import {
    each as _each
} from 'lodash'

export class HelpCommand extends AbstractCommand {

    readonly command : string = 'help <command="1">';

    readonly description: string = 'Help request';

    readonly example: string = `${process.env.COMMAND_STARTER} help // Sends you a PM with this message
${process.env.COMMAND_STARTER} help gif // Sends you a PM with all the info about one command`;


    processCommand ( parameters ) : void
    {
        var commands = global.command.getCommandsObject()
        var commandName = parameters.command;
        var message = `**HELP**`;

        if (commandName.trim() !== '1') {
            if ( commandName in commands && commands[commandName].show_in_help ) {
                var commandInfo = commands[commandName];
                message = `**${commandInfo.name.toUpperCase()}**
\`\`\`Example:
${commandInfo.example}
Description:
${commandInfo.description}
Parameters:
${commandInfo.parameters}
\`\`\``
            } else {
                message = `can not find command '${commandName}'`;
            }
        } else {
            message = "__**HELP**__\n\n";
            _each(commands, commandInfo => {
                // @ts-ignore
                if ( commandInfo.show_in_help ) {
                    // @ts-ignore
                    message += `__${commandInfo.name.toUpperCase()}__
\`\`\`Example:
${commandInfo.example}
Description:
${commandInfo.description}
Parameters:
${commandInfo.parameters}
\`\`\``;
                }
            })
        }

        this.message.author.send(message,{split:true})
    }
}