import { AbstractCommand } from "../abstracts/AbstractCommand";

export class SourceCommand extends AbstractCommand {

    readonly command : string = 'source';

    readonly description: string = 'Returns the GitHub Repository';

    readonly example: string = `${process.env.COMMAND_STARTER} source // returns you the link to the source code`;

    processCommand () : void
    {
        this.message.author.send(`The beautiful sause code you can find @ https://github.com/ianwijma/high-rollerz-bot`)
    }
}