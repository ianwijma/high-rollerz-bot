import {AbstractCore} from "../abstracts/AbstractCore";
import {DiscordCore} from "./DiscordCore";
import {GifCommand} from "../commands/GifCommand";
import {InviteCommand} from "../commands/InviteCommand";
import {HelpCommand} from "../commands/HelpCommand";
import {ManageCommand} from "../commands/ManageCommand";
import {SourceCommand} from "../commands/SourceCommand";
import {PingPongCommand} from "../commands/PingPongCommand";
import {AvatarCommand} from "../commands/AvatarCommand";
import { Message } from "discord.js";

export class CommandCore extends AbstractCore{

    global_value: string = 'command';

    name: string = 'Command Core';

    object: DiscordCore;
    
    command_array: any = [];

    async startCore(): Promise<any> {
        this.object = global.discord;

        await this.registerCommands();
        this.startListeners();
    }

    private registerCommands () {
        this.command_array.push( PingPongCommand );
        this.command_array.push( HelpCommand );
        this.command_array.push( ManageCommand );
        this.command_array.push( InviteCommand );
        this.command_array.push( SourceCommand );
        this.command_array.push( AvatarCommand );
        this.command_array.push( GifCommand );
    }

    private startListeners() {
        /**
         * @var Message message
         */
        this.object.eventbus.on('message', message => {
            if (message.toString().startsWith(process.env.COMMAND_STARTER)) {
                this.handle(message)
            }
        });
    }

    public getCommandsArray () : Array<object>
    {
        var commands = [];
        this.command_array.map(commandCls => {
            var command = new commandCls();
            commands.push({
                name: command.getTrigger(),
                description: command.getDescription(),
                show_in_help: command.show_in_help,
                class: command,
                rawClass: commandCls,
            });
        });
        return commands;
    }

    public getCommandsObject () : object
    {
        var commands = {};
        this.command_array.map(commandCls => {
            var command = new commandCls();
            commands[command.getTrigger()] = {
                name: command.getTrigger(),
                description: command.getDescription(),
                show_in_help: command.show_in_help,
                class: command,
                rawClass: commandCls,
            };
        });
        return commands;
    }

    private handle ( message : Message ) : void {
        if ( message !== null) {
            this.command_array.forEach(CommandHandleClass => {
                let commandHandle = new CommandHandleClass(message);
                commandHandle.handle();
            });
        }
    }

}
