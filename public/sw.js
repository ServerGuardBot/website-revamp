/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./sw.ts":
/*!***************!*\
  !*** ./sw.ts ***!
  \***************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/// <reference lib=\"webworker\" />\n// @ts-ignore\nconst resources = [];\nself.addEventListener(\"install\", function(event) {\n    console.log(\"Hello world from the Service Worker \\uD83E\\uDD19\");\n});\nself.addEventListener(\"message\", function(event) {\n    if (event.data.type == \"reloadSession\") {\n        self.clients.matchAll().then(function(clients) {\n            clients.forEach(function(client) {\n                if (event.source && typeof event.source == typeof Client) {\n                    if (client.id == event.source.id) return;\n                }\n                client.postMessage({\n                    type: \"reloadSession\"\n                });\n            });\n        });\n    }\n});\n\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdy50cyIsIm1hcHBpbmdzIjoiO0FBQUEsaUNBQWlDO0FBSWpDLGFBQWE7QUFDYixNQUFNQSxZQUFZQyxLQUFLQyxhQUFhO0FBRXBDRCxLQUFLRSxnQkFBZ0IsQ0FBQyxXQUFXLFNBQVVDLEtBQUs7SUFDOUNDLFFBQVFDLEdBQUcsQ0FBQztBQUNkO0FBRUFMLEtBQUtFLGdCQUFnQixDQUFDLFdBQVcsU0FBVUMsS0FBSztJQUM1QyxJQUFJQSxNQUFNRyxJQUFJLENBQUNDLElBQUksSUFBSSxpQkFBaUI7UUFDcENQLEtBQUtRLE9BQU8sQ0FBQ0MsUUFBUSxHQUFHQyxJQUFJLENBQUMsU0FBVUYsT0FBTztZQUMxQ0EsUUFBUUcsT0FBTyxDQUFDLFNBQVVDLE1BQU07Z0JBQzVCLElBQUlULE1BQU1VLE1BQU0sSUFBSSxPQUFPVixNQUFNVSxNQUFNLElBQUksT0FBT0MsUUFBUTtvQkFDdEQsSUFBSUYsT0FBT0csRUFBRSxJQUFJLE1BQU9GLE1BQU0sQ0FBWUUsRUFBRSxFQUFFO2dCQUNsRDtnQkFDQUgsT0FBT0ksV0FBVyxDQUFDO29CQUFFVCxNQUFNO2dCQUFnQjtZQUMvQztRQUNKO0lBQ0o7QUFDSjtBQXJCZSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zdy50cz9iNjdlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIGxpYj1cIndlYndvcmtlclwiIC8+XG5leHBvcnQgdHlwZSB7fTtcbmRlY2xhcmUgbGV0IHNlbGY6IFNlcnZpY2VXb3JrZXJHbG9iYWxTY29wZTtcblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgcmVzb3VyY2VzID0gc2VsZi5fX1dCX01BTklGRVNUO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnN0YWxsXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICBjb25zb2xlLmxvZyhcIkhlbGxvIHdvcmxkIGZyb20gdGhlIFNlcnZpY2UgV29ya2VyIPCfpJlcIik7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZGF0YS50eXBlID09IFwicmVsb2FkU2Vzc2lvblwiKSB7XG4gICAgICAgIHNlbGYuY2xpZW50cy5tYXRjaEFsbCgpLnRoZW4oZnVuY3Rpb24gKGNsaWVudHMpIHtcbiAgICAgICAgICAgIGNsaWVudHMuZm9yRWFjaChmdW5jdGlvbiAoY2xpZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSAmJiB0eXBlb2YgZXZlbnQuc291cmNlID09IHR5cGVvZiBDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaWVudC5pZCA9PSAoZXZlbnQuc291cmNlIGFzIENsaWVudCkuaWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xpZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogXCJyZWxvYWRTZXNzaW9uXCIgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufSkiXSwibmFtZXMiOlsicmVzb3VyY2VzIiwic2VsZiIsIl9fV0JfTUFOSUZFU1QiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsInR5cGUiLCJjbGllbnRzIiwibWF0Y2hBbGwiLCJ0aGVuIiwiZm9yRWFjaCIsImNsaWVudCIsInNvdXJjZSIsIkNsaWVudCIsImlkIiwicG9zdE1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./sw.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./sw.ts");
/******/ 	
/******/ })()
;