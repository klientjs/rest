import Klient from '@klient/core';
import type { KlientRequestConfig } from '@klient/core';
declare type AnyObject = any;
export default class Resource {
    readonly name: string;
    readonly entrypoint: string;
    readonly identifierProperty: string;
    readonly iriProperty: string;
    static ACTION_CREATE: string;
    static ACTION_READ: string;
    static ACTION_READ_LIST: string;
    static ACTION_UPDATE: string;
    static ACTION_DELETE: string;
    protected klient: Klient;
    constructor(name: string, entrypoint: string, identifierProperty?: string, iriProperty?: string);
    onRegistration(klient: Klient): void;
    request<R = AnyObject>(config: KlientRequestConfig): Promise<any>;
    list<R = AnyObject>(params?: unknown, config?: KlientRequestConfig): Promise<any>;
    create<R = AnyObject>(data: unknown, config?: KlientRequestConfig): Promise<any>;
    update<R = AnyObject>(data: unknown, config?: KlientRequestConfig): Promise<any>;
    read<R = AnyObject>(item: number | string | unknown, config?: KlientRequestConfig): Promise<any>;
    delete<R = null>(item: number | string | unknown, config?: KlientRequestConfig): Promise<any>;
    uri(item?: string | number | unknown, ...parts: (string | number)[]): string;
}
export {};
