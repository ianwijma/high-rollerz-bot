import { AbstractCommand } from "../abstracts/AbstractCommand";

export class PurgeCommand extends AbstractCommand {

    readonly command : string = 'purge <amount=2>';

    readonly description: string = 'Purges message';

    processCommand ( parameters ) : void
    {
        var amount = parseInt(parameters.amount);
        if (amount > 100) {
            amount = 100;
        }

        this.message.channel.send(`Purging ${amount} messages...`)
            .then(()=>{
                this.message.channel.bulkDelete(amount)
            })
    }
}