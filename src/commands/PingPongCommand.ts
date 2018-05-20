import { AbstractCommand } from "../abstracts/AbstractCommand";

export class PingPongCommand extends AbstractCommand {

    readonly command : string = 'ping <amount=1>';

    readonly description: string = 'Replies with Pong!';

    processCommand ( parameters ) : void
    {
        var amount = parseInt(parameters.amount);

        if (amount > 10) {
            amount = 1
        }

        for (let index = 0; index < amount; index++) {
            if (amount > 1) {
                this.message.channel.send(`[${index+1}/${amount}] Pong!`)
            } else {
                this.message.channel.send('Pong!')
            }

        }
    }
}