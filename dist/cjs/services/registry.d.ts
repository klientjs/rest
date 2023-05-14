import Klient from '@klient/core';
import Resource from './resource';
export default class Registry {
    protected readonly klient: Klient;
    readonly collection: Record<string, Resource>;
    constructor(klient: Klient);
    register(nameOrResource: string | Resource, entrypoint?: string): this;
    unregister(resource: Resource | string): this;
    resource(name: string): Resource | undefined;
}
