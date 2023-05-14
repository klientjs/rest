import { Event } from '@klient/core';
export default class RegisterEvent extends Event {
    constructor(resource) {
        super();
        this.resource = resource;
    }
}
RegisterEvent.NAME = 'rest:register';
