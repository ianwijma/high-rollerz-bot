import {ModuleInterface} from "../interfaces";

export abstract class AbstractModule implements ModuleInterface{

    abstract eventPrefix: string;
    abstract moduleName: string;
    abstract databasePrefix: string;

    constructor() {

    }

    getEventPrefix(): string {
        return this.eventPrefix;
    }

    getDatabasePrefix(): string {
        return this.databasePrefix;
    }

    getModuleName(): string {
        return this.moduleName
    }

    abstract start(): Promise<void>;

}