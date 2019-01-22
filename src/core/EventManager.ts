import EventEmitter = NodeJS.EventEmitter;


class EventManager{

    bus:EventEmitter;

    getBus () {
        if (!this.bus) {
            this.bus = new EventEmitter();
        }
        return this.bus;
    }

    getTriggerName (moduleName:string, eventName: string) {
        return `${moduleName}_${eventName}`;
    }

    trigger (moduleName:string, eventName: string) {
        let triggerName = this.getTriggerName(moduleName, eventName);
        let bus = this.getBus();
        // @ts-ignore Typescript does not seem to know this is an array like object
        arguments.shift(); arguments.shift();
        bus.emit.apply(this, [triggerName, ...arguments]);
    }

    listen(moduleName:string, eventName:string) {
        let triggerName = this.getTriggerName(moduleName, eventName);
        let bus = this.getBus();
        // @ts-ignore Typescript does not seem to know this is an array like object
        arguments.shift(); arguments.shift();
        bus.on.apply(this, [triggerName, ...arguments]);
    }

    listenOnce(moduleName:string, eventName:string) {
        let triggerName = this.getTriggerName(moduleName, eventName);
        let bus = this.getBus();
        // @ts-ignore Typescript does not seem to know this is an array like object
        arguments.shift(); arguments.shift();
        bus.once.apply(this, [triggerName, ...arguments]);
    }

}

export default new EventManager();