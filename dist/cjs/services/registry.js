"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
const register_1 = require("../events/register");
class Registry {
    constructor(klient) {
        this.klient = klient;
        this.collection = {};
    }
    register(nameOrResource, entrypoint) {
        let resource = nameOrResource;
        if (typeof resource === 'string') {
            resource = new resource_1.default(resource, String(entrypoint));
        }
        this.collection[resource.name] = resource;
        resource.onRegistration(this.klient);
        this.klient.dispatcher.dispatch(new register_1.default(resource), false);
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
exports.default = Registry;
