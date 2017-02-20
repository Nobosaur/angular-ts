// issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/369
// https://github.com/witoldsz/angular-http-auth/blob/master/src/angular-http-auth.js
/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
/* tslint:disable:no-empty no-shadowed-variable */
var AuthService = (function () {
    function AuthService() {
        /**
          * Holds all the requests which failed due to 401 response,
          * so they can be re-requested in future, once login is completed.
          */
        this.buffer = [];
        /**
         * Required by HTTP interceptor.
         * Function is attached to provider to be invisible for regular users of this service.
         */
        this.pushToBuffer = function (config, deferred) {
            this.buffer.push({
                config: config,
                deferred: deferred
            });
        };
        this.$get = [
            '$rootScope', '$injector', function ($rootScope, $injector) {
                var $http; //initialized later because of circular dependency problem
                function retry(config, deferred) {
                    $http = $http || $injector.get('$http');
                    $http(config).then(function (response) {
                        deferred.resolve(response);
                    });
                }
                function retryAll() {
                    for (var _i = 0, _a = this.buffer; _i < _a.length; _i++) {
                        var request = _a[_i];
                        retry(request.config, request.deferred);
                    }
                    this.buffer = [];
                }
                return {
                    loginConfirmed: function () {
                        $rootScope.$broadcast('event:auth-loginConfirmed');
                        retryAll();
                    }
                };
            }
        ];
    }
    return AuthService;
}());
angular.module('http-auth-interceptor', [])
    .provider('authService', AuthService)
    .config(['$httpProvider', 'authServiceProvider', function ($httpProvider, authServiceProvider) {
        $httpProvider.defaults.headers.common = { Authorization: 'Bearer token' };
        $httpProvider.defaults.headers.get['Authorization'] = 'Bearer token';
        $httpProvider.defaults.headers.post['Authorization'] = function (config) { return 'Bearer token'; };
        var interceptor = ['$rootScope', '$q', function ($rootScope, $q) {
                function success(response) {
                    return response;
                }
                function error(response) {
                    if (response.status === 401) {
                        var deferred = $q.defer();
                        authServiceProvider.pushToBuffer(response.config, deferred);
                        $rootScope.$broadcast('event:auth-loginRequired');
                        return deferred.promise;
                    }
                    // otherwise
                    return $q.reject(response);
                }
                return function (promise) {
                    return promise.then(success, error);
                };
            }];
        $httpProvider.interceptors.push(interceptor);
    }]);
var HttpAndRegularPromiseTests;
(function (HttpAndRegularPromiseTests) {
    function someController($scope, $http, $q) {
        $http.get('http://somewhere/some/resource')
            .then(function (response) {
            // typing lost, so something like
            // var i: number = response.data
            // would type check
            $scope.person = response.data;
        });
        $http.get('http://somewhere/some/resource')
            .then(function (response) {
            // typing lost, so something like
            // var i: number = response.data
            // would NOT type check
            $scope.person = response.data;
        });
        var aPromise = $q.when({ firstName: 'Jack', lastName: 'Sparrow' });
        aPromise.then(function (person) {
            $scope.person = person;
        });
        var bPromise = $q.when(42);
        bPromise.then(function (answer) {
            $scope.theAnswer = answer;
        });
        var cPromise = $q.when(['a', 'b', 'c']);
        cPromise.then(function (letters) {
            $scope.letters = letters;
        });
        // When $q.when is passed an IPromise<T>, it returns an IPromise<T>
        var dPromise = $q.when($q.when('ALBATROSS!'));
        dPromise.then(function (snack) {
            $scope.snack = snack;
        });
        // $q.when may be called without arguments
        var ePromise = $q.when();
        ePromise.then(function () {
            $scope.nothing = 'really nothing';
        });
    }
})(HttpAndRegularPromiseTests || (HttpAndRegularPromiseTests = {}));
// Test for AngularJS Syntax
var My;
(function (My) {
    var Namespace;
    (function (Namespace) {
    })(Namespace = My.Namespace || (My.Namespace = {}));
})(My || (My = {}));
// IModule Registering Test
var mod = angular.module('tests', []);
mod.controller('name', function ($scope) { });
mod.controller('name', ['$scope', function ($scope) { }]);
mod.controller('name', (function () {
    function class_1() {
    }
    return class_1;
}()));
mod.controller({
    MyCtrl: (function () {
        function class_2() {
        }
        return class_2;
    }()),
    MyCtrl2: function () { },
    MyCtrl3: ['$fooService', function ($fooService) { }]
});
mod.directive('myDirectiveA', function ($rootScope) {
    return function (scope, el, attrs) {
        var foo = 'none';
        el.click(function (e) {
            foo = e.type;
            $rootScope.$apply();
        });
        scope.$watch(function () { return foo; }, function () { return el.text(foo); });
    };
});
mod.directive('myDirectiveB', ['$rootScope', function ($rootScope) {
        return {
            link: function (scope, el, attrs) {
                el.click(function (e) {
                    el.hide();
                });
            }
        };
    }]);
mod.directive({
    myFooDir: function () { return ({
        template: 'my-foo-dir.tpl.html'
    }); },
    myBarDir: ['$fooService', function ($fooService) { return ({
            template: 'my-bar-dir.tpl.html'
        }); }]
});
mod.factory('name', function ($scope) { });
mod.factory('name', ['$scope', function ($scope) { }]);
mod.factory({
    name1: function (foo) { },
    name2: ['foo', function (foo) { }]
});
mod.filter('name', function ($scope) { });
mod.filter('name', ['$scope', function ($scope) { }]);
mod.filter({
    name1: function (foo) { },
    name2: ['foo', function (foo) { }]
});
mod.provider('name', function ($scope) { return { $get: function () { } }; });
mod.provider('name', TestProvider);
mod.provider('name', ['$scope', function ($scope) { }]);
mod.provider(My.Namespace);
mod.service('name', function ($scope) { });
mod.service('name', ['$scope', function ($scope) { }]);
mod.service({
    MyCtrl: (function () {
        function class_3() {
        }
        return class_3;
    }()),
    MyCtrl2: function () { },
    MyCtrl3: ['$fooService', function ($fooService) { }]
});
mod.constant('name', 23);
mod.constant('name', '23');
mod.constant(My.Namespace);
mod.value('name', 23);
mod.value('name', '23');
mod.value(My.Namespace);
mod.decorator('name', function ($scope) { });
mod.decorator('name', ['$scope', function ($scope) { }]);
var TestProvider = (function () {
    function TestProvider($scope) {
        this.$scope = $scope;
    }
    TestProvider.prototype.$get = function () {
    };
    return TestProvider;
}());
// QProvider tests
angular.module('qprovider-test', [])
    .config(['$qProvider', function ($qProvider) {
        var provider = $qProvider.errorOnUnhandledRejections(false);
        var currentValue = $qProvider.errorOnUnhandledRejections();
    }]);
// Promise signature tests
var foo;
foo.then(function (x) {
    // x is inferred to be a number
    x.toFixed();
    return 'asdf';
}).then(function (x) {
    // x is inferred to be string
    var len = x.length;
    return 123;
}, function (e) {
    return anyOf2([123], toPromise([123])); // IPromise<T> | T, both are good for the 2nd arg of .then()
}).then(function (x) {
    // x is infered to be a number or number[]
    if (Array.isArray(x)) {
        x[0].toFixed();
    }
    else {
        x.toFixed();
    }
    return;
}).catch(function (e) {
    return foo || 123; // IPromise<T> | T, both are good for .catch()
}).then(function (x) {
    // x is infered to be void | number
    x && x.toFixed();
    // Typescript will prevent you to actually use x as a local variable before you check it is not void
    // Try object:
    return { a: 123 };
}).then(function (x) {
    // Object is inferred here
    x.a = 123;
    //Try a promise
    var y;
    var condition;
    return condition ? y : x.a; // IPromise<T> | T, both are good for the 1st arg of .then()
}).then(function (x) {
    // x is infered to be a number, which is the resolved value of a promise
    x.toFixed();
});
// $q signature tests
var TestQ;
(function (TestQ) {
    var tResult;
    var promiseTResult;
    var tValue;
    var promiseTValue;
    var tOther;
    var promiseTOther;
    var $q;
    var promiseAny;
    var assertPromiseType = function (arg) { return arg; };
    // $q constructor
    {
        var result = void 0;
        result = new $q(function (resolve) { });
        result = new $q(function (resolve, reject) { });
        result = $q(function (resolve) { });
        result = $q(function (resolve, reject) { });
    }
    // $q.all
    {
        var result = void 0;
        result = $q.all([promiseAny, promiseAny]);
        // TS should infer that n1 and n2 are numbers and have toFixed.
        $q.all([1, $q.when(2)]).then(function (_a) {
            var n1 = _a[0], n2 = _a[1];
            return n1.toFixed() + n2.toFixed();
        });
        $q.all([1, $q.when(2), '3']).then(function (_a) {
            var n1 = _a[0], n2 = _a[1], n3 = _a[2];
            return n1.toFixed() + n2.toFixed() + n3.slice(1);
        });
    }
    {
        var result = void 0;
        result = $q.all([promiseAny, promiseAny]);
    }
    {
        var result = void 0;
        result = $q.all({ a: promiseAny, b: promiseAny });
    }
    {
        var result = void 0;
        result = $q.all({ a: promiseAny, b: promiseAny });
    }
    // $q.defer
    {
        var result = void 0;
        result = $q.defer();
        result.resolve(tResult);
        var anyValue;
        result.reject(anyValue);
        result.promise.then(function (result) {
            return $q.resolve(result);
        });
    }
    // $q.reject
    {
        var result = void 0;
        result = $q.reject();
        result = $q.reject('');
        result.catch(function () { return 5; }).then(function (x) { return x.toFixed(); });
    }
    // $q.resolve
    {
        var result = void 0;
        result = $q.resolve();
    }
    {
        var result = void 0;
        result = $q.resolve(tResult);
        result = $q.resolve(promiseTResult);
        result = $q.resolve(Math.random() > 0.5 ? tResult : promiseTOther);
        result = $q.resolve(Math.random() > 0.5 ? tResult : promiseTOther);
    }
    // $q.when
    {
        var result = void 0;
        result = $q.when();
    }
    {
        var result = void 0;
        var resultOther = void 0;
        result = $q.when(tResult);
        result = $q.when(promiseTResult);
        result = $q.when(tValue, function (result) { return tResult; });
        result = $q.when(tValue, function (result) { return tResult; }, function (any) { return any; });
        result = $q.when(tValue, function (result) { return tResult; }, function (any) { return any; }, function (any) { return any; });
        result = $q.when(promiseTValue, function (result) { return tResult; });
        result = resultOther = $q.when(promiseTValue, function (result) { return tResult; }, function (any) { return tOther; });
        result = resultOther = $q.when(promiseTValue, function (result) { return tResult; }, function (any) { return tOther; }, function (any) { return any; });
        result = resultOther = $q.when(promiseTValue, function (result) { return tResult; }, function (any) { return promiseTOther; });
        result = resultOther = $q.when(promiseTValue, function (result) { return tResult; }, function (any) { return promiseTOther; }, function (any) { return any; });
        result = $q.when(tValue, function (result) { return promiseTResult; });
        result = $q.when(tValue, function (result) { return promiseTResult; }, function (any) { return any; });
        result = $q.when(tValue, function (result) { return promiseTResult; }, function (any) { return any; }, function (any) { return any; });
        result = $q.when(promiseTValue, function (result) { return promiseTResult; });
        result = resultOther = $q.when(promiseTValue, function (result) { return promiseTResult; }, function (any) { return tOther; });
        result = resultOther = $q.when(promiseTValue, function (result) { return promiseTResult; }, function (any) { return tOther; }, function (any) { return any; });
        result = resultOther = $q.when(promiseTValue, function (result) { return promiseTResult; }, function (any) { return promiseTOther; });
        result = resultOther = $q.when(promiseTValue, function (result) { return promiseTResult; }, function (any) { return promiseTOther; }, function (any) { return any; });
    }
})(TestQ || (TestQ = {}));
var httpFoo;
httpFoo.then(function (x) {
    // When returning a promise the generic type must be inferred.
    var innerPromise;
    return innerPromise;
}).then(function (x) {
    // must still be number.
    x.toFixed();
});
httpFoo.then(function (response) {
    var h = response.headers('test');
    h.charAt(0);
    var hs = response.headers();
    hs['content-type'].charAt(1);
});
// Deferred signature tests
var TestDeferred;
(function (TestDeferred) {
    var any;
    var tResult;
    var deferred;
    // deferred.resolve
    {
        var result = void 0;
        result = deferred.resolve();
        result = deferred.resolve(tResult);
    }
    // deferred.reject
    {
        var result = void 0;
        result = deferred.reject();
        result = deferred.reject(any);
    }
    // deferred.notify
    {
        var result = void 0;
        result = deferred.notify();
        result = deferred.notify(any);
    }
    // deferred.promise
    {
        var result = void 0;
        result = deferred.promise;
    }
})(TestDeferred || (TestDeferred = {}));
var TestInjector;
(function (TestInjector) {
    var $injector;
    $injector.strictDi = true;
    $injector.annotate(function () { });
    $injector.annotate(function () { }, true);
})(TestInjector || (TestInjector = {}));
// Promise signature tests
var TestPromise;
(function (TestPromise) {
    var any;
    function isTResult(x) {
        return x.kind === 'result';
    }
    var tresult;
    var tresultPromise;
    var tresultHttpPromise;
    var tother;
    var totherPromise;
    var totherHttpPromise;
    var promise;
    var $q;
    var assertPromiseType = function (arg) { return arg; };
    var reject = $q.reject();
    // promise.then
    assertPromiseType(promise.then(function (result) { return any; }));
    assertPromiseType(promise.then(function (result) { return any; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return any; }, function (any) { return any; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return reject; }));
    assertPromiseType(promise.then(function (result) { return reject; }, function (any) { return reject; }));
    assertPromiseType(promise.then(function (result) { return reject; }, function (any) { return reject; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return result; }));
    assertPromiseType(promise.then(function (result) { return tresult; }));
    assertPromiseType(promise.then(function (result) { return tresultPromise; }));
    assertPromiseType(promise.then(function (result) { return result; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return result; }, function (any) { return any; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return result; }, function (any) { return reject; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return anyOf2(reject, result); }));
    assertPromiseType(promise.then(function (result) { return anyOf3(result, tresultPromise, reject); }));
    assertPromiseType(promise.then(function (result) { return anyOf3(reject, result, tresultPromise); }, function (reason) { return anyOf3(reject, tresult, tresultPromise); }));
    assertPromiseType(promise.then(function (result) { return tresultHttpPromise; }));
    assertPromiseType(promise.then(function (result) { return result; }, function (any) { return tother; }));
    assertPromiseType(promise.then(function (result) { return anyOf3(reject, result, totherPromise); }, function (reason) { return anyOf3(reject, tother, tresultPromise); }));
    assertPromiseType(promise.then(function (result) { return anyOf3(tresultPromise, result, totherPromise); }));
    assertPromiseType(promise.then(function (result) { return result; }, function (any) { return tother; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return tresultPromise; }, function (any) { return totherPromise; }));
    assertPromiseType(promise.then(function (result) { return tresultPromise; }, function (any) { return totherPromise; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return tresultHttpPromise; }, function (any) { return totherHttpPromise; }));
    assertPromiseType(promise.then(function (result) { return tresultHttpPromise; }, function (any) { return totherHttpPromise; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return tother; }));
    assertPromiseType(promise.then(function (result) { return tother; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return tother; }, function (any) { return any; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return totherPromise; }));
    assertPromiseType(promise.then(function (result) { return totherPromise; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return totherPromise; }, function (any) { return any; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return totherHttpPromise; }));
    assertPromiseType(promise.then(function (result) { return totherHttpPromise; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return totherHttpPromise; }, function (any) { return any; }, function (any) { return any; }));
    assertPromiseType(promise.then(function (result) { return tresult; }, function (any) { return tother; }).then(function (ambiguous) { return isTResult(ambiguous) ? ambiguous.c : ambiguous.f; }));
    // promise.catch
    assertPromiseType(promise.catch(function (err) { return err; }));
    assertPromiseType(promise.catch(function (err) { return any; }));
    assertPromiseType(promise.catch(function (err) { return tresult; }));
    assertPromiseType(promise.catch(function (err) { return anyOf2(tresult, reject); }));
    assertPromiseType(promise.catch(function (err) { return anyOf3(tresult, tresultPromise, reject); }));
    assertPromiseType(promise.catch(function (err) { return tresultPromise; }));
    assertPromiseType(promise.catch(function (err) { return tresultHttpPromise; }));
    assertPromiseType(promise.catch(function (err) { return tother; }));
    assertPromiseType(promise.catch(function (err) { return totherPromise; }));
    assertPromiseType(promise.catch(function (err) { return totherHttpPromise; }));
    assertPromiseType(promise.catch(function (err) { return tother; }).then(function (ambiguous) { return isTResult(ambiguous) ? ambiguous.c : ambiguous.f; }));
    // promise.finally
    assertPromiseType(promise.finally(function () { return any; }));
    assertPromiseType(promise.finally(function () { return tresult; }));
    assertPromiseType(promise.finally(function () { return tother; }));
})(TestPromise || (TestPromise = {}));
function test_angular_forEach() {
    var values = { name: 'misko', gender: 'male' };
    var log = [];
    angular.forEach(values, function (value, key) {
        this.push(key + ': ' + value);
    }, log);
    //expect(log).toEqual(['name: misko', 'gender: male']);
}
// angular.element() tests
var element = angular.element('div.myApp');
var scope = element.scope();
var isolateScope = element.isolateScope();
isolateScope = element.find('div.foo').isolateScope();
isolateScope = element.children().isolateScope();
// $timeout signature tests
var TestTimeout;
(function (TestTimeout) {
    var fnTResult;
    var promiseAny;
    var $timeout;
    // $timeout
    {
        var result = void 0;
        result = $timeout();
    }
    {
        var result = void 0;
        result = $timeout(1);
        result = $timeout(1, true);
    }
    {
        var result = void 0;
        result = $timeout(fnTResult);
        result = $timeout(fnTResult, 1);
        result = $timeout(fnTResult, 1, true);
        result = $timeout(fnTResult, 1, true, 1);
        result = $timeout(fnTResult, 1, true, 1, '');
        result = $timeout(fnTResult, 1, true, 1, '', true);
    }
    // $timeout.cancel
    {
        var result = void 0;
        result = $timeout.cancel();
        result = $timeout.cancel(promiseAny);
    }
})(TestTimeout || (TestTimeout = {}));
function test_IAttributes(attributes) {
    return attributes;
}
test_IAttributes({
    $normalize: function (classVal) { return 'foo'; },
    $addClass: function (classVal) { },
    $removeClass: function (classVal) { },
    $updateClass: function (newClass, oldClass) { },
    $set: function (key, value) { },
    $observe: function (name, fn) {
        return fn;
    },
    $attr: {}
});
var SampleDirective = (function () {
    function SampleDirective() {
        this.restrict = 'A';
        this.name = 'doh';
    }
    SampleDirective.prototype.compile = function (templateElement) {
        return {
            post: this.link
        };
    };
    SampleDirective.instance = function () {
        return new SampleDirective();
    };
    SampleDirective.prototype.link = function (scope) {
    };
    return SampleDirective;
}());
var SampleDirective2 = (function () {
    function SampleDirective2() {
        this.restrict = 'EAC';
    }
    SampleDirective2.prototype.compile = function (templateElement) {
        return {
            pre: this.link
        };
    };
    SampleDirective2.instance = function () {
        return new SampleDirective2();
    };
    SampleDirective2.prototype.link = function (scope) {
    };
    return SampleDirective2;
}());
angular.module('SameplDirective', []).directive('sampleDirective', SampleDirective.instance).directive('sameplDirective2', SampleDirective2.instance);
angular.module('AnotherSampleDirective', []).directive('myDirective', ['$interpolate', '$q', function ($interpolate, $q) {
        return {
            restrict: 'A',
            link: function (scope, el, attr) {
                $interpolate(attr['test'])(scope);
                $interpolate('', true)(scope);
                $interpolate('', true, 'html')(scope);
                $interpolate('', true, 'html', true)(scope);
                var defer = $q.defer();
                defer.reject();
                defer.resolve();
                defer.promise.then(function (d) {
                    return d;
                }).then(function () {
                    return null;
                }, function () {
                    return null;
                })
                    .catch(function () {
                    return null;
                })
                    .finally(function () {
                    return null;
                });
                var promise = new $q(function (resolve) {
                    resolve();
                });
                promise = new $q(function (resolve, reject) {
                    reject();
                    resolve(true);
                });
                promise = new $q(function (resolver, reject) {
                    resolver(true);
                    reject(false);
                });
            }
        };
    }]);
// test from https://docs.angularjs.org/guide/directive
angular.module('docsSimpleDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };
    }])
    .directive('myCustomer', function () {
    return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
    };
});
angular.module('docsTemplateUrlDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };
    }])
    .directive('myCustomer', function () {
    return {
        templateUrl: 'my-customer.html'
    };
});
angular.module('docsRestrictDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };
    }])
    .directive('myCustomer', function () {
    return {
        restrict: 'E',
        templateUrl: 'my-customer.html'
    };
});
angular.module('docsScopeProblemExample', [])
    .controller('NaomiController', ['$scope', function ($scope) {
        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };
    }])
    .controller('IgorController', ['$scope', function ($scope) {
        $scope.customer = {
            name: 'Igor',
            address: '123 Somewhere'
        };
    }])
    .directive('myCustomer', function () {
    return {
        restrict: 'E',
        templateUrl: 'my-customer.html'
    };
});
angular.module('docsIsolateScopeDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
        $scope.igor = { name: 'Igor', address: '123 Somewhere' };
    }])
    .directive('myCustomer', function () {
    return {
        restrict: 'E',
        scope: {
            customerInfo: '=info'
        },
        templateUrl: 'my-customer-iso.html'
    };
});
angular.module('docsIsolationExample', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
        $scope.vojta = { name: 'Vojta', address: '3456 Somewhere Else' };
    }])
    .directive('myCustomer', function () {
    return {
        restrict: 'E',
        scope: {
            customerInfo: '=info'
        },
        templateUrl: 'my-customer-plus-vojta.html'
    };
});
angular.module('docsTimeDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.format = 'M/d/yy h:mm:ss a';
    }])
    .directive('myCurrentTime', ['$interval', 'dateFilter', function ($interval, dateFilter) {
        return {
            link: function (scope, element, attrs) {
                var format, timeoutId;
                function updateTime() {
                    element.text(dateFilter(new Date(), format));
                }
                scope.$watch(attrs['myCurrentTime'], function (value) {
                    format = value;
                    updateTime();
                });
                element.on('$destroy', function () {
                    $interval.cancel(timeoutId);
                });
                // start the UI update process; save the timeoutId for canceling
                timeoutId = $interval(function () {
                    updateTime(); // update DOM
                }, 1000);
            }
        };
    }]);
angular.module('docsTransclusionDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.name = 'Tobias';
    }])
    .directive('myDialog', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'my-dialog.html'
    };
});
angular.module('docsTransclusionExample', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.name = 'Tobias';
    }])
    .directive('myDialog', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        templateUrl: 'my-dialog.html',
        link: function (scope, element) {
            scope['name'] = 'Jeff';
        }
    };
});
angular.module('docsIsoFnBindExample', [])
    .controller('Controller', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.name = 'Tobias';
        $scope.hideDialog = function () {
            $scope.dialogIsHidden = true;
            $timeout(function () {
                $scope.dialogIsHidden = false;
            }, 2000);
        };
    }])
    .directive('myDialog', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            close: '&onClose'
        },
        templateUrl: 'my-dialog-close.html'
    };
});
angular.module('dragModule', [])
    .directive('myDraggable', ['$document', function ($document) {
        return function (scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element.css({
                position: 'relative',
                border: '1px solid red',
                backgroundColor: 'lightgrey',
                cursor: 'pointer'
            });
            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });
            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }
            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    }]);
angular.module('docsTabsExample', [])
    .directive('myTabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function ($scope) {
            var panes = $scope['panes'] = [];
            $scope['select'] = function (pane) {
                angular.forEach(panes, function (pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            };
            this.addPane = function (pane) {
                if (panes.length === 0) {
                    $scope['select'](pane);
                }
                panes.push(pane);
            };
        },
        templateUrl: 'my-tabs.html'
    };
})
    .directive('myPane', function () {
    return {
        require: '^myTabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function (scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
        },
        templateUrl: 'my-pane.html'
    };
});
angular.module('multiSlotTranscludeExample', [])
    .directive('dropDownMenu', function () {
    return {
        transclude: {
            button: 'button',
            list: 'ul',
        },
        link: function (scope, element, attrs, ctrl, transclude) {
            // without scope
            transclude().appendTo(element);
            transclude(function (clone) { return clone.appendTo(element); });
            // with scope
            transclude(scope, function (clone) { return clone.appendTo(element); });
            transclude(scope, function (clone) { return clone.appendTo(element); }, element, 'button');
            transclude(scope, null, element, 'list').addClass('drop-down-list').appendTo(element);
        }
    };
});
angular.module('componentExample', [])
    .component('counter', {
    require: { ctrl: '^ctrl' },
    bindings: {
        count: '='
    },
    controller: 'CounterCtrl',
    controllerAs: 'counterCtrl',
    template: function () {
        return '';
    },
    transclude: {
        el: 'target'
    }
})
    .component('anotherCounter', {
    controller: function () { },
    require: {
        parent: '^parentCtrl'
    },
    template: '',
    transclude: true
});
angular.module('copyExample', [])
    .controller('ExampleController', ['$scope', function ($scope) {
        $scope.master = {};
        $scope.update = function (user) {
            // Example with 1 argument
            $scope.master = angular.copy(user);
        };
        $scope.reset = function () {
            // Example with 2 arguments
            angular.copy($scope.master, $scope.user);
        };
        $scope.reset();
    }]);
var locationTests;
(function (locationTests) {
    var $location;
    /*
     * From https://docs.angularjs.org/api/ng/service/$location
     */
    // given url http://example.com/#/some/path?foo=bar&baz=xoxo
    var searchObject = $location.search();
    // => {foo: 'bar', baz: 'xoxo'}
    function assert(condition) {
        if (!condition) {
            throw new Error();
        }
    }
    // set foo to 'yipee'
    $location.search('foo', 'yipee');
    // => $location
    // set foo to 5
    $location.search('foo', 5);
    // => $location
    /*
     * From: https://docs.angularjs.org/guide/$location
     */
    // in browser with HTML5 history support:
    // open http://example.com/#!/a -> rewrite to http://example.com/a
    // (replacing the http://example.com/#!/a history record)
    assert($location.path() === '/a');
    $location.path('/foo');
    assert($location.absUrl() === 'http://example.com/foo');
    assert($location.search() === {});
    $location.search({ a: 'b', c: true });
    assert($location.absUrl() === 'http://example.com/foo?a=b&c');
    $location.path('/new').search('x=y');
    assert($location.url() === 'new?x=y');
    assert($location.absUrl() === 'http://example.com/new?x=y');
    // in browser without html5 history support:
    // open http://example.com/new?x=y -> redirect to http://example.com/#!/new?x=y
    // (again replacing the http://example.com/new?x=y history item)
    assert($location.path() === '/new');
    assert($location.search() === { x: 'y' });
    $location.path('/foo/bar');
    assert($location.path() === '/foo/bar');
    assert($location.url() === '/foo/bar?x=y');
    assert($location.absUrl() === 'http://example.com/#!/foo/bar?x=y');
})(locationTests || (locationTests = {}));
// NgModelController
function NgModelControllerTyping() {
    var ngModel;
    var $http;
    var $q;
    // See https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$validators
    ngModel.$validators['validCharacters'] = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return /[0-9]+/.test(value) &&
            /[a-z]+/.test(value) &&
            /[A-Z]+/.test(value) &&
            /\W+/.test(value);
    };
    ngModel.$asyncValidators['uniqueUsername'] = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return $http.get('/api/users/' + value).
            then(function resolved() {
            return $q.reject('exists');
        }, function rejected() {
            return true;
        });
    };
}
var $filter;
function testFilter() {
    var items;
    $filter('filter')(items, 'test');
    $filter('filter')(items, { name: 'test' });
    $filter('filter')(items, function (val, index, array) {
        return true;
    });
    $filter('filter')(items, function (val, index, array) {
        return true;
    }, function (actual, expected) {
        return actual === expected;
    });
}
function testCurrency() {
    $filter('currency')(126);
    $filter('currency')(126, '$', 2);
}
function testNumber() {
    $filter('number')(167);
    $filter('number')(167, 2);
}
function testDate() {
    $filter('date')(new Date());
    $filter('date')(new Date(), 'yyyyMMdd');
    $filter('date')(new Date(), 'yyyyMMdd', '+0430');
}
function testJson() {
    var json = $filter('json')({ test: true }, 2);
}
function testLowercase() {
    var lower = $filter('lowercase')('test');
}
function testUppercase() {
    var lower = $filter('uppercase')('test');
}
function testLimitTo() {
    var limitTo = $filter('limitTo');
    var filtered = $filter('limitTo')([1, 2, 3], 5);
    filtered = $filter('limitTo')([1, 2, 3], 5, 2);
    var filteredString = $filter('limitTo')('124', 4);
    filteredString = $filter('limitTo')(124, 4);
}
function testOrderBy() {
    var filtered = $filter('orderBy')([1, 2, 3], 'test');
    filtered = $filter('orderBy')([1, 2, 3], 'test', true);
    filtered = $filter('orderBy')([1, 2, 3], ['prop1', 'prop2']);
    filtered = $filter('orderBy')([1, 2, 3], function (val) { return 1; });
    var filtered2 = $filter('orderBy')(['1', '2', '3'], function (val) { return 1; });
    filtered2 = $filter('orderBy')(['1', '2', '3'], [
        function (val) { return 1; },
        function (val) { return 2; }
    ]);
}
function testDynamicFilter() {
    // Test with separate variables
    var dateFilter = $filter('date');
    var myDate = new Date();
    dateFilter(myDate, 'EEE, MMM d');
    // Test with dynamic name
    var filterName = 'date';
    var dynDateFilter = $filter(filterName);
    dynDateFilter(new Date());
}
function testCustomFilter() {
    var filterCustom = $filter('custom');
    var filtered = filterCustom('test');
}
function parseTyping() {
    var $parse;
    var compiledExp = $parse('a.b.c');
    if (compiledExp.constant) {
        return compiledExp({});
    }
    else if (compiledExp.literal) {
        return compiledExp({}, { a: { b: { c: 42 } } });
    }
}
function parseWithParams() {
    var $parse;
    var compiledExp1 = $parse('a.b.c', function () { return null; });
    var compiledExp2 = $parse('a.b.c', null, false);
}
function doBootstrap(element, mode) {
    if (mode === 'debug') {
        return angular.bootstrap(element, ['main', function ($provide) {
                $provide.decorator('$rootScope', function ($delegate) {
                    $delegate['debug'] = true;
                });
            }, 'debug-helpers'], {
            strictDi: true
        });
    }
    return angular.bootstrap(element, ['main'], {
        strictDi: false
    });
}
function testIHttpParamSerializerJQLikeProvider() {
    var serializer;
    serializer({
        a: 'b'
    });
}
function anyOf2(v1, v2) {
    return Math.random() < 1 / 2 ? v1 : v2;
}
function anyOf3(v1, v2, v3) {
    var rnd = Math.random();
    return rnd < 1 / 3 ? v1 : rnd < 2 / 3 ? v2 : v3;
}
function toPromise(val) {
    var p;
    return p;
}
