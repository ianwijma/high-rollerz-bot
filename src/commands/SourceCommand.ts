import { AbstractCommand } from "../abstracts/AbstractCommand";

export class SourceCommand extends AbstractCommand {

    readonly command : string = 'source';

    readonly description: string = 'Returns the GitHub Repository';

    processCommand () : void
    {
        this.message.author.send(`The beautiful sause code you can find @ https://github.com/ianwijma/high-rollerz-bot`)
    }
}