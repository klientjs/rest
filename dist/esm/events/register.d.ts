import { Event } from '@klient/core';
import type Resource from '../services/resource';
export default class RegisterEvent extends Event {
    resource: Resource;
    static NAME: string;
    constructor(resource: Resource);
}
