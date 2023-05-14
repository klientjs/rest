export default class Resource {
    constructor(name, entrypoint, identifierProperty = 'id', iriProperty = '@id') {
        this.name = name;
        this.entrypoint = entrypoint;
        this.identifierProperty = identifierProperty;
        this.iriProperty = iriProperty;
    }
    onRegistration(klient) {
        this.klient = klient;
    }
    request(config) {
        config.context = config.context || {};
        config.context.resource = this.name;
        config.context.rest = true;
        return this.klient.request(config).then(({ data }) => data);
    }
    list(params, config = {}) {
        config.context = config.context || {};
        config.context.action = Resource.ACTION_READ_LIST;
        return this.request(Object.assign({ method: 'GET', url: this.entrypoint, params }, config));
    }
    create(data, config = {}) {
        config.context = config.context || {};
        config.context.action = Resource.ACTION_CREATE;
        return this.request(Object.assign({ method: 'POST', url: this.entrypoint, data }, config));
    }
    update(data, config = {}) {
        config.context = config.context || {};
        config.context.action = Resource.ACTION_UPDATE;
        return this.request(Object.assign({ method: 'PUT', url: this.uri(data), data }, config));
    }
    read(item, config = {}) {
        config.context = config.context || {};
        config.context.action = Resource.ACTION_READ;
        return this.request(Object.assign({ method: 'GET', url: this.uri(item) }, config));
    }
    delete(item, config = {}) {
        config.context = config.context || {};
        config.context.action = Resource.ACTION_DELETE;
        return this.request(Object.assign({ method: 'DELETE', url: this.uri(item) }, config));
    }
    uri(item, ...parts) {
        let iri = '';
        if (typeof item === 'string' || typeof item === 'number') {
            const identifier = String(item);
            if (identifier.indexOf('/') !== -1) {
                iri = identifier;
            }
            else {
                iri = `${this.entrypoint}/${identifier}`;
            }
        }
        else if (item !== null && typeof item === 'object') {
            const obj = item;
            iri = String(obj[this.iriProperty] || `${this.entrypoint}/${obj[this.identifierProperty]}`);
        }
        else {
            iri = this.entrypoint;
        }
        return `/${iri}${parts.length > 0 ? '/' : ''}${parts.join('/')}`.replace(/\/\//g, '/');
    }
}
Resource.ACTION_CREATE = 'create';
Resource.ACTION_READ = 'read';
Resource.ACTION_READ_LIST = 'list';
Resource.ACTION_UPDATE = 'update';
Resource.ACTION_DELETE = 'delete';
