(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.app = factory());
})(this, (function () { 'use strict';

    function overrideElementDefine(OverrideElement) {
        var ref;
        self[null === (ref = Object.getPrototypeOf(OverrideElement)) || void 0 === ref ? void 0 : ref.name] = OverrideElement;
    }

    var ReactiveFlags, PWC_PREFIX = "?pwc";
    var TEXT_COMMENT_DATA = "?pwc_t";
    var PLACEHOLDER_COMMENT_DATA = "?pwc_p";
    !function(ReactiveFlags) {
        ReactiveFlags.RAW = "__p_raw__";
    }(ReactiveFlags || (ReactiveFlags = {}));

    function hasOwnProperty(target, key) {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
    function isArray(arg) {
        return Array.isArray(arg);
    }
    function isPrimitive(value) {
        return null === value || "object" != typeof value && "function" != typeof value;
    }
    function is(prev, curr) {
        return prev === curr ? 0 !== prev || 1 / prev == 1 / curr : prev != prev && curr != curr;
    }

    function isEventName(attrName) {
        return attrName.startsWith("on");
    }

    var _typeof = function(obj) {
        return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
    };
    function shallowEqual(valueA, valueB) {
        if ((void 0 === valueA ? "undefined" : _typeof(valueA)) !== (void 0 === valueB ? "undefined" : _typeof(valueB))) return !1;
        if (isPrimitive(valueB)) return valueA === valueB;
        var keysA = Object.keys(valueA), keysB = Object.keys(valueB);
        if (keysA.length !== keysB.length) return !1;
        var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
        try {
            for(var _step, _iterator = keysA[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
                var val = _step.value;
                if (!hasOwnProperty(valueB, val) || !isEventName(val) || !is(valueA[val], valueB[val])) return !1;
            }
        } catch (err) {
            _didIteratorError = !0, _iteratorError = err;
        } finally{
            try {
                _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
            } finally{
                if (_didIteratorError) throw _iteratorError;
            }
        }
        return !0;
    }

    function generateUid() {
        return new Date().getTime();
    }

    function toRaw(observed) {
        var raw = observed && observed[ReactiveFlags.RAW];
        return raw ? toRaw(raw) : observed;
    }
    function get(target, key, receiver) {
        return key === ReactiveFlags.RAW ? target : Reflect.get(target, key, receiver);
    }
    function getProxyHandler(callback) {
        var trigger, trigger1, set = (trigger = callback, function set(target, key, value, receiver) {
            var result = Reflect.set(target, key, value, receiver);
            return toRaw(receiver) !== target || isArray(target) && "length" === key || trigger(), result;
        }), deleteProperty = (trigger1 = callback, function deleteProperty(target, key) {
            var hadKey = hasOwnProperty(target, key), result = Reflect.deleteProperty(target, key);
            return result && hadKey && trigger1(), result;
        });
        return {
            get: get,
            set: set,
            deleteProperty: deleteProperty
        };
    }

    function _checkPrivateRedeclaration$3(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
    function _classExtractFieldDescriptor$3(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
        return privateMap.get(receiver);
    }
    function _classPrivateFieldGet$3(receiver, privateMap) {
        var receiver, descriptor, descriptor = _classExtractFieldDescriptor$3(receiver, privateMap, "get");
        return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
    }
    function _classPrivateFieldInit$2(obj, privateMap, value) {
        _checkPrivateRedeclaration$3(obj, privateMap), privateMap.set(obj, value);
    }
    function _defineProperties$2(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    var _element = new WeakMap(), _proxyHandler = new WeakMap(), _createReactiveProperty = new WeakSet();
    var Reactive = function() {
        var Constructor, protoProps, staticProps;
        function Reactive(elementInstance) {
            var obj, privateSet, receiver, privateMap, value, descriptor;
            !function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, Reactive), _classPrivateFieldInit$2(this, _element, {
                writable: !0,
                value: void 0
            }), _classPrivateFieldInit$2(this, _proxyHandler, {
                writable: !0,
                value: getProxyHandler(this.requestUpdate.bind(this))
            }), obj = this, (_checkPrivateRedeclaration$3(obj, privateSet = _createReactiveProperty), privateSet.add(obj)), receiver = this, privateMap = _element, value = elementInstance, descriptor = _classExtractFieldDescriptor$3(receiver, privateMap, "set"), (function _classApplyDescriptorSet(receiver, descriptor, value) {
                if (descriptor.set) descriptor.set.call(receiver, value);
                else {
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = value;
                }
            })(receiver, descriptor, value);
        }
        return Constructor = Reactive, protoProps = [
            {
                key: "requestUpdate",
                value: function requestUpdate() {
                    var ref;
                    null === (ref = _classPrivateFieldGet$3(this, _element)) || void 0 === ref || ref.requestUpdate();
                }
            },
            {
                key: "getReactiveValue",
                value: function getReactiveValue(prop) {
                    var key = Reactive.getKey(prop);
                    return _classPrivateFieldGet$3(this, _element)[key];
                }
            },
            {
                key: "setReactiveValue",
                value: function setReactiveValue(prop, value) {
                    var key = Reactive.getKey(prop);
                    "object" == typeof value ? (function _classPrivateMethodGet(receiver, privateSet, fn) {
                        if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                        return fn;
                    })(this, _createReactiveProperty, createReactiveProperty).call(this, key, value) : _classPrivateFieldGet$3(this, _element)[key] = value, this.requestUpdate();
                }
            }
        ], staticProps = [
            {
                key: "getKey",
                value: function getKey(key) {
                    return "#_".concat(key);
                }
            }
        ], protoProps && _defineProperties$2(Constructor.prototype, protoProps), staticProps && _defineProperties$2(Constructor, staticProps), Reactive;
    }();
    function createReactiveProperty(key, initialValue) {
        _classPrivateFieldGet$3(this, _element)[key] = new Proxy(initialValue, _classPrivateFieldGet$3(this, _proxyHandler));
    }

    function commitAttributes$1(element, attrs, isInitial) {
        for(var attrName in attrs)if (hasOwnProperty(attrs, attrName)) if (isEventName(attrName) && isInitial) {
            var _attrName = attrs[attrName], handler = _attrName.handler, _capture = _attrName.capture, capture = void 0 !== _capture && _capture;
            element.addEventListener(attrName.slice(2).toLowerCase(), handler, capture);
        } else attrName in element ? element[attrName] = attrs[attrName] : element.setAttribute(attrName, attrs[attrName]);
    }

    function _checkPrivateRedeclaration$2(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _classExtractFieldDescriptor$2(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
        return privateMap.get(receiver);
    }
    function _classPrivateFieldGet$2(receiver, privateMap) {
        var receiver, descriptor, descriptor = _classExtractFieldDescriptor$2(receiver, privateMap, "get");
        return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
    }
    function _classPrivateFieldInit$1(obj, privateMap, value) {
        _checkPrivateRedeclaration$2(obj, privateMap), privateMap.set(obj, value);
    }
    function _classPrivateFieldSet$2(receiver, privateMap, value) {
        var descriptor = _classExtractFieldDescriptor$2(receiver, privateMap, "set");
        return !function _classApplyDescriptorSet(receiver, descriptor, value) {
            if (descriptor.set) descriptor.set.call(receiver, value);
            else {
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                descriptor.value = value;
            }
        }(receiver, descriptor, value), value;
    }
    function _classPrivateMethodGet$1(receiver, privateSet, fn) {
        if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return fn;
    }
    function _defineProperties$1(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        return protoProps && _defineProperties$1(Constructor.prototype, protoProps), staticProps && _defineProperties$1(Constructor, staticProps), Constructor;
    }
    var _el = new WeakMap();
    var TextNode = function() {
        function TextNode(commentNode, initialValue) {
            _classCallCheck(this, TextNode), _classPrivateFieldInit$1(this, _el, {
                writable: !0,
                value: void 0
            });
            var textNode = document.createTextNode(initialValue);
            _classPrivateFieldSet$2(this, _el, textNode), commentNode.parentNode.insertBefore(textNode, commentNode);
        }
        return _createClass(TextNode, [
            {
                key: "commitValue",
                value: function commitValue(value) {
                    _classPrivateFieldGet$2(this, _el).nodeValue = value;
                }
            }
        ]), TextNode;
    }();
    var _el1 = new WeakMap(), _commitAttributes = new WeakSet();
    var AttributedNode = function() {
        function AttributedNode(commentNode, initialAttrs) {
            var obj, privateSet, _this = this;
            _classCallCheck(this, AttributedNode), _classPrivateFieldInit$1(this, _el1, {
                writable: !0,
                value: void 0
            }), obj = this, (_checkPrivateRedeclaration$2(obj, privateSet = _commitAttributes), privateSet.add(obj)), _classPrivateFieldSet$2(this, _el1, commentNode.nextSibling), window.customElements.get(_classPrivateFieldGet$2(this, _el1).localName) ? _classPrivateFieldGet$2(this, _el1).__init_task__ = function() {
                _classPrivateMethodGet$1(_this, _commitAttributes, commitAttributes).call(_this, initialAttrs, !0);
            } : _classPrivateMethodGet$1(this, _commitAttributes, commitAttributes).call(this, initialAttrs, !0);
        }
        return _createClass(AttributedNode, [
            {
                key: "commitValue",
                value: function commitValue(value) {
                    _classPrivateMethodGet$1(this, _commitAttributes, commitAttributes).call(this, value);
                }
            }
        ]), AttributedNode;
    }();
    function commitAttributes(value) {
        var isInitial = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        commitAttributes$1(_classPrivateFieldGet$2(this, _el1), value, isInitial);
    }

    var runtime = {exports: {}};

    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    (function (module) {
    var runtime = (function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }
      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);

        // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.
        generator._invoke = makeInvokeMethod(innerFn, self, context);

        return generator;
      }
      exports.wrap = wrap;

      // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";

      // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.
      var ContinueSentinel = {};

      // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.
      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}

      // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.
      var IteratorPrototype = {};
      define(IteratorPrototype, iteratorSymbol, function () {
        return this;
      });

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype =
        Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      define(Gp, "constructor", GeneratorFunctionPrototype);
      define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
      GeneratorFunction.displayName = define(
        GeneratorFunctionPrototype,
        toStringTagSymbol,
        "GeneratorFunction"
      );

      // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          define(prototype, method, function(arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction ||
            // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === "GeneratorFunction"
          : false;
      };

      exports.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };

      // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.
      exports.awrap = function(arg) {
        return { __await: arg };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value &&
                typeof value === "object" &&
                hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function(value) {
                invoke("next", value, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function(unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function(error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise =
            // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
        }

        // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).
        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
        return this;
      });
      exports.AsyncIterator = AsyncIterator;

      // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.
      exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;

        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        );

        return exports.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function(result) {
              return result.done ? result.value : iter.next();
            });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;

        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }

            // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;

            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);

            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;

            var record = tryCatch(innerFn, self, context);
            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done
                ? GenStateCompleted
                : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };

            } else if (record.type === "throw") {
              state = GenStateCompleted;
              // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }

      // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.
      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (! info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value;

          // Resume execution at the desired location (see delegateYield).
          context.next = delegate.nextLoc;

          // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }

        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        }

        // The delegate iterator is finished, so forget it and continue with
        // the outer generator.
        context.delegate = null;
        return ContinueSentinel;
      }

      // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.
      defineIteratorMethods(Gp);

      define(Gp, toStringTagSymbol, "Generator");

      // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.
      define(Gp, iteratorSymbol, function() {
        return this;
      });

      define(Gp, "toString", function() {
        return "[object Generator]";
      });

      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function(object) {
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();

        // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.
        return function next() {
          while (keys.length) {
            var key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }

          // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.
          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1, next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;

              return next;
            };

            return next.next = next;
          }
        }

        // Return an iterator with no values.
        return { next: doneResult };
      }
      exports.values = values;

      function doneResult() {
        return { value: undefined$1, done: true };
      }

      Context.prototype = {
        constructor: Context,

        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.
          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;

          this.method = "next";
          this.arg = undefined$1;

          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" &&
                  hasOwn.call(this, name) &&
                  !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },

        stop: function() {
          this.done = true;

          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },

        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !! caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }

              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },

        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev &&
                hasOwn.call(entry, "finallyLoc") &&
                this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry &&
              (type === "break" ||
               type === "continue") &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },

        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" ||
              record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },

        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },

        "catch": function(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }

          // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.
          throw new Error("illegal catch attempt");
        },

        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      };

      // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.
      return exports;

    }(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      module.exports 
    ));

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, in modern engines
      // we can explicitly access globalThis. In older engines we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
    }(runtime));

    var queue = [], isFlushing = !1, isFlushingPending = !1, resolvedPromise = Promise.resolve();
    function enqueueJob(job) {
        queue.find(function(param) {
            return param.uid === job.uid;
        }) || (queue.push(job), queueFlush());
    }
    function queueFlush() {
        isFlushing || isFlushingPending || (isFlushingPending = !0, resolvedPromise.then(flushJobs));
    }
    function flushJobs() {
        isFlushingPending = !1, isFlushing = !0;
        try {
            var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
            try {
                for(var _step, _iterator = queue[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value.run();
            } catch (err) {
                _didIteratorError = !0, _iteratorError = err;
            } finally{
                try {
                    _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                } finally{
                    if (_didIteratorError) throw _iteratorError;
                }
            }
        } finally{
            isFlushing = !1, queue = [];
        }
    }

    function _arrayLikeToArray(arr, len) {
        (null == len || len > arr.length) && (len = arr.length);
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function _assertThisInitialized(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function _checkPrivateRedeclaration$1(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
    function _classExtractFieldDescriptor$1(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
        return privateMap.get(receiver);
    }
    function _classPrivateFieldGet$1(receiver, privateMap) {
        var receiver, descriptor, descriptor = _classExtractFieldDescriptor$1(receiver, privateMap, "get");
        return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
    }
    function _classPrivateFieldInit(obj, privateMap, value) {
        _checkPrivateRedeclaration$1(obj, privateMap), privateMap.set(obj, value);
    }
    function _classPrivateFieldSet$1(receiver, privateMap, value) {
        var descriptor = _classExtractFieldDescriptor$1(receiver, privateMap, "set");
        return !function _classApplyDescriptorSet(receiver, descriptor, value) {
            if (descriptor.set) descriptor.set.call(receiver, value);
            else {
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                descriptor.value = value;
            }
        }(receiver, descriptor, value), value;
    }
    function _classPrivateMethodGet(receiver, privateSet, fn) {
        if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return fn;
    }
    function _classPrivateMethodInit(obj, privateSet) {
        _checkPrivateRedeclaration$1(obj, privateSet), privateSet.add(obj);
    }
    function _defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _getPrototypeOf(o) {
        return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        }, _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            return o.__proto__ = p, o;
        }, _setPrototypeOf(o, p);
    }
    function _slicedToArray(arr, i) {
        return (function _arrayWithHoles(arr) {
            if (Array.isArray(arr)) return arr;
        })(arr) || (function _iterableToArrayLimit(arr, i) {
            var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
            if (null != _i) {
                var _arr = [], _n = !0, _d = !1;
                try {
                    for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
                } catch (err) {
                    _d = !0, _e = err;
                } finally{
                    try {
                        _n || null == _i.return || _i.return();
                    } finally{
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }
        })(arr, i) || _unsupportedIterableToArray(arr, i) || (function _nonIterableRest() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        })();
    }
    function _unsupportedIterableToArray(o, minLen) {
        if (o) {
            if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
    }
    function reactiveElementFactory(Definition1) {
        var createTemplate, initRenderTemplate, performUpdate, _uid, _initialized, _fragment, _currentTemplate, _reactiveNodes, _reactive, _createTemplate, _initRenderTemplate, _performUpdate;
        return createTemplate = function createTemplate(source) {
            var template = document.createElement("template");
            return template.innerHTML = source, template.content.cloneNode(!0);
        }, initRenderTemplate = function initRenderTemplate(fragment, values) {
            var currentComment, nodeIterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, {
                acceptNode: function acceptNode(node) {
                    var ref;
                    return (null === (ref = node.data) || void 0 === ref ? void 0 : ref.includes(PWC_PREFIX)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }), index = 0;
            for(_classPrivateFieldSet$1(this, _reactiveNodes, []); currentComment = nodeIterator.nextNode();){
                if (currentComment.data === TEXT_COMMENT_DATA) {
                    var textElement = new TextNode(currentComment, values[index]);
                    _classPrivateFieldGet$1(this, _reactiveNodes).push(textElement);
                } else if (currentComment.data === PLACEHOLDER_COMMENT_DATA) {
                    var attributedElement = new AttributedNode(currentComment, values[index]);
                    _classPrivateFieldGet$1(this, _reactiveNodes).push(attributedElement);
                }
                index++;
            }
        }, performUpdate = function performUpdate() {
            var ref = _slicedToArray(_classPrivateFieldGet$1(this, _currentTemplate), 2), oldStrings = ref[0], oldValues = ref[1], _template = _slicedToArray(this.template, 2), strings = _template[0], values = _template[1];
            if (oldStrings === strings) for(var index = 0; index < oldValues.length; index++)shallowEqual(oldValues[index], values[index]) || _classPrivateFieldGet$1(this, _reactiveNodes)[index].commitValue(values[index]);
            _classPrivateFieldSet$1(this, _currentTemplate, this.template);
        }, _uid = new WeakMap(), _initialized = new WeakMap(), _fragment = new WeakMap(), _currentTemplate = new WeakMap(), _reactiveNodes = new WeakMap(), _reactive = new WeakMap(), _createTemplate = new WeakSet(), _initRenderTemplate = new WeakSet(), _performUpdate = new WeakSet(), (function(Definition) {
            !function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && _setPrototypeOf(subClass, superClass);
            }(_class, Definition);
            var Derived, hasNativeReflectConstruct, Constructor, protoProps, _super = (Derived = _class, hasNativeReflectConstruct = function _isNativeReflectConstruct() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                } catch (e) {
                    return !1;
                }
            }(), function _createSuperInternal() {
                var obj, self, call, result, Super = _getPrototypeOf(Derived);
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else result = Super.apply(this, arguments);
                return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : _assertThisInitialized(self);
            });
            function _class() {
                var _this;
                return (function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                })(this, _class), _this = _super.apply(this, arguments), _classPrivateFieldInit(_assertThisInitialized(_this), _uid, {
                    writable: !0,
                    value: generateUid()
                }), _classPrivateFieldInit(_assertThisInitialized(_this), _initialized, {
                    writable: !0,
                    value: !1
                }), _classPrivateFieldInit(_assertThisInitialized(_this), _fragment, {
                    writable: !0,
                    value: void 0
                }), _classPrivateFieldInit(_assertThisInitialized(_this), _currentTemplate, {
                    writable: !0,
                    value: void 0
                }), _classPrivateFieldInit(_assertThisInitialized(_this), _reactiveNodes, {
                    writable: !0,
                    value: void 0
                }), _classPrivateFieldInit(_assertThisInitialized(_this), _reactive, {
                    writable: !0,
                    value: new Reactive(_assertThisInitialized(_this))
                }), _classPrivateMethodInit(_assertThisInitialized(_this), _createTemplate), _classPrivateMethodInit(_assertThisInitialized(_this), _initRenderTemplate), _classPrivateMethodInit(_assertThisInitialized(_this), _performUpdate), _this;
            }
            return Constructor = _class, protoProps = [
                {
                    key: "connectedCallback",
                    value: function connectedCallback() {
                        if (!_classPrivateFieldGet$1(this, _initialized)) {
                            this.__init_task__ && this.__init_task__(), _classPrivateFieldSet$1(this, _currentTemplate, this.template || []);
                            var ref = _slicedToArray(_classPrivateFieldGet$1(this, _currentTemplate), 2), template = ref[0], tmp = ref[1], values = void 0 === tmp ? [] : tmp;
                            _classPrivateFieldSet$1(this, _fragment, _classPrivateMethodGet(this, _createTemplate, createTemplate).call(this, template)), _classPrivateMethodGet(this, _initRenderTemplate, initRenderTemplate).call(this, _classPrivateFieldGet$1(this, _fragment), values), this.appendChild(_classPrivateFieldGet$1(this, _fragment));
                        }
                        _classPrivateFieldSet$1(this, _initialized, !0);
                    }
                },
                {
                    key: "disconnectedCallback",
                    value: function disconnectedCallback() {}
                },
                {
                    key: "attributeChangedCallback",
                    value: function attributeChangedCallback() {}
                },
                {
                    key: "adoptedCallback",
                    value: function adoptedCallback() {}
                },
                {
                    key: "requestUpdate",
                    value: function requestUpdate() {
                        enqueueJob({
                            uid: _classPrivateFieldGet$1(this, _uid),
                            run: _classPrivateMethodGet(this, _performUpdate, performUpdate).bind(this)
                        });
                    }
                },
                {
                    key: "getReactiveValue",
                    value: function getReactiveValue(prop) {
                        return _classPrivateFieldGet$1(this, _reactive).getReactiveValue(prop);
                    }
                },
                {
                    key: "setReactiveValue",
                    value: function setReactiveValue(prop, val) {
                        _classPrivateFieldGet$1(this, _reactive).setReactiveValue(prop, val);
                    }
                }
            ], _defineProperties(Constructor.prototype, protoProps), _class;
        })(Definition1);
    }

    overrideElementDefine(reactiveElementFactory(HTMLElement));

    function customElement(name) {
        return function(value, param) {
            (0, param.addInitializer)(function() {
                customElements.define(name, this);
            });
        };
    }

    function reactive(value, param) {
        var kind = param.kind, name = param.name;
        if ("accessor" === kind) return {
            get: function get() {
                return this.getReactiveValue(name);
            },
            set: function set(val) {
                this.setReactiveValue(name, val);
            },
            init: function init(initialValue) {
                this.setReactiveValue(name, initialValue);
            }
        };
    }

    var _initClass, _dec, _init_count, _initProto;

    function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

    function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

    function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

    function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

    function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

    function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

    function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

    function createMetadataMethodsForProperty(metadataMap, kind, property, decoratorFinishedRef) { return { getMetadata: function (key) { assertNotFinished(decoratorFinishedRef, "getMetadata"), assertMetadataKey(key); var metadataForKey = metadataMap[key]; if (void 0 !== metadataForKey) if (1 === kind) { var pub = metadataForKey.public; if (void 0 !== pub) return pub[property]; } else if (2 === kind) { var priv = metadataForKey.private; if (void 0 !== priv) return priv.get(property); } else if (Object.hasOwnProperty.call(metadataForKey, "constructor")) return metadataForKey.constructor; }, setMetadata: function (key, value) { assertNotFinished(decoratorFinishedRef, "setMetadata"), assertMetadataKey(key); var metadataForKey = metadataMap[key]; if (void 0 === metadataForKey && (metadataForKey = metadataMap[key] = {}), 1 === kind) { var pub = metadataForKey.public; void 0 === pub && (pub = metadataForKey.public = {}), pub[property] = value; } else if (2 === kind) { var priv = metadataForKey.priv; void 0 === priv && (priv = metadataForKey.private = new Map()), priv.set(property, value); } else metadataForKey.constructor = value; } }; }

    function convertMetadataMapToFinal(obj, metadataMap) { var parentMetadataMap = obj[Symbol.metadata || Symbol.for("Symbol.metadata")], metadataKeys = Object.getOwnPropertySymbols(metadataMap); if (0 !== metadataKeys.length) { for (var i = 0; i < metadataKeys.length; i++) { var key = metadataKeys[i], metaForKey = metadataMap[key], parentMetaForKey = parentMetadataMap ? parentMetadataMap[key] : null, pub = metaForKey.public, parentPub = parentMetaForKey ? parentMetaForKey.public : null; pub && parentPub && Object.setPrototypeOf(pub, parentPub); var priv = metaForKey.private; if (priv) { var privArr = Array.from(priv.values()), parentPriv = parentMetaForKey ? parentMetaForKey.private : null; parentPriv && (privArr = privArr.concat(parentPriv)), metaForKey.private = privArr; } parentMetaForKey && Object.setPrototypeOf(metaForKey, parentMetaForKey); } parentMetadataMap && Object.setPrototypeOf(metadataMap, parentMetadataMap), obj[Symbol.metadata || Symbol.for("Symbol.metadata")] = metadataMap; } }

    function createAddInitializerMethod(initializers, decoratorFinishedRef) { return function (initializer) { assertNotFinished(decoratorFinishedRef, "addInitializer"), assertCallable(initializer, "An initializer"), initializers.push(initializer); }; }

    function memberDec(dec, name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value) { var kindStr; switch (kind) { case 1: kindStr = "accessor"; break; case 2: kindStr = "method"; break; case 3: kindStr = "getter"; break; case 4: kindStr = "setter"; break; default: kindStr = "field"; } var metadataKind, metadataName, ctx = { kind: kindStr, name: isPrivate ? "#" + name : name, isStatic: isStatic, isPrivate: isPrivate }, decoratorFinishedRef = { v: !1 }; if (0 !== kind && (ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef)), isPrivate) { metadataKind = 2, metadataName = Symbol(name); var access = {}; 0 === kind ? (access.get = desc.get, access.set = desc.set) : 2 === kind ? access.get = function () { return desc.value; } : (1 !== kind && 3 !== kind || (access.get = function () { return desc.get.call(this); }), 1 !== kind && 4 !== kind || (access.set = function (v) { desc.set.call(this, v); })), ctx.access = access; } else metadataKind = 1, metadataName = name; try { return dec(value, Object.assign(ctx, createMetadataMethodsForProperty(metadataMap, metadataKind, metadataName, decoratorFinishedRef))); } finally { decoratorFinishedRef.v = !0; } }

    function assertNotFinished(decoratorFinishedRef, fnName) { if (decoratorFinishedRef.v) throw new Error("attempted to call " + fnName + " after decoration was finished"); }

    function assertMetadataKey(key) { if ("symbol" != typeof key) throw new TypeError("Metadata keys must be symbols, received: " + key); }

    function assertCallable(fn, hint) { if ("function" != typeof fn) throw new TypeError(hint + " must be a function"); }

    function assertValidReturnValue(kind, value) { var type = typeof value; if (1 === kind) { if ("object" !== type || null === value) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); void 0 !== value.get && assertCallable(value.get, "accessor.get"), void 0 !== value.set && assertCallable(value.set, "accessor.set"), void 0 !== value.init && assertCallable(value.init, "accessor.init"), void 0 !== value.initializer && assertCallable(value.initializer, "accessor.initializer"); } else if ("function" !== type) { var hint; throw hint = 0 === kind ? "field" : 10 === kind ? "class" : "method", new TypeError(hint + " decorators must return a function or void 0"); } }

    function getInit(desc) { var initializer; return null == (initializer = desc.init) && (initializer = desc.initializer) && "undefined" != typeof console && console.warn(".initializer has been renamed to .init as of March 2022"), initializer; }

    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers) { var desc, initializer, value, newValue, get, set, decs = decInfo[0]; if (isPrivate ? desc = 0 === kind || 1 === kind ? { get: decInfo[3], set: decInfo[4] } : 3 === kind ? { get: decInfo[3] } : 4 === kind ? { set: decInfo[3] } : { value: decInfo[3] } : 0 !== kind && (desc = Object.getOwnPropertyDescriptor(base, name)), 1 === kind ? value = { get: desc.get, set: desc.set } : 2 === kind ? value = desc.value : 3 === kind ? value = desc.get : 4 === kind && (value = desc.set), "function" == typeof decs) void 0 !== (newValue = memberDec(decs, name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value)) && (assertValidReturnValue(kind, newValue), 0 === kind ? initializer = newValue : 1 === kind ? (initializer = getInit(newValue), get = newValue.get || value.get, set = newValue.set || value.set, value = { get: get, set: set }) : value = newValue);else for (var i = decs.length - 1; i >= 0; i--) { var newInit; if (void 0 !== (newValue = memberDec(decs[i], name, desc, metadataMap, initializers, kind, isStatic, isPrivate, value))) assertValidReturnValue(kind, newValue), 0 === kind ? newInit = newValue : 1 === kind ? (newInit = getInit(newValue), get = newValue.get || value.get, set = newValue.set || value.set, value = { get: get, set: set }) : value = newValue, void 0 !== newInit && (void 0 === initializer ? initializer = newInit : "function" == typeof initializer ? initializer = [initializer, newInit] : initializer.push(newInit)); } if (0 === kind || 1 === kind) { if (void 0 === initializer) initializer = function (instance, init) { return init; };else if ("function" != typeof initializer) { var ownInitializers = initializer; initializer = function (instance, init) { for (var value = init, i = 0; i < ownInitializers.length; i++) value = ownInitializers[i].call(instance, value); return value; }; } else { var originalInitializer = initializer; initializer = function (instance, init) { return originalInitializer.call(instance, init); }; } ret.push(initializer); } 0 !== kind && (1 === kind ? (desc.get = value.get, desc.set = value.set) : 2 === kind ? desc.value = value : 3 === kind ? desc.get = value : 4 === kind && (desc.set = value), isPrivate ? 1 === kind ? (ret.push(function (instance, args) { return value.get.call(instance, args); }), ret.push(function (instance, args) { return value.set.call(instance, args); })) : 2 === kind ? ret.push(value) : ret.push(function (instance, args) { return value.call(instance, args); }) : Object.defineProperty(base, name, desc)); }

    function applyMemberDecs(ret, Class, protoMetadataMap, staticMetadataMap, decInfos) { for (var protoInitializers, staticInitializers, existingProtoNonFields = new Map(), existingStaticNonFields = new Map(), i = 0; i < decInfos.length; i++) { var decInfo = decInfos[i]; if (Array.isArray(decInfo)) { var base, metadataMap, initializers, kind = decInfo[1], name = decInfo[2], isPrivate = decInfo.length > 3, isStatic = kind >= 5; if (isStatic ? (base = Class, metadataMap = staticMetadataMap, 0 !== (kind -= 5) && (initializers = staticInitializers = staticInitializers || [])) : (base = Class.prototype, metadataMap = protoMetadataMap, 0 !== kind && (initializers = protoInitializers = protoInitializers || [])), 0 !== kind && !isPrivate) { var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields, existingKind = existingNonFields.get(name) || 0; if (!0 === existingKind || 3 === existingKind && 4 !== kind || 4 === existingKind && 3 !== kind) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name); !existingKind && kind > 2 ? existingNonFields.set(name, kind) : existingNonFields.set(name, !0); } applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers); } } pushInitializers(ret, protoInitializers), pushInitializers(ret, staticInitializers); }

    function pushInitializers(ret, initializers) { initializers && ret.push(function (instance) { for (var i = 0; i < initializers.length; i++) initializers[i].call(instance); return instance; }); }

    function applyClassDecs(ret, targetClass, metadataMap, classDecs) { if (classDecs.length > 0) { for (var initializers = [], newClass = targetClass, name = targetClass.name, i = classDecs.length - 1; i >= 0; i--) { var decoratorFinishedRef = { v: !1 }; try { var ctx = Object.assign({ kind: "class", name: name, addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef) }, createMetadataMethodsForProperty(metadataMap, 0, name, decoratorFinishedRef)), nextNewClass = classDecs[i](newClass, ctx); } finally { decoratorFinishedRef.v = !0; } void 0 !== nextNewClass && (assertValidReturnValue(10, nextNewClass), newClass = nextNewClass); } ret.push(newClass, function () { for (var i = 0; i < initializers.length; i++) initializers[i].call(newClass); }); } }

    function _applyDecs(targetClass, memberDecs, classDecs) { var ret = [], staticMetadataMap = {}, protoMetadataMap = {}; return applyMemberDecs(ret, targetClass, protoMetadataMap, staticMetadataMap, memberDecs), convertMetadataMapToFinal(targetClass.prototype, protoMetadataMap), applyClassDecs(ret, targetClass, staticMetadataMap, classDecs), convertMetadataMapToFinal(targetClass, staticMetadataMap), ret; }

    let _CustomComponent;

    _dec = customElement('custom-component');

    var _A = /*#__PURE__*/new WeakMap();

    class CustomComponent extends HTMLElement {
      constructor(...args) {
        super(...args);

        _classPrivateFieldInitSpec(this, _A, {
          writable: true,
          value: (_initProto(this), _init_count(this, 0))
        });
      }

      get count() {
        return _classPrivateFieldGet(this, _A);
      }

      set count(v) {
        _classPrivateFieldSet(this, _A, v);
      }

      addCount() {
        this.count = this.count + 1;
      }

      reduceCount() {
        this.count = this.count - 1;
      }

      get template() {
        return ["\n  <div class=\"content\">\n    <!--?pwc_p--><button>+</button>\n    <!--?pwc_t-->\n    <!--?pwc_p--><button>-</button>\n  </div>\n", [{
          onclick: {
            handler: this["addCount"].bind(this),
            capture: false
          }
        }, this["count"], {
          onclick: {
            handler: this["reduceCount"].bind(this),
            capture: false
          }
        }]];
      }

    }

    [_init_count, _initProto, _CustomComponent, _initClass] = _applyDecs(CustomComponent, [[reactive, 1, "count"]], [_dec]);

    _initClass();

    var script = _CustomComponent;

    return script;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy9lbGVtZW50cy9vdmVycmlkZUVsZW1lbnREZWZpbmUuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy9wd2MvZXMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvcHdjL2VzL3V0aWxzL2NvbW1vbi5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy91dGlscy9pc0V2ZW50TmFtZS5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy91dGlscy9zaGFsbG93RXF1YWwuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy9wd2MvZXMvdXRpbHMvZ2VuZXJhdGVVaWQuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy9wd2MvZXMvcmVhY3Rpdml0eS9oYW5kbGVyLmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvcHdjL2VzL3JlYWN0aXZpdHkvcmVhY3RpdmUuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy9wd2MvZXMvZWxlbWVudHMvY29tbWl0QXR0cmlidXRlcy5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy9lbGVtZW50cy9yZWFjdGl2ZU5vZGUuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVnZW5lcmF0b3ItcnVudGltZUAwLjEzLjkvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy9lbGVtZW50cy9zaGVkdWxlci5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy9lbGVtZW50cy9yZWFjdGl2ZUVsZW1lbnRGYWN0b3J5LmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvcHdjL2VzL2VsZW1lbnRzL25hdGl2ZS9IVE1MRWxlbWVudC5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3B3Yy9lcy9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy9wd2MvZXMvZGVjb3JhdG9ycy9yZWFjdGl2ZS5qcyIsIi4uLy4uL3NyYy91bmtub3duIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKE92ZXJyaWRlRWxlbWVudCkge1xuICAgIHZhciByZWY7XG4gICAgc2VsZltudWxsID09PSAocmVmID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKE92ZXJyaWRlRWxlbWVudCkpIHx8IHZvaWQgMCA9PT0gcmVmID8gdm9pZCAwIDogcmVmLm5hbWVdID0gT3ZlcnJpZGVFbGVtZW50O1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDJWc1pXMWxiblJ6TDI5MlpYSnlhV1JsUld4bGJXVnVkRVJsWm1sdVpTNTBjeUpkTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0FvVDNabGNuSnBaR1ZGYkdWdFpXNTBLU0E5UGlCN1hHNGdJSE5sYkdaYlQySnFaV04wTG1kbGRGQnliM1J2ZEhsd1pVOW1LRTkyWlhKeWFXUmxSV3hsYldWdWRDay9MbTVoYldWZElEMGdUM1psY25KcFpHVkZiR1Z0Wlc1ME8xeHVmVHRjYmlKZExDSnVZVzFsY3lJNld5SlBkbVZ5Y21sa1pVVnNaVzFsYm5RaUxDSlBZbXBsWTNRaUxDSnpaV3htSWl3aVoyVjBVSEp2ZEc5MGVYQmxUMllpTENKdVlXMWxJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hOUVVGTkxGTkJRVk1zVVVGQlVTeERRVUZRUVN4bFFVRmxMRVZCUVVzc1EwRkJRenRSUVVNNVFrTXNSMEZCYzBNN1NVRkJNME5ETEVsQlFVa3NWMEZCUTBRc1IwRkJjME1zUjBGQmRFTkJMRTFCUVUwc1EwRkJRMFVzWTBGQll5eERRVUZEU0N4bFFVRmxMR2xDUVVGeVEwTXNSMEZCYzBNc1IwRkJkRU5CTEVsQlFVa3NRMEZCU2tFc1EwRkJORU1zUjBGQk5VTkJMRWRCUVhORExFTkJRVVZITEVsQlFVa3NTVUZCU1Vvc1pVRkJaU3hEUVVGRE8wRkJRM1pGTEVOQlFVTWlmUT09IiwiZXhwb3J0IHZhciBSZWFjdGl2ZUZsYWdzLCBQV0NfUFJFRklYID0gXCI/cHdjXCI7XG5leHBvcnQgdmFyIFRFWFRfQ09NTUVOVF9EQVRBID0gXCI/cHdjX3RcIjtcbmV4cG9ydCB2YXIgUExBQ0VIT0xERVJfQ09NTUVOVF9EQVRBID0gXCI/cHdjX3BcIjtcbiFmdW5jdGlvbihSZWFjdGl2ZUZsYWdzKSB7XG4gICAgUmVhY3RpdmVGbGFncy5SQVcgPSBcIl9fcF9yYXdfX1wiO1xufShSZWFjdGl2ZUZsYWdzIHx8IChSZWFjdGl2ZUZsYWdzID0ge30pKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDJOdmJuTjBZVzUwY3k1MGN5SmRMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdZMjl1YzNRZ1VGZERYMUJTUlVaSldDQTlJQ2MvY0hkakp6dGNibVY0Y0c5eWRDQmpiMjV6ZENCVVJWaFVYME5QVFUxRlRsUmZSRUZVUVNBOUlDYy9jSGRqWDNRbk8xeHVaWGh3YjNKMElHTnZibk4wSUZCTVFVTkZTRTlNUkVWU1gwTlBUVTFGVGxSZlJFRlVRU0E5SUNjL2NIZGpYM0FuTzF4dVpYaHdiM0owSUdOdmJuTjBJR1Z1ZFcwZ1VtVmhZM1JwZG1WR2JHRm5jeUI3WEc0Z0lGSkJWeUE5SUNkZlgzQmZjbUYzWDE4bkxGeHVmVnh1SWwwc0ltNWhiV1Z6SWpwYklsQlhRMTlRVWtWR1NWZ2lMQ0pVUlZoVVgwTlBUVTFGVGxSZlJFRlVRU0lzSWxCTVFVTkZTRTlNUkVWU1gwTlBUVTFGVGxSZlJFRlVRU0lzSWxKbFlXTjBhWFpsUm14aFozTWlMQ0pTUVZjaVhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFMUJRVTBzUTBGQlF5eEhRVUZMTEdkQ1FVRkRRU3hWUVVGVkxFZEJRVWNzUTBGQlRUdEJRVU5vUXl4TlFVRk5MRU5CUVVNc1IwRkJTeXhEUVVGRFF5eHBRa0ZCYVVJc1IwRkJSeXhEUVVGUk8wRkJRM3BETEUxQlFVMHNRMEZCUXl4SFFVRkxMRU5CUVVORExIZENRVUYzUWl4SFFVRkhMRU5CUVZFN1ZVRkRPVUpETEdGQlFXRTdTVUZCWWtFc1lVRkJZU3hEUVVNM1FrTXNSMEZCUnl4SFFVRkhMRU5CUVZjc1ZUdEZRVVJFUkN4aFFVRmhMRXRCUVdKQkxHRkJRV0VzVHlKOSIsImV4cG9ydCBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICAgIHJldHVybiBudWxsID09PSB2YWx1ZSB8fCBcIm9iamVjdFwiICE9IHR5cGVvZiB2YWx1ZSAmJiBcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIHZhbHVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzKHByZXYsIGN1cnIpIHtcbiAgICByZXR1cm4gcHJldiA9PT0gY3VyciA/IDAgIT09IHByZXYgfHwgMSAvIHByZXYgPT0gMSAvIGN1cnIgOiBwcmV2ICE9IHByZXYgJiYgY3VyciAhPSBjdXJyO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlqYUhKcGMyTnBibVI1TDBOdlpHVXZSMmwwYUhWaUwzQjNZeTl3WVdOcllXZGxjeTl3ZDJNdmMzSmpMM1YwYVd4ekwyTnZiVzF2Ymk1MGN5SmRMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdablZ1WTNScGIyNGdhR0Z6VDNkdVVISnZjR1Z5ZEhrb2RHRnlaMlYwTENCclpYa3BJSHRjYmlBZ2NtVjBkWEp1SUU5aWFtVmpkQzV3Y205MGIzUjVjR1V1YUdGelQzZHVVSEp2Y0dWeWRIa3VZMkZzYkNoMFlYSm5aWFFzSUd0bGVTazdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGMwRnljbUY1S0dGeVp6b2dZVzU1S1NCN1hHNGdJSEpsZEhWeWJpQkJjbkpoZVM1cGMwRnljbUY1S0dGeVp5azdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGMxQnlhVzFwZEdsMlpTaDJZV3gxWlRvZ2RXNXJibTkzYmlrZ2UxeHVJQ0J5WlhSMWNtNGdkbUZzZFdVZ1BUMDlJRzUxYkd3Z2ZId2dLSFI1Y0dWdlppQjJZV3gxWlNBaFBUMGdKMjlpYW1WamRDY2dKaVlnZEhsd1pXOW1JSFpoYkhWbElDRTlQU0FuWm5WdVkzUnBiMjRuS1R0Y2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR2x6S0hCeVpYWXNJR04xY25JcE9pQmliMjlzWldGdUlIdGNiaUFnTHk4Z1UyRnRaVlpoYkhWbElHRnNaMjl5YVhSb2JWeHVJQ0JwWmlBb2NISmxkaUE5UFQwZ1kzVnljaWtnZTF4dUlDQWdJQzh2SUZOMFpYQnpJREV0TlN3Z055MHhNRnh1SUNBZ0lDOHZJRk4wWlhCeklEWXVZaTAyTG1VNklDc3dJQ0U5SUMwd1hHNGdJQ0FnY21WMGRYSnVJSEJ5WlhZZ0lUMDlJREFnZkh3Z01TQXZJSEJ5WlhZZ1BUMDlJREVnTHlCamRYSnlPMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJQzh2SUZOMFpYQWdOaTVoT2lCT1lVNGdQVDBnVG1GT1hHNGdJQ0FnY21WMGRYSnVJSEJ5WlhZZ0lUMDlJSEJ5WlhZZ0ppWWdZM1Z5Y2lBaFBUMGdZM1Z5Y2pzZ0x5OGdaWE5zYVc1MExXUnBjMkZpYkdVdGJHbHVaU0J1YnkxelpXeG1MV052YlhCaGNtVmNiaUFnZlZ4dWZTSmRMQ0p1WVcxbGN5STZXeUpvWVhOUGQyNVFjbTl3WlhKMGVTSXNJblJoY21kbGRDSXNJbXRsZVNJc0lrOWlhbVZqZENJc0luQnliM1J2ZEhsd1pTSXNJbU5oYkd3aUxDSnBjMEZ5Y21GNUlpd2lZWEpuSWl3aVFYSnlZWGtpTENKcGMxQnlhVzFwZEdsMlpTSXNJblpoYkhWbElpd2lhWE1pTENKd2NtVjJJaXdpWTNWeWNpSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUVUZCVFN4VlFVRlZRU3hqUVVGakxFTkJRVU5ETEUxQlFVMHNSVUZCUlVNc1IwRkJSeXhGUVVGRkxFTkJRVU03U1VGRE0wTXNUVUZCVFN4RFFVRkRReXhOUVVGTkxFTkJRVU5ETEZOQlFWTXNRMEZCUTBvc1kwRkJZeXhEUVVGRFN5eEpRVUZKTEVOQlJHUktMRTFCUVUwc1JVRkJSVU1zUjBGQlJ6dEJRVVV4UXl4RFFVRkRPMEZCUlVRc1RVRkJUU3hWUVVGVlNTeFBRVUZQTEVOQlFVTkRMRWRCUVZFc1JVRkJSU3hEUVVGRE8wbEJRMnBETEUxQlFVMHNRMEZCUTBNc1MwRkJTeXhEUVVGRFJpeFBRVUZQTEVOQlJFVkRMRWRCUVZFN1FVRkZhRU1zUTBGQlF6dEJRVVZFTEUxQlFVMHNWVUZCVlVVc1YwRkJWeXhEUVVGRFF5eExRVUZqTEVWQlFVVXNRMEZCUXp0SlFVTXpReXhOUVVGTkxFTkJRVmNzU1VGQlNTeExRVVJMUVN4TFFVRmpMRWxCUTBjc1EwRkJVU3hYUVVGNlFpeE5RVUZOTEVOQlJFNUJMRXRCUVdNc1NVRkRaME1zUTBGQlZTeGhRVUV6UWl4TlFVRk5MRU5CUkc1RFFTeExRVUZqTzBGQlJURkRMRU5CUVVNN1FVRkZSQ3hOUVVGTkxGVkJRVlZETEVWQlFVVXNRMEZCUTBNc1NVRkJTU3hGUVVGRlF5eEpRVUZKTEVWQlFWY3NRMEZCUXp0WFFVRjBRa1FzU1VGQlNTeExRVUZGUXl4SlFVRkpMRWRCUzFRc1EwRkJReXhMUVV4R1JDeEpRVUZKTEVsQlMwVXNRMEZCUXl4SFFVeFFRU3hKUVVGSkxFbEJTMlVzUTBGQlF5eEhRVXhrUXl4SlFVRkpMRWRCUVZaRUxFbEJRVWtzU1VGQlNrRXNTVUZCU1N4SlFVRkZReXhKUVVGSkxFbEJRVXBCTEVsQlFVazdRVUZWTjBJc1EwRkJReUo5IiwiZXhwb3J0IGZ1bmN0aW9uIGlzRXZlbnROYW1lKGF0dHJOYW1lKSB7XG4gICAgcmV0dXJuIGF0dHJOYW1lLnN0YXJ0c1dpdGgoXCJvblwiKTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDNWMGFXeHpMMmx6UlhabGJuUk9ZVzFsTG5SeklsMHNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnBjMFYyWlc1MFRtRnRaU2hoZEhSeVRtRnRaVG9nYzNSeWFXNW5LVG9nWW05dmJHVmhiaUI3WEc0Z0lDOHZJRmRvWlc0Z1lYUjBjbWxpZFhSbElHNWhiV1VnYzNSaGNuUlhhWFJvSUc5dUxDQnBkQ0J6YUc5MWJHUWdZbVVnWVc0Z1pYWmxiblJjYmlBZ2NtVjBkWEp1SUdGMGRISk9ZVzFsTG5OMFlYSjBjMWRwZEdnb0oyOXVKeWs3WEc1OVhHNGlYU3dpYm1GdFpYTWlPbHNpYVhORmRtVnVkRTVoYldVaUxDSmhkSFJ5VG1GdFpTSXNJbk4wWVhKMGMxZHBkR2dpWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEUxQlFVMHNWVUZCVlVFc1YwRkJWeXhEUVVGRFF5eFJRVUZuUWl4RlFVRlhMRU5CUVVNN1NVRkZkRVFzVFVGQlRTeERRVVp2UWtFc1VVRkJaMElzUTBGRk1VSkRMRlZCUVZVc1EwRkJReXhEUVVGSk8wRkJRMnBETEVOQlFVTWlmUT09IiwidmFyIF90eXBlb2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFN5bWJvbCAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcbmltcG9ydCB7IGlzUHJpbWl0aXZlLCBoYXNPd25Qcm9wZXJ0eSwgaXMgfSBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7IGlzRXZlbnROYW1lIH0gZnJvbSBcIi4vaXNFdmVudE5hbWVcIjtcbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93RXF1YWwodmFsdWVBLCB2YWx1ZUIpIHtcbiAgICBpZiAoKHZvaWQgMCA9PT0gdmFsdWVBID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YodmFsdWVBKSkgIT09ICh2b2lkIDAgPT09IHZhbHVlQiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKHZhbHVlQikpKSByZXR1cm4gITE7XG4gICAgaWYgKGlzUHJpbWl0aXZlKHZhbHVlQikpIHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQjtcbiAgICB2YXIga2V5c0EgPSBPYmplY3Qua2V5cyh2YWx1ZUEpLCBrZXlzQiA9IE9iamVjdC5rZXlzKHZhbHVlQik7XG4gICAgaWYgKGtleXNBLmxlbmd0aCAhPT0ga2V5c0IubGVuZ3RoKSByZXR1cm4gITE7XG4gICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAhMCwgX2RpZEl0ZXJhdG9yRXJyb3IgPSAhMSwgX2l0ZXJhdG9yRXJyb3IgPSB2b2lkIDA7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yKHZhciBfc3RlcCwgX2l0ZXJhdG9yID0ga2V5c0FbU3ltYm9sLml0ZXJhdG9yXSgpOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9ICEwKXtcbiAgICAgICAgICAgIHZhciB2YWwgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcGVydHkodmFsdWVCLCB2YWwpIHx8ICFpc0V2ZW50TmFtZSh2YWwpIHx8ICFpcyh2YWx1ZUFbdmFsXSwgdmFsdWVCW3ZhbF0pKSByZXR1cm4gITE7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSAhMCwgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgfSBmaW5hbGx5e1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiB8fCBudWxsID09IF9pdGVyYXRvci5yZXR1cm4gfHwgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICB9IGZpbmFsbHl7XG4gICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAhMDtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDNWMGFXeHpMM05vWVd4c2IzZEZjWFZoYkM1MGN5SmRMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdleUJwYzFCeWFXMXBkR2wyWlN3Z2FHRnpUM2R1VUhKdmNHVnlkSGtzSUdseklIMGdabkp2YlNBbkxpOWpiMjF0YjI0bk8xeHVhVzF3YjNKMElIc2dhWE5GZG1WdWRFNWhiV1VnZlNCbWNtOXRJQ2N1TDJselJYWmxiblJPWVcxbEp6dGNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSE5vWVd4c2IzZEZjWFZoYkNoMllXeDFaVUU2SUdGdWVTd2dkbUZzZFdWQ09pQmhibmtwSUh0Y2JpQWdhV1lnS0hSNWNHVnZaaUIyWVd4MVpVRWdJVDA5SUhSNWNHVnZaaUIyWVd4MVpVSXBJSHRjYmlBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lIMWNiaUFnTHk4Z2RHVjRkQ0J1YjJSbFhHNGdJR2xtSUNocGMxQnlhVzFwZEdsMlpTaDJZV3gxWlVJcEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxRU0E5UFQwZ2RtRnNkV1ZDTzF4dUlDQjlYRzRnSUM4dklHRjBkSEpwWW5WMFpTQnViMlJsWEc0Z0lHTnZibk4wSUd0bGVYTkJJRDBnVDJKcVpXTjBMbXRsZVhNb2RtRnNkV1ZCS1R0Y2JpQWdZMjl1YzNRZ2EyVjVjMElnUFNCUFltcGxZM1F1YTJWNWN5aDJZV3gxWlVJcE8xeHVJQ0JwWmlBb2EyVjVjMEV1YkdWdVozUm9JQ0U5UFNCclpYbHpRaTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lIMWNibHh1SUNCbWIzSWdLR052Ym5OMElIWmhiQ0J2WmlCclpYbHpRU2tnZTF4dUlDQWdJR2xtSUNnaGFHRnpUM2R1VUhKdmNHVnlkSGtvZG1Gc2RXVkNMQ0IyWVd3cElIeDhJQ0ZwYzBWMlpXNTBUbUZ0WlNoMllXd3BJSHg4SUNGcGN5aDJZV3gxWlVGYmRtRnNYU3dnZG1Gc2RXVkNXM1poYkYwcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSFJ5ZFdVN1hHNTlYRzRpWFN3aWJtRnRaWE1pT2xzaWFYTlFjbWx0YVhScGRtVWlMQ0pvWVhOUGQyNVFjbTl3WlhKMGVTSXNJbWx6SWl3aWFYTkZkbVZ1ZEU1aGJXVWlMQ0p6YUdGc2JHOTNSWEYxWVd3aUxDSjJZV3gxWlVFaUxDSjJZV3gxWlVJaUxDSnJaWGx6UVNJc0lrOWlhbVZqZENJc0ltdGxlWE1pTENKclpYbHpRaUlzSW14bGJtZDBhQ0lzSW5aaGJDSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN08wRkJRVUVzVFVGQlRTeEhRVUZIUVN4WFFVRlhMRVZCUVVWRExHTkJRV01zUlVGQlJVTXNSVUZCUlN4UlFVRlJMRU5CUVZVN1FVRkRNVVFzVFVGQlRTeEhRVUZIUXl4WFFVRlhMRkZCUVZFc1EwRkJaVHRCUVVVelF5eE5RVUZOTEZWQlFWVkRMRmxCUVZrc1EwRkJRME1zVFVGQlZ5eEZRVUZGUXl4TlFVRlhMRVZCUVVVc1EwRkJRenRKUVVOMFJDeEZRVUZGTEdOQlFWTkVMRTFCUVUwc2FVSkJRV0lzVDBGQllTeERRVUZPUVN4TlFVRk5MRzFDUVVGWlF5eE5RVUZOTEdsQ1FVRmlMRTlCUVdFc1EwRkJUa0VzVFVGQlRTeEpRVU5xUXl4TlFVRk5MRVZCUVVNc1EwRkJTenRKUVVka0xFVkJRVVVzUlVGQlJVNHNWMEZCVnl4RFFVRkRUU3hOUVVGTkxFZEJRM0JDTEUxQlFVMHNRMEZCUTBRc1RVRkJUU3hMUVVGTFF5eE5RVUZOTzBsQlJ6RkNMRWRCUVVzc1EwRkJRME1zUzBGQlN5eEhRVUZIUXl4TlFVRk5MRU5CUVVORExFbEJRVWtzUTBGQlEwb3NUVUZCVFN4SFFVTXhRa3NzUzBGQlN5eEhRVUZIUml4TlFVRk5MRU5CUVVORExFbEJRVWtzUTBGQlEwZ3NUVUZCVFR0SlFVTm9ReXhGUVVGRkxFVkJRVVZETEV0QlFVc3NRMEZCUTBrc1RVRkJUU3hMUVVGTFJDeExRVUZMTEVOQlFVTkRMRTFCUVUwc1JVRkRMMElzVFVGQlRTeEZRVUZETEVOQlFVczdVVUZIVkN4NVFrRkJVeXhQUVVGVUxHbENRVUZUTEU5QlFWUXNZMEZCVXpzN1VVRkJaQ3hIUVVGSExFdEJRVVVzUzBGQlV5eEZRVUZVTEZOQlFWTXNSMEZCU1Vvc1MwRkJTeXgxUWtGQmJFSXNlVUpCUVZNc1NVRkJWQ3hMUVVGVExFZEJRVlFzVTBGQlV5eG5Ra0ZCVkN4NVFrRkJVeXhOUVVGWExFTkJRVU03V1VGQmNrSXNSMEZCU3l4RFFVRkRTeXhIUVVGSExFZEJRVlFzUzBGQlV6dFpRVU5hTEVWQlFVVXNSMEZCUjFnc1kwRkJZeXhEUVVGRFN5eE5RVUZOTEVWQlFVVk5MRWRCUVVjc1RVRkJUVlFzVjBGQlZ5eERRVUZEVXl4SFFVRkhMRTFCUVUxV0xFVkJRVVVzUTBGQlEwY3NUVUZCVFN4RFFVRkRUeXhIUVVGSExFZEJRVWRPTEUxQlFVMHNRMEZCUTAwc1IwRkJSeXhKUVVOc1JpeE5RVUZOTEVWQlFVTXNRMEZCU3p0UlFVVm9RaXhEUVVGRE96dFJRVXBKTEdsQ1FVRlRMRTlCUVZRc1kwRkJVeXhOT3pzN1dVRkJWQ3g1UWtGQlV5eFpRVUZVTEZOQlFWTXNWMEZCVkN4VFFVRlRMRk03TzJkQ1FVRlVMR2xDUVVGVExGRkJRVlFzWTBGQlV6czdPMGxCVFdRc1RVRkJUU3hGUVVGRExFTkJRVWs3UVVGRFlpeERRVUZESW4wPSIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVpZCgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWphSEpwYzJOcGJtUjVMME52WkdVdlIybDBhSFZpTDNCM1l5OXdZV05yWVdkbGN5OXdkMk12YzNKakwzVjBhV3h6TDJkbGJtVnlZWFJsVldsa0xuUnpJbDBzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JtZFc1amRHbHZiaUJuWlc1bGNtRjBaVlZwWkNncE9pQnVkVzFpWlhJZ2UxeHVJQ0J5WlhSMWNtNGdibVYzSUVSaGRHVW9LUzVuWlhSVWFXMWxLQ2s3WEc1OVhHNGlYU3dpYm1GdFpYTWlPbHNpWjJWdVpYSmhkR1ZWYVdRaUxDSkVZWFJsSWl3aVoyVjBWR2x0WlNKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1RVRkJUU3hWUVVGVlFTeFhRVUZYTEVkQlFWY3NRMEZCUXp0SlFVTnlReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZEUXl4SlFVRkpMRWRCUVVkRExFOUJRVTg3UVVGRE0wSXNRMEZCUXlKOSIsImltcG9ydCB7IGhhc093blByb3BlcnR5LCBpc0FycmF5IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBSZWFjdGl2ZUZsYWdzIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuZnVuY3Rpb24gdG9SYXcob2JzZXJ2ZWQpIHtcbiAgICB2YXIgcmF3ID0gb2JzZXJ2ZWQgJiYgb2JzZXJ2ZWRbUmVhY3RpdmVGbGFncy5SQVddO1xuICAgIHJldHVybiByYXcgPyB0b1JhdyhyYXcpIDogb2JzZXJ2ZWQ7XG59XG5mdW5jdGlvbiBnZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgcmV0dXJuIGtleSA9PT0gUmVhY3RpdmVGbGFncy5SQVcgPyB0YXJnZXQgOiBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3h5SGFuZGxlcihjYWxsYmFjaykge1xuICAgIHZhciB0cmlnZ2VyLCB0cmlnZ2VyMSwgc2V0ID0gKHRyaWdnZXIgPSBjYWxsYmFjaywgZnVuY3Rpb24gc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgICAgICByZXR1cm4gdG9SYXcocmVjZWl2ZXIpICE9PSB0YXJnZXQgfHwgaXNBcnJheSh0YXJnZXQpICYmIFwibGVuZ3RoXCIgPT09IGtleSB8fCB0cmlnZ2VyKCksIHJlc3VsdDtcbiAgICB9KSwgZGVsZXRlUHJvcGVydHkgPSAodHJpZ2dlcjEgPSBjYWxsYmFjaywgZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcbiAgICAgICAgdmFyIGhhZEtleSA9IGhhc093blByb3BlcnR5KHRhcmdldCwga2V5KSwgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG4gICAgICAgIHJldHVybiByZXN1bHQgJiYgaGFkS2V5ICYmIHRyaWdnZXIxKCksIHJlc3VsdDtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5OiBkZWxldGVQcm9wZXJ0eVxuICAgIH07XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWphSEpwYzJOcGJtUjVMME52WkdVdlIybDBhSFZpTDNCM1l5OXdZV05yWVdkbGN5OXdkMk12YzNKakwzSmxZV04wYVhacGRIa3ZhR0Z1Wkd4bGNpNTBjeUpkTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnZXlCb1lYTlBkMjVRY205d1pYSjBlU3dnYVhOQmNuSmhlU0I5SUdaeWIyMGdKeTR1TDNWMGFXeHpKenRjYm1sdGNHOXlkQ0I3SUZKbFlXTjBhWFpsUm14aFozTWdmU0JtY205dElDY3VMaTlqYjI1emRHRnVkSE1uTzF4dVhHNW1kVzVqZEdsdmJpQjBiMUpoZHlodlluTmxjblpsWkRvZ2IySnFaV04wS1RvZ2IySnFaV04wSUh0Y2JpQWdZMjl1YzNRZ2NtRjNJRDBnYjJKelpYSjJaV1FnSmlZZ2IySnpaWEoyWldSYlVtVmhZM1JwZG1WR2JHRm5jeTVTUVZkZE8xeHVJQ0J5WlhSMWNtNGdjbUYzSUQ4Z2RHOVNZWGNvY21GM0tTQTZJRzlpYzJWeWRtVmtPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm5aWFFvWEc0Z0lIUmhjbWRsZERvZ2IySnFaV04wTEZ4dUlDQnJaWGs2SUhOMGNtbHVaeXhjYmlBZ2NtVmpaV2wyWlhJNklHOWlhbVZqZEN4Y2JpazZJR0Z1ZVNCN1hHNGdJR2xtSUNoclpYa2dQVDA5SUZKbFlXTjBhWFpsUm14aFozTXVVa0ZYS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJoY21kbGREdGNiaUFnZlZ4dUlDQnlaWFIxY200Z1VtVm1iR1ZqZEM1blpYUW9kR0Z5WjJWMExDQnJaWGtzSUhKbFkyVnBkbVZ5S1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWTNKbFlYUmxVMlYwZEdWeUtIUnlhV2RuWlhJcElIdGNiaUFnY21WMGRYSnVJR1oxYm1OMGFXOXVJSE5sZENoY2JpQWdJQ0IwWVhKblpYUTZJRzlpYW1WamRDeGNiaUFnSUNCclpYazZJSE4wY21sdVp5eGNiaUFnSUNCMllXeDFaVG9nZFc1cmJtOTNiaXhjYmlBZ0lDQnlaV05sYVhabGNqb2diMkpxWldOMExGeHVJQ0FwSUh0Y2JpQWdJQ0JqYjI1emRDQnlaWE4xYkhRZ1BTQlNaV1pzWldOMExuTmxkQ2gwWVhKblpYUXNJR3RsZVN3Z2RtRnNkV1VzSUhKbFkyVnBkbVZ5S1R0Y2JpQWdJQ0JqYjI1emRDQnZjbWxuYVc1VVlYSm5aWFFnUFNCMGIxSmhkeWh5WldObGFYWmxjaWs3WEc1Y2JpQWdJQ0F2THlCSloyNXZjbVVnZEdobElITmxkQ0IzYUdsamFDQm9ZWEJ3Wlc1bFpDQnBiaUJoSUhCeWIzUnZkSGx3WlNCamFHRnBibHh1SUNBZ0lHbG1JQ2h2Y21sbmFXNVVZWEpuWlhRZ0lUMDlJSFJoY21kbGRDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCSloyNXZjbVVnZEdobElHRnljbUY1TG14bGJtZDBhQ0JqYUdGdVoyVnpYRzRnSUNBZ2FXWWdLQ0ZwYzBGeWNtRjVLSFJoY21kbGRDa2dmSHdnYTJWNUlDRTlQU0FuYkdWdVozUm9KeWtnZTF4dUlDQWdJQ0FnZEhKcFoyZGxjaWdwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDA3WEc1OVhHNWNibVoxYm1OMGFXOXVJR055WldGMFpVUmxiR1YwWlZCeWIzQmxjblI1S0hSeWFXZG5aWElwSUh0Y2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlHUmxiR1YwWlZCeWIzQmxjblI1S0Z4dUlDQWdJSFJoY21kbGREb2diMkpxWldOMExGeHVJQ0FnSUd0bGVUb2djM1J5YVc1bkxGeHVJQ0FwT2lCaWIyOXNaV0Z1SUh0Y2JpQWdJQ0JqYjI1emRDQm9ZV1JMWlhrZ1BTQm9ZWE5QZDI1UWNtOXdaWEowZVNoMFlYSm5aWFFzSUd0bGVTazdYRzRnSUNBZ1kyOXVjM1FnY21WemRXeDBJRDBnVW1WbWJHVmpkQzVrWld4bGRHVlFjbTl3WlhKMGVTaDBZWEpuWlhRc0lHdGxlU2s3WEc1Y2JpQWdJQ0JwWmlBb2NtVnpkV3gwSUNZbUlHaGhaRXRsZVNrZ2UxeHVJQ0FnSUNBZ2RISnBaMmRsY2lncE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5TzF4dWZWeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHZGxkRkJ5YjNoNVNHRnVaR3hsY2loallXeHNZbUZqYXlrZ2UxeHVJQ0JqYjI1emRDQnpaWFFnUFNCamNtVmhkR1ZUWlhSMFpYSW9ZMkZzYkdKaFkyc3BPMXh1SUNCamIyNXpkQ0JrWld4bGRHVlFjbTl3WlhKMGVTQTlJR055WldGMFpVUmxiR1YwWlZCeWIzQmxjblI1S0dOaGJHeGlZV05yS1R0Y2JpQWdjbVYwZFhKdUlIdGNiaUFnSUNCblpYUXNYRzRnSUNBZ2MyVjBMRnh1SUNBZ0lHUmxiR1YwWlZCeWIzQmxjblI1TEZ4dUlDQjlPMXh1ZlZ4dUlsMHNJbTVoYldWeklqcGJJbWhoYzA5M2JsQnliM0JsY25SNUlpd2lhWE5CY25KaGVTSXNJbEpsWVdOMGFYWmxSbXhoWjNNaUxDSjBiMUpoZHlJc0ltOWljMlZ5ZG1Wa0lpd2ljbUYzSWl3aVVrRlhJaXdpWjJWMElpd2lkR0Z5WjJWMElpd2lhMlY1SWl3aWNtVmpaV2wyWlhJaUxDSlNaV1pzWldOMElpd2laMlYwVUhKdmVIbElZVzVrYkdWeUlpd2lZMkZzYkdKaFkyc2lMQ0owY21sbloyVnlJaXdpYzJWMElpd2lkbUZzZFdVaUxDSnlaWE4xYkhRaUxDSmtaV3hsZEdWUWNtOXdaWEowZVNJc0ltaGhaRXRsZVNKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1RVRkJUU3hIUVVGSFFTeGpRVUZqTEVWQlFVVkRMRTlCUVU4c1VVRkJVU3hEUVVGVk8wRkJRMnhFTEUxQlFVMHNSMEZCUjBNc1lVRkJZU3hSUVVGUkxFTkJRV003VTBGRmJrTkRMRXRCUVVzc1EwRkJRME1zVVVGQlowSXNSVUZCVlN4RFFVRkRPMGxCUTNoRExFZEJRVXNzUTBGQlEwTXNSMEZCUnl4SFFVUkpSQ3hSUVVGblFpeEpRVUZvUWtFc1VVRkJaMElzUTBGRFNVWXNZVUZCWVN4RFFVRkRTU3hIUVVGSE8wbEJRMnhFTEUxQlFVMHNRMEZCUTBRc1IwRkJSeXhIUVVGSFJpeExRVUZMTEVOQlFVTkZMRWRCUVVjc1NVRkdWRVFzVVVGQlowSTdRVUZITDBJc1EwRkJRenRUUVVWUlJ5eEhRVUZITEVOQlExWkRMRTFCUVdNc1JVRkRaRU1zUjBGQlZ5eEZRVU5ZUXl4UlFVRm5RaXhGUVVOWUxFTkJRVU03VjBGR1RrUXNSMEZCVnl4TFFVZERVQ3hoUVVGaExFTkJRVU5KTEVkQlFVY3NSMEZLTjBKRkxFMUJRV01zUjBGUFVFY3NUMEZCVHl4RFFVRkRTaXhIUVVGSExFTkJVR3hDUXl4TlFVRmpMRVZCUTJSRExFZEJRVmNzUlVGRFdFTXNVVUZCWjBJN1FVRk5iRUlzUTBGQlF6dEJRWGREUkN4TlFVRk5MRlZCUVZWRkxHVkJRV1VzUTBGQlEwTXNVVUZCVVN4RlFVRkZMRU5CUVVNN1VVRjBRM0pDUXl4UFFVRlBMRVZCZDBKRFFTeFJRVUZQTEVWQlpUZENReXhIUVVGSExFbEJka05YUkN4UFFVRlBMRWRCYzBOSFJDeFJRVUZSTEVWQmNrTXZRaXhSUVVGUkxFTkJRVU5GTEVkQlFVY3NRMEZEYWtKUUxFMUJRV01zUlVGRFpFTXNSMEZCVnl4RlFVTllUeXhMUVVGakxFVkJRMlJPTEZGQlFXZENMRVZCUTJoQ0xFTkJRVU03VVVGRFJDeEhRVUZMTEVOQlFVTlBMRTFCUVUwc1IwRkJSMDRzVDBGQlR5eERRVUZEU1N4SFFVRkhMRU5CVERGQ1VDeE5RVUZqTEVWQlEyUkRMRWRCUVZjc1JVRkRXRThzUzBGQll5eEZRVU5rVGl4UlFVRm5RanRsUVVkTFVDeExRVUZMTEVOQlNERkNUeXhSUVVGblFpeE5RVWhvUWtZc1RVRkJZeXhKUVdOVVVDeFBRVUZQTEVOQlpGcFBMRTFCUVdNc1MwRmphMElzUTBGQlVTeFpRV0o0UTBNc1IwRkJWeXhKUVVoUFN5eFBRVUZQTEVsQldXaENSeXhOUVVGTk8wbEJVMnBDTEVOQlFVTXNSMEZ0UWt0RExHTkJRV01zU1VGb1FsRktMRkZCUVU4c1IwRmpURVFzVVVGQlVTeEZRV0l2UWl4UlFVRlJMRU5CUVVOTExHTkJRV01zUTBGRE5VSldMRTFCUVdNc1JVRkRaRU1zUjBGQlZ5eEZRVU5HTEVOQlFVTTdVVUZEVml4SFFVRkxMRU5CUVVOVkxFMUJRVTBzUjBGQlIyNUNMR05CUVdNc1EwRklOMEpSTEUxQlFXTXNSVUZEWkVNc1IwRkJWeXhIUVVkTVVTeE5RVUZOTEVkQlFVZE9MRTlCUVU4c1EwRkJRMDhzWTBGQll5eERRVXB5UTFZc1RVRkJZeXhGUVVOa1F5eEhRVUZYTzFGQlVWZ3NUVUZCVFN4RFFVaEdVU3hOUVVGTkxFbEJRVWxGTEUxQlFVMHNTVUZTVFV3c1VVRkJUeXhKUVZjeFFrY3NUVUZCVFR0SlFVTm1MRU5CUVVNN1NVRkxSQ3hOUVVGTkxFTkJRVU1zUTBGQlF6dFJRVU5PVml4SFFVRkhMRVZCUVVoQkxFZEJRVWM3VVVGRFNGRXNSMEZCUnl4RlFVRklRU3hIUVVGSE8xRkJRMGhITEdOQlFXTXNSVUZCWkVFc1kwRkJZenRKUVVOb1FpeERRVUZETzBGQlEwZ3NRMEZCUXlKOSIsImZ1bmN0aW9uIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZUNvbGxlY3Rpb24pIHtcbiAgICBpZiAocHJpdmF0ZUNvbGxlY3Rpb24uaGFzKG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgaW5pdGlhbGl6ZSB0aGUgc2FtZSBwcml2YXRlIGVsZW1lbnRzIHR3aWNlIG9uIGFuIG9iamVjdFwiKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIGFjdGlvbikge1xuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIFwiICsgYWN0aW9uICsgXCIgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xuICAgIHZhciByZWNlaXZlciwgZGVzY3JpcHRvciwgZGVzY3JpcHRvciA9IF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIFwiZ2V0XCIpO1xuICAgIHJldHVybiBkZXNjcmlwdG9yLmdldCA/IGRlc2NyaXB0b3IuZ2V0LmNhbGwocmVjZWl2ZXIpIDogZGVzY3JpcHRvci52YWx1ZTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQob2JqLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xuICAgIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZU1hcCksIHByaXZhdGVNYXAuc2V0KG9iaiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCAhMSwgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSAhMCwgXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IgJiYgKGRlc2NyaXB0b3Iud3JpdGFibGUgPSAhMCksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG59XG5pbXBvcnQgeyBnZXRQcm94eUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVyXCI7XG52YXIgX2VsZW1lbnQgPSBuZXcgV2Vha01hcCgpLCBfcHJveHlIYW5kbGVyID0gbmV3IFdlYWtNYXAoKSwgX2NyZWF0ZVJlYWN0aXZlUHJvcGVydHkgPSBuZXcgV2Vha1NldCgpO1xuZXhwb3J0IHZhciBSZWFjdGl2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHM7XG4gICAgZnVuY3Rpb24gUmVhY3RpdmUoZWxlbWVudEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBvYmosIHByaXZhdGVTZXQsIHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSwgZGVzY3JpcHRvcjtcbiAgICAgICAgIWZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9KHRoaXMsIFJlYWN0aXZlKSwgX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdCh0aGlzLCBfZWxlbWVudCwge1xuICAgICAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICAgICAgdmFsdWU6IHZvaWQgMFxuICAgICAgICB9KSwgX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdCh0aGlzLCBfcHJveHlIYW5kbGVyLCB7XG4gICAgICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgICAgICB2YWx1ZTogZ2V0UHJveHlIYW5kbGVyKHRoaXMucmVxdWVzdFVwZGF0ZS5iaW5kKHRoaXMpKVxuICAgICAgICB9KSwgb2JqID0gdGhpcywgKF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZVNldCA9IF9jcmVhdGVSZWFjdGl2ZVByb3BlcnR5KSwgcHJpdmF0ZVNldC5hZGQob2JqKSksIHJlY2VpdmVyID0gdGhpcywgcHJpdmF0ZU1hcCA9IF9lbGVtZW50LCB2YWx1ZSA9IGVsZW1lbnRJbnN0YW5jZSwgZGVzY3JpcHRvciA9IF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIFwic2V0XCIpLCAoZnVuY3Rpb24gX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3Iuc2V0KSBkZXNjcmlwdG9yLnNldC5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWRlc2NyaXB0b3Iud3JpdGFibGUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHJlYWQgb25seSBwcml2YXRlIGZpZWxkXCIpO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkocmVjZWl2ZXIsIGRlc2NyaXB0b3IsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yID0gUmVhY3RpdmUsIHByb3RvUHJvcHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGtleTogXCJyZXF1ZXN0VXBkYXRlXCIsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVxdWVzdFVwZGF0ZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVmO1xuICAgICAgICAgICAgICAgIG51bGwgPT09IChyZWYgPSBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2VsZW1lbnQpKSB8fCB2b2lkIDAgPT09IHJlZiB8fCByZWYucmVxdWVzdFVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBrZXk6IFwiZ2V0UmVhY3RpdmVWYWx1ZVwiLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJlYWN0aXZlVmFsdWUocHJvcCkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBSZWFjdGl2ZS5nZXRLZXkocHJvcCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfZWxlbWVudClba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAga2V5OiBcInNldFJlYWN0aXZlVmFsdWVcIixcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRSZWFjdGl2ZVZhbHVlKHByb3AsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IFJlYWN0aXZlLmdldEtleShwcm9wKTtcbiAgICAgICAgICAgICAgICBcIm9iamVjdFwiID09IHR5cGVvZiB2YWx1ZSA/IChmdW5jdGlvbiBfY2xhc3NQcml2YXRlTWV0aG9kR2V0KHJlY2VpdmVyLCBwcml2YXRlU2V0LCBmbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXByaXZhdGVTZXQuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbjtcbiAgICAgICAgICAgICAgICB9KSh0aGlzLCBfY3JlYXRlUmVhY3RpdmVQcm9wZXJ0eSwgY3JlYXRlUmVhY3RpdmVQcm9wZXJ0eSkuY2FsbCh0aGlzLCBrZXksIHZhbHVlKSA6IF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfZWxlbWVudClba2V5XSA9IHZhbHVlLCB0aGlzLnJlcXVlc3RVcGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0sIHN0YXRpY1Byb3BzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBrZXk6IFwiZ2V0S2V5XCIsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0S2V5KGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIiNfXCIuY29uY2F0KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdLCBwcm90b1Byb3BzICYmIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyksIHN0YXRpY1Byb3BzICYmIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyksIFJlYWN0aXZlO1xufSgpO1xuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVQcm9wZXJ0eShrZXksIGluaXRpYWxWYWx1ZSkge1xuICAgIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfZWxlbWVudClba2V5XSA9IG5ldyBQcm94eShpbml0aWFsVmFsdWUsIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfcHJveHlIYW5kbGVyKSk7XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWphSEpwYzJOcGJtUjVMME52WkdVdlIybDBhSFZpTDNCM1l5OXdZV05yWVdkbGN5OXdkMk12YzNKakwzSmxZV04wYVhacGRIa3ZjbVZoWTNScGRtVXVkSE1pTENJdlZYTmxjbk12WTJoeWFYTmphVzVrZVM5RGIyUmxMMGRwZEdoMVlpOXdkMk12Y0dGamEyRm5aWE12Y0hkakwzTnlZeTlqYjI1emRHRnVkSE11ZEhNaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIc2daMlYwVUhKdmVIbElZVzVrYkdWeUlIMGdabkp2YlNBbkxpOW9ZVzVrYkdWeUp6dGNibHh1YVc1MFpYSm1ZV05sSUZKbFlXTjBhWFpsVkhsd1pTQjdYRzRnSUhObGRGSmxZV04wYVhabFZtRnNkV1U2SUNod2NtOXdPaUJ6ZEhKcGJtY3NJSFpoYkRvZ2RXNXJibTkzYmlrZ1BUNGdkbTlwWkR0Y2JseHVJQ0JuWlhSU1pXRmpkR2wyWlZaaGJIVmxPaUFvY0hKdmNEb2djM1J5YVc1bktTQTlQaUIxYm10dWIzZHVPMXh1WEc0Z0lDOHZJRlJvWlNCeVpXRmpkR2wyWlNCd2NtOXdaWEowZVNCcFppQmphR0Z1WjJWa0lIZHBiR3dnY21WeGRXVnpkQ0JoSUhWd1pHRjBaVnh1SUNCeVpYRjFaWE4wVlhCa1lYUmxPaUFvS1NBOVBpQjJiMmxrTzF4dWZWeHVYRzVsZUhCdmNuUWdZMnhoYzNNZ1VtVmhZM1JwZG1VZ2FXMXdiR1Z0Wlc1MGN5QlNaV0ZqZEdsMlpWUjVjR1VnZTF4dUlDQnpkR0YwYVdNZ1oyVjBTMlY1S0d0bGVUb2djM1J5YVc1bktUb2djM1J5YVc1bklIdGNiaUFnSUNCeVpYUjFjbTRnWUNOZkpIdHJaWGw5WUR0Y2JpQWdmVnh1WEc0Z0lDTmxiR1Z0Wlc1ME9pQmhibms3WEc0Z0lDTndjbTk0ZVVoaGJtUnNaWElnUFNCblpYUlFjbTk0ZVVoaGJtUnNaWElvZEdocGN5NXlaWEYxWlhOMFZYQmtZWFJsTG1KcGJtUW9kR2hwY3lrcE8xeHVYRzRnSUdOdmJuTjBjblZqZEc5eUtHVnNaVzFsYm5SSmJuTjBZVzVqWlNrZ2UxeHVJQ0FnSUhSb2FYTXVJMlZzWlcxbGJuUWdQU0JsYkdWdFpXNTBTVzV6ZEdGdVkyVTdYRzRnSUgxY2JseHVJQ0J5WlhGMVpYTjBWWEJrWVhSbEtDa2dlMXh1SUNBZ0lIUm9hWE11STJWc1pXMWxiblEvTG5KbGNYVmxjM1JWY0dSaGRHVW9LVHRjYmlBZ2ZWeHVYRzRnSUdkbGRGSmxZV04wYVhabFZtRnNkV1VvY0hKdmNEb2djM1J5YVc1bktTQjdYRzRnSUNBZ1kyOXVjM1FnYTJWNUlEMGdVbVZoWTNScGRtVXVaMlYwUzJWNUtIQnliM0FwTzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGlObGJHVnRaVzUwVzJ0bGVWMDdYRzRnSUgxY2JseHVJQ0J6WlhSU1pXRmpkR2wyWlZaaGJIVmxLSEJ5YjNBNklITjBjbWx1Wnl3Z2RtRnNkV1U2SUhWdWEyNXZkMjRwSUh0Y2JpQWdJQ0JqYjI1emRDQnJaWGtnUFNCU1pXRmpkR2wyWlM1blpYUkxaWGtvY0hKdmNDazdYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjJZV3gxWlNBOVBUMGdKMjlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJSFJvYVhNdUkyTnlaV0YwWlZKbFlXTjBhWFpsVUhKdmNHVnlkSGtvYTJWNUxDQjJZV3gxWlNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdUkyVnNaVzFsYm5SYmEyVjVYU0E5SUhaaGJIVmxPMXh1SUNBZ0lIMWNiaUFnSUNCMGFHbHpMbkpsY1hWbGMzUlZjR1JoZEdVb0tUdGNiaUFnZlZ4dVhHNGdJQ05qY21WaGRHVlNaV0ZqZEdsMlpWQnliM0JsY25SNUtHdGxlVG9nYzNSeWFXNW5MQ0JwYm1sMGFXRnNWbUZzZFdVNklHRnVlU2tnZTF4dUlDQWdJSFJvYVhNdUkyVnNaVzFsYm5SYmEyVjVYU0E5SUc1bGR5QlFjbTk0ZVNocGJtbDBhV0ZzVm1Gc2RXVXNJSFJvYVhNdUkzQnliM2g1U0dGdVpHeGxjaWs3WEc0Z0lIMWNibjFjYmlJc0ltVjRjRzl5ZENCamIyNXpkQ0JRVjBOZlVGSkZSa2xZSUQwZ0p6OXdkMk1uTzF4dVpYaHdiM0owSUdOdmJuTjBJRlJGV0ZSZlEwOU5UVVZPVkY5RVFWUkJJRDBnSno5d2QyTmZkQ2M3WEc1bGVIQnZjblFnWTI5dWMzUWdVRXhCUTBWSVQweEVSVkpmUTA5TlRVVk9WRjlFUVZSQklEMGdKejl3ZDJOZmNDYzdYRzVsZUhCdmNuUWdZMjl1YzNRZ1pXNTFiU0JTWldGamRHbDJaVVpzWVdkeklIdGNiaUFnVWtGWElEMGdKMTlmY0Y5eVlYZGZYeWNzWEc1OVhHNGlYU3dpYm1GdFpYTWlPbHNpWjJWMFVISnZlSGxJWVc1a2JHVnlJaXdpVW1WaFkzUnBkbVVpTENKbGJHVnRaVzUwU1c1emRHRnVZMlVpTENKeVpYRjFaWE4wVlhCa1lYUmxJaXdpWW1sdVpDSXNJbVZzWlcxbGJuUWlMQ0puWlhSU1pXRmpkR2wyWlZaaGJIVmxJaXdpY0hKdmNDSXNJbXRsZVNJc0ltZGxkRXRsZVNJc0luTmxkRkpsWVdOMGFYWmxWbUZzZFdVaUxDSjJZV3gxWlNJc0ltTnlaV0YwWlZKbFlXTjBhWFpsVUhKdmNHVnlkSGtpTENKcGJtbDBhV0ZzVm1Gc2RXVWlMQ0pRY205NGVTSXNJbkJ5YjNoNVNHRnVaR3hsY2lKZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenM3T3pKRk96czdPenQ1VFRzN08wRkJRVUVzVFVGQlRTeEhRVUZIUVN4bFFVRmxMRkZCUVZFc1EwRkJWenRKUVdkQ2VrTXNVVUZCVVN4clFrRkRVaXhoUVVGaExHdENRWGxDWWl4MVFrRkJkVUk3UVVFdlFucENMRTFCUVUwc1MwRkJUME1zVVVGQlVTeEhRVUZrTEZGQlFWRTdaMEk3TzJGQlFVWkJMRkZCUVZFc1EwRlJVRU1zWlVGQlpUczdPenQzUkVGSU0wSXNVVUZCVVRzN2JVSkJRVklzU1VGQlNTeERRVUZLTEVOQlFXTTdlVU5CUTJRc1lVRkJZVHM3YlVKQlFVZEdMR1ZCUVdVc1EwRkJReXhKUVVGSkxFTkJRVU5ITEdGQlFXRXNRMEZCUTBNc1NVRkJTU3hEUVVGRExFbEJRVWs3YzBWQmVVSTFSQ3gxUWtGQmRVSXNkVVJCZEVKbVF5eFJRVUZQTEZWQlFVZElMR1ZCUVdVN2IwVTdPenQzUXpzN2RVTTdPenM3V1VGSGFrTkRMRWRCUVdFc1JVRkJZa0VzUTBGQllUdHRRa0ZCWWtFc1VVRkJVU3hEUVVGU1FTeGhRVUZoTEVkQlFVY3NRMEZCUXpzN2MwUkJRMllzU1VGQlNTeEZRVUZGUlN4UlFVRlBMRFJDUVVGRlJpeGhRVUZoTEVWRGVFSm9ReXhEUkhkQ2JVTTdXVUZEYWtNc1EwRkJRenM3TzFsQlJVUkhMRWRCUVdkQ0xFVkJRV2hDUVN4RFFVRm5RanR0UWtGQmFFSkJMRkZCUVZFc1EwRkJVa0VzWjBKQlFXZENMRU5CUVVORExFbEJRVmtzUlVGQlJTeERRVUZETzJkQ1FVTTVRaXhIUVVGTExFTkJRVU5ETEVkQlFVY3NSMEZCUjFBc1VVRkJVU3hEUVVGRFVTeE5RVUZOTEVOQlJGcEdMRWxCUVZrN1owSkJSVE5DTEUxQlFVMHNkVUpCUVVNc1NVRkJTU3hGUVVGRlJpeFJRVUZQTEVWQlFVTkhMRWRCUVVjN1dVRkRNVUlzUTBGQlF6czdPMWxCUlVSRkxFZEJRV2RDTEVWQlFXaENRU3hEUVVGblFqdHRRa0ZCYUVKQkxGRkJRVkVzUTBGQlVrRXNaMEpCUVdkQ0xFTkJRVU5JTEVsQlFWa3NSVUZCUlVrc1MwRkJZeXhGUVVGRkxFTkJRVU03WjBKQlF6bERMRWRCUVVzc1EwRkJRMGdzUjBGQlJ5eEhRVUZIVUN4UlFVRlJMRU5CUVVOUkxFMUJRVTBzUTBGRVdrWXNTVUZCV1R0blFrRkZUaXhEUVVGUkxGZEJRWHBDTEUxQlFVMHNRMEZCUTBrc1MwRkJTenM3TzIxQ1FVTmtMRWxCUVVrc1JVRkJSVU1zZFVKQlFYTkNMRVZCUVhSQ1FTeHpRa0ZCYzBJc1QwRkJOVUlzU1VGQlNTeEZRVUY1UWtvc1IwRkJSeXhGUVVGRlJ5eExRVUZMTERCQ1FVVjJReXhKUVVGSkxFVkJRVVZPTEZGQlFVOHNSVUZCUTBjc1IwRkJSeXhKUVVGSlJ5eExRVUZMTEVWQlJUVkNMRWxCUVVrc1EwRkJRMUlzWVVGQllTeEZPMWxCUTNCQ0xFTkJRVU03T3pzN1dVRTFRazFOTEVkQlFVMHNSVUZCVGtFc1EwRkJUVHR0UWtGQllpeFJRVUZSTEVOQlFVUkJMRTFCUVUwc1EwRkJRMFFzUjBGQlZ5eEZRVUZWTEVOQlFVTTdaMEpCUTJ4RExFMUJRVTBzUTBGQlJTeERRVUZGTEVsQlFVMHNUVUZCUVN4RFFVUktRU3hIUVVGWE8xbEJSWHBDTEVOQlFVTTdPenM3VTBFMFFrUXNjMEpCUlVNc1EwRkdkVUpCTEVkQlFWY3NSVUZCUlVzc1dVRkJhVUlzUlVGQlJTeERRVUZET3pCQ1FVTjJSQ3hKUVVGSkxFVkJRVVZTTEZGQlFVOHNSVUZCUTBjc1IwRkJSeXhKUVVGSkxFZEJRVWNzUTBGQlEwMHNTMEZCU3l4RFFVRkRSQ3haUVVGWkxIZENRVUZGTEVsQlFVa3NSVUZCUlVVc1lVRkJXU3hGUVVGRExFTkJRVU03UVVGRGJrVXNRMEZCUXlKOSIsImltcG9ydCB7IGhhc093blByb3BlcnR5IH0gZnJvbSBcIi4uL3V0aWxzL2NvbW1vblwiO1xuaW1wb3J0IHsgaXNFdmVudE5hbWUgfSBmcm9tIFwiLi4vdXRpbHMvaXNFdmVudE5hbWVcIjtcbmV4cG9ydCBmdW5jdGlvbiBjb21taXRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJzLCBpc0luaXRpYWwpIHtcbiAgICBmb3IodmFyIGF0dHJOYW1lIGluIGF0dHJzKWlmIChoYXNPd25Qcm9wZXJ0eShhdHRycywgYXR0ck5hbWUpKSBpZiAoaXNFdmVudE5hbWUoYXR0ck5hbWUpICYmIGlzSW5pdGlhbCkge1xuICAgICAgICB2YXIgX2F0dHJOYW1lID0gYXR0cnNbYXR0ck5hbWVdLCBoYW5kbGVyID0gX2F0dHJOYW1lLmhhbmRsZXIsIF9jYXB0dXJlID0gX2F0dHJOYW1lLmNhcHR1cmUsIGNhcHR1cmUgPSB2b2lkIDAgIT09IF9jYXB0dXJlICYmIF9jYXB0dXJlO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYXR0ck5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKSwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgfSBlbHNlIGF0dHJOYW1lIGluIGVsZW1lbnQgPyBlbGVtZW50W2F0dHJOYW1lXSA9IGF0dHJzW2F0dHJOYW1lXSA6IGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyc1thdHRyTmFtZV0pO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlqYUhKcGMyTnBibVI1TDBOdlpHVXZSMmwwYUhWaUwzQjNZeTl3WVdOcllXZGxjeTl3ZDJNdmMzSmpMMlZzWlcxbGJuUnpMMk52YlcxcGRFRjBkSEpwWW5WMFpYTXVkSE1pTENJdlZYTmxjbk12WTJoeWFYTmphVzVrZVM5RGIyUmxMMGRwZEdoMVlpOXdkMk12Y0dGamEyRm5aWE12Y0hkakwzTnlZeTlqYjI1emRHRnVkSE11ZEhNaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIc2dhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2ZTQm1jbTl0SUNjdUxpOTFkR2xzY3k5amIyMXRiMjRuTzF4dWFXMXdiM0owSUhzZ2FYTkZkbVZ1ZEU1aGJXVWdmU0JtY205dElDY3VMaTkxZEdsc2N5OXBjMFYyWlc1MFRtRnRaU2M3WEc1cGJYQnZjblFnZEhsd1pTQjdJRUYwZEhKcFluVjBaWE1nZlNCbWNtOXRJQ2N1TGk5MGVYQmxKenRjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdOdmJXMXBkRUYwZEhKcFluVjBaWE1vWld4bGJXVnVkRG9nUld4bGJXVnVkQ3dnWVhSMGNuTTZJRUYwZEhKcFluVjBaWE1zSUdselNXNXBkR2xoYkRvZ1ltOXZiR1ZoYmlrZ2UxeHVJQ0JtYjNJZ0tHTnZibk4wSUdGMGRISk9ZVzFsSUdsdUlHRjBkSEp6S1NCN1hHNGdJQ0FnYVdZZ0tHaGhjMDkzYmxCeWIzQmxjblI1S0dGMGRISnpMQ0JoZEhSeVRtRnRaU2twSUh0Y2JpQWdJQ0FnSUdsbUlDaHBjMFYyWlc1MFRtRnRaU2hoZEhSeVRtRnRaU2tnSmlZZ2FYTkpibWwwYVdGc0tTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElIc2dhR0Z1Wkd4bGNpd2dZMkZ3ZEhWeVpTQTlJR1poYkhObElIMGdQU0JoZEhSeWMxdGhkSFJ5VG1GdFpWMDdYRzRnSUNBZ0lDQWdJQzh2SUVsbUlHTmhjSFIxY21VZ2FYTWdkSEoxWlN3Z2RHaGxJR1YyWlc1MElITm9iM1ZzWkNCaVpTQjBjbWxuWjJWeVpXUWdkMmhsYmlCallYQjBkWEpsSUhOMFlXZGxYRzRnSUNBZ0lDQWdJR1ZzWlcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpaGhkSFJ5VG1GdFpTNXpiR2xqWlNneUtTNTBiMHh2ZDJWeVEyRnpaU2dwTENCb1lXNWtiR1Z5TENCallYQjBkWEpsS1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb1lYUjBjazVoYldVZ2FXNGdaV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdJQ0F2THlCV1pYSnBabmtnZEdoaGRDQjBhR1Z5WlNCcGN5QmhJSFJoY21kbGRDQndjbTl3WlhKMGVTQnZiaUIwYUdVZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwVzJGMGRISk9ZVzFsWFNBOUlHRjBkSEp6VzJGMGRISk9ZVzFsWFR0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtHRjBkSEpPWVcxbExDQmhkSFJ5YzF0aGRIUnlUbUZ0WlYwcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1ZlZ4dUlpd2laWGh3YjNKMElHTnZibk4wSUZCWFExOVFVa1ZHU1ZnZ1BTQW5QM0IzWXljN1hHNWxlSEJ2Y25RZ1kyOXVjM1FnVkVWWVZGOURUMDFOUlU1VVgwUkJWRUVnUFNBblAzQjNZMTkwSnp0Y2JtVjRjRzl5ZENCamIyNXpkQ0JRVEVGRFJVaFBURVJGVWw5RFQwMU5SVTVVWDBSQlZFRWdQU0FuUDNCM1kxOXdKenRjYm1WNGNHOXlkQ0JqYjI1emRDQmxiblZ0SUZKbFlXTjBhWFpsUm14aFozTWdlMXh1SUNCU1FWY2dQU0FuWDE5d1gzSmhkMTlmSnl4Y2JuMWNiaUpkTENKdVlXMWxjeUk2V3lKb1lYTlBkMjVRY205d1pYSjBlU0lzSW1selJYWmxiblJPWVcxbElpd2lZMjl0YldsMFFYUjBjbWxpZFhSbGN5SXNJbVZzWlcxbGJuUWlMQ0poZEhSeWN5SXNJbWx6U1c1cGRHbGhiQ0lzSW1GMGRISk9ZVzFsSWl3aWFHRnVaR3hsY2lJc0ltTmhjSFIxY21VaUxDSmhaR1JGZG1WdWRFeHBjM1JsYm1WeUlpd2ljMnhwWTJVaUxDSjBiMHh2ZDJWeVEyRnpaU0lzSW5ObGRFRjBkSEpwWW5WMFpTSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUVUZCVFN4SFFVRkhRU3hqUVVGakxGRkJRVkVzUTBGQmFVSTdRVUZEYUVRc1RVRkJUU3hIUVVGSFF5eFhRVUZYTEZGQlFWRXNRMEZCYzBJN1FVRkhiRVFzVFVGQlRTeFZRVUZWUXl4blFrRkJaMElzUTBGQlEwTXNUMEZCWjBJc1JVRkJSVU1zUzBGQmFVSXNSVUZCUlVNc1UwRkJhMElzUlVGQlJTeERRVUZETzBsQlEzcEdMRWRCUVVjc1EwRkJSU3hIUVVGTExFTkJRVU5ETEZGQlFWRXNTVUZCU1VZc1MwRkJTeXhEUVVNeFFpeEZRVUZGTEVWQlFVVktMR05CUVdNc1EwRkJRMGtzUzBGQlN5eEZRVUZGUlN4UlFVRlJMRWRCUTJoRExFVkJRVVVzUlVGQlJVd3NWMEZCVnl4RFFVRkRTeXhSUVVGUkxFdEJTSGREUkN4VFFVRnJRaXhGUVVjeFF5eERRVUZETzFGQlEzWkRMRWRCUVVzc1EwRkJaME5FTEZOQlFXVXNSMEZCWmtFc1MwRkJTeXhEUVVGRFJTeFJRVUZSTEVkQlFUTkRReXhQUVVGUExFZEJRWE5DU0N4VFFVRmxMRU5CUVRWRFJ5eFBRVUZQTEdGQlFYTkNTQ3hUUVVGbExFTkJRVzVEU1N4UFFVRlBMRVZCUVZCQkxFOUJRVTg3VVVGRmVFSk1MRTlCUVU4c1EwRkJRMDBzWjBKQlFXZENMRU5CUVVOSUxGRkJRVkVzUTBGQlEwa3NTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSVU1zVjBGQlZ5eEpRVUZKU2l4UFFVRlBMRVZCUVVWRExFOUJRVThzUTBGQlF5eERRVUZETzBsQlF6bEZMRU5CUVVNc1RVRkJWVVlzVVVGQlVTeEpRVUZKU0N4UFFVRlBMRWRCUlRWQ1FTeFBRVUZQTEVOQlFVTkhMRkZCUVZFc1NVRkJTVVlzUzBGQlN5eERRVUZEUlN4UlFVRlJMRWxCUld4RFNDeFBRVUZQTEVOQlFVTlRMRmxCUVZrc1EwRkJRMDRzVVVGQlVTeEZRVUZGUml4TFFVRkxMRU5CUVVORkxGRkJRVkVzUlVObWNrUXNRMFJuUWs4N1FVRkhVQ3hEUVVGREluMD0iLCJmdW5jdGlvbiBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVDb2xsZWN0aW9uKSB7XG4gICAgaWYgKHByaXZhdGVDb2xsZWN0aW9uLmhhcyhvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGluaXRpYWxpemUgdGhlIHNhbWUgcHJpdmF0ZSBlbGVtZW50cyB0d2ljZSBvbiBhbiBvYmplY3RcIik7XG59XG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG59XG5mdW5jdGlvbiBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBhY3Rpb24pIHtcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBcIiArIGFjdGlvbiArIFwiIHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcbiAgICB2YXIgcmVjZWl2ZXIsIGRlc2NyaXB0b3IsIGRlc2NyaXB0b3IgPSBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBcImdldFwiKTtcbiAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5jYWxsKHJlY2VpdmVyKSA6IGRlc2NyaXB0b3IudmFsdWU7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRJbml0KG9iaiwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVNYXApLCBwcml2YXRlTWFwLnNldChvYmosIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIFwic2V0XCIpO1xuICAgIHJldHVybiAhZnVuY3Rpb24gX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yLCB2YWx1ZSkge1xuICAgICAgICBpZiAoZGVzY3JpcHRvci5zZXQpIGRlc2NyaXB0b3Iuc2V0LmNhbGwocmVjZWl2ZXIsIHZhbHVlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWRlc2NyaXB0b3Iud3JpdGFibGUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHJlYWQgb25seSBwcml2YXRlIGZpZWxkXCIpO1xuICAgICAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfShyZWNlaXZlciwgZGVzY3JpcHRvciwgdmFsdWUpLCB2YWx1ZTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVNZXRob2RHZXQocmVjZWl2ZXIsIHByaXZhdGVTZXQsIGZuKSB7XG4gICAgaWYgKCFwcml2YXRlU2V0LmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIHJldHVybiBmbjtcbn1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgITEsIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gITAsIFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yICYmIChkZXNjcmlwdG9yLndyaXRhYmxlID0gITApLCBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxufVxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIHJldHVybiBwcm90b1Byb3BzICYmIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyksIHN0YXRpY1Byb3BzICYmIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyksIENvbnN0cnVjdG9yO1xufVxuaW1wb3J0IHsgY29tbWl0QXR0cmlidXRlcyBhcyBjb21taXRBdHRyaWJ1dGVzMSB9IGZyb20gXCIuL2NvbW1pdEF0dHJpYnV0ZXNcIjtcbnZhciBfZWwgPSBuZXcgV2Vha01hcCgpO1xuZXhwb3J0IHZhciBUZXh0Tm9kZSA9IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uIFRleHROb2RlKGNvbW1lbnROb2RlLCBpbml0aWFsVmFsdWUpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRleHROb2RlKSwgX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdCh0aGlzLCBfZWwsIHtcbiAgICAgICAgICAgIHdyaXRhYmxlOiAhMCxcbiAgICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGluaXRpYWxWYWx1ZSk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfZWwsIHRleHROb2RlKSwgY29tbWVudE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGV4dE5vZGUsIGNvbW1lbnROb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIF9jcmVhdGVDbGFzcyhUZXh0Tm9kZSwgW1xuICAgICAgICB7XG4gICAgICAgICAgICBrZXk6IFwiY29tbWl0VmFsdWVcIixcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21taXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfZWwpLm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSksIFRleHROb2RlO1xufSgpO1xudmFyIF9lbDEgPSBuZXcgV2Vha01hcCgpLCBfY29tbWl0QXR0cmlidXRlcyA9IG5ldyBXZWFrU2V0KCk7XG5leHBvcnQgdmFyIEF0dHJpYnV0ZWROb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZnVuY3Rpb24gQXR0cmlidXRlZE5vZGUoY29tbWVudE5vZGUsIGluaXRpYWxBdHRycykge1xuICAgICAgICB2YXIgb2JqLCBwcml2YXRlU2V0LCBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBdHRyaWJ1dGVkTm9kZSksIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQodGhpcywgX2VsMSwge1xuICAgICAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICAgICAgdmFsdWU6IHZvaWQgMFxuICAgICAgICB9KSwgb2JqID0gdGhpcywgKF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZVNldCA9IF9jb21taXRBdHRyaWJ1dGVzKSwgcHJpdmF0ZVNldC5hZGQob2JqKSksIF9jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfZWwxLCBjb21tZW50Tm9kZS5uZXh0U2libGluZyksIHdpbmRvdy5jdXN0b21FbGVtZW50cy5nZXQoX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9lbDEpLmxvY2FsTmFtZSkgPyBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2VsMSkuX19pbml0X3Rhc2tfXyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2NsYXNzUHJpdmF0ZU1ldGhvZEdldChfdGhpcywgX2NvbW1pdEF0dHJpYnV0ZXMsIGNvbW1pdEF0dHJpYnV0ZXMpLmNhbGwoX3RoaXMsIGluaXRpYWxBdHRycywgITApO1xuICAgICAgICB9IDogX2NsYXNzUHJpdmF0ZU1ldGhvZEdldCh0aGlzLCBfY29tbWl0QXR0cmlidXRlcywgY29tbWl0QXR0cmlidXRlcykuY2FsbCh0aGlzLCBpbml0aWFsQXR0cnMsICEwKTtcbiAgICB9XG4gICAgcmV0dXJuIF9jcmVhdGVDbGFzcyhBdHRyaWJ1dGVkTm9kZSwgW1xuICAgICAgICB7XG4gICAgICAgICAgICBrZXk6IFwiY29tbWl0VmFsdWVcIixcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21taXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX2NvbW1pdEF0dHJpYnV0ZXMsIGNvbW1pdEF0dHJpYnV0ZXMpLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSksIEF0dHJpYnV0ZWROb2RlO1xufSgpO1xuZnVuY3Rpb24gY29tbWl0QXR0cmlidXRlcyh2YWx1ZSkge1xuICAgIHZhciBpc0luaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB2b2lkIDAgIT09IGFyZ3VtZW50c1sxXSAmJiBhcmd1bWVudHNbMV07XG4gICAgY29tbWl0QXR0cmlidXRlczEoX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9lbDEpLCB2YWx1ZSwgaXNJbml0aWFsKTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDJWc1pXMWxiblJ6TDNKbFlXTjBhWFpsVG05a1pTNTBjeUpkTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnZXlCamIyMXRhWFJCZEhSeWFXSjFkR1Z6SUgwZ1puSnZiU0FuTGk5amIyMXRhWFJCZEhSeWFXSjFkR1Z6Snp0Y2JtbHRjRzl5ZENCMGVYQmxJSHNnUVhSMGNtbGlkWFJsY3lCOUlHWnliMjBnSnk0dUwzUjVjR1VuTzF4dVhHNWxlSEJ2Y25RZ2FXNTBaWEptWVdObElGSmxZV04wYVhabFRtOWtaU0I3WEc0Z0lHTnZiVzFwZEZaaGJIVmxPaUFvZG1Gc2RXVTZJR0Z1ZVNrZ1BUNGdkbTlwWkR0Y2JuMWNibHh1Wlhod2IzSjBJR05zWVhOeklGUmxlSFJPYjJSbElHbHRjR3hsYldWdWRITWdVbVZoWTNScGRtVk9iMlJsSUh0Y2JpQWdJMlZzT2lCVVpYaDBPMXh1SUNCamIyNXpkSEoxWTNSdmNpaGpiMjF0Wlc1MFRtOWtaVG9nUTI5dGJXVnVkQ3dnYVc1cGRHbGhiRlpoYkhWbE9pQnpkSEpwYm1jcElIdGNiaUFnSUNCamIyNXpkQ0IwWlhoMFRtOWtaU0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVlJsZUhST2IyUmxLR2x1YVhScFlXeFdZV3gxWlNrN1hHNGdJQ0FnZEdocGN5NGpaV3dnUFNCMFpYaDBUbTlrWlR0Y2JpQWdJQ0JqYjIxdFpXNTBUbTlrWlM1d1lYSmxiblJPYjJSbExtbHVjMlZ5ZEVKbFptOXlaU2gwWlhoMFRtOWtaU3dnWTI5dGJXVnVkRTV2WkdVcE8xeHVJQ0I5WEc1Y2JpQWdZMjl0YldsMFZtRnNkV1VvZG1Gc2RXVTZJSE4wY21sdVp5a2dlMXh1SUNBZ0lIUm9hWE11STJWc0xtNXZaR1ZXWVd4MVpTQTlJSFpoYkhWbE8xeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQmpiR0Z6Y3lCQmRIUnlhV0oxZEdWa1RtOWtaU0JwYlhCc1pXMWxiblJ6SUZKbFlXTjBhWFpsVG05a1pTQjdYRzRnSUNObGJEb2dSV3hsYldWdWREdGNiaUFnWTI5dWMzUnlkV04wYjNJb1kyOXRiV1Z1ZEU1dlpHVTZJRU52YlcxbGJuUXNJR2x1YVhScFlXeEJkSFJ5Y3pvZ1FYUjBjbWxpZFhSbGN5a2dlMXh1SUNBZ0lIUm9hWE11STJWc0lEMGdZMjl0YldWdWRFNXZaR1V1Ym1WNGRGTnBZbXhwYm1jZ1lYTWdSV3hsYldWdWREdGNiaUFnSUNCcFppQW9kMmx1Wkc5M0xtTjFjM1J2YlVWc1pXMWxiblJ6TG1kbGRDaDBhR2x6TGlObGJDNXNiMk5oYkU1aGJXVXBLU0I3WEc0Z0lDQWdJQ0F2THlCQWRITXRhV2R1YjNKbFhHNGdJQ0FnSUNCMGFHbHpMaU5sYkM1ZlgybHVhWFJmZEdGemExOWZJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxpTmpiMjF0YVhSQmRIUnlhV0oxZEdWektHbHVhWFJwWVd4QmRIUnljeXdnZEhKMVpTazdYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCMGFHbHpMaU5qYjIxdGFYUkJkSFJ5YVdKMWRHVnpLR2x1YVhScFlXeEJkSFJ5Y3l3Z2RISjFaU2s3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnWTI5dGJXbDBWbUZzZFdVb2RtRnNkV1U2SUVGMGRISnBZblYwWlhNcElIdGNiaUFnSUNCMGFHbHpMaU5qYjIxdGFYUkJkSFJ5YVdKMWRHVnpLSFpoYkhWbEtUdGNiaUFnZlZ4dVhHNGdJQ05qYjIxdGFYUkJkSFJ5YVdKMWRHVnpLSFpoYkhWbE9pQkJkSFJ5YVdKMWRHVnpMQ0JwYzBsdWFYUnBZV3dnUFNCbVlXeHpaU2tnZTF4dUlDQWdJR052YlcxcGRFRjBkSEpwWW5WMFpYTW9kR2hwY3k0alpXd3NJSFpoYkhWbExDQnBjMGx1YVhScFlXd3BPMXh1SUNCOVhHNTlYRzRpWFN3aWJtRnRaWE1pT2xzaVkyOXRiV2wwUVhSMGNtbGlkWFJsY3lJc0lsUmxlSFJPYjJSbElpd2lZMjl0YldWdWRFNXZaR1VpTENKcGJtbDBhV0ZzVm1Gc2RXVWlMQ0owWlhoMFRtOWtaU0lzSW1SdlkzVnRaVzUwSWl3aVkzSmxZWFJsVkdWNGRFNXZaR1VpTENKbGJDSXNJbkJoY21WdWRFNXZaR1VpTENKcGJuTmxjblJDWldadmNtVWlMQ0pqYjIxdGFYUldZV3gxWlNJc0luWmhiSFZsSWl3aWJtOWtaVlpoYkhWbElpd2lRWFIwY21saWRYUmxaRTV2WkdVaUxDSnBibWwwYVdGc1FYUjBjbk1pTENKdVpYaDBVMmxpYkdsdVp5SXNJbmRwYm1SdmR5SXNJbU4xYzNSdmJVVnNaVzFsYm5Seklpd2laMlYwSWl3aWJHOWpZV3hPWVcxbElpd2lYMTlwYm1sMFgzUmhjMnRmWHlJc0ltbHpTVzVwZEdsaGJDSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3pzN096czdPekpGT3pzN096dG5SVHM3TzI5RE96czdPenM3T3pzN096dDVUVHM3T3pzN08wRkJRVUVzVFVGQlRTeEhRVUZIUVN4blFrRkJaMElzU1VGQmFFSkJMR2xDUVVGblFpeFJRVUZSTEVOQlFXOUNPMGxCVVc1RUxFZEJRVWM3UVVGRVRDeE5RVUZOTEV0QlFVOURMRkZCUVZFc1IwRkJaQ3hSUVVGUk8yZENPMkZCUVVaQkxGRkJRVkVzUTBGRlVFTXNWMEZCYjBJc1JVRkJSVU1zV1VGQmIwSTdjMFZCUkhSRUxFZEJRVWM3TzIxQ1FVRklMRWxCUVVrc1EwRkJTaXhEUVVGVk8xVTdVVUZGVWl4SFFVRkxMRU5CUVVORExGRkJRVkVzUjBGQlIwTXNVVUZCVVN4RFFVRkRReXhqUVVGakxFTkJRVU5JTEZsQlFWazdiME5CUXk5RFNTeEhRVUZGTEVWQlFVZElMRkZCUVZFc1IwRkRia0pHTEZkQlFWY3NRMEZCUTAwc1ZVRkJWU3hEUVVGRFF5eFpRVUZaTEVOQlFVTk1MRkZCUVZFc1JVRkJSVVlzVjBGQlZ5eERPenM3TzFsQlJ6TkVVU3hIUVVGWExFVkJRVmhCTEVOQlFWYzdiVUpCUVZoQkxGRkJRVkVzUTBGQlVrRXNWMEZCVnl4RFFVRkRReXhMUVVGaExFVkJRVVVzUTBGQlF6dHpRMEZETVVJc1NVRkJTU3hGUVVGRlNpeEhRVUZGTEVWQlFVTkxMRk5CUVZNc1IwRkJSMFFzUzBGQlN5eERRVUZETzFsQlF6ZENMRU5CUVVNN096czdTVUZKUkN4SlFVRkhMR3RDUVdsQ1NDeHBRa0ZCYVVJN1FVRnNRbTVDTEUxQlFVMHNTMEZCVDBVc1kwRkJZeXhIUVVGd1FpeFJRVUZSTzJkQ08yRkJRVVpCTEdOQlFXTXNRMEZGWWxnc1YwRkJiMElzUlVGQlJWa3NXVUZCZDBJN096UkZRVVF4UkN4SlFVRkhPenR0UWtGQlNDeEpRVUZKTEVOQlFVb3NRMEZCWVR0elJVRnBRbUlzYVVKQlFXbENMSEZFUVdaVVVDeEpRVUZGTEVWQlFVZE1MRmRCUVZjc1EwRkJRMkVzVjBGQlZ5eEhRVU01UWtNc1RVRkJUU3hEUVVGRFF5eGpRVUZqTEVOQlFVTkRMRWRCUVVjc2RVSkJRVU1zU1VGQlNTeEZRVUZGV0N4SlFVRkZMRVZCUVVOWkxGTkJRVk1zTUVKQlJUbERMRWxCUVVrc1JVRkJSVm9zU1VGQlJTeEZRVUZEWVN4aFFVRmhMRWRCUVVjc1VVRkRMMElzUjBGRWNVTXNRMEZCUXpzd1EwRkRlRUp3UWl4cFFrRkJaMElzUlVGQmFFSkJMR2RDUVVGblFpeGpRVUZEWXl4WlFVRlpMRWRCUVVVc1EwRkJTU3hEUVVGRExFTkJRVU03VVVGRE4wTXNRMEZCUXl3d1FrRkZSQ3hKUVVGSkxFVkJRVVZrTEdsQ1FVRm5RaXhGUVVGb1FrRXNaMEpCUVdkQ0xFOUJRWFJDTEVsQlFVa3NSVUZCYlVKakxGbEJRVmtzUjBGQlJTeERRVUZKTEVNN096czdXVUZKTjBOS0xFZEJRVmNzUlVGQldFRXNRMEZCVnp0dFFrRkJXRUVzVVVGQlVTeERRVUZTUVN4WFFVRlhMRU5CUVVORExFdEJRV2xDTEVWQlFVVXNRMEZCUXp0MVEwRkRPVUlzU1VGQlNTeEZRVUZGV0N4cFFrRkJaMElzUlVGQmFFSkJMR2RDUVVGblFpeFBRVUYwUWl4SlFVRkpMRVZCUkUxWExFdEJRV2xDTEVOQlEwVXNRMEZCUXp0WlFVTm9ReXhEUVVGRE96czdPMU5CUlVRc1owSkJSVU1zUTBGR2FVSkJMRXRCUVdsQ0xFVkJRWEZDTEVOQlFVTTdVVUZCY0VKVkxGTkJRVk03U1VGRE5VTnlRaXhwUWtGQlowSXNkVUpCUVVNc1NVRkJTU3hGUVVGRlR5eEpRVUZGTEVkQlJGUkpMRXRCUVdsQ0xFVkJRVVZWTEZOQlFWTXNRMEZEUVN4RFFVRkRPMEZCUXk5RExFTkJRVU1pZlE9PSIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIGRlZmluZShJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgZGVmaW5lKEdwLCBcImNvbnN0cnVjdG9yXCIsIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgZGVmaW5lKEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIEdlbmVyYXRvckZ1bmN0aW9uKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBkZWZpbmUoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUsIGFzeW5jSXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgZGVmaW5lKEdwLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIGRlZmluZShHcCwgXCJ0b1N0cmluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgaW4gbW9kZXJuIGVuZ2luZXNcbiAgLy8gd2UgY2FuIGV4cGxpY2l0bHkgYWNjZXNzIGdsb2JhbFRoaXMuIEluIG9sZGVyIGVuZ2luZXMgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsVGhpcy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xuICB9IGVsc2Uge1xuICAgIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyksIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGluZm8uZG9uZSA/IHJlc29sdmUodmFsdWUpIDogUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xufVxuaW1wb3J0IHJlZ2VuZXJhdG9yUnVudGltZSBmcm9tIFwicmVnZW5lcmF0b3ItcnVudGltZVwiO1xudmFyIHF1ZXVlID0gW10sIGlzRmx1c2hpbmcgPSAhMSwgaXNGbHVzaGluZ1BlbmRpbmcgPSAhMSwgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCksIGN1cnJlbnRGbHVzaFByb21pc2UgPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgcmV0dXJuIF9uZXh0VGljay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuZnVuY3Rpb24gX25leHRUaWNrKCkge1xuICAgIHZhciBmbjE7XG4gICAgcmV0dXJuIChfbmV4dFRpY2sgPSAoZm4xID0gcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoZnVuY3Rpb24gX2NhbGxlZShmbikge1xuICAgICAgICB2YXIgcHJvbWlzZTtcbiAgICAgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jdHgpIHtcbiAgICAgICAgICAgIGZvcig7Oylzd2l0Y2goX2N0eC5wcmV2ID0gX2N0eC5uZXh0KXtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlID0gY3VycmVudEZsdXNoUHJvbWlzZSB8fCByZXNvbHZlZFByb21pc2UsIF9jdHguYWJydXB0KFwicmV0dXJuXCIsIGZuID8gcHJvbWlzZS50aGVuKHRoaXMgPyBmbi5iaW5kKHRoaXMpIDogZm4pIDogcHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jdHguc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlLCB0aGlzKTtcbiAgICB9KSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIGdlbiA9IGZuMS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICAgICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX25leHQodm9pZCAwKTtcbiAgICAgICAgfSk7XG4gICAgfSkpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZW5xdWV1ZUpvYihqb2IpIHtcbiAgICBxdWV1ZS5maW5kKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHJldHVybiBwYXJhbS51aWQgPT09IGpvYi51aWQ7XG4gICAgfSkgfHwgKHF1ZXVlLnB1c2goam9iKSwgcXVldWVGbHVzaCgpKTtcbn1cbmZ1bmN0aW9uIHF1ZXVlRmx1c2goKSB7XG4gICAgaXNGbHVzaGluZyB8fCBpc0ZsdXNoaW5nUGVuZGluZyB8fCAoaXNGbHVzaGluZ1BlbmRpbmcgPSAhMCwgY3VycmVudEZsdXNoUHJvbWlzZSA9IHJlc29sdmVkUHJvbWlzZS50aGVuKGZsdXNoSm9icykpO1xufVxuZnVuY3Rpb24gZmx1c2hKb2JzKCkge1xuICAgIGlzRmx1c2hpbmdQZW5kaW5nID0gITEsIGlzRmx1c2hpbmcgPSAhMDtcbiAgICB0cnkge1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9ICEwLCBfZGlkSXRlcmF0b3JFcnJvciA9ICExLCBfaXRlcmF0b3JFcnJvciA9IHZvaWQgMDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvcih2YXIgX3N0ZXAsIF9pdGVyYXRvciA9IHF1ZXVlW1N5bWJvbC5pdGVyYXRvcl0oKTsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAhMClfc3RlcC52YWx1ZS5ydW4oKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9ICEwLCBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5e1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uIHx8IG51bGwgPT0gX2l0ZXJhdG9yLnJldHVybiB8fCBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICB9IGZpbmFsbHl7XG4gICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZmluYWxseXtcbiAgICAgICAgaXNGbHVzaGluZyA9ICExLCBjdXJyZW50Rmx1c2hQcm9taXNlID0gbnVsbCwgcXVldWUgPSBbXTtcbiAgICB9XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWphSEpwYzJOcGJtUjVMME52WkdVdlIybDBhSFZpTDNCM1l5OXdZV05yWVdkbGN5OXdkMk12YzNKakwyVnNaVzFsYm5SekwzTm9aV1IxYkdWeUxuUnpJbDBzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JwYm5SbGNtWmhZMlVnVTJOb1pXUjFiR1Z5U205aUlIdGNiaUFnZFdsa09pQnVkVzFpWlhJN1hHNGdJSEoxYmpvZ0tDa2dQVDRnZG05cFpEdGNibjFjYmx4dWJHVjBJSEYxWlhWbE9pQlRZMmhsWkhWc1pYSktiMkpiWFNBOUlGdGRPMXh1YkdWMElHbHpSbXgxYzJocGJtY2dQU0JtWVd4elpUdGNibXhsZENCcGMwWnNkWE5vYVc1blVHVnVaR2x1WnlBOUlHWmhiSE5sTzF4dVkyOXVjM1FnY21WemIyeDJaV1JRY205dGFYTmxPaUJRY205dGFYTmxQR0Z1ZVQ0Z1BTQlFjbTl0YVhObExuSmxjMjlzZG1Vb0tUdGNibXhsZENCamRYSnlaVzUwUm14MWMyaFFjbTl0YVhObE9pQlFjbTl0YVhObFBIWnZhV1ErSUh3Z2JuVnNiQ0E5SUc1MWJHdzdYRzVjYm1WNGNHOXlkQ0JoYzNsdVl5Qm1kVzVqZEdsdmJpQnVaWGgwVkdsamF6d2dWQ0E5SUhadmFXUStLRnh1SUNCMGFHbHpPaUJVTEZ4dUlDQm1iajg2SUNoMGFHbHpPaUJVS1NBOVBpQjJiMmxrTEZ4dUtUb2dVSEp2YldselpUeDJiMmxrUGlCN1hHNGdJR052Ym5OMElIQnliMjFwYzJVZ1BTQmpkWEp5Wlc1MFJteDFjMmhRY205dGFYTmxJSHg4SUhKbGMyOXNkbVZrVUhKdmJXbHpaVHRjYmlBZ2NtVjBkWEp1SUdadUlEOGdjSEp2YldselpTNTBhR1Z1S0hSb2FYTWdQeUJtYmk1aWFXNWtLSFJvYVhNcElEb2dabTRwSURvZ2NISnZiV2x6WlR0Y2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1Z1Y1hWbGRXVktiMklvYW05aU9pQlRZMmhsWkhWc1pYSktiMklwSUh0Y2JpQWdMeThnUlc1emRYSmxJR0VnYVc1emRHRnVZMlVnYjI1c2VTQm9ZWE1nYjI1bElHcHZZbHh1SUNCcFppQW9JWEYxWlhWbExtWnBibVFvS0hzZ2RXbGtJSDBwSUQwK0lIdGNiaUFnSUNCeVpYUjFjbTRnZFdsa0lEMDlQU0JxYjJJdWRXbGtPMXh1SUNCOUtTa2dlMXh1SUNBZ0lIRjFaWFZsTG5CMWMyZ29hbTlpS1R0Y2JpQWdJQ0J4ZFdWMVpVWnNkWE5vS0NrN1hHNGdJSDFjYm4xY2JseHVablZ1WTNScGIyNGdjWFZsZFdWR2JIVnphQ2dwSUh0Y2JpQWdhV1lnS0NGcGMwWnNkWE5vYVc1bklDWW1JQ0ZwYzBac2RYTm9hVzVuVUdWdVpHbHVaeWtnZTF4dUlDQWdJR2x6Um14MWMyaHBibWRRWlc1a2FXNW5JRDBnZEhKMVpUdGNiaUFnSUNCamRYSnlaVzUwUm14MWMyaFFjbTl0YVhObElEMGdjbVZ6YjJ4MlpXUlFjbTl0YVhObExuUm9aVzRvWm14MWMyaEtiMkp6S1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm1iSFZ6YUVwdlluTW9LU0I3WEc0Z0lHbHpSbXgxYzJocGJtZFFaVzVrYVc1bklEMGdabUZzYzJVN1hHNGdJR2x6Um14MWMyaHBibWNnUFNCMGNuVmxPMXh1WEc0Z0lDOHZJRlJQUkU4Z2RYQmtZWFJsSUdOdmJYQnZibVZ1ZEhNZ1puSnZiU0J3WVhKbGJuUWdkRzhnWTJocGJHUmNibHh1SUNCMGNua2dlMXh1SUNBZ0lHWnZjaUFvWTI5dWMzUWdhbTlpSUc5bUlIRjFaWFZsS1NCN1hHNGdJQ0FnSUNCcWIySXVjblZ1S0NrN1hHNGdJQ0FnZlZ4dUlDQjlJR1pwYm1Gc2JIa2dlMXh1SUNBZ0lHbHpSbXgxYzJocGJtY2dQU0JtWVd4elpUdGNiaUFnSUNCamRYSnlaVzUwUm14MWMyaFFjbTl0YVhObElEMGdiblZzYkR0Y2JpQWdJQ0J4ZFdWMVpTQTlJRnRkTzF4dUlDQjlYRzU5WEc1Y2JseHVJbDBzSW01aGJXVnpJanBiSW5GMVpYVmxJaXdpYVhOR2JIVnphR2x1WnlJc0ltbHpSbXgxYzJocGJtZFFaVzVrYVc1bklpd2ljbVZ6YjJ4MlpXUlFjbTl0YVhObElpd2lVSEp2YldselpTSXNJbkpsYzI5c2RtVWlMQ0pqZFhKeVpXNTBSbXgxYzJoUWNtOXRhWE5sSWl3aWJtVjRkRlJwWTJzaUxDSm1iaUlzSW5CeWIyMXBjMlVpTENKMGFHVnVJaXdpWW1sdVpDSXNJbVZ1Y1hWbGRXVktiMklpTENKcWIySWlMQ0ptYVc1a0lpd2lkV2xrSWl3aWNIVnphQ0lzSW5GMVpYVmxSbXgxYzJnaUxDSm1iSFZ6YUVwdlluTWlMQ0p5ZFc0aVhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN2NVSTdPenN5UlRzN08wRkJTMEVzUjBGQlJ5eERRVUZEUVN4TFFVRkxMRWRCUVcxQ0xFTkJRVU1zUTBGQlF5eEZRVU14UWtNc1ZVRkJWU3hKUVVGSExFTkJRVXNzUlVGRGJFSkRMR2xDUVVGcFFpeEpRVUZITEVOQlFVc3NSVUZEZGtKRExHVkJRV1VzUjBGQmFVSkRMRTlCUVU4c1EwRkJRME1zVDBGQlR5eEpRVU5xUkVNc2JVSkJRVzFDTEVkQlFYbENMRWxCUVVrN1FVRkZjRVFzVFVGQlRTeFZRVUZuUWtNc1VVRkJVU3hEUVVVMVFrTXNSVUZCYzBJN1YwRkdSa1FzVTBGQlVUczdVMEZCVWtFc1UwRkJVVHM3V1VGQlVrRXNVMEZCVVN4clEwRkJka0lzVVVGQlVTeFRRVVZpUXl4RlFVRnpRaXhGUVVOUUxFTkJRVU03V1VGRFZrTXNUMEZCVHpzN096c3lRa0ZCVUVFc1QwRkJUeXhIUVVGSFNDeHRRa0ZCYlVJc1NVRkJTVWdzWlVGQlpTeDNRa0ZHZEVSTExFVkJRWE5DTEVkQlIxWkRMRTlCUVU4c1EwRkJRME1zU1VGQlNTeERRVUZETEVsQlFVa3NSMEZJTjBKR0xFVkJRWE5DTEVOQlIyRkhMRWxCUVVrc1EwRkJReXhKUVVGSkxFbEJTRFZEU0N4RlFVRnpRaXhKUVVkblEwTXNUMEZCVHpzN096czdPMGxCUXk5RUxFTkJRVU03T3pzN08zTkdPenM3Y1VZN08zbENPenM3TzBGQlJVUXNUVUZCVFN4VlFVRlZSeXhWUVVGVkxFTkJRVU5ETEVkQlFXbENMRVZCUVVVc1EwRkJRenRKUVVWNFEySXNTMEZCU3l4RFFVRkRZeXhKUVVGSkxFTkJRVU1zVVVGQlVTeFJRVUZMTEVOQlFVTTdVVUZETlVJc1RVRkJUU3hQUVVSWFF5eEhRVUZITEV0QlEweEdMRWRCUVVjc1EwRkJRMFVzUjBGQlJ6dEpRVU40UWl4RFFVRkRMRTFCUTBObUxFdEJRVXNzUTBGQlEyZENMRWxCUVVrc1EwRkJRMGdzUjBGQlJ5eEhRVU5rU1N4VlFVRlZMRWRCUmxZc1EwRkhSRHRCUVVOSUxFTkJRVU03VTBGRlVVRXNWVUZCVlN4SFFVRkhMRU5CUVVNN1NVRkRhRUpvUWl4VlFVRlZMRWxCUVV0RExHbENRVUZwUWl4TFFVTnVRMEVzYVVKQlFXbENMRWxCUVVjc1EwRkJTU3hGUVVONFFra3NiVUpCUVcxQ0xFZEJRVWRJTEdWQlFXVXNRMEZCUTA4c1NVRkJTU3hEUVVGRFVTeFRRVUZUTEVWQlJtcENMRU5CUjNCRE8wRkJRMGdzUTBGQlF6dFRRVVZSUVN4VFFVRlRMRWRCUVVjc1EwRkJRenRKUVVOd1FtaENMR2xDUVVGcFFpeEpRVUZITEVOQlFVc3NSVUZEZWtKRUxGVkJRVlVzU1VGQlJ5eERRVUZKTEVFN1NVRkpha0lzUjBGQlJ5eERRVUZETEVOQlFVTTdXVUZEUlN4NVFrRkJVeXhQUVVGVUxHbENRVUZUTEU5QlFWUXNZMEZCVXpzN1dVRkJaQ3hIUVVGSExFdEJRVVVzUzBGQlV5eEZRVUZVTEZOQlFWTXNSMEZCU1VRc1MwRkJTeXgxUWtGQmJFSXNlVUpCUVZNc1NVRkJWQ3hMUVVGVExFZEJRVlFzVTBGQlV5eG5Ra0ZCVkN4NVFrRkJVeXhOUVVGVUxFdEJRVk1zVDBGRFVtMUNMRWRCUVVjc1JVRkJSU3hEUVVGRE96dFpRVVJRTEdsQ1FVRlRMRTlCUVZRc1kwRkJVeXhOT3pzN1owSkJRVlFzZVVKQlFWTXNXVUZCVkN4VFFVRlRMRmRCUVZRc1UwRkJVeXhUT3p0dlFrRkJWQ3hwUWtGQlV5eFJRVUZVTEdOQlFWTTdPenRKUVVkb1FpeERRVUZETEZGQlFWTXNRMEZCUXp0UlFVTlViRUlzVlVGQlZTeEpRVUZITEVOQlFVc3NSVUZEYkVKTExHMUNRVUZ0UWl4SFFVRkhMRWxCUVVrc1JVRkRNVUpPTEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNc1FUdEpRVU5hTEVOQlFVTTdRVUZEU0N4RFFVRkRJbjA9IiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgICAobnVsbCA9PSBsZW4gfHwgbGVuID4gYXJyLmxlbmd0aCkgJiYgKGxlbiA9IGFyci5sZW5ndGgpO1xuICAgIGZvcih2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKWFycjJbaV0gPSBhcnJbaV07XG4gICAgcmV0dXJuIGFycjI7XG59XG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgICBpZiAodm9pZCAwID09PSBzZWxmKSB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gICAgcmV0dXJuIHNlbGY7XG59XG5mdW5jdGlvbiBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVDb2xsZWN0aW9uKSB7XG4gICAgaWYgKHByaXZhdGVDb2xsZWN0aW9uLmhhcyhvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGluaXRpYWxpemUgdGhlIHNhbWUgcHJpdmF0ZSBlbGVtZW50cyB0d2ljZSBvbiBhbiBvYmplY3RcIik7XG59XG5mdW5jdGlvbiBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBhY3Rpb24pIHtcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBcIiArIGFjdGlvbiArIFwiIHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcbiAgICB2YXIgcmVjZWl2ZXIsIGRlc2NyaXB0b3IsIGRlc2NyaXB0b3IgPSBfY2xhc3NFeHRyYWN0RmllbGREZXNjcmlwdG9yKHJlY2VpdmVyLCBwcml2YXRlTWFwLCBcImdldFwiKTtcbiAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5jYWxsKHJlY2VpdmVyKSA6IGRlc2NyaXB0b3IudmFsdWU7XG59XG5mdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRJbml0KG9iaiwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihvYmosIHByaXZhdGVNYXApLCBwcml2YXRlTWFwLnNldChvYmosIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IF9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IocmVjZWl2ZXIsIHByaXZhdGVNYXAsIFwic2V0XCIpO1xuICAgIHJldHVybiAhZnVuY3Rpb24gX2NsYXNzQXBwbHlEZXNjcmlwdG9yU2V0KHJlY2VpdmVyLCBkZXNjcmlwdG9yLCB2YWx1ZSkge1xuICAgICAgICBpZiAoZGVzY3JpcHRvci5zZXQpIGRlc2NyaXB0b3Iuc2V0LmNhbGwocmVjZWl2ZXIsIHZhbHVlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWRlc2NyaXB0b3Iud3JpdGFibGUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHJlYWQgb25seSBwcml2YXRlIGZpZWxkXCIpO1xuICAgICAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfShyZWNlaXZlciwgZGVzY3JpcHRvciwgdmFsdWUpLCB2YWx1ZTtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVNZXRob2RHZXQocmVjZWl2ZXIsIHByaXZhdGVTZXQsIGZuKSB7XG4gICAgaWYgKCFwcml2YXRlU2V0LmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgIHJldHVybiBmbjtcbn1cbmZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVNZXRob2RJbml0KG9iaiwgcHJpdmF0ZVNldCkge1xuICAgIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKG9iaiwgcHJpdmF0ZVNldCksIHByaXZhdGVTZXQuYWRkKG9iaik7XG59XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8ICExLCBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9ICEwLCBcInZhbHVlXCIgaW4gZGVzY3JpcHRvciAmJiAoZGVzY3JpcHRvci53cml0YWJsZSA9ICEwKSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gICAgfSwgX2dldFByb3RvdHlwZU9mKG8pO1xufVxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICByZXR1cm4gX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgICAgIHJldHVybiBvLl9fcHJvdG9fXyA9IHAsIG87XG4gICAgfSwgX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG4gICAgfSkoYXJyKSB8fCAoZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkge1xuICAgICAgICB2YXIgX3MsIF9lLCBfaSA9IG51bGwgPT0gYXJyID8gbnVsbCA6IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFN5bWJvbCAmJiBhcnJbU3ltYm9sLml0ZXJhdG9yXSB8fCBhcnJbXCJAQGl0ZXJhdG9yXCJdO1xuICAgICAgICBpZiAobnVsbCAhPSBfaSkge1xuICAgICAgICAgICAgdmFyIF9hcnIgPSBbXSwgX24gPSAhMCwgX2QgPSAhMTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKSAmJiAoX2Fyci5wdXNoKF9zLnZhbHVlKSwgIWkgfHwgX2Fyci5sZW5ndGggIT09IGkpOyBfbiA9ICEwKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIF9kID0gITAsIF9lID0gZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5e1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIF9uIHx8IG51bGwgPT0gX2kucmV0dXJuIHx8IF9pLnJldHVybigpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX2FycjtcbiAgICAgICAgfVxuICAgIH0pKGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgKGZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbiAgICB9KSgpO1xufVxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICAgIGlmIChvKSB7XG4gICAgICAgIGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBvKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgICAgICAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICAgICAgICBpZiAoXCJPYmplY3RcIiA9PT0gbiAmJiBvLmNvbnN0cnVjdG9yICYmIChuID0gby5jb25zdHJ1Y3Rvci5uYW1lKSwgXCJNYXBcIiA9PT0gbiB8fCBcIlNldFwiID09PSBuKSByZXR1cm4gQXJyYXkuZnJvbShuKTtcbiAgICAgICAgaWYgKFwiQXJndW1lbnRzXCIgPT09IG4gfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICAgIH1cbn1cbmltcG9ydCB7IFRFWFRfQ09NTUVOVF9EQVRBLCBQV0NfUFJFRklYLCBQTEFDRUhPTERFUl9DT01NRU5UX0RBVEEgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBSZWFjdGl2ZSB9IGZyb20gXCIuLi9yZWFjdGl2aXR5L3JlYWN0aXZlXCI7XG5pbXBvcnQgeyBBdHRyaWJ1dGVkTm9kZSwgVGV4dE5vZGUgfSBmcm9tIFwiLi9yZWFjdGl2ZU5vZGVcIjtcbmltcG9ydCB7IHNoYWxsb3dFcXVhbCwgZ2VuZXJhdGVVaWQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGVucXVldWVKb2IgfSBmcm9tIFwiLi9zaGVkdWxlclwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oRGVmaW5pdGlvbjEpIHtcbiAgICB2YXIgY3JlYXRlVGVtcGxhdGUsIGluaXRSZW5kZXJUZW1wbGF0ZSwgcGVyZm9ybVVwZGF0ZSwgX3VpZCwgX2luaXRpYWxpemVkLCBfZnJhZ21lbnQsIF9jdXJyZW50VGVtcGxhdGUsIF9yZWFjdGl2ZU5vZGVzLCBfcmVhY3RpdmUsIF9jcmVhdGVUZW1wbGF0ZSwgX2luaXRSZW5kZXJUZW1wbGF0ZSwgX3BlcmZvcm1VcGRhdGUsIF9jbGFzcztcbiAgICByZXR1cm4gY3JlYXRlVGVtcGxhdGUgPSBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZShzb3VyY2UpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGUuaW5uZXJIVE1MID0gc291cmNlLCB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSghMCk7XG4gICAgfSwgaW5pdFJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24gaW5pdFJlbmRlclRlbXBsYXRlKGZyYWdtZW50LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRDb21tZW50LCBub2RlSXRlcmF0b3IgPSBkb2N1bWVudC5jcmVhdGVOb2RlSXRlcmF0b3IoZnJhZ21lbnQsIE5vZGVGaWx0ZXIuU0hPV19DT01NRU5ULCB7XG4gICAgICAgICAgICBhY2NlcHROb2RlOiBmdW5jdGlvbiBhY2NlcHROb2RlKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVmO1xuICAgICAgICAgICAgICAgIHJldHVybiAobnVsbCA9PT0gKHJlZiA9IG5vZGUuZGF0YSkgfHwgdm9pZCAwID09PSByZWYgPyB2b2lkIDAgOiByZWYuaW5jbHVkZXMoUFdDX1BSRUZJWCkpID8gTm9kZUZpbHRlci5GSUxURVJfQUNDRVBUIDogTm9kZUZpbHRlci5GSUxURVJfUkVKRUNUO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgaW5kZXggPSAwO1xuICAgICAgICBmb3IoX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9yZWFjdGl2ZU5vZGVzLCBbXSk7IGN1cnJlbnRDb21tZW50ID0gbm9kZUl0ZXJhdG9yLm5leHROb2RlKCk7KXtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWVudC5kYXRhID09PSBURVhUX0NPTU1FTlRfREFUQSkge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0RWxlbWVudCA9IG5ldyBUZXh0Tm9kZShjdXJyZW50Q29tbWVudCwgdmFsdWVzW2luZGV4XSk7XG4gICAgICAgICAgICAgICAgX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9yZWFjdGl2ZU5vZGVzKS5wdXNoKHRleHRFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudENvbW1lbnQuZGF0YSA9PT0gUExBQ0VIT0xERVJfQ09NTUVOVF9EQVRBKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZWRFbGVtZW50ID0gbmV3IEF0dHJpYnV0ZWROb2RlKGN1cnJlbnRDb21tZW50LCB2YWx1ZXNbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX3JlYWN0aXZlTm9kZXMpLnB1c2goYXR0cmlidXRlZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuICAgIH0sIHBlcmZvcm1VcGRhdGUgPSBmdW5jdGlvbiBwZXJmb3JtVXBkYXRlKCkge1xuICAgICAgICB2YXIgcmVmID0gX3NsaWNlZFRvQXJyYXkoX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9jdXJyZW50VGVtcGxhdGUpLCAyKSwgb2xkU3RyaW5ncyA9IHJlZlswXSwgb2xkVmFsdWVzID0gcmVmWzFdLCBfdGVtcGxhdGUgPSBfc2xpY2VkVG9BcnJheSh0aGlzLnRlbXBsYXRlLCAyKSwgc3RyaW5ncyA9IF90ZW1wbGF0ZVswXSwgdmFsdWVzID0gX3RlbXBsYXRlWzFdO1xuICAgICAgICBpZiAob2xkU3RyaW5ncyA9PT0gc3RyaW5ncykgZm9yKHZhciBpbmRleCA9IDA7IGluZGV4IDwgb2xkVmFsdWVzLmxlbmd0aDsgaW5kZXgrKylzaGFsbG93RXF1YWwob2xkVmFsdWVzW2luZGV4XSwgdmFsdWVzW2luZGV4XSkgfHwgX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9yZWFjdGl2ZU5vZGVzKVtpbmRleF0uY29tbWl0VmFsdWUodmFsdWVzW2luZGV4XSk7XG4gICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfY3VycmVudFRlbXBsYXRlLCB0aGlzLnRlbXBsYXRlKTtcbiAgICB9LCBfdWlkID0gbmV3IFdlYWtNYXAoKSwgX2luaXRpYWxpemVkID0gbmV3IFdlYWtNYXAoKSwgX2ZyYWdtZW50ID0gbmV3IFdlYWtNYXAoKSwgX2N1cnJlbnRUZW1wbGF0ZSA9IG5ldyBXZWFrTWFwKCksIF9yZWFjdGl2ZU5vZGVzID0gbmV3IFdlYWtNYXAoKSwgX3JlYWN0aXZlID0gbmV3IFdlYWtNYXAoKSwgX2NyZWF0ZVRlbXBsYXRlID0gbmV3IFdlYWtTZXQoKSwgX2luaXRSZW5kZXJUZW1wbGF0ZSA9IG5ldyBXZWFrU2V0KCksIF9wZXJmb3JtVXBkYXRlID0gbmV3IFdlYWtTZXQoKSwgX2NsYXNzID0gKGZ1bmN0aW9uKERlZmluaXRpb24pIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgICFmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgICAgICAgICAgIGlmIChcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIHN1cGVyQ2xhc3MgJiYgbnVsbCAhPT0gc3VwZXJDbGFzcykgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogITBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgc3VwZXJDbGFzcyAmJiBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xuICAgICAgICB9KF9jbGFzcywgRGVmaW5pdGlvbik7XG4gICAgICAgIHZhciBEZXJpdmVkLCBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0LCBDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMsIF9zdXBlciA9IChEZXJpdmVkID0gX2NsYXNzLCBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHtcbiAgICAgICAgICAgIGlmIChcInVuZGVmaW5lZFwiID09IHR5cGVvZiBSZWZsZWN0IHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuICExO1xuICAgICAgICAgICAgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiAhMTtcbiAgICAgICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFByb3h5KSByZXR1cm4gITA7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uKCkge30pKSwgITA7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KCksIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkge1xuICAgICAgICAgICAgdmFyIG9iaiwgc2VsZiwgY2FsbCwgcmVzdWx0LCBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKTtcbiAgICAgICAgICAgIGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpO1xuICAgICAgICAgICAgfSBlbHNlIHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZiA9IHRoaXMsIChjYWxsID0gcmVzdWx0KSAmJiAoXCJvYmplY3RcIiA9PSAoKG9iaiA9IGNhbGwpICYmIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIFN5bWJvbCAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqKSB8fCBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGNhbGwpID8gY2FsbCA6IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBfY2xhc3MoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXM7XG4gICAgICAgICAgICByZXR1cm4gKGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIH0pKHRoaXMsIF9jbGFzcyksIF90aGlzID0gX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIF9jbGFzc1ByaXZhdGVGaWVsZEluaXQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIF91aWQsIHtcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGdlbmVyYXRlVWlkKClcbiAgICAgICAgICAgIH0pLCBfY2xhc3NQcml2YXRlRmllbGRJbml0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBfaW5pdGlhbGl6ZWQsIHtcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICExXG4gICAgICAgICAgICB9KSwgX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgX2ZyYWdtZW50LCB7XG4gICAgICAgICAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgICAgIH0pLCBfY2xhc3NQcml2YXRlRmllbGRJbml0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBfY3VycmVudFRlbXBsYXRlLCB7XG4gICAgICAgICAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgICAgIH0pLCBfY2xhc3NQcml2YXRlRmllbGRJbml0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBfcmVhY3RpdmVOb2Rlcywge1xuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdm9pZCAwXG4gICAgICAgICAgICB9KSwgX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgX3JlYWN0aXZlLCB7XG4gICAgICAgICAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXcgUmVhY3RpdmUoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpXG4gICAgICAgICAgICB9KSwgX2NsYXNzUHJpdmF0ZU1ldGhvZEluaXQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIF9jcmVhdGVUZW1wbGF0ZSksIF9jbGFzc1ByaXZhdGVNZXRob2RJbml0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBfaW5pdFJlbmRlclRlbXBsYXRlKSwgX2NsYXNzUHJpdmF0ZU1ldGhvZEluaXQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIF9wZXJmb3JtVXBkYXRlKSwgX3RoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yID0gX2NsYXNzLCBwcm90b1Byb3BzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJjb25uZWN0ZWRDYWxsYmFja1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2luaXRpYWxpemVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRfdGFza19fICYmIHRoaXMuX19pbml0X3Rhc2tfXygpLCBfY2xhc3NQcml2YXRlRmllbGRTZXQodGhpcywgX2N1cnJlbnRUZW1wbGF0ZSwgdGhpcy50ZW1wbGF0ZSB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVmID0gX3NsaWNlZFRvQXJyYXkoX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHRoaXMsIF9jdXJyZW50VGVtcGxhdGUpLCAyKSwgdGVtcGxhdGUgPSByZWZbMF0sIHRtcCA9IHJlZlsxXSwgdmFsdWVzID0gdm9pZCAwID09PSB0bXAgPyBbXSA6IHRtcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZFNldCh0aGlzLCBfZnJhZ21lbnQsIF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX2NyZWF0ZVRlbXBsYXRlLCBjcmVhdGVUZW1wbGF0ZSkuY2FsbCh0aGlzLCB0ZW1wbGF0ZSkpLCBfY2xhc3NQcml2YXRlTWV0aG9kR2V0KHRoaXMsIF9pbml0UmVuZGVyVGVtcGxhdGUsIGluaXRSZW5kZXJUZW1wbGF0ZSkuY2FsbCh0aGlzLCBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2ZyYWdtZW50KSwgdmFsdWVzKSwgdGhpcy5hcHBlbmRDaGlsZChfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX2ZyYWdtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHRoaXMsIF9pbml0aWFsaXplZCwgITApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKSB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiYWRvcHRlZENhbGxiYWNrXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkb3B0ZWRDYWxsYmFjaygpIHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogXCJyZXF1ZXN0VXBkYXRlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RVcGRhdGUoKSB7XG4gICAgICAgICAgICAgICAgICAgIGVucXVldWVKb2Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX3VpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBydW46IF9jbGFzc1ByaXZhdGVNZXRob2RHZXQodGhpcywgX3BlcmZvcm1VcGRhdGUsIHBlcmZvcm1VcGRhdGUpLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwiZ2V0UmVhY3RpdmVWYWx1ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSZWFjdGl2ZVZhbHVlKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jbGFzc1ByaXZhdGVGaWVsZEdldCh0aGlzLCBfcmVhY3RpdmUpLmdldFJlYWN0aXZlVmFsdWUocHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IFwic2V0UmVhY3RpdmVWYWx1ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRSZWFjdGl2ZVZhbHVlKHByb3AsIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBfY2xhc3NQcml2YXRlRmllbGRHZXQodGhpcywgX3JlYWN0aXZlKS5zZXRSZWFjdGl2ZVZhbHVlKHByb3AsIHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdLCBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpLCBzdGF0aWNQcm9wcyAmJiBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpLCBfY2xhc3M7XG4gICAgfSkoRGVmaW5pdGlvbjEpO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDJWc1pXMWxiblJ6TDNKbFlXTjBhWFpsUld4bGJXVnVkRVpoWTNSdmNua3VkSE1pTENJdlZYTmxjbk12WTJoeWFYTmphVzVrZVM5RGIyUmxMMGRwZEdoMVlpOXdkMk12Y0dGamEyRm5aWE12Y0hkakwzTnlZeTlqYjI1emRHRnVkSE11ZEhNaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIUjVjR1VnZXlCRmJHVnRaVzUwVkdWdGNHeGhkR1VzSUZCWFEwVnNaVzFsYm5RZ2ZTQm1jbTl0SUNjdUxpOTBlWEJsSnp0Y2JtbHRjRzl5ZENCN0lGUkZXRlJmUTA5TlRVVk9WRjlFUVZSQkxDQlFWME5mVUZKRlJrbFlMQ0JRVEVGRFJVaFBURVJGVWw5RFQwMU5SVTVVWDBSQlZFRWdmU0JtY205dElDY3VMaTlqYjI1emRHRnVkSE1uTzF4dWFXMXdiM0owSUhzZ1VtVmhZM1JwZG1VZ2ZTQm1jbTl0SUNjdUxpOXlaV0ZqZEdsMmFYUjVMM0psWVdOMGFYWmxKenRjYm1sdGNHOXlkQ0IwZVhCbElIc2dVbVZoWTNScGRtVk9iMlJsSUgwZ1puSnZiU0FuTGk5eVpXRmpkR2wyWlU1dlpHVW5PMXh1YVcxd2IzSjBJSHNnUVhSMGNtbGlkWFJsWkU1dlpHVXNJRlJsZUhST2IyUmxJSDBnWm5KdmJTQW5MaTl5WldGamRHbDJaVTV2WkdVbk8xeHVhVzF3YjNKMElIc2djMmhoYkd4dmQwVnhkV0ZzTENCblpXNWxjbUYwWlZWcFpDQjlJR1p5YjIwZ0p5NHVMM1YwYVd4ekp6dGNibWx0Y0c5eWRDQjdJR1Z1Y1hWbGRXVktiMklnZlNCbWNtOXRJQ2N1TDNOb1pXUjFiR1Z5Snp0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ0tFUmxabWx1YVhScGIyNHBJRDArSUh0Y2JpQWdjbVYwZFhKdUlHTnNZWE56SUdWNGRHVnVaSE1nUkdWbWFXNXBkR2x2YmlCcGJYQnNaVzFsYm5SeklGQlhRMFZzWlcxbGJuUWdlMXh1SUNBZ0lDTjFhV1E2SUc1MWJXSmxjaUE5SUdkbGJtVnlZWFJsVldsa0tDazdYRzRnSUNBZ0x5OGdRMjl0Y0c5dVpXNTBJR2x1YVhScFlXd2djM1JoZEdWY2JpQWdJQ0FqYVc1cGRHbGhiR2w2WldRZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0F2THlCVWFHVWdjbTl2ZENCbWNtRm5iV1Z1ZEZ4dUlDQWdJQ05tY21GbmJXVnVkRG9nVG05a1pUdGNiaUFnSUNBdkx5QlVaVzF3YkdGMFpTQnBibVp2WEc0Z0lDQWdJMk4xY25KbGJuUlVaVzF3YkdGMFpUb2dSV3hsYldWdWRGUmxiWEJzWVhSbE8xeHVJQ0FnSUM4dklGSmxZV04wYVhabElHNXZaR1Z6WEc0Z0lDQWdJM0psWVdOMGFYWmxUbTlrWlhNNklGSmxZV04wYVhabFRtOWtaVnRkTzF4dUlDQWdJQzh2SUZKbFlXTjBhWFpsSUdsdWMzUmhibU5sWEc0Z0lDQWdJM0psWVdOMGFYWmxPaUJTWldGamRHbDJaU0E5SUc1bGR5QlNaV0ZqZEdsMlpTaDBhR2x6S1R0Y2JseHVJQ0FnSUM4dklFTjFjM1J2YlNCbGJHVnRaVzUwSUc1aGRHbDJaU0JzYVdabFkzbGpiR1ZjYmlBZ0lDQmpiMjV1WldOMFpXUkRZV3hzWW1GamF5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTRqYVc1cGRHbGhiR2w2WldRcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYMTlwYm1sMFgzUmhjMnRmWHlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgxOXBibWwwWDNSaGMydGZYeWdwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIUm9hWE11STJOMWNuSmxiblJVWlcxd2JHRjBaU0E5SUhSb2FYTXVkR1Z0Y0d4aGRHVWdmSHdnVzEwN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUZ0MFpXMXdiR0YwWlN3Z2RtRnNkV1Z6SUQwZ1cxMWRJRDBnZEdocGN5NGpZM1Z5Y21WdWRGUmxiWEJzWVhSbE8xeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdUkyWnlZV2R0Wlc1MElEMGdkR2hwY3k0alkzSmxZWFJsVkdWdGNHeGhkR1VvZEdWdGNHeGhkR1VwTzF4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11STJsdWFYUlNaVzVrWlhKVVpXMXdiR0YwWlNoMGFHbHpMaU5tY21GbmJXVnVkQ3dnZG1Gc2RXVnpLVHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWhjSEJsYm1SRGFHbHNaQ2gwYUdsekxpTm1jbUZuYldWdWRDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR2x6TGlOcGJtbDBhV0ZzYVhwbFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dUlDQWdJR1JwYzJOdmJtNWxZM1JsWkVOaGJHeGlZV05yS0NrZ2UzMWNiaUFnSUNCaGRIUnlhV0oxZEdWRGFHRnVaMlZrUTJGc2JHSmhZMnNvS1NCN2ZWeHVJQ0FnSUdGa2IzQjBaV1JEWVd4c1ltRmpheWdwSUh0OVhHNWNiaUFnSUNBdkx5QkZlSFJsYm5OcGIyNGdiV1YwYUc5a2MxeHVJQ0FnSUNOamNtVmhkR1ZVWlcxd2JHRjBaU2h6YjNWeVkyVTZJSE4wY21sdVp5azZJRTV2WkdVZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnZEdWdGNHeGhkR1VnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2QwWlcxd2JHRjBaU2NwTzF4dVhHNGdJQ0FnSUNBdkx5QlVUMFJQT2lCNGMzTmNiaUFnSUNBZ0lIUmxiWEJzWVhSbExtbHVibVZ5U0ZSTlRDQTlJSE52ZFhKalpUdGNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUmxiWEJzWVhSbExtTnZiblJsYm5RdVkyeHZibVZPYjJSbEtIUnlkV1VwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQ05wYm1sMFVtVnVaR1Z5VkdWdGNHeGhkR1VvWm5KaFoyMWxiblE2SUU1dlpHVXNJSFpoYkhWbGN5a2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2JtOWtaVWwwWlhKaGRHOXlJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxUbTlrWlVsMFpYSmhkRzl5S0daeVlXZHRaVzUwTENCT2IyUmxSbWxzZEdWeUxsTklUMWRmUTA5TlRVVk9WQ3dnZTF4dUlDQWdJQ0FnSUNCaFkyTmxjSFJPYjJSbEtHNXZaR1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvS0c1dlpHVWdZWE1nUTI5dGJXVnVkQ2t1WkdGMFlUOHVhVzVqYkhWa1pYTW9VRmREWDFCU1JVWkpXQ2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQk9iMlJsUm1sc2RHVnlMa1pKVEZSRlVsOUJRME5GVUZRN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJPYjJSbFJtbHNkR1Z5TGtaSlRGUkZVbDlTUlVwRlExUTdYRzRnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUd4bGRDQmpkWEp5Wlc1MFEyOXRiV1Z1ZERvZ1RtOWtaVHRjYmlBZ0lDQWdJR3hsZENCcGJtUmxlQ0E5SURBN1hHNGdJQ0FnSUNCMGFHbHpMaU55WldGamRHbDJaVTV2WkdWeklEMGdXMTA3WEc1Y2JpQWdJQ0FnSUhkb2FXeGxJQ2dvWTNWeWNtVnVkRU52YlcxbGJuUWdQU0J1YjJSbFNYUmxjbUYwYjNJdWJtVjRkRTV2WkdVb0tTa3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1NXNXpaWEowSUdSNWJtRnRhV01nZEdWNGRDQnViMlJsWEc0Z0lDQWdJQ0FnSUdsbUlDZ29ZM1Z5Y21WdWRFTnZiVzFsYm5RZ1lYTWdRMjl0YldWdWRDa3VaR0YwWVNBOVBUMGdWRVZZVkY5RFQwMU5SVTVVWDBSQlZFRXBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0IwWlhoMFJXeGxiV1Z1ZENBOUlHNWxkeUJVWlhoMFRtOWtaU2hqZFhKeVpXNTBRMjl0YldWdWRDQmhjeUJEYjIxdFpXNTBMQ0IyWVd4MVpYTmJhVzVrWlhoZEtUdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxpTnlaV0ZqZEdsMlpVNXZaR1Z6TG5CMWMyZ29kR1Y0ZEVWc1pXMWxiblFwTzF4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tDaGpkWEp5Wlc1MFEyOXRiV1Z1ZENCaGN5QkRiMjF0Wlc1MEtTNWtZWFJoSUQwOVBTQlFURUZEUlVoUFRFUkZVbDlEVDAxTlJVNVVYMFJCVkVFcElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQmhkSFJ5YVdKMWRHVmtSV3hsYldWdWRDQTlJRzVsZHlCQmRIUnlhV0oxZEdWa1RtOWtaU2hqZFhKeVpXNTBRMjl0YldWdWRDQmhjeUJEYjIxdFpXNTBMQ0IyWVd4MVpYTmJhVzVrWlhoZEtUdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxpTnlaV0ZqZEdsMlpVNXZaR1Z6TG5CMWMyZ29ZWFIwY21saWRYUmxaRVZzWlcxbGJuUXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXNWtaWGdyS3p0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0FqY0dWeVptOXliVlZ3WkdGMFpTZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElGdHZiR1JUZEhKcGJtZHpMQ0J2YkdSV1lXeDFaWE5kSUQwZ2RHaHBjeTRqWTNWeWNtVnVkRlJsYlhCc1lYUmxPMXh1SUNBZ0lDQWdZMjl1YzNRZ1czTjBjbWx1WjNNc0lIWmhiSFZsYzEwZ1BTQjBhR2x6TG5SbGJYQnNZWFJsTzF4dVhHNGdJQ0FnSUNBdkx5QlhhR2xzWlNCMFpXMXdiR0YwWlNCemRISnBibWR6SUdseklHTnZibk4wWVc1MElIZHBkR2dnY0hKbGRpQnZibVZ6TEZ4dUlDQWdJQ0FnTHk4Z2FYUWdjMmh2ZFd4a0lHcDFjM1FnZFhCa1lYUmxJRzV2WkdVZ2RtRnNkV1Z6SUdGdVpDQmhkSFJ5YVdKMWRHVnpYRzRnSUNBZ0lDQnBaaUFvYjJ4a1UzUnlhVzVuY3lBOVBUMGdjM1J5YVc1bmN5a2dlMXh1SUNBZ0lDQWdJQ0JtYjNJZ0tHeGxkQ0JwYm1SbGVDQTlJREE3SUdsdVpHVjRJRHdnYjJ4a1ZtRnNkV1Z6TG14bGJtZDBhRHNnYVc1a1pYZ3JLeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2doYzJoaGJHeHZkMFZ4ZFdGc0tHOXNaRlpoYkhWbGMxdHBibVJsZUYwc0lIWmhiSFZsYzF0cGJtUmxlRjBwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxpTnlaV0ZqZEdsMlpVNXZaR1Z6VzJsdVpHVjRYUzVqYjIxdGFYUldZV3gxWlNoMllXeDFaWE5iYVc1a1pYaGRLVHRjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lIUm9hWE11STJOMWNuSmxiblJVWlcxd2JHRjBaU0E5SUhSb2FYTXVkR1Z0Y0d4aGRHVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVnhkV1Z6ZEZWd1pHRjBaU2dwT2lCMmIybGtJSHRjYmlBZ0lDQWdJR1Z1Y1hWbGRXVktiMklvZTF4dUlDQWdJQ0FnSUNCMWFXUTZJSFJvYVhNdUkzVnBaQ3hjYmlBZ0lDQWdJQ0FnY25WdU9pQjBhR2x6TGlOd1pYSm1iM0p0VlhCa1lYUmxMbUpwYm1Rb2RHaHBjeWtzWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSU1pXRmpkR2wyWlZaaGJIVmxLSEJ5YjNBNklITjBjbWx1WnlrNklIVnVhMjV2ZDI0Z2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVJM0psWVdOMGFYWmxMbWRsZEZKbFlXTjBhWFpsVm1Gc2RXVW9jSEp2Y0NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFVtVmhZM1JwZG1WV1lXeDFaU2h3Y205d09pQnpkSEpwYm1jc0lIWmhiRG9nZFc1cmJtOTNiaWtnZTF4dUlDQWdJQ0FnZEdocGN5NGpjbVZoWTNScGRtVXVjMlYwVW1WaFkzUnBkbVZXWVd4MVpTaHdjbTl3TENCMllXd3BPMXh1SUNBZ0lIMWNiaUFnZlR0Y2JuMDdYRzRpTENKbGVIQnZjblFnWTI5dWMzUWdVRmREWDFCU1JVWkpXQ0E5SUNjL2NIZGpKenRjYm1WNGNHOXlkQ0JqYjI1emRDQlVSVmhVWDBOUFRVMUZUbFJmUkVGVVFTQTlJQ2MvY0hkalgzUW5PMXh1Wlhod2IzSjBJR052Ym5OMElGQk1RVU5GU0U5TVJFVlNYME5QVFUxRlRsUmZSRUZVUVNBOUlDYy9jSGRqWDNBbk8xeHVaWGh3YjNKMElHTnZibk4wSUdWdWRXMGdVbVZoWTNScGRtVkdiR0ZuY3lCN1hHNGdJRkpCVnlBOUlDZGZYM0JmY21GM1gxOG5MRnh1ZlZ4dUlsMHNJbTVoYldWeklqcGJJbFJGV0ZSZlEwOU5UVVZPVkY5RVFWUkJJaXdpVUZkRFgxQlNSVVpKV0NJc0lsQk1RVU5GU0U5TVJFVlNYME5QVFUxRlRsUmZSRUZVUVNJc0lsSmxZV04wYVhabElpd2lRWFIwY21saWRYUmxaRTV2WkdVaUxDSlVaWGgwVG05a1pTSXNJbk5vWVd4c2IzZEZjWFZoYkNJc0ltZGxibVZ5WVhSbFZXbGtJaXdpWlc1eGRXVjFaVXB2WWlJc0lrUmxabWx1YVhScGIyNGlMQ0p6YjNWeVkyVWlMQ0owWlcxd2JHRjBaU0lzSW1SdlkzVnRaVzUwSWl3aVkzSmxZWFJsUld4bGJXVnVkQ0lzSW1sdWJtVnlTRlJOVENJc0ltTnZiblJsYm5RaUxDSmpiRzl1WlU1dlpHVWlMQ0ptY21GbmJXVnVkQ0lzSW5aaGJIVmxjeUlzSW1OMWNuSmxiblJEYjIxdFpXNTBJaXdpYm05a1pVbDBaWEpoZEc5eUlpd2lZM0psWVhSbFRtOWtaVWwwWlhKaGRHOXlJaXdpVG05a1pVWnBiSFJsY2lJc0lsTklUMWRmUTA5TlRVVk9WQ0lzSW1GalkyVndkRTV2WkdVaUxDSnViMlJsSWl3aVpHRjBZU0lzSW1sdVkyeDFaR1Z6SWl3aVJrbE1WRVZTWDBGRFEwVlFWQ0lzSWtaSlRGUkZVbDlTUlVwRlExUWlMQ0pwYm1SbGVDSXNJbkpsWVdOMGFYWmxUbTlrWlhNaUxDSnVaWGgwVG05a1pTSXNJblJsZUhSRmJHVnRaVzUwSWl3aWNIVnphQ0lzSW1GMGRISnBZblYwWldSRmJHVnRaVzUwSWl3aVkzVnljbVZ1ZEZSbGJYQnNZWFJsSWl3aWIyeGtVM1J5YVc1bmN5SXNJbTlzWkZaaGJIVmxjeUlzSW5OMGNtbHVaM01pTENKc1pXNW5kR2dpTENKamIyMXRhWFJXWVd4MVpTSXNJbU52Ym01bFkzUmxaRU5oYkd4aVlXTnJJaXdpYVc1cGRHbGhiR2w2WldRaUxDSmZYMmx1YVhSZmRHRnphMTlmSWl3aVkzSmxZWFJsVkdWdGNHeGhkR1VpTENKcGJtbDBVbVZ1WkdWeVZHVnRjR3hoZEdVaUxDSmhjSEJsYm1SRGFHbHNaQ0lzSW1ScGMyTnZibTVsWTNSbFpFTmhiR3hpWVdOcklpd2lZWFIwY21saWRYUmxRMmhoYm1kbFpFTmhiR3hpWVdOcklpd2lZV1J2Y0hSbFpFTmhiR3hpWVdOcklpd2ljbVZ4ZFdWemRGVndaR0YwWlNJc0luVnBaQ0lzSW5KMWJpSXNJbkJsY21admNtMVZjR1JoZEdVaUxDSmlhVzVrSWl3aVoyVjBVbVZoWTNScGRtVldZV3gxWlNJc0luQnliM0FpTENKeVpXRmpkR2wyWlNJc0luTmxkRkpsWVdOMGFYWmxWbUZzZFdVaUxDSjJZV3dpWFN3aWJXRndjR2x1WjNNaU9pSTdNa1E3ZFVVN096czdPenM3T3pzN096czdPenM3T3pzN01rVTdPenM3TzJkRk96czdiME03T3pzN096czdPenR2UlRzN096czdlVTA3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN08ybERPenM3TUVRN096czdPenM3T3pzN096czdPenM3T3pzN1FVRkRRU3hOUVVGTkxFZEJRVWRCTEdsQ1FVRnBRaXhGUVVGRlF5eFZRVUZWTEVWQlFVVkRMSGRDUVVGM1FpeFJRVUZSTEVOQlFXTTdRVUZEZEVZc1RVRkJUU3hIUVVGSFF5eFJRVUZSTEZGQlFWRXNRMEZCZDBJN1FVRkZha1FzVFVGQlRTeEhRVUZIUXl4alFVRmpMRVZCUVVWRExGRkJRVkVzVVVGQlVTeERRVUZuUWp0QlFVTjZSQ3hOUVVGTkxFZEJRVWRETEZsQlFWa3NSVUZCUlVNc1YwRkJWeXhSUVVGUkxFTkJRVlU3UVVGRGNFUXNUVUZCVFN4SFFVRkhReXhWUVVGVkxGRkJRVkVzUTBGQldUdEJRVVYyUXl4TlFVRk5MRk5CUVZNc1VVRkJVU3hEUVVGUVF5eFhRVUZWTEVWQlFVc3NRMEZCUXp0UlFXMUROVUlzWTBGUFF5eEZRVVZFTEd0Q1FYbENReXhGUVVWRUxHRkJZME1zUlVGdVJrUXNTVUZCU1N4RlFVVktMRmxCUVZrc1JVRkZXaXhUUVVGVExFVkJSVlFzWjBKQlFXZENMRVZCUldoQ0xHTkJRV01zUlVGRlpDeFRRVUZUTEVWQmRVSlVMR1ZCUVdVc1JVRlRaaXh0UWtGQmJVSXNSVUV5UW01Q0xHTkJRV003U1VGMFJXaENMRTFCUVUwc1EwRnJRMG9zWTBGUFF5eEhRVkJFTEZGQlFWRXNRMEZCVWl4alFVOURMRU5CVUdWRExFMUJRV01zUlVGQlVTeERRVUZETzFGQlEzSkRMRWRCUVVzc1EwRkJRME1zVVVGQlVTeEhRVUZIUXl4UlFVRlJMRU5CUVVORExHRkJRV0VzUTBGQlF5eERRVUZWTzFGQlMyeEVMRTFCUVUwc1EwRkdUa1lzVVVGQlVTeERRVUZEUnl4VFFVRlRMRWRCUVVkS0xFMUJRVTBzUlVGRmNFSkRMRkZCUVZFc1EwRkJRMGtzVDBGQlR5eERRVUZEUXl4VFFVRlRMRVZCUVVNc1EwRkJTVHRKUVVONFF5eERRVUZETEVWQlJVUXNhMEpCZVVKRExFZEJla0pFTEZGQlFWRXNRMEZCVWl4clFrRjVRa01zUTBGNlFtMUNReXhSUVVGakxFVkJRVVZETEUxQlFVMHNSVUZCUlN4RFFVRkRPMUZCUXpORExFZEJRVXNzUTBGUlJFTXNZMEZCWXl4RlFWSmFReXhaUVVGWkxFZEJRVWRTTEZGQlFWRXNRMEZCUTFNc2EwSkJRV3RDTEVOQlJEbENTaXhSUVVGakxFVkJRekpDU3l4VlFVRlZMRU5CUVVORExGbEJRVmtzUlVGQlJTeERRVUZETzFsQlEyNUdReXhWUVVGVkxFVkJRVlpCTEZGQlFWRXNRMEZCVWtFc1ZVRkJWU3hEUVVGRFF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0dlFrRkRXaXhIUVVGelFqdHJRMEZCZEVJc1IwRkJjMElzUjBGRWFrSkJMRWxCUVVrc1EwRkRVME1zU1VGQlNTeG5Ra0ZCZEVJc1IwRkJjMElzUjBGQmRFSXNTVUZCU1N4RFFVRktMRU5CUVdkRExFZEJRV2hETEVkQlFYTkNMRU5CUVVWRExGRkJRVkVzUTBGQlF6RkNMRlZCUVZVc1MwRkRkRU54UWl4VlFVRlZMRU5CUVVOTkxHRkJRV0VzUjBGRk1VSk9MRlZCUVZVc1EwRkJRMDhzWVVGQllUdFpRVU5xUXl4RFFVRkRPMUZCUTBnc1EwRkJReXhIUVVWSFF5eExRVUZMTEVkQlFVY3NRMEZCUXp0UlFVZGlMRWRCUVVjc05rSkJSa2RETEdOQlFXRXNSVUZCUnl4RFFVRkRMRU5CUVVNc1IwRkZhRUphTEdOQlFXTXNSMEZCUjBNc1dVRkJXU3hEUVVGRFdTeFJRVUZSTEVsQlFVc3NRMEZCUXp0WlFVVnNSQ3hGUVVGRkxFVkJRVWRpTEdOQlFXTXNRMEZCWVU4c1NVRkJTU3hMUVVGTE1VSXNhVUpCUVdsQ0xFVkJRVVVzUTBGQlF6dG5Ra0ZETTBRc1IwRkJTeXhEUVVGRGFVTXNWMEZCVnl4SFFVRkhMRWRCUVVjc1EwRkJRelZDTEZGQlFWRXNRMEZCUTJNc1kwRkJZeXhGUVdoQ2FrSkVMRTFCUVUwc1EwRm5RaXRDV1N4TFFVRkxPM05EUVVONFJTeEpRVUZKTEVWQlFVVkRMR05CUVdFc1JVRkJRMGNzU1VGQlNTeERRVUZEUkN4WFFVRlhMRU5CUVVNc1EwRkJRenRaUVVONFF5eERRVUZETEUxQlFVMHNSVUZCUlN4RlFVRkhaQ3hqUVVGakxFTkJRV0ZQTEVsQlFVa3NTMEZCUzNoQ0xIZENRVUYzUWl4RlFVRkZMRU5CUVVNN1owSkJRM3BGTEVkQlFVc3NRMEZCUTJsRExHbENRVUZwUWl4SFFVRkhMRWRCUVVjc1EwRkJReTlDTEdOQlFXTXNRMEZCUTJVc1kwRkJZeXhGUVc1Q04wSkVMRTFCUVUwc1EwRnRRakpEV1N4TFFVRkxPM05EUVVOd1JpeEpRVUZKTEVWQlFVVkRMR05CUVdFc1JVRkJRMGNzU1VGQlNTeERRVUZEUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzFsQlF6bERMRU5CUVVNN1dVRkZSRXdzUzBGQlN5eEZRVUZGTEVOQlFVTTdVVUZEVml4RFFVRkRPMGxCUTBnc1EwRkJReXhGUVVWRUxHRkJZME1zUjBGa1JDeFJRVUZSTEVOQlFWSXNZVUZqUXl4SFFXUm5RaXhEUVVGRE8xRkJRMmhDTEVkQlFVc3NORU5CUVRKQ0xFbEJRVWtzUlVGQlJVMHNaMEpCUVdVc1QwRkJPVU5ETEZWQlFWVXNWMEZCUlVNc1UwRkJVeXhYUVVOR0xGTkJRV0VzYTBKQlFXSXNTVUZCU1N4RFFVRkRNMElzVVVGQlVTeE5RVUZvUXpSQ0xFOUJRVThzUjBGQldTeFRRVUZoTEV0QlFYWkNja0lzVFVGQlRTeEhRVUZKTEZOQlFXRTdVVUZKZGtNc1JVRkJSU3hGUVVGRmJVSXNWVUZCVlN4TFFVRkxSU3hQUVVGUExFVkJRM2hDTEVkQlFVY3NRMEZCUlN4SFFVRkhMRU5CUVVOVUxFdEJRVXNzUjBGQlJ5eERRVUZETEVWQlFVVkJMRXRCUVVzc1IwRkJSMUVzVTBGQlV5eERRVUZEUlN4TlFVRk5MRVZCUVVWV0xFdEJRVXNzUjBGRE5VTjRRaXhaUVVGWkxFTkJRVU5uUXl4VFFVRlRMRU5CUVVOU0xFdEJRVXNzUjBGQlIxb3NUVUZCVFN4RFFVRkRXU3hMUVVGTExEUkNRVU01UXl4SlFVRkpMRVZCUVVWRExHTkJRV0VzUlVGQlEwUXNTMEZCU3l4RlFVRkZWeXhYUVVGWExFTkJRVU4yUWl4TlFVRk5MRU5CUVVOWkxFdEJRVXNzUlVGRVNDeERRVVZxUkR0dlEwRkhRMDBzWjBKQlFXVXNSVUZCUnl4SlFVRkpMRU5CUVVONlFpeFJRVUZSTEVORE5VWXpReXhEUkRSR05FTTdTVUZEZUVNc1EwRkJReXhGUVc1R1JDeEpRVUZKTEd0Q1FVVktMRmxCUVZrc2EwSkJSVm9zVTBGQlV5eHJRa0ZGVkN4blFrRkJaMElzYTBKQlJXaENMR05CUVdNc2EwSkJSV1FzVTBGQlV5eHJRa0YxUWxRc1pVRkJaU3hyUWtGVFppeHRRa0ZCYlVJc2EwSkJNa0p1UWl4alFVRmpMRFJDUVhSRlZDeFJRVUZSTzI5Q096czdPenM3T3pzN2JVVTdOa0k3T3pzN096czdPenM3T3pzN08zVkZPM2RFT3pzN096czdPekpJUVVOaUxFbEJRVWs3TzNWQ1FVRlhTaXhYUVVGWE8zTkZRVVV4UWl4WlFVRlpPenQzUWtGQlJ5eERRVUZMTzNORlFVVndRaXhUUVVGVE96dDFRa0ZCVkN4SlFVRkpMRU5CUVVvc1EwRkJaMEk3YzBWQlJXaENMR2RDUVVGblFqczdkVUpCUVdoQ0xFbEJRVWtzUTBGQlNpeERRVUZyUXp0elJVRkZiRU1zWTBGQll6czdkVUpCUVdRc1NVRkJTU3hEUVVGS0xFTkJRU3RDTzNORlFVVXZRaXhUUVVGVE96dDFRa0ZCWVN4SFFVRkhMRU5CUVVOS0xGRkJRVkU3ZFVWQmRVSnNReXhsUVVGbExEQkVRVk5tTEcxQ1FVRnRRaXd3UkVFeVFtNUNMR05CUVdNN096czdaMEpCZUVSa2RVTXNSMEZCYVVJc1JVRkJha0pCTEVOQlFXbENPM1ZDUVVGcVFrRXNVVUZCVVN4RFFVRlNRU3hwUWtGQmFVSXNSMEZCUnl4RFFVRkRPMjlDUVVOdVFpeEZRVUZGTEhsQ1FVRkhMRWxCUVVrc1JVRkJSVU1zV1VGQlZ5eEhRVUZGTEVOQlFVTTdkMEpCUTI1Q0xFbEJRVWtzUTBGQlEwTXNZVUZCWVN4SlFVTndRaXhKUVVGSkxFTkJRVU5CTEdGQlFXRXNaME5CUldSU0xHZENRVUZsTEVWQlFVY3NTVUZCU1N4RFFVRkRla0lzVVVGQlVTeEpRVUZKTEVOQlFVTXNRMEZCUXl4RE8zZENRVU16UXl4SFFVRkxMRFJEUVVFeVFpeEpRVUZKTEVWQlFVVjVRaXhuUWtGQlpTeFBRVUU1UTNwQ0xGRkJRVkVzVjBGQlJVOHNSMEZCVnl4WFFVRllRU3hOUVVGTkxHTkJRVTVCTEVkQlFWY3NSMEZCUml4RFFVRkRMRU5CUVVNc1IwRkJXRUVzUjBGQlZ6dHZSRUZGZEVKRUxGTkJRVkVzZVVKQlFVY3NTVUZCU1N4RlFVRkZORUlzWlVGQll5eEZRVUZrUVN4alFVRmpMRTlCUVhCQ0xFbEJRVWtzUlVGQmFVSnNReXhSUVVGUkxESkNRVVU1UXl4SlFVRkpMRVZCUVVWdFF5eHRRa0ZCYTBJc1JVRkJiRUpCTEd0Q1FVRnJRaXhQUVVGNFFpeEpRVUZKTEhkQ1FVRnhRaXhKUVVGSkxFVkJRVVUzUWl4VFFVRlJMRWRCUVVWRExFMUJRVTBzUjBGREwwTXNTVUZCU1N4RFFVRkROa0lzVjBGQlZ5eDFRa0ZCUXl4SlFVRkpMRVZCUVVVNVFpeFRRVUZSTEVVN2IwSkJRMnBETEVOQlFVTTdaMFJCUTBzd1FpeFpRVUZYTEVkQlFVY3NRMEZCU1N4RFEzQkRPVUlzUTBSdlF5dENPMmRDUVVNelFpeERRVUZET3pzN1owSkJRMFJMTEVkQlFXOUNMRVZCUVhCQ1FTeERRVUZ2UWp0MVFrRkJjRUpCTEZGQlFWRXNRMEZCVWtFc2IwSkJRVzlDTEVkQlFVY3NRMEZCUXl4RFFVRkRPenM3WjBKQlEzcENReXhIUVVGM1FpeEZRVUY0UWtFc1EwRkJkMEk3ZFVKQlFYaENRU3hSUVVGUkxFTkJRVkpCTEhkQ1FVRjNRaXhIUVVGSExFTkJRVU1zUTBGQlF6czdPMmRDUVVNM1FrTXNSMEZCWlN4RlFVRm1RU3hEUVVGbE8zVkNRVUZtUVN4UlFVRlJMRU5CUVZKQkxHVkJRV1VzUjBGQlJ5eERRVUZETEVOQlFVTTdPenRuUWtGMVJIQkNReXhIUVVGaExFVkJRV0pCTEVOQlFXRTdkVUpCUVdKQkxGRkJRVkVzUTBGQlVrRXNZVUZCWVN4SFFVRlRMRU5CUVVNN2IwSkJRM0pDTTBNc1ZVRkJWU3hEUVVGRExFTkJRVU03ZDBKQlExWTBReXhIUVVGSExIZENRVUZGTEVsQlFVa3NSVUZCUlVFc1NVRkJSenQzUWtGRFpFTXNSMEZCUnl4NVFrRkJSU3hKUVVGSkxFVkJRVVZETEdOQlFXRXNSVUZCWWtFc1lVRkJZU3hGUVVGRFF5eEpRVUZKTEVOQlFVTXNTVUZCU1R0dlFrRkRjRU1zUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUTB3c1EwRkJRenM3TzJkQ1FVVkVReXhIUVVGblFpeEZRVUZvUWtFc1EwRkJaMEk3ZFVKQlFXaENRU3hSUVVGUkxFTkJRVkpCTEdkQ1FVRm5RaXhEUVVGRFF5eEpRVUZaTEVWQlFWY3NRMEZCUXp0dlFrRkRka01zVFVGQlRTeDFRa0ZCUXl4SlFVRkpMRVZCUVVWRExGTkJRVkVzUlVGQlEwWXNaMEpCUVdkQ0xFTkJSSFpDUXl4SlFVRlpPMmRDUVVVM1FpeERRVUZET3pzN1owSkJSVVJGTEVkQlFXZENMRVZCUVdoQ1FTeERRVUZuUWp0MVFrRkJhRUpCTEZGQlFWRXNRMEZCVWtFc1owSkJRV2RDTEVOQlFVTkdMRWxCUVZrc1JVRkJSVWNzUjBGQldTeEZRVUZGTEVOQlFVTTdNRU5CUXpWRExFbEJRVWtzUlVGQlJVWXNVMEZCVVN4RlFVRkRReXhuUWtGQlowSXNRMEZFYUVKR0xFbEJRVmtzUlVGQlJVY3NSMEZCV1N4RFFVTkRMRU5CUVVNN1owSkJRemRETEVOQlFVTTdPenRQUVc1SGEwSnVSQ3hYUVVGVk8wRkJjVWRxUXl4RFFVRkRJbjA9IiwiaW1wb3J0IG92ZXJyaWRlRWxlbWVudERlZmluZSBmcm9tIFwiLi4vb3ZlcnJpZGVFbGVtZW50RGVmaW5lXCI7XG5pbXBvcnQgcmVhY3RpdmVFbGVtZW50RmFjdG9yeSBmcm9tIFwiLi4vcmVhY3RpdmVFbGVtZW50RmFjdG9yeVwiO1xub3ZlcnJpZGVFbGVtZW50RGVmaW5lKHJlYWN0aXZlRWxlbWVudEZhY3RvcnkoSFRNTEVsZW1lbnQpKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDJWc1pXMWxiblJ6TDI1aGRHbDJaUzlJVkUxTVJXeGxiV1Z1ZEM1MGN5SmRMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdiM1psY25KcFpHVkZiR1Z0Wlc1MFJHVm1hVzVsSUdaeWIyMGdKeTR1TDI5MlpYSnlhV1JsUld4bGJXVnVkRVJsWm1sdVpTYzdYRzVwYlhCdmNuUWdjbVZoWTNScGRtVkZiR1Z0Wlc1MFJtRmpkRzl5ZVNCbWNtOXRJQ2N1TGk5eVpXRmpkR2wyWlVWc1pXMWxiblJHWVdOMGIzSjVKenRjYmx4dWIzWmxjbkpwWkdWRmJHVnRaVzUwUkdWbWFXNWxLSEpsWVdOMGFYWmxSV3hsYldWdWRFWmhZM1J2Y25rb1NGUk5URVZzWlcxbGJuUXBLVHRjYmlKZExDSnVZVzFsY3lJNld5SnZkbVZ5Y21sa1pVVnNaVzFsYm5SRVpXWnBibVVpTENKeVpXRmpkR2wyWlVWc1pXMWxiblJHWVdOMGIzSjVJaXdpU0ZSTlRFVnNaVzFsYm5RaVhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFMUJRVTBzUTBGQlEwRXNjVUpCUVhGQ0xFMUJRVTBzUTBGQk1FSTdRVUZETlVRc1RVRkJUU3hEUVVGRFF5eHpRa0ZCYzBJc1RVRkJUU3hEUVVFeVFqdEJRVVU1UkVRc2NVSkJRWEZDTEVOQlFVTkRMSE5DUVVGelFpeERRVUZEUXl4WFFVRlhMRVZCUVVVc1EwRkJReUo5IiwiZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbUVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgcGFyYW0pIHtcbiAgICAgICAgKDAsIHBhcmFtLmFkZEluaXRpYWxpemVyKShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShuYW1lLCB0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5amFISnBjMk5wYm1SNUwwTnZaR1V2UjJsMGFIVmlMM0IzWXk5d1lXTnJZV2RsY3k5d2QyTXZjM0pqTDJSbFkyOXlZWFJ2Y25NdlkzVnpkRzl0Uld4bGJXVnVkQzUwY3lKZExDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1kzVnpkRzl0Uld4bGJXVnVkQ2h1WVcxbE9pQnpkSEpwYm1jcElIdGNiaUFnY21WMGRYSnVJQ2gyWVd4MVpTd2dleUJoWkdSSmJtbDBhV0ZzYVhwbGNpQjlLU0E5UGlCN1hHNGdJQ0FnWVdSa1NXNXBkR2xoYkdsNlpYSW9ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnWTNWemRHOXRSV3hsYldWdWRITXVaR1ZtYVc1bEtHNWhiV1VzSUhSb2FYTXBPMXh1SUNBZ0lIMHBPMXh1SUNCOU8xeHVmVnh1SWwwc0ltNWhiV1Z6SWpwYkltTjFjM1J2YlVWc1pXMWxiblFpTENKdVlXMWxJaXdpZG1Gc2RXVWlMQ0poWkdSSmJtbDBhV0ZzYVhwbGNpSXNJbU4xYzNSdmJVVnNaVzFsYm5Seklpd2laR1ZtYVc1bElsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeE5RVUZOTEZWQlFWVkJMR0ZCUVdFc1EwRkJRME1zU1VGQldTeEZRVUZGTEVOQlFVTTdTVUZETTBNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlVFTXNTMEZCU3l4VFFVRjVRaXhEUVVGRE8ydENRVUYwUWtNc1kwRkJZeXhGUVVOa0xGRkJRVkVzUjBGQlNTeERRVUZETzFsQlF6RkNReXhqUVVGakxFTkJRVU5ETEUxQlFVMHNRMEZCUTBvc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzFGQlEzQkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRMHdzUTBGQlF6dEJRVU5JTEVOQlFVTWlmUT09IiwiZXhwb3J0IGZ1bmN0aW9uIHJlYWN0aXZlKHZhbHVlLCBwYXJhbSkge1xuICAgIHZhciBraW5kID0gcGFyYW0ua2luZCwgbmFtZSA9IHBhcmFtLm5hbWU7XG4gICAgaWYgKFwiYWNjZXNzb3JcIiA9PT0ga2luZCkgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSZWFjdGl2ZVZhbHVlKG5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UmVhY3RpdmVWYWx1ZShuYW1lLCB2YWwpO1xuICAgICAgICB9LFxuICAgICAgICBpbml0OiBmdW5jdGlvbiBpbml0KGluaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRSZWFjdGl2ZVZhbHVlKG5hbWUsIGluaXRpYWxWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlqYUhKcGMyTnBibVI1TDBOdlpHVXZSMmwwYUhWaUwzQjNZeTl3WVdOcllXZGxjeTl3ZDJNdmMzSmpMMlJsWTI5eVlYUnZjbk12Y21WaFkzUnBkbVV1ZEhNaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2laWGh3YjNKMElHWjFibU4wYVc5dUlISmxZV04wYVhabEtIWmhiSFZsTENCN0lHdHBibVFzSUc1aGJXVWdmU2tnZTF4dUlDQnBaaUFvYTJsdVpDQTlQVDBnSjJGalkyVnpjMjl5SnlrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JuWlhRb0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG1kbGRGSmxZV04wYVhabFZtRnNkV1VvYm1GdFpTazdYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdjMlYwS0haaGJDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRkpsWVdOMGFYWmxWbUZzZFdVb2JtRnRaU3dnZG1Gc0tUdGNiaUFnSUNBZ0lIMHNYRzRnSUNBZ0lDQnBibWwwS0dsdWFYUnBZV3hXWVd4MVpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRkpsWVdOMGFYWmxWbUZzZFdVb2JtRnRaU3dnYVc1cGRHbGhiRlpoYkhWbEtUdGNiaUFnSUNBZ0lIMHNYRzRnSUNBZ2ZUdGNiaUFnZlZ4dWZWeHVJbDBzSW01aGJXVnpJanBiSW5KbFlXTjBhWFpsSWl3aWRtRnNkV1VpTENKcmFXNWtJaXdpYm1GdFpTSXNJbWRsZENJc0ltZGxkRkpsWVdOMGFYWmxWbUZzZFdVaUxDSnpaWFFpTENKMllXd2lMQ0p6WlhSU1pXRmpkR2wyWlZaaGJIVmxJaXdpYVc1cGRDSXNJbWx1YVhScFlXeFdZV3gxWlNKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1RVRkJUU3hWUVVGVlFTeFJRVUZSTEVOQlFVTkRMRXRCUVVzc1JVRkJSU3hMUVVGakxFVkJRVVVzUTBGQlF6dFJRVUZtUXl4SlFVRkpMRWRCUVU0c1MwRkJZeXhEUVVGYVFTeEpRVUZKTEVWQlFVVkRMRWxCUVVrc1IwRkJXaXhMUVVGakxFTkJRVTVCTEVsQlFVazdTVUZETVVNc1JVRkJSU3hGUVVGWExFTkJRVlVzWTBGQmJrSkVMRWxCUVVrc1JVRkRUaXhOUVVGTkxFTkJRVU1zUTBGQlF6dFJRVU5PUlN4SFFVRkhMRVZCUVVoQkxGRkJRMDRzUTBGRVRVRXNSMEZCUnl4SFFVRkhMRU5CUVVNN1dVRkRUQ3hOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZEUXl4blFrRkJaMElzUTBGQlEwWXNTVUZCU1R0UlFVTnVReXhEUVVGRE8xRkJRMFJITEVkQlFVY3NSVUZCU0VFc1VVRkJVU3hEUVVGU1FTeEhRVUZITEVOQlFVTkRMRWRCUVVjc1JVRkJSU3hEUVVGRE8xbEJRMUlzU1VGQlNTeERRVUZEUXl4blFrRkJaMElzUTBGQlEwd3NTVUZCU1N4RlFVUjRRa2tzUjBGQlJ5eERRVU15UWl4RFFVRkRPMUZCUTI1RExFTkJRVU03VVVGRFJFVXNTVUZCU1N4RlFVRktRU3hSUVVGUkxFTkJRVkpCTEVsQlFVa3NRMEZCUTBNc1dVRkJXU3hGUVVGRkxFTkJRVU03V1VGRGJFSXNTVUZCU1N4RFFVRkRSaXhuUWtGQlowSXNRMEZCUTB3c1NVRkJTU3hGUVVSMlFrOHNXVUZCV1N4RFFVTXdRaXhEUVVGRE8xRkJRelZETEVOQlFVTTdTVUZEU0N4RFFVRkRPMEZCUlV3c1EwRkJReUo5IiwiaW1wb3J0IHsgY3VzdG9tRWxlbWVudCwgcmVhY3RpdmUgfSBmcm9tIFwicHdjXCI7XG5AY3VzdG9tRWxlbWVudCgnY3VzdG9tLWNvbXBvbmVudCcpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21Db21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIEByZWFjdGl2ZVxuICBhY2Nlc3NvciBjb3VudCA9IDA7XG5cbiAgYWRkQ291bnQoKSB7XG4gICAgdGhpcy5jb3VudCA9IHRoaXMuY291bnQgKyAxO1xuICB9XG5cbiAgcmVkdWNlQ291bnQoKSB7XG4gICAgdGhpcy5jb3VudCA9IHRoaXMuY291bnQgLSAxO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBbXCJcXG4gIDxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlxcbiAgICA8IS0tP3B3Y19wLS0+PGJ1dHRvbj4rPC9idXR0b24+XFxuICAgIDwhLS0/cHdjX3QtLT5cXG4gICAgPCEtLT9wd2NfcC0tPjxidXR0b24+LTwvYnV0dG9uPlxcbiAgPC9kaXY+XFxuXCIsIFt7XG4gICAgICBvbmNsaWNrOiB7XG4gICAgICAgIGhhbmRsZXI6IHRoaXNbXCJhZGRDb3VudFwiXS5iaW5kKHRoaXMpLFxuICAgICAgICBjYXB0dXJlOiBmYWxzZVxuICAgICAgfVxuICAgIH0sIHRoaXNbXCJjb3VudFwiXSwge1xuICAgICAgb25jbGljazoge1xuICAgICAgICBoYW5kbGVyOiB0aGlzW1wicmVkdWNlQ291bnRcIl0uYmluZCh0aGlzKSxcbiAgICAgICAgY2FwdHVyZTogZmFsc2VcbiAgICAgIH1cbiAgICB9XV07XG4gIH1cblxufSJdLCJuYW1lcyI6WyJfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbiIsIl9jbGFzc0V4dHJhY3RGaWVsZERlc2NyaXB0b3IiLCJfY2xhc3NQcml2YXRlRmllbGRHZXQiLCJfY2xhc3NQcml2YXRlRmllbGRJbml0IiwiX2RlZmluZVByb3BlcnRpZXMiLCJjb21taXRBdHRyaWJ1dGVzIiwiX2NsYXNzUHJpdmF0ZUZpZWxkU2V0IiwiX2NsYXNzUHJpdmF0ZU1ldGhvZEdldCIsImNvbW1pdEF0dHJpYnV0ZXMxIiwidW5kZWZpbmVkIiwiY3VzdG9tRWxlbWVudCIsIkhUTUxFbGVtZW50IiwiY291bnQiLCJhZGRDb3VudCIsInJlZHVjZUNvdW50IiwidGVtcGxhdGUiLCJvbmNsaWNrIiwiaGFuZGxlciIsImJpbmQiLCJjYXB0dXJlIiwicmVhY3RpdmUiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFlLDhCQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3pDLElBQUksSUFBSSxHQUFHLENBQUM7SUFDWixJQUFJLElBQUksQ0FBQyxJQUFJLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxjQUFj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
