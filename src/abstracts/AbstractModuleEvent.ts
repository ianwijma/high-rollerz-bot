import {ModuleEventInterface} from "../interfaces/interfaces";
import EventManager from "../core/EventManager";
import {AbstractModule} from "./AbstractModule";

export abstract class AbstractModuleEvent implements ModuleEventInterface {

    abstract eventName: string;

    abstract module: AbstractModule;

    trigger() {
        EventManager.trigger(this.module.getModuleName(), this.eventName);
    }

}