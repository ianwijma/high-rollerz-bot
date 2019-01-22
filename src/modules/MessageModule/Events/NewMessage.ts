import {AbstractModuleEvent} from "../../../abstracts/AbstractModuleEvent";

export default class NewMessage extends AbstractModuleEvent {
    eventName: string = 'newMessage';
}