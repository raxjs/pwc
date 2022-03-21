export function hasOwnProperty(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
}
export function isArray(arg) {
    return Array.isArray(arg);
}
export function isPrimitive(value) {
    return null === value || "object" != typeof value && "function" != typeof value;
}
export function is(prev, curr) {
    return prev === curr ? 0 !== prev || 1 / prev == 1 / curr : prev != prev && curr != curr;
}
export function isEventName(key) {
    return key.startsWith("on");
}
export function shallowEqual(valueA, valueB) {
    if (typeof valueA != typeof valueB) return !1;
    if (isPrimitive(valueB)) return valueA === valueB;
    const keysA = Object.keys(valueA), keysB = Object.keys(valueB);
    if (keysA.length !== keysB.length) return !1;
    for (const val of keysA)if (!hasOwnProperty(valueB, val) || !isEventName(val) || !is(valueA[val], valueB[val])) return !1;
    return !0;
}
