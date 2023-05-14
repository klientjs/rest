import { Extensions } from '@klient/core';
import Registry from './services/registry';
export { default as Resource } from './services/resource';
export { default as RegisterEvent } from './events/register';
export const load = (registry, data) => {
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
export const extension = {
    name: '@klient/rest',
    initialize: (klient) => {
        const registry = new Registry(klient);
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
            load(registry, data);
        }
    }
};
Extensions.push(extension);
