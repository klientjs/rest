"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extension = exports.load = exports.RegisterEvent = exports.Resource = void 0;
const core_1 = require("@klient/core");
const registry_1 = require("./services/registry");
var resource_1 = require("./services/resource");
Object.defineProperty(exports, "Resource", { enumerable: true, get: function () { return resource_1.default; } });
var register_1 = require("./events/register");
Object.defineProperty(exports, "RegisterEvent", { enumerable: true, get: function () { return register_1.default; } });
const load = (registry, data) => {
    const keys = Object.keys(data);
    for (let i = 0, len = keys.length; i < len; i += 1) {
        const alias = keys[i];
        const value = data[alias];
        if (typeof value === 'string') {
            registry.register(alias, value);
        }
        else {
            registry.register(value);
        }
    }
    return this;
};
exports.load = load;
exports.extension = {
    name: '@klient/rest',
    initialize: (klient) => {
        const registry = new registry_1.default(klient);
        klient.services.set('resources', registry);
        klient
            .extends('rest', registry)
            .extends('resource', registry.resource.bind(registry))
            .extends('register', (nameOrResource, entrypoint) => {
            registry.register(nameOrResource, entrypoint);
            return klient;
        })
            .extends('unregister', (name) => {
            registry.unregister(name);
            return klient;
        });
        const data = klient.parameters.get('rest.load');
        if (data) {
            (0, exports.load)(registry, data);
        }
    }
};
core_1.Extensions.push(exports.extension);
