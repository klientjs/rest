import Resource from './resource';
import RegisterEvent from '../events/register';
export default class Registry {
    constructor(klient) {
        this.klient = klient;
        this.collection = {};
    }
    register(nameOrResource, entrypoint) {
        let resource = nameOrResource;
        if (typeof resource === 'string') {
            resource = new Resource(resource, String(entrypoint));
        }
        this.collection[resource.name] = resource;
        resource.onRegistration(this.klient);
        this.klient.dispatcher.dispatch(new RegisterEvent(resource), false);
        return this;
    }
    unregister(resource) {
        delete this.collection[typeof resource === 'string' ? resource : resource.name];
        return this;
    }
    resource(name) {
        return this.collection[name];
    }
}
