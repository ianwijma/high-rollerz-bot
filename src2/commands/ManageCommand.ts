import { AbstractCommand } from "../abstracts/AbstractCommand";

export class ManageCommand extends AbstractCommand {

    readonly command : string = 'manage <action> <action_value="null">';

    readonly description: string = 'Actions that allow bot changing things';

    readonly show_in_help : boolean = false;

    readonly example: string = `${process.env.COMMAND_STARTER} manage name // changes the name of  the bot`;


    processCommand ( parameters ) : void
    {
        var trusted_ids = process.env.TRUSTED_IDS;
        var current_id = this.message.author.id;
        var can_execute = trusted_ids.split(',').indexOf(current_id) !== -1;

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
        actions['die'] = () => {this.die()};

        return actions
    }

    die ()
    {
        this.message.channel.send('Goodbye cruel world')
            .then(() => {
                this.message.channel.send('*Dies*');
                setTimeout(()=> {
                    process.abort()
                }, 500)
            });
    }

    changeName (action_value:string)
    {
        this.message.channel.send(`Updating bots user name to ${action_value}..`)
            .then(msg=>{
                global.discord.object.user.setUsername(action_value)
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
                global.discord.object.user.setActivity(action_value)
                    .then(()=>{
                        // @ts-ignore
                        msg.edit(`Updated bots game to ${action_value}`)
                    })
            });
    }
}