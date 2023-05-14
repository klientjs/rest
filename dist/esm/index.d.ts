import type Klient from '@klient/core';
import type { Parameters as KlientParameters } from '@klient/core';
import Resource from './services/resource';
import Registry from './services/registry';
export { default as Resource } from './services/resource';
export { default as RegisterEvent } from './events/register';
export declare type LoadDataArg = {
    [_alias: string]: Resource | string;
};
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
export declare const load: (registry: Registry, data: LoadDataArg) => undefined;
export declare const extension: {
    name: string;
    initialize: (klient: Klient<Parameters>) => void;
};
