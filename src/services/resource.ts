import Klient from '@klient/core';

import type { KlientRequestConfig } from '@klient/core';
import type { AxiosResponse } from 'axios';

type AnyObject = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export default class Resource {
  static ACTION_CREATE = 'create';

  static ACTION_READ = 'read';

  static ACTION_READ_LIST = 'list';

  static ACTION_UPDATE = 'update';

  static ACTION_DELETE = 'delete';

  protected klient!: Klient;

  constructor(
    // Name must be uniq
    readonly name: string,
    // The prefix of resource entrypoint (ex: /api/users)
    readonly entrypoint: string,
    // The property where identifier is stored
    readonly identifierProperty: string = 'id',
    // The property where IRI is stored (ex { '@id': '/api/users/1' })
    readonly iriProperty: string = '@id'
  ) {}

  onRegistration(klient: Klient) {
    this.klient = klient;
  }

  request<R = AnyObject>(config: KlientRequestConfig) {
    config.context = config.context || {};
    config.context.resource = this.name;
    config.context.rest = true;

    return this.klient.request<R>(config).then(({ data }: AxiosResponse) => data);
  }

  list<R = AnyObject>(params?: unknown, config: KlientRequestConfig = {}) {
    config.context = config.context || {};
    config.context.action = Resource.ACTION_READ_LIST;

    return this.request<R>({ method: 'GET', url: this.entrypoint, params, ...config });
  }

  create<R = AnyObject>(data: unknown, config: KlientRequestConfig = {}) {
    config.context = config.context || {};
    config.context.action = Resource.ACTION_CREATE;

    return this.request<R>({ method: 'POST', url: this.entrypoint, data, ...config });
  }

  update<R = AnyObject>(data: unknown, config: KlientRequestConfig = {}) {
    config.context = config.context || {};
    config.context.action = Resource.ACTION_UPDATE;

    return this.request<R>({ method: 'PUT', url: this.uri(data), data, ...config });
  }

  read<R = AnyObject>(item: number | string | unknown, config: KlientRequestConfig = {}) {
    config.context = config.context || {};
    config.context.action = Resource.ACTION_READ;

    return this.request<R>({ method: 'GET', url: this.uri(item), ...config });
  }

  delete<R = null>(item: number | string | unknown, config: KlientRequestConfig = {}) {
    config.context = config.context || {};
    config.context.action = Resource.ACTION_DELETE;

    return this.request<R>({ method: 'DELETE', url: this.uri(item), ...config });
  }

  uri(item?: string | number | unknown, ...parts: (string | number)[]): string {
    let iri = '';

    if (typeof item === 'string' || typeof item === 'number') {
      const identifier = String(item);

      // Only IRI can contains "/"
      if (identifier.indexOf('/') !== -1) {
        iri = identifier;
      } else {
        iri = `${this.entrypoint}/${identifier}`;
      }
    } else if (item !== null && typeof item === 'object') {
      const obj = item as Record<string, number | string>;
      // Build object IRI by using iri property or identifiers
      iri = String(obj[this.iriProperty] || `${this.entrypoint}/${obj[this.identifierProperty]}`);
    } else {
      iri = this.entrypoint;
    }

    return `/${iri}${parts.length > 0 ? '/' : ''}${parts.join('/')}`.replace(/\/\//g, '/');
  }
}
