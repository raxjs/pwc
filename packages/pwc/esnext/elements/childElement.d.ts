export interface ChildElement {
    commitValue: (value: any) => void;
}
export declare class TextElement implements ChildElement {
    #private;
    constructor(commentNode: Comment, initialValue: string);
    commitValue(value: string): void;
}
export declare class AttributedElement implements ChildElement {
    #private;
    constructor(commentNode: Comment, initialAttrs: object);
    commitValue(value: object): void;
}
