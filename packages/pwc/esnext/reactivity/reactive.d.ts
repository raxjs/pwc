import type { ReactiveType } from '../type';
export declare class Reactive implements ReactiveType {
    #private;
    static getKey(key: string): string;
    constructor(elementInstance: any);
    requestUpdate(): void;
    getReactiveValue(prop: string): any;
    setReactiveValue(prop: string, value: unknown): void;
}
