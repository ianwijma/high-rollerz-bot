import {
    clone as _clone,
    isFunction as _isFunction
} from 'lodash'

export class CommandHelper {

    readonly pattern : string;

    readonly patternSplit : Array<string>;

    readonly command : string;

    readonly commandSplit : Array<string>;

    readonly callback : Function|null = null;

    /**
     *
     * @param {string} trigger      : Example: !hr
     * @param {string} pattern      : Example: ping <amount> <message="Pong!">
     * @param {string} command      : Example: !hr ping 4       Example :Hey how was your day!      Example: !rh ping 5 Hey
     * @param {Function} callback   : Example function (amount, message) { // do stuff here with the parameters }
     */
    constructor ( trigger : string, pattern : string, command : string, callback : Function|null = null )
    {
        this.pattern = `${trigger.trim()} ${pattern.trim()}`;
        this.patternSplit = this.pattern.split(' ');

        this.command = command.trim();
        this.commandSplit = this.commandString(this.command);

        if ( _isFunction(callback)  ) {
            this.callback = callback
        }
    }

    commandString (string) : Array<string>
    {
        var stringArray : Array<string> = [];
        var stringBuffer = '';
        var lockSpaceFlushing = false;

        string.split('').forEach(function (char) {
            if ( char === '"' && lockSpaceFlushing === false ) {
                lockSpaceFlushing = true;
            } else if ( char === '"' && lockSpaceFlushing === true ) {
                stringArray.push(stringBuffer);
                stringBuffer = '';
                lockSpaceFlushing = false;
            } else if (  char !== ' ' ) {
                stringBuffer += char;
            } else if ( char === ' ' && lockSpaceFlushing ) {
                stringBuffer += char;
            } else if ( lockSpaceFlushing === false ) {
                stringArray.push(stringBuffer);
                stringBuffer = '';
            }
        });

        if (stringBuffer.length !== 0) {
            stringArray.push(stringBuffer);
        }

        return stringArray;
    }

    call () : boolean
    {
        if ( this.shouldProcessCommand() ) {
            this.callback(this.getCommandParameters());
            return true;
        }
        return false;
    }

    shouldProcessCommand () : boolean
    {
        var patternSplit = _clone(this.patternSplit);
        var commandSplit = _clone(this.commandSplit);

        // Checks if the trigger are the same;
        if ( patternSplit.shift() !== commandSplit.shift() ) {
            return false
        }

        // Checks if the keywords are the same;
        if ( patternSplit.shift() !== commandSplit.shift() ) {
            return false
        }
        return true;
    }

    // <amount> <message="Pong!">
    getCommandParameters () : object
    {
        var parameters = {};
        var patternSplit = _clone(this.patternSplit);
        var commandSplit = _clone(this.commandSplit);
        var patternRegex = /<([a-z_]+)>|<([a-zA-Z_]+)=([a-zA-Z \d]+)>|<([a-zA-Z_]+)="([a-zA-Z \d]+)">/; // TODO: Fix fucked up regex xD

        // Checks if the trigger are the same;
        if ( patternSplit.shift() !== commandSplit.shift() ) {
            return parameters;
        }

        // Checks if the keywords are the same;
        if ( patternSplit.shift() !== commandSplit.shift() ) {
            return parameters;
        }

        /*
         * Not I know for sure its this command that they want to execute
         */

        if (commandSplit.length > patternSplit.length) {
            throw new Error(`Received too many arguments: please match "${this.pattern}"`);
        }

        patternSplit.forEach((patternItem : string, index) => {
            var commandVariable : any = undefined;
            if (commandSplit[index] !== void 0) {
                commandVariable = commandSplit[index];
            }
            if (!patternRegex.test(patternItem)) {
                throw new Error(`Incorrect parameter '${patternItem}'. Needs to be like '${this.pattern}'`)
            }

            var patternExec = patternRegex.exec(patternItem);

            // Getting of the variable name and fallback
            var variableName = '';
            var variableFallback : any = undefined;
            if ( patternExec[1] !== undefined ) {
                variableName = patternExec[1];
            } else

            if ( patternExec[2] !== undefined ) {
                variableName = patternExec[2];
                variableFallback = patternExec[3];
            } else

            if ( patternExec[4] !== undefined ) {
                variableName = patternExec[4];
                variableFallback = patternExec[5];
            }

            var value = commandVariable;
            if (value === undefined) {
                value = variableFallback;
            }

            if ( value === undefined ) {
                throw new Error(`Required index '${variableName}' not found '${this.pattern}'`);
            }

            parameters[variableName] = value;
        });

        return parameters;
    }

}