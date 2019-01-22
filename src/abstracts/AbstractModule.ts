import {ModuleInterface} from "../interfaces/interfaces";

export abstract class AbstractModule implements ModuleInterface {

    abstract moduleName: string;

    constructor() {

    }

    getModuleName(): string {
        return this.moduleName
    }

    abstract async start(): Promise<void>;

}