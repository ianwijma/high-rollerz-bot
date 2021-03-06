import { Message } from "discord.js";
import {CommandHelper} from "../lib/CommandHelper";

export abstract class AbstractCommand {

    readonly message: Message;

    abstract readonly command : string;

    abstract readonly description : string;

    abstract readonly example : string;

    readonly show_in_help : boolean = true;

    constructor (message:Message)
    {
        this.message = message;
    }

    public handle ()
    {
        var ezCommand = new CommandHelper(
            process.env.COMMAND_STARTER,
            this.command,
            this.message.toString(),
            parameters => { this.processCommand(parameters) }
        )
        try {
            ezCommand.call()
        } catch ( e ) {
            this.message.channel.send(`${global.emoji.getEmoji('no')} ${e.toString()}`);
        }
    }

    public getTrigger () {
        return this.command.split(' ').shift()
    }

    public getParameters () {
        var collection = this.command.split(' ');
        collection.shift();
        return collection.join(' ')
    }

    public getDescription () {
        return this.description
    }

    abstract processCommand( parameters : object ) : void

}