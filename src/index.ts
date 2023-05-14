import { Extensions } from '@klient/core';

import type Klient from '@klient/core';
import type { Parameters as KlientParameters } from '@klient/core';
import Resource from './services/resource';
import Registry from './services/registry';

export { default as Resource } from './services/resource';
export { default as RegisterEvent } from './events/register';

export type LoadDataArg = { [_alias: string]: Resource | string };

export interface Parameters extends KlientParameters {
  rest?: {
    load: LoadDataArg;
  };
}

export interface KlientExtended extends Klient<Parameters> {
  rest: Registry;
  register(nameOrResource: string | Resource, entrypoint?: string): KlientExtended;
  unregister(nameOrResource: string | Resource): KlientExtended;
  resource(name: string): Resource | undefined;
}

export const load = (registry: Registry, data: LoadDataArg) => {
  const keys = Object.keys(data);

  for (let i = 0, len = keys.length; i < len; i += 1) {
    const alias = keys[i];
    const value = data[alias];

    if (typeof value === 'string') {
      registry.register(alias, value);
    } else {
      registry.register(value);
    }
  }

  return this;
};

export const extension = {
  name: '@klient/rest',
  initialize: (klient: Klient<Parameters>) => {
    const registry = new Registry(klient);
    klient.services.set('resources', registry);
    klient
      .extends('rest', registry)
      .extends('resource', registry.resource.bind(registry))
      .extends('register', (nameOrResource: string | Resource, entrypoint?: string): KlientExtended => {
        registry.register(nameOrResource, entrypoint);
        return klient as KlientExtended;
      })
      .extends('unregister', (name: string): KlientExtended => {
        registry.unregister(name);
        return klient as KlientExtended;
      });

    const data = klient.parameters.get('rest.load') as LoadDataArg | undefined;

    if (data) {
      load(registry, data);
    }
  }
};

Extensions.push(extension);
