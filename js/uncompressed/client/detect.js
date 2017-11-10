/** Singleton for helping when we want to detect some information.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.detect = function () {
	this.name = 'detect';

	/* Execute the basic detection when loading page */
	if (typeof(document) === 'object') {
        this.baseUrl();

		cause.$(document).ready((function () {
			this.jsVersion();
			this.language();

			cause.include.js(cause.baseUrl + 'js/addons/date.format.js', function () {}, function () {
				cause.alert(cause.localize('missingAddons'), 'date.format.js');
			});
		}).bind(this));
	}
};

/** Find the URL of cause library.
 *
 * @memberOf cause.objects.detect
 */
cause.objects.detect.prototype.baseUrl = function () {
	var minimizeScript = cause.$('script[src*="cause.min.js"]');
	var unminimizeScript = cause.$('script[src*="cause.js"]');

	if (minimizeScript.length > 0) {
		var minimizeUrl = minimizeScript.attr('src');

		cause.baseUrl = minimizeUrl.substr(0, minimizeUrl.indexOf('js/cause.min.js'));

		return null;
	}

	if (unminimizeScript.length > 0) {
		var unminimizeUrl = unminimizeScript.attr('src');

		cause.baseUrl = unminimizeUrl.substr(0, unminimizeUrl.indexOf('js/cause.js'));
	}
};

/** Detect javascript version of browser.
 * All standard browser use minimum version ES5.1
 * Chart made with the page https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/.
 *
 * @memberOf cause.objects.detect
 */
cause.objects.detect.prototype.jsVersion = function () {
	this.supportES();
	this.supportES5();
	this.supportES6();
};

/** Check if the browser support old JavaScript version
 *
 * ECMA-262 Edition 2 = JavaScript 1.3.
 * ECMA-262 Edition 3 = JavaScript 1.5.
 */
cause.objects.detect.prototype.supportES = function () {
	cause.version.js = '1.3';

	if (typeof(Function.arity) !== 'undefined') {
		return null;
	}

	cause.version.js = '1.4';

	if (typeof(Number.prototype.toFixed) !== 'function') {
		return null;
	}

    cause.version.js = '1.5';

    if (typeof(Array.prototype.filter) !== 'function') {
        return null;
    }

    cause.version.js = '1.6';

    if (typeof(Symbol) === 'function') {
        cause.version.js = '1.7';
    }
};

/** Check if the browser support "ES5"
 *
 * ES5 - ECMAScript2009 = JavaScript 1.8.2.
 * ES5.1 - ECMAScript2011 = JavaScript 1.8.5.
 */
cause.objects.detect.prototype.supportES5 = function () {
	if (typeof(Array.prototype.reduce) !== 'function') {
		return null;
	}

	cause.version.js = '1.8';

	if (typeof(String.prototype.trim) !== 'function') {
		return null;
	}

	cause.version.js = 'ES5 (1.8.2)';

	if (typeof(Array.isArray) === 'function') {
		cause.version.js = 'ES5.1 (1.8.5)';
	}
};

/** Check if the browser support "ES6"
 *
 * ES6 - ECMAScript2015
 */
cause.objects.detect.prototype.supportES6 = function () {
	var hasNewFunct = (typeof(Array.prototype.fill) === 'function' && typeof(String.prototype.startsWith) === 'function');
	var hasNewObject = (typeof(Proxy) === 'function' && typeof(Set) === 'function' && typeof(Map) === 'function');

	if (!hasNewFunct || !hasNewObject) {
		return null;
	}

	cause.version.js = 'ES6';
};

/** Detecth if user is in private/incognito mode.
 *
 * @memberOf cause.objects.detect
 * @returns {boolean}
 */
cause.objects.detect.prototype.privateMode = function() {
	try {
		localStorage.test = 2;
	} catch (e) {
		return true;
	}

	return false;
};

/** Find all language of browser.
 *
 * @memberOf cause.objects.detect
 */
cause.objects.detect.prototype.language = function () {
	if (typeof(navigator) === 'object') {
		if (navigator.languages) {
			cause.languages.user = navigator.languages;
		} else {
			cause.languages.user = [(navigator.userLanguage || navigator.language)];
		}

		// First language are used has default
		cause.languages.select = cause.languages.user[0];
	}
};

/** @property {cause.objects.detect} */
cause.detect = new cause.objects.detect();