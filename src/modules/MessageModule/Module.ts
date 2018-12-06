import {AbstractModule} from "../../abstracts/AbstractModule";

export class Module extends AbstractModule{

    databasePrefix: string = 'message';
    eventPrefix: string = 'message';
    moduleName: string = 'Message';

    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
            reject();
        });
    }


}