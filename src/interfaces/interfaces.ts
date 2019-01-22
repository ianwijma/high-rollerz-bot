export interface ModuleInterface {
    moduleName: string;
    getModuleName():string;
    start():Promise<void>;
}

export interface ModuleEventInterface {
    module:ModuleInterface;
    eventName:string;
    trigger():void;
}