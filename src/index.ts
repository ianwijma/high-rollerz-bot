export default class App {


    constructor() {
        this.initializeApp();
    }

    initializeApp () {

    }

    async startModules () : Promise<any> {
        return new Promise(resolve => {
            resolve()
        })
    }

    async start () : Promise<any> {
        let res;
        let prom = new Promise(resolve => {res = resolve});

        await this.startModules();

        res();
        return prom;
    }


}