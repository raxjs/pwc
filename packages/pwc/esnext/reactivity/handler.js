import { hasOwnProperty, isArray } from "../utils";
import { ReactiveFlags } from "../constants";
function toRaw(observed) {
    const raw = observed && observed[ReactiveFlags.RAW];
    return raw ? toRaw(raw) : observed;
}
function get(target, key, receiver) {
    return key === ReactiveFlags.RAW ? target : Reflect.get(target, key, receiver);
}
export function getProxyHandler(callback) {
    var trigger, trigger1;
    const set = (trigger = callback, function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver), originTarget = toRaw(receiver);
        return originTarget !== target || isArray(target) && "length" === key || trigger(), result;
    }), deleteProperty = (trigger1 = callback, function deleteProperty(target, key) {
        const hadKey = hasOwnProperty(target, key), result = Reflect.deleteProperty(target, key);
        return result && hadKey && trigger1(), result;
    });
    return {
        get,
        set,
        deleteProperty
    };
}
