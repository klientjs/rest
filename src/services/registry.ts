import Klient from '@klient/core';
import Resource from './resource';
import RegisterEvent from '../events/register';

export default class Registry {
  readonly collection: Record<string, Resource> = {};

  constructor(protected readonly klient: Klient) {}

  register(nameOrResource: string | Resource, entrypoint?: string): this {
    let resource = nameOrResource;

    if (typeof resource === 'string') {
      resource = new Resource(resource, String(entrypoint));
    }

    this.collection[resource.name] = resource;
    resource.onRegistration(this.klient);

    this.klient.dispatcher.dispatch(new RegisterEvent(resource), false);

    return this;
  }

  unregister(resource: Resource | string): this {
    delete this.collection[typeof resource === 'string' ? resource : resource.name];
    return this;
  }

  resource(name: string): Resource | undefined {
    return this.collection[name];
  }
}
