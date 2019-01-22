export interface ModuleInterface {
    moduleName: string;
    eventPrefix:string;
    databasePrefix:string;
    getDatabasePrefix():string;
    getEventPrefix():string;
    getModuleName():string;
    start():Promise<void>;
}