import { AbstractCommand } from "../abstracts/AbstractCommand";

export class PingPongCommand extends AbstractCommand {

    readonly command : string = 'ping <amount=1>';

    readonly description: string = 'Replies with Pong!';

    readonly example: string = `${process.env.COMMAND_STARTER} ping // pong!`;

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