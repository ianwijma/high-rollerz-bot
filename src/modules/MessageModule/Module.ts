import {AbstractModule} from "../../abstracts/AbstractModule";

export class Module extends AbstractModule{

    moduleName: string = 'Message';

    async start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
            reject();
        });
    }


}