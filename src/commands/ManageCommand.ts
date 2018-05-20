import { AbstractCommand } from "../abstracts/AbstractCommand";

export class ManageCommand extends AbstractCommand {

    readonly command : string = 'manage <action> <action_value>';

    readonly description: string = 'Actions that allow bot changing things';

    readonly show_in_help : boolean = false;

    processCommand ( parameters ) : void
    {
        var trusted_ids = process.env.TRUSTED_IDS;
        var current_id = this.message.author.id;
        var can_execute = false;
        trusted_ids.split(',').forEach(id => {
            if ( current_id === id ) {
                can_execute = true;
            }
        });

        if (!can_execute) {
            throw new Error('Lol no, nice try.');
        }

        var actions = this.getActions();
        var action = parameters.action;
        var action_value = parameters.action_value;

        if (action in actions) {
            actions[action](action_value)
        } else {
            this.message.channel.send(`Could not find manage action ${action}`);
        }
    }

    getActions () : object
    {
        var actions = {};

        actions['name'] = value => {this.changeName(value)};
        actions['game'] = value => {this.changeGame(value)};

        return actions
    }

    changeName (action_value:string)
    {
        this.message.channel.send(`Updating bots user name to ${action_value}..`)
            .then(msg=>{
                global.discord.user.setUsername(action_value)
                    .then(()=>{
                        // @ts-ignore
                        msg.edit(`Updated bots user name to ${action_value}`)
                    })
            });
    }

    changeGame (action_value:string)
    {
        this.message.channel.send(`Updating bots game to ${action_value}..`)
            .then(msg=>{
                global.discord.user.setActivity(action_value)
                    .then(()=>{
                        // @ts-ignore
                        msg.edit(`Updated bots game to ${action_value}`)
                    })
            });
    }
}