import { Message } from "discord.js";
import { PingPongCommand } from "./commands/PingPongCommand";
import {HelpCommand} from "./commands/HelpCommand";
import {ManageCommand} from "./commands/ManageCommand";
// import {KickCommand} from "./commands/KickCommand";
import {InviteCommand} from "./commands/InviteCommand";
import {SourceCommand} from "./commands/SourceCommand";
import {NicknameCommand} from "./commands/NicknameCommand";
import {AvatarCommand} from "./commands/AvatarCommand";
import {GifCommand} from "./commands/GifCommand";
import {PurgeCommand} from "./commands/PurgeCommand";

export class MessageHandler {

    private readonly message: Message|null;

    private readonly commandArray: any;
    
    constructor ( message: Message|null = null ) {
        this.message = message;
        this.commandArray = [];
        this.register();
    }

    private register () : void {
        this.commandArray.push( PingPongCommand );
        this.commandArray.push( HelpCommand );
        this.commandArray.push( ManageCommand );
        // this.commandArray.push( KickCommand );
        this.commandArray.push( InviteCommand );
        this.commandArray.push( SourceCommand );
        this.commandArray.push( NicknameCommand );
        this.commandArray.push( AvatarCommand );
        this.commandArray.push( GifCommand );
        this.commandArray.push( PurgeCommand );
    }

    public getCommandsArray () : Array<object>
    {
        var commands = [];
        this.commandArray.map(commandCls => {
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
        this.commandArray.map(commandCls => {
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

    public handle () : void {
        if (this.message !== null) {
            this.commandArray.forEach(CommandHandleClass => {
                let commandHandle = new CommandHandleClass(this.message);
                commandHandle.handle();
            });
        }
    }



}