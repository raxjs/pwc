declare function get(target: object, key: string, receiver: object): any;
export declare function getProxyHandler(callback: any): {
    get: typeof get;
    set: (target: object, key: string, value: unknown, receiver: object) => boolean;
    deleteProperty: (target: object, key: string) => boolean;
};
export {};
