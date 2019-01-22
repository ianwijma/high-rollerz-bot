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

    async start (){
        await this.startModules();
    }


}