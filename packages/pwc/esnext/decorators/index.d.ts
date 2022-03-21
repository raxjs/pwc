export declare function reactive(value: any, { kind, name, addInitializer }: {
    kind: any;
    name: any;
    addInitializer: any;
}): {
    get(): any;
    set(val: any): void;
    init(initialValue: any): any;
};
export declare function legacyReactive(name: any, initialValue: any): void;
