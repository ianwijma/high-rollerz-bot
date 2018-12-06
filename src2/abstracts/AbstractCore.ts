

export abstract class AbstractCore {

    abstract name : string;

    abstract global_value : string;

    abstract  object : any;

    async start () : Promise<any> {
        await this.startCore();

        global[this.global_value] = this;

        return this.name
    }

    abstract async startCore ();

}