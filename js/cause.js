/**
 * @copyright CAUSE 2016
 * @author CAUSE
 * @version 1.0
 */
"use strict";

/** Defined the DevExtreme application variable name.
 *
 * @namespace
 */
var myApp = {};

/** Defined the labels variable for every available language.
 *
 * @namespace
 */
var causeAvailableLanguage = {};

/** Main file to define the class "cause".
 * Execute the following command to minimized all file of "/js/uncompressed/".
 * Go inside the "StaticWebContent" folder and run "./compress".
 *
 * @namespace
 * @property {string} baseUrl - Basic URL for the library
 * @property {boolean} debug - True to access to mode debug
 * @property {array} escapeKeys - Keyboard key that we always accept
 * @property {boolean} helpIsOn - True when object is call by help function
 * @property {object} languages - Language specification
 * @property {array} languages.available - All posible language
 * @property {string} languages.select - Selected language
 * @property {array} languages.user - Navigator language
 * @property {string} name - Library name
 * @property {integer} next - Next value for unique ID.
 * @property {Date} time - Time when "cause" is created
 * @property {object} version - Version of used externalPlugins or element
 * @property {string|float|integer} version.cause - Library version
 * @property {string|float|integer} version.js - Detected javascript version
 */
var cause = {
	acceptOldBrowser: {},
    baseUrl: './static/cause-web-content/',
	baseUrlPlugins: '/static/plugins/',
	debug: false,
	escapeKeys: [
		8 /* Backspace */, 9 /* Tabs */, 13 /* Enter */,
		35 /* End */, 36 /* Home */, 46 /* Delete */,
		37 /* Arrow left */, 38 /* Arrow top */, 39 /* Arrow right */, 40 /* Arrow bottom */
	],
	helpIsOn: false,
	languages: {
		available: ['fr', 'en'],
		select: 'fr',
		user: []
	},
	name: 'CAUSE',
	next: 0,
	time: (new Date()),
	version: {
		/* Tag each version of the library here */
		cause: '1.0.0',

		/* Could be redefined if it's included inside HTML */
        cldrjs: '0.4.8',
		devExtreme: '17.1.8',
		jQuery: '3.2.1',
		knockout: '3.4.0',			// Use DevExtreme version

		/* Automatically detected */
		js: '',							// JavaScript version

		/* Plugins version */
        chartJS: '2.1.6',				// Chart generator
        ckeditor: '4.5.11',				// Text editor
        codeMirror: '5.21.0',			// Text editor
        fontAwesome: '4.7.0',			// Font icon
        googleMaps: '3',				// Maps
        jPlayer: '2.9.2',				// Video player
		jsZip: '3.1.2',					// Zip generator
		html2canvas: '0.5.0',			// Image generator
		pdfjs: '1.6.210',				// PDF viewer
        psdjs: '3.1.0',					// PSD viewer
		recordRTC: '5.4.0',				// Audio recording
		tinymce: '4.5.1',				// Text editor
		webAudioRecorderJs: '0.1.1',	// Audio recording
		webodf: '0.5.9',				// Text viewer
        wodoTextEditor: '0.5.9'			// Text editor
	},

	/** Object with all custom create class
	 *
	 * @namespace
	 */
	objects: {},

	/** Executed on a window error.
	 *
	 * @param {object} e - jQuery or browser event
	 */
	error: function (e) {
		if (!e) {
			return null;
		}

		var error = {
			message: (e.originalEvent ? e.originalEvent.message : e.message),
			file: (e.originalEvent ? e.originalEvent.filename : e.filename),
			line: (e.originalEvent ? e.originalEvent.lineno : e.lineno),
			column: (e.originalEvent ? e.originalEvent.colno : e.colno),
			callstack: (this.getFirefoxCallstack(e.originalEvent) || [])
		};

		this.log(error.message + "\n" + 'Line ' + error.line + ' in file ' + error.file, 'error');
	},

	getFirefoxCallstack: function (event) {
		if (!(event && event.stack)) {
			return null;
		}

		var callstack = [];
		var lines = event.stack.split('\n');
		for (var i = 0, j = lines.length; i < j; i++) {
			if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
				callstack.push(lines[i]);
			}
		}

		return callstack;
	},

	/** Redirect the user because is browser is too old.
	 * Actually is call when: jQuery 2 or higher can't be loaded,
	 * MSIE needed to be more then 9,
	 * Gecko needed to be 40 or more,
	 * Webkit needed to be 536 or more.
	 */
	needUpdate: function () {
		if (!cause.helpIsOn) {
			location.href = location.protocol + cause.baseUrl + 'html/browser.html';
        }
	}
};/** Check if script src look to had jQuery.
 */
cause.jQuery = function () {
	if (typeof(document) === 'object') {
		var script = document.querySelectorAll('script[src*=jquery]');

		if (script.length > 0) {
			return true;
		}
	}

	return false;
};

/** Class for replace jQuery when is not loaded.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.jquery = function (selector, context) {
	this.name = 'jquery';
	this.return = [];
	this.return.selector = (selector || (typeof(document) === 'object' ? document : this));
	this.return.context = (context || (typeof(document) === 'object' ? document : this));

	this.buildObject();
	this.addGenericFunction();
	this.addHtmlFunction();
	this.addDomFunction();
	this.addAttributeFunction();
	this.addListenersFunction();
	this.addCssFunction();
};

/** Build basic equivalent jQuery object
 *
 * @memberOf cause.objects.jquery
 */
cause.objects.jquery.prototype.buildObject = function () {
	if (typeof this.return.selector !== 'string' && !(this.return.selector instanceof String)) {
		this.return = [this.return.selector];
	} else if (this.return.selector.substr(0, 1) === '<' && this.return.selector.substr(this.return.selector.length - 1, 1) === '>') {
		var tag = this.return.selector.substr(1, this.return.selector.length - 2);

		if (tag.includes(' ')) {
			this.return = [cause.html.parse(this.return.selector)];
		} else {
			this.return = (typeof(document) === 'object' ? [document.createElement(tag)] : []);
		}
	} else if (typeof(document) === 'object') {
		this.return = this.return.context.querySelectorAll(this.return.selector);
	}
};

cause.objects.jquery.prototype.createSelectorTag = function () {

};

/** Generic jQuery function
 */
cause.objects.jquery.prototype.addGenericFunction = function () {
	this.return.each = (function (query, funct) {
		for (var i = 0, j = query.length; i < j; i++) {
			funct(i, query[i]);
		}

		return query;
	}).bind(this.return.context, this.return);
};

/** HTML jQuery function
 */
cause.objects.jquery.prototype.addHtmlFunction = function () {
	this.return.appendTo = (function (query, selector) {
		query.each(function (nb, elm) {
			cause.$(selector).insert(elm);
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.find = (function (query, selector) {
		var elements = [];

		query.each(function (nb, elm) {
			if (nb === 0) {
				elements = cause.$(selector, elm);
			} else {
				cause.$(selector, elm).each(function (nb2, elm2) {
					elements.push(elm2);
				});
			}
		});

		return elements;
	}).bind(this.return.context, this.return);
	this.return.get = (function (query, key) {
		return (query[key] ? query[key] : null);
	}).bind(this.return.context, this.return);
	this.return.html = (function (query, html) {
		if (html) {
			query.each(function (nb, elm) {
				elm.innerHTML = html;
			});

			return query;
		} else {
			return query[0].innerHTML;
		}
	}).bind(this.return.context, this.return);
	this.return.val = (function (query, value) {
		if (value) {
			query.each(function (nb, elm) {
				elm.value = value;
			});

			return query;
		} else {
			return query[0].value;
		}
	}).bind(this.return.context, this.return);
};

/** DOM jQuery function
 */
cause.objects.jquery.prototype.addDomFunction = function () {
	this.return.append = (function (query, dom) {
		query.each(function (nb, elm) {
			elm.appendChild(dom);
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.remove = (function (query) {
		query.each(function (nb, elm) {
			elm.parentNode.removeChild(elm);
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.replaceWith = (function (query, child) {
		if (!cause.is.element(child)) {
			child = cause.$(child).get(0);
		}

		query.each(function (nb, elm) {
			elm.parentNode.replaceChild(child, elm);
		});

		return query;
	}).bind(this.return.context, this.return);
};

/** Attribute jQuery function
 */
cause.objects.jquery.prototype.addAttributeFunction = function () {
	this.return.attr = (function (query, key, value) {
		if (value) {
			query.each(function (nb, elm) {
				elm.setAttribute(key, value);
			});

			return query;
		} else if (typeof(query[0]) != 'undefined') {
			return query[0].getAttribute(key);
		}
	}).bind(this.return.context, this.return);
	this.return.removeAttr = (function (query, key) {
		query.each(function (nb, elm) {
			if (typeof(elm.addEventListener) === 'function') {
				elm.removeAttribute(key);
			}
		});

		return query;
	}).bind(this.return.context, this.return);
};

/** Listener jQuery function
 */
cause.objects.jquery.prototype.addListenersFunction = function () {
	this.return.click = (function (query, listener) {
		query.each(function (nb, elm) {
			if (typeof(elm.addEventListener) === 'function') {
				elm.addEventListener('click', listener);
			}
		});

		return query;
	}).bind(document, this.return);
	this.return.contextmenu = (function (query, listener) {
		query.each(function (nb, elm) {
			if (typeof(elm.addEventListener) === 'function') {
				elm.addEventListener('contextmenu', listener);
			}
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.on = (function (query, event, listener) {
		query.each(function (nb, elm) {
			if (typeof(elm.addEventListener) === 'function') {
				elm.addEventListener(event, listener);
			}
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.off = (function (query, event, listener) {
		query.each(function (nb, elm) {
			if (typeof(elm.removeEventListener) === 'function') {
				elm.removeEventListener(event, listener);
			}
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.ready = (function (query, listener) {
		query.on('DOMContentLoaded', listener);

		return query;
	}).bind(this.return.context, this.return);
};

/** CSS jQuery function
 */
cause.objects.jquery.prototype.addCssFunction = function () {
	this.return.css = (function (query, name, value) {
		if (!value && typeof(name) !== 'object') {
			return query[0].style[name];
		}

		var css = name;
		if (typeof(name) !== 'object') {
			css[name] = value;
		}

		var setEachStyle = function (key, nb, elm) {
			elm.style[key] = css[key];
		};

		for (var key in css) {
			if (css.hasOwnProperty(key)) {
				query.each(setEachStyle.bind(this, key));
			}
		}
	}).bind(this.return.context, this.return);
	this.return.height = (function (query, height) {
		if (height) {
			query.css('height', height + (cause.is.number(height) ? 'px' : ''));

			return query;
		} else {
			return query[0].getBoundingClientRect().height;
		}
	}).bind(this.return.context, this.return);
	this.return.width = (function (query, width) {
		if (width) {
			query.css('width', width + (cause.is.number(width) ? 'px' : ''));

			return query;
		} else {
			return query[0].getBoundingClientRect().width;
		}
	}).bind(this.return.context, this.return);

	/* Class CSS jQuery function */
	this.return.addClass = (function (query, cls) {
		query.each(function (nb, elm) {
			if (typeof(elm.classList) === 'object') {
				if (!elm.classList.contains(cls)) {
					elm.classList.add(cls);
				}
			} else if (!(' ' + elm.className + ' ').includes(' ' + cls + ' ')) {
				elm.className += ' ' + cls;
			}
		});

		return query;
	}).bind(this.return.context, this.return);
	this.return.hasClass = (function (query, cls) {
		var find = false;

		query.each(function (nb, elm) {
			if (typeof(elm.classList) === 'object') {
				if (elm.classList.contains(cls)) {
					find = true;
				}
			} else if ((' ' + elm.className + ' ').includes(' ' + cls + ' ')) {
				find = true;
			}
		});

		return find;
	}).bind(this.return.context, this.return);
	this.return.removeClass = (function (query, cls) {
		query.each(function (nb, elm) {
			if (typeof(elm.classList) === 'object') {
				if (elm.classList.contains(cls)) {
					elm.classList.remove(cls);
				}
			} else if ((' ' + elm.className + ' ').includes(' ' + cls + ' ')) {
				elm.className = elm.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');
			}
		});

		return query;
	}).bind(this.return.context, this.return);
};

/** Function to replace jQuery.
 * We mostly use this to make usable the librarie without load jQuery.
 * Some of this function are not complet as jQuery, so don't expect the same result.
 *
 * @param {string} selector - Selector for DOM on page
 * @param {object} context - HTML element to use a context, by default we use document
 * @returns {jQuery|object} jQuery return or object to replace some specific function of jQuery
 */
cause.$ = function (selector, context) {
	if (typeof($) === 'function') {
		return $(selector, context);
	} else {
		var jquery = new this.objects.jquery(selector, context);

		return jquery.return;
	}
};/** Show an alert message and try to make it asynchrone.
 *
 * @param {string} message - Message of alert
 * @param {string} title - Title of alert
 */
cause.alert = function (message, title) {
	if (message) {
		if (typeof(DevExpress) === 'object') {
			DevExpress.ui.dialog.alert(message, title);
		} else if (typeof(cause.$) === 'function') {
			var div = cause.$('<div>').addClass('alert-box').html(
				'<div class="dx-desktop-layout-main-menu">' + title + '</div>' +
				'<div class="content">' + message + '</div>' +
				'<div class="buttons"><div>OK</div></div>'
			).appendTo('body');

			div.find('.buttons div').click(function (e) {
				cause.$(e.target).parents('.alert-box').remove();
			});
		} else {
			window.alert(message.stripTags());
		}
	}
};

/** Count element inside an object and/or array
 *
 * @param {object|array} object - Object or array to count
 */
cause.count = function (object) {
	if (typeof(object) == 'undefined') {
		return 0;
	}

	if (typeof(object.length) != 'undefined') {
		return object.length;
	}

	var len = 0;
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			len++;
		}
	}

	return len;
};

/** This function is used when we like to execute a function only once.
 * For optimization we suppose always use this function on event "onresize", "onscroll" and "key*".
 *
 * @param {function} func - Function to execute
 * @param {integer} wait - Delay before execution
 * @tutorial debounce
 */
cause.debounce = function (func, wait) {
	var timeout = null;

	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			func.apply(context, args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (!wait) {
			func.apply(context, args);
		}
	};
};

/** Show an dialog message and try to make it asynchrone.
 *
 * @param {string} message - Message for dialog
 * @param {string} title - String for title
 * @param {array} buttons - Array of object for each button
 */
cause.dialog = function (message, title, buttons) {
    if (!message) {
        return null;
    }

    if (typeof(buttons) === 'function') {
		buttons = [{
			text: cause.localize('ok'),
			onClick: buttons
		},{
			text: cause.localize('cancel')
		}];
	}

    var clickOnButtons = (function (buttons, e) {
        for (var i = 0, j = buttons.length; i < j; i++) {
            if (buttons[i].text === e.target.innerHTML && typeof(buttons[i].onClick) === 'function') {
                buttons[i].onClick([{
                    component: null,
                    element: cause.$(e.target),
                    jQueryEvent: e,
                    validationGroup: null
                }]);
            }
        }

        cause.$(e.target).parents('.alert-box').remove();
    }).bind(this, buttons);

    if (typeof(DevExpress) === 'object') {
        var config = {
            title: title,
            message: message
        };

        config[(parseInt(cause.version.devExtreme) > 15 ? 'toolbarItems' : 'buttons')] = buttons;
        DevExpress.ui.dialog.custom(config).show();
    } else if (typeof(cause.$) === 'function') {
        var btnHtml = '';
        var div = cause.$('<div>').addClass('alert-box');

        for (var i = 0, j = buttons.length; i < j; i++) {
            btnHtml += '<div>' + buttons[i].text + '</div>';
        }

        div.html('<div class="dx-desktop-layout-main-menu">' + title + '</div><div class="content">' + message + '</div><div class="buttons">' + btnHtml + '</div>').appendTo('body');
        div.find('.buttons div').click(clickOnButtons);
    } else if (confirm(message.stripTags())) {
        buttons[i].onClick();
    }
};

/** Open email application with with predefined data.
 *
 * @param {string} to - Email to send
 * @param {string} subject - Subject of email
 * @param {string} body - Content of email
 */
cause.email = function (to, subject, body) {
	if (!to) {
        return null;
    }

    var url = 'mailto:' + to + '?subject=' + (subject ? subject : 'cause.js - email');

    if (body) {
        url += '&body=' + body;
    }

    cause.$('<a>').attr('href', url).get(0).click();
};

/** Extend an object with an other.
 *
 * @param {object} 0 - Object who receive all other value
 * @param {object} 1 - Object with the default value
 * @param {object} 2 - Object to copy
 * @returns {object} First argument with all other value
 */
cause.extend = function () {
    for (var i=1, j=arguments.length; i < j; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
			}
		}
	}

    return arguments[0];
};

/** Extends an object for devextreme
 *
 * @param {object} d - Object with the default value
 * @param {object} b - Object to copy
 */
cause.extends = function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	__.prototype = b.prototype;
	d.prototype = new __();
};

/** Create a new hotkeys.
 *
 * @param {string} selector - jQuery selector for element
 * @param {string} event - Event on we want the handler (keypress, keydown, keyup)
 * @param {string} keys - String of keys we need press
 * @param {function} handler - Function to execute when hotkeys is use
 */
cause.hotkeys = function (selector, event, keys, handler) {
	if (typeof(jQuery.hotkeys) === 'object') {
		$(selector).on(event, null, keys, handler);
	} else if (typeof($) != 'function') {
		cause.include.js(cause.baseUrlPlugins + 'jQuery/jquery-' + cause.version.jQuery + '.min.js', function () {
			cause.hotkeys(selector, event, keys, handler);
		}, function () {
			cause.alert(cause.localize('missingPlugins'), 'jquery.js');
		});
	} else {
		cause.include.js(cause.baseUrl + 'js/addons/jquery.hotkeys.js', function () {
			$(selector).on(event, null, keys, handler);
		}, function () {
			cause.alert(cause.localize('missingAddons'), 'jquery.hotkeys.js');
		});
	}
};

/** This function is used to check if the connected user has access to specific system feature.
 *
 * @param {string} permissionName - Name of permission to check
 */
cause.permission = function (permissionName) {
	if (!myApp.access) {
		return false;
	}

    if (!typeof(myApp.access.includes) == 'function') {
		return false;
    }

    return myApp.access.includes(permissionName);
};

/** Print one DIV of page
 *
 * @param {DomElement} div - DIV to print
 */
cause.print = function (div) {
	var element = $(div);

	if (element.length == 0) {
		return;
	}

    element.addClass('only-div-to-print');

    window.print();

    setTimeout(function () {
        element.removeClass('only-div-to-print');
	}, 1000);
};

/** Sleep code during the specified time.
 * We not recommanded to use this function for  more than 1 second.
 *
 * @param {integer} milliseconds - Sleeping time
 */
cause.sleep = function (milliseconds) {
	var start = new Date().getTime();

	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
};

/** Return an auto increment ID.
 *
 * @returns {string} New ID
 */
cause.unique = function () {
	this.next++;

	return 'cause-' + this.next;
};

/** Generate an UUID.
 *
 * @returns {string} New UUID
 */
cause.uuid = function () {
	function S4() {
		return parseInt((1+Math.random())*0x10000).toString(16).substring(1);
	}

	return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
};

/** This function is used when we like to execute a function only once and we don't known each time is execute.
 *
 * @param {function} func - Function to execute
 * @param {integer} wait - Delay before execution
 */
cause.wait = function (func, wait) {
	clearTimeout(this.wait_timeout);

	if (func) {
		if (!wait) {
			func.apply(this);
		} else {
			this.wait_timeout = setTimeout((function () {
				clearTimeout(this.wait_timeout);

				func.apply(this);
			}).bind(this), wait);
		}
	};
};

/* Set some variable before start and setup a function to catch error! */
if (typeof(window) === 'object') {
	cause.$(window).on('error', cause.error.bind(cause));
	cause.$(document).ready((function () {
		this.debug = (this.location.getQueryUrl('debug') || this.debug);
		this.version.jQuery = (typeof($) === 'function' ? $.fn.jquery : this.version.jQuery);
		this.version.knockout = (typeof(ko) === 'object' ? ko.version : this.version.knockout);
		this.version.devExtreme = (typeof(DevExpress) === 'object' ? DevExpress.VERSION : this.version.devExtreme);
	}).bind(cause));
} else if (typeof(module) === 'object' ) {
	module.exports = cause;
}/** Singleton for helping when we process to color
 *
 * @namespace
 * @memberOf cause
 */
cause.color = {
	/** Show help when is cause.help('color') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.color":', 'help_title');
		cause.log("\t" +
			'cause.color.hslToRgb() = Convert HSL vers RGB', 'help');
	},

	/** Convert HSL to RGB
	 *
	 * @param {integer} h
	 * @param {integer} s
	 * @param {integer} l
	 * @returns {array} RGB
	 */
	hslToRgb: function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            var hue2rgb = function (p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	}
};/** Class for helping with console.
 * This class detect if the developer console is open.
 * If the property "block" is true, we redirect the visitor to another page.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.console = function () {
    this.name = 'console';
    this.time = 2;
    this.open = false;
    this.block = false;
    this.nbTest = 0;
    this.interval = null;
    this.orientation = '';

    /* Execute the basic detection when loading page */
    if (typeof(document) === 'object') {
        cause.$(document).ready((function () {
            cause.on('resize', this.detect.bind(this));
            cause.on('devtoolschange', this.change.bind(this));

            this.detect();

            if (this.block && !cause.debug) {
                this.interval = setInterval(this.eachInterval.bind(this), this.time * 1000);
            }
        }).bind(this));
    }
};

/** Show help when is cause.help('console') is call.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.help = function () {
    cause.log('Aide pour "cause.console":', 'help_title');
    cause.log("\t" +
        'cause.console.detect() = Test à savoir si les outils de développement sont ouvert', 'help' );
};

/** Function executed on every interval to test if console is open.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.eachInterval = function () {
    if (!this.open || this.nbTest > 3) {
        this.nbTest = 0;
        this.detectWithProfile();
        this.detectWithPrintingImage();
    } else {
        this.nbTest++;
    }
};

/** Redirect the user if the developer tools is detected.
 *
 * @memberOf cause.objects.console
 * @param {boolean} enable - True if detected
 */
cause.objects.console.prototype.change = function (enable) {
    if (this.block && !cause.debug) {
        var url = (cause.baseUrl.indexOf('.') === 0 ? cause.baseUrl.substr(1) : cause.baseUrl);
        var isin_doc = location.pathname.includes(url + 'html/index.html');

        if (enable && !isin_doc) {
            location.href = cause.baseUrl + 'html/index.html#devtools';
        }
    }
};

/** Detect if a developer console is open.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detect = function () {
    this.detectWithSize();
    this.detectWithProfile();
    this.detectWithPrintingImage();

    return this.open;
};

/** Use the screen size to detect if a developer tools is open.
 * This detection work when developer tools is docked.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detectWithSize = function () {
    var widthThreshold = (window.outerWidth - window.innerWidth > 30);
    var heightThreshold = (window.outerHeight - window.innerHeight > 160);
    var orientation = (widthThreshold ? 'vertical' : (heightThreshold ? 'horizontal' : '' ));

    if (widthThreshold || heightThreshold) {
        if (!this.open || this.orientation !== orientation) {
            cause.listeners.execute('devtoolschange', true, orientation);
        }

        this.open = true;
    } else {
        if (this.open) {
            cause.listeners.execute('devtoolschange', false, '');
        }

        this.open = false;
    }

    this.orientation = orientation;
}

/** Use the console.profile() to detect if a developer console is open.
 * console.profiles has been remove from webkit, we can't use this method anymore.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detectWithProfile = function () {
    if (typeof(console.profiles) === 'object') {
        console.profile();
        console.profileEnd();

        if (this.block && !cause.debug && typeof(console.clear) === 'function') {
            console.clear();
        }

        if (console.profiles.length > 0 && !this.open) {
            cause.listeners.execute('devtoolschange', true, this.orientation || 'undock');
        } else if (console.profiles.length === 0 && this.open) {
            cause.listeners.execute('devtoolschange', false, '');
        }

        this.open = (console.profiles.length > 0);
    }
};

/** Use the print in console of image to detect if a developer console is open.
 * In chrome the developer tools always get the ID of print image.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detectWithPrintingImage = function () {
    if (!this.image) {
        this.image = new Image();
        this.image.__defineGetter__('id', (function () {
            /* If this is execute, a developer tools is detected */
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            if (!this.open) {
                cause.listeners.execute('devtoolschange', true, this.orientation || 'undock');
            }

            this.orientation = (this.orientation || 'undock');
            this.timeout = null;
            this.open = true;
        }).bind(this));
    }

    this.timeout = setTimeout((function () {
        /* If timeout is executed, there is no developer tools detected */
        clearTimeout(this.timeout);

        if (this.open) {
            cause.listeners.execute('devtoolschange', false, '');
        }

        this.orientation = '';
        this.timeout = null;
        this.open = false;
    }).bind(this), (this.time * 800));

    if (!cause.helpIsOn) {
        console.log('Log image to test devtools', this.image);
    }

    if (this.block && !cause.debug && typeof(console.clear) === 'function') {
        console.clear();
    }
};

/** @property {cause.objects.console} */
cause.console = new cause.objects.console();/** Singleton for helping when we use cookie.
 *
 * @namespace
 * @memberOf cause
 */
cause.cookie = {
	/** Show help when is cause.help('cookie') is call.
	 */
	help: function () {
		cause.log('Aide pour "cause.cookie":', 'help_title');
		cause.log("\t" +
			'cause.cookie.get(nom) = Retourne la valeur du cookie' + "\n\t" +
			'cause.cookie.remove(nom, [[url], domain]) = Retourne la valeur du cookie' + "\n\t" +
			'cause.cookie.set(nom, valeur, [[[[expires], url], domain], secure]) = Crée ou change la valeur d\'un cookie', 'help');
	},

	/** Return the cookie value
	 *
	 * @param {string} name - Name of cookie
	 */
	get: function (name) {
		var start = document.cookie.indexOf(name + '=');
		var len = start + name.length + 1;

		if ((!start) && (name !== document.cookie.substring(0, name.length))) {
			return null;
		}

		if (start === -1) {
			return null;
		}

		var end = document.cookie.indexOf(';', len);

		if (end === -1) {
			end = document.cookie.length;
		}

		return document.cookie.substring(len, end);
	},

	/** Delete a cookie

	 * @param {string} name - Name of cookie
	 * @param {string} path - Url where cookie is available
	 * @param {string} domain - Domain where cookie is available
	 */
	remove: function (name, path, domain) {
		if (this.get(name)) {
			document.cookie = name + '=' +
				(path ? ';path=' + path : '') +
				(domain ? ';domain=' + domain : '') +
				';expires=Thu, 01-Jan-1970 00:00:01 GMT';
		}
	},

	/** Format date
	 *
	 * @param {string} name - Name of cookie
	 * @param {string} value - Value of cookie
	 * @param {integer} expires - Number of days the cookie is valid
	 * @param {string} path - Url where cookie is available
	 * @param {string} domain - Domain where cookie is available
	 * @param {boolean} secure - True if cookie is secure
	 */
	set: function (name, value, expires, path, domain, secure) {
		if (expires) {
			expires = expires * 1000 * 60 * 60 * 24;
		}

		var today = new Date();
		var expires_date = new Date(today.getTime() + (expires));

		document.cookie = name + '=' + value +
			(expires ? ';expires=' + expires_date.toGMTString() : '') +
			(path ? ';path=' + path : '') +
			(domain ? ';domain=' + domain : '') +
			(secure ? ';secure' : '');
	}
};
/** Singleton for helping when we process to date
 *
 * @namespace
 * @memberOf cause
 */
cause.date = {
	/** Show help when is cause.help('date') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.date":', 'help_title');
		cause.log("\t" +
			'cause.date.parse("string date") = Convertie une chaine de caractère en objet date' + "\n\t" +
			'cause.date.format(date, format, [UTC]) = Convertie une date dans un format spécifique', 'help');
	},

	/** Return a date object from a string
	 *
	 * @param {string} date - String of date
	 */
	parse: function (date) {
		var time = new Date(date);
		
		if (!isNaN(time.getTime())) {
			return time;
        }

        return this.parseGMT(date);
	},

	parseGMT: function (date) {
        var time = new Date(date.replaceAll(' ', 'T') + 'Z');

        if (!isNaN(time.getTime())) {
            return time;
        }

        return this.parseString(date);
	},

	parseString: function (date) {
		var info = date.replaceAll(' ', '-').replaceAll(':', '-').replaceAll('/', '-').split('-');

		time = new Date();
		time.setFullYear(info[0]);
		time.setMonth(parseInt(info[1]) + 1);
		time.setDate(info[2]);
		time.setHours(info[3]);
		time.setMinutes(info[4]);
		time.setSeconds(info[5]);
		time.setMilliseconds(0);

		time.setUTCFullYear(info[0]);
		time.setUTCMonth(parseInt(info[1]) + 1);
		time.setUTCDate(info[2]);
		time.setUTCHours(info[3]);
		time.setUTCMinutes(info[4]);
		time.setUTCSeconds(info[5]);
		time.setUTCMilliseconds(0);

        return time;
	},

	/** Format date
	 *
	 * @param {string} date - Date string
	 * @param {string} format - Format of date
	 * @param {boolean} utc - True for UTC date
	 * @returns {string} New date string
	 */
	format: function (date, format, utc) {
		return dateFormat(date, format, utc);
	}
};/** Class for helping for file treatment.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.file = function (config) {
	this.name = 'file';
	this.config = cause.extend({}, {
		file: '',
		local: false
	}, (config || {}));
};

/** Show help when is cause.help('file') is call
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.help = function () {
	cause.log('Aide pour "cause.objects.file":', 'help_title');
	cause.log("\t" +
		'new cause.objects.file(config);' + "\n\n\t" +
		'config.file = Complete path of file to use' + "\n\t" +
        'config.local = True to search on local computer (only with nodejs)', 'help');
};

/** Read content of file
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.read = function (callback) {
	if (this.config.local) {
        return cause.log('Not implemented yet', 'warn');
    }

    var onExternalServer = false;
	if (this.config.file.indexOf('://') > -1) {
        var name = this.config.file.substr(this.config.file.indexOf('://') + 3).split('/');

        onExternalServer = (name[0] != location.host);
	}

	if (onExternalServer) {
        return this.readFromExternalServer(callback);
	}

	this.readFromSameServer(callback);
};

cause.objects.file.prototype.readFromExternalServer = function (callback) {
    var element = $('<iframe>').attr('src', this.config.file);

    element.on('load', (function (callback, e) {
		cause.log('todo : save iframe of external URL');
	}).bind(this, callback));
    element.appendTo('body');
};

cause.objects.file.prototype.readFromSameServer = function (callback) {
    cause.ajax({
        url: this.config.file,
        method: 'GET',
        dataType: 'blob',
        progress: this.onProgress.bind(this),
        success: this.onLoaded.bind(this, callback),
        error: this.onError.bind(this)
    });
};

/** Execute when the request send error
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.onError = function () {
    cause.log('File: file not found', 'error');
};

/** Execute when the request send progress information
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.onProgress = function (e, percentage) {
    console.log(percentage);
};

/** File is read
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.onLoaded = function (callback, content, status) {
	if (status != 'success') {
        cause.log('File: error on reading file', 'error');
        return;
    }

	if (!callback) {
        cause.log('File: you need to pass a callback function to receive file content', 'warn');
		return;
    }

	callback(content);
};/** Singleton for helping when we format some string.
 *
 * @namespace
 * @memberOf cause
 */
cause.format = {
	/** Show help when is cause.help('format') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.format":', 'help_title');
		cause.log("\t" +
			'cause.format.meter(meter) = Convertie un nombre de mètre en KM' + "\n\t" +
			'cause.format.date(date, format, [UTC]) = Convertie une date dans un format spécifique', 'help');
	},

	/** Format date
	 *
	 * @param {string} date - Date string
	 * @param {string} format - Format of date
	 * @param {boolean} utc - True for UTC date
	 * @returns {string} New date string
	 */
	date: cause.date.format,

	/** Return formatted meter.
	 *
	 * @param {integer} meter - Number of total meter
	 * @returns {string} Number of meter with abbreviation
	 */
	meter: function (meter) {
		meter = parseInt(meter);

		if (meter) {
			if (meter > 1000) {
				var km = (Math.round(meter / 100) / 10);
				
				return km + ' km';
			}
	
			return meter + ' m';
		}
	},

	/** Return formatted speed transfer.
	 *
	 * @param {integer} speedBps -Transfered bits
	 * @returns {string} transfer speed
	 */
	speed: function (speedBps) {
		if (speedBps < 1024) {
			return speedBps.toFixed(2) + ' Bps';
		}

		var speedKbps = (speedBps / 1024);
		if (speedKbps < 1024) {
			return speedKbps.toFixed(2) + ' Kbps';
		}

		var speedMbps = (speedKbps / 1024);
		if (speedMbps < 1024) {
			return speedMbps.toFixed(2) + ' Mbps';
		}

		return (speedMbps / 1024).toFixed(2) + ' Gbps';
	},

	/** Return formatted time.
	 */
	time: function (totalSeconds, format) {
		var time = new Date();
		var hours   = Math.floor(totalSeconds / 3600);
		var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		time.setHours(hours);
		time.setMinutes(minutes);
		time.setSeconds(seconds);

		return this.date(time, format || 'H:MM:ss');
	}
};/** Function for helping to use cause library.
 *
 * @memberOf! cause
 * @function
 * @param {string} module - String to specify a module to show help
 */
cause.help = (function () {
	/** Check it a specific module exist
	 *
	 * @param {string} module - Name of module to check
	 * @returns {boolean}
	 */
	var isModule = function (module) {
		var selectedModule = (cause.objects[module] || cause[module]);

		if (typeof(selectedModule) === 'object') {
			if (selectedModule !== null && !(selectedModule instanceof Date) && !(selectedModule instanceof Array)) {
				return true;
			}
		} else if (typeof(selectedModule) === 'function') {
			var instanceModule = new selectedModule();

			if (instanceModule.name === module) {
				return true;
			}
		}

		return false;
	};

	/** Convert some text to HTML
	 *
	 * @param {string} str - Text to convert
	 * @returns {string}
	 */
	var toHtml = function (str) {
		str = str.replaceAll("\n", '<br />');
		str = str.replaceAll("\t", ' &nbsp; &nbsp;');

		return str;
	};

	/** Show all information of one module
	 *
	 * @param {string} module - Name of module
	 */
	var showModule = function(module) {
		var obj = (cause.objects[module] || cause[module]);
		var listOfFuncts = '';

		if (typeof(obj) === 'function') {
			obj = new obj();
		}
		if (typeof(obj.help) === 'function') {
			obj.help();
		}

		for (var i in obj) {
			if (typeof(obj[i]) === 'function' && i !== 'help' && i.substr(0, 1) !== '_') {
				listOfFuncts += (listOfFuncts ? "\n" : '') + "\t" + 'cause.' + module + '.' + i + '();';
			}
		}

		if (cause.console.detect()) {
			cause.log('Liste des fonctions pour le module "cause.' + module + '":', 'help_title');
			cause.log(listOfFuncts, 'help');
		} else {
			cause.alert('<b>Liste des fonctions pour le module "cause.' + module + '":</b><br />' + toHtml(listOfFuncts), this.title);
		}
	};

	var showCause = function () {
		var listOfFuncts = '';
		var listOfModules = '';

		for (var i in cause) {
			if (i !== 'help' && i !== 'languages' && i !== 'version') {
				if (isModule(i)) {
					listOfModules += (listOfModules ? "\n" : '') + "\t" + 'cause.' + i;
				} else if (typeof(cause[i]) === 'function') {
					listOfFuncts += (listOfFuncts ? "\n" : '') + "\t" + 'cause.' + i + '();';
				}
			}
		}

		// Print list of every modules we can use.
		if (cause.console.detect()) {
			cause.log('Aide général pour la librairie "cause":', 'help_title');
			cause.log('Liste des fonctions:', 'help_title');
			cause.log(listOfFuncts, 'help');
			cause.log('Liste des modules:', 'help_title');
			cause.log(listOfModules, 'help');
			cause.log('Pour avoir d\'avantage d\'aide à propos d\'un module utilisé la commande "cause.help(\'module\')"', 'help_title');
		} else {
			cause.alert('<div style="height:200px;overflow:auto;">' +
				'<b>Aide général pour la librairie "cause":</b><br />' +
				'<b>Liste des fonction:</b><br />' + toHtml(listOfFuncts) + '<br />' +
				'<b>Liste des modules:</b><br />' + toHtml(listOfModules) + '<br />' +
				'<b>Pour avoir d\'avantage d\'aide à propos d\'un module utilisé la commande "cause.help(\'module\')"</b></div>', this.title);
		}
	};

	/** Show all information
	 *
	 * @param {string} module - Name of module
	 */
	var show = function (module) {
		if (typeof(console.clear) === 'function') {
			console.clear();
		}

		if (module) {
			if (isModule(module)) {
				showModule(module);
			} else if (cause.console.detect()) {
				cause.log('Le module "cause.' + module + '" ne semble pas exister!', 'help_title');
			} else {
				cause.alert('<b>Le module "cause.' + module + '" ne semble pas exister!</b>', this.title);
			}
		} else {
			showCause();
		}
	};

	return function (module) {
		this.name = 'help';
		this.title = cause.localize('help');

		cause.helpIsOn = true;
		show(module);
		cause.helpIsOn = false;
	};
}());
/** Singleton for helping for html.
 *
 * @namespace
 * @memberOf cause
 */
cause.html = {
	/** Show help when is cause.help('html') is call.
	 **/
	help: function () {
		cause.log('Aide pour "cause.html":', 'help_title');
		cause.log("\t" +
			'cause.html.autoSize(node element) = Automatiquement définir la grandeur d\'un élément', 'help');
	},

	/** Automaticaly resize a html element.
	 *
	 * @param {HTMLElment} elm: Element to automatically resize with is content
	 */
    autoSize: function (elm) {
        var div = document.createElement('div');

        div.style.visibility = 'hidden';
        div.style.position = 'absolute';
        div.style.width = elm.offsetWidth;
        div.innerHTML = elm.value.replace(/\n/g, '<br>');

        document.body.appendChild(div);
        elm.style.height=(div.offsetHeight + 22) + 'px';
        div.parentNode.removeChild(div);
    },

	createTagHTML: function (tagName, attrs) {
		var tag = document.createElement(tagName);

		if (attrs) {
			for (var attr in attrs) {
				switch(attr) {
					case 'onload':
                    case 'onerror':
						tag[attr] = attrs[attr];
						break;
					default:
                        if (attrs.hasOwnProperty(attr)) {
                            tag.setAttribute(attr, attrs[attr]);
                        }
				}
			}
		}

		return tag;
	},

	/** Return the position of cursor
	 */
	getCaretPosition: function () {
		var isTextTag = (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT'));

		if (window.getSelection && isTextTag) {
			return (document.activeElement.selectionStart || 0 );
		}

		return 0;
	},

	/** Return the selected tag or text
	 */
	getSelection: function () {
        if (window.getSelection) {
		    if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
				return {
					selectionStart: document.activeElement.selectionStart,
					selectionEnd: document.activeElement.selectionEnd
				};
            } else {
		        return window.getSelection();
            }
        }

		return false;
	},

	/** Set the selected text
	 */
	setSelection: function (element, start, length) {
        if (window.getSelection) {
			var domToSetSelection = (element || document.activeElement);
			var lengthOfSelection = (length || 0);

		    if (domToSetSelection && (domToSetSelection.tagName === 'TEXTAREA' || domToSetSelection.tagName === 'INPUT')) {
				domToSetSelection.selectionStart = start;
				domToSetSelection.selectionEnd = start + lengthOfSelection;
            }
        }
	},

	/** Convert HTML to a DOM element.
	 *
	 * @param {string} html - Code HTML to convert
	 * @returns {HTMLElement} Dom element
	 */
	parse: function (html) {
		var dom = document.createElement('div');

		dom.innerHTML = html;

		return (dom.childNodes && dom.childNodes.length > 0 ? dom.childNodes[0] : null);
	}
};
/** Singleton for helping with image.
 *
 * @namespace
 * @memberOf cause
 */
cause.image = (function () {
	var toDataUrlFromFileReader = function (url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();

            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', url);
        xhr.send();
    };

	var toDataUrlFromCanvas = function () {
        var img = new Image();
        var canvas = document.createElement('canvas');

        img.crossOrigin = 'anonymous';
        img.onload = function () {
            canvas.height = this.height;
            canvas.width = this.width;
            canvas.getContext('2d').drawImage(this, 0, 0);

            callback(canvas.toDataURL('image/png'));
        };

        img.src = url;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = url;
        }
    };

	/** Show help when is cause.help('image') is call
	 */
	var help = function () {
		cause.log('Aide pour "cause.image":', 'help_title');
		cause.log("\t" +
			'cause.image.toDataUrl(url, callback) = Convert image to dataurl', 'help');
	};

	/** Convert an image to a dataurl.
	 *
	 * @param {string} url - URL of image
	 * @param {function} callback - function to execute when convert is finish
	 */
	var toDataUrl = function (url, callback) {
		if (typeof(FileReader) == 'function') {
            toDataUrlFromFileReader(url, callback);
		} else {
            toDataUrlFromCanvas(url, callback);
		}
	};

	return function() {
	    this.help = help;
	    this.toDataUrl = toDataUrl;
    };
}());
/** Class for helping with including file
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.include = function () {
    this.loadedJS = {};
    this.loadedCSS = {};

    /** Function for helping to swith version.
     *
     * @deprecated
     * @param {array|string} url - File URL or an array of URL
     */
    cause.loadCSS = function (url) {
        if (!cause.helpIsOn) {
            cause.log('Use cause.include.css() instead of cause.loadCSS()', 'warn');
        }

        cause.include.css(url);
    };

    /** Function for helping to swith version.
     *
     * @deprecated
     * @param {array|string} url - File URL or an array of URL
     */
    cause.loadJS = function (url, callback, error) {
        if (!cause.helpIsOn) {
            cause.log('Use cause.include.js() instead of cause.loadJS()', 'warn');
        }

        cause.include.js(url, callback, error);
    };
};

/** Show help when is cause.help('include') is call.
 *
 * @memberOf cause.objects.include
 */
cause.objects.include.prototype.help = function () {
    cause.log('Aide pour "cause.include":', 'help_title');
    cause.log("\t" +
        'cause.include.css(url) = Include CSS file on page' + "\n\t" +
        'cause.include.js(url, callback) = Include JS file on page', 'help');
};

/** Load a specific link file (CSS, HTML).
 *
 * @memberOf cause.objects.include
 * @param {string} url - File URL or an array of URL
 */
cause.objects.include.prototype.css = function (url, callback, error) {
    if (!url) {
        return null;
    }

    var time = (new Date()).getTime();

    url = (cause.is.array(url) ? url : [url]);

    this.loadedCSS[time] = {
        loaded: 0,
        error: 0,
        total: 0,
        finish: this.allUrlIsLoaded.bind(this, 'loadedCSS', time, callback, error)
    };

    for (var i=0, j=url.length; i<j; i++) {
        var attrs = (typeof(url[i]) != 'object' ? {href: url[i]} : url[i]);

        if (attrs.href.includes('.html') || attrs.href.includes('.css')) {
            this.loadedCSS[time].total++;

            attrs = cause.extend({}, {
                rel: (attrs.href.includes('.html') ? 'dx-template' : 'stylesheet'),
                type: (attrs.href.includes('.html') ? 'text/html' : 'text/css'),
                onerror: this.onError.bind(this, 'loadedCSS', time, attrs.href),
                onload: this.onLoad.bind(this, 'loadedCSS', time, attrs.href)
            }, attrs);

            document.getElementsByTagName('head')[0].appendChild(cause.html.createTagHTML('link', attrs));
        }
    }
};

/** Load a specific script file.
 *
 * @memberOf cause.objects.include
 * @param {array|string} url - File URL or an array of URL
 * @param {function} callback - Function to execute when file is loaded
 * @param {function} error - Function to execute when file can't be load
 */
cause.objects.include.prototype.js = function (url, callback, error) {
    if (!url) {
        return null;
    }

    var time = (new Date()).getTime();

    url = (cause.is.array(url) ? url : [url]);

    this.loadedJS[time] = {
        loaded: 0,
        error: 0,
        total: 0,
        finish: this.allUrlIsLoaded.bind(this, 'loadedJS', time, callback, error)
    };

    for (var i = 0, j = url.length; i < j; i++) {
        if (url[i].includes('.js') || url[i].includes('/jsapi') || url[i].includes('/api.') || url[i].includes('/api/')) {
            this.loadedJS[time].total++;

            var attrs = {
                src: url[i],
                type: 'text/javascript',
                onerror: this.onError.bind(this, 'loadedJS', time, url[i]),
                onload: this.onLoad.bind(this, 'loadedJS', time, url[i])
            };
            var tag = cause.html.createTagHTML('script', attrs);

            if (tag.readyState) {
                tag.onreadystatechange = this.onReadyStateChange.bind(this, tag, 'loadedJS', time, url[i]);
            }

            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    }
};

cause.objects.include.prototype.allUrlIsLoaded = function (loadedType, time, callback, error, url) {
    if (this[loadedType][time].loaded === this[loadedType][time].total) {
        if (loadedType === 'loadedCSS') {
            cause.log('Callback on CSS work!', 'warn');
        }

        if (this[loadedType][time].error > 0) {
            if (typeof(error) === 'function') {
                error();
            } else {
                cause.log('File "' + url + '" cannot be found!', 'error');
            }
        } else if (typeof(callback) === 'function') {
            callback(time);
        }
    }
};

cause.objects.include.prototype.onReadyStateChange = function (tag, loadedType, time, url) {
    if (tag.readyState === 'loaded' || tag.readyState === 'complete') {
        tag.onreadystatechange = null;

        this.loadedJS[time].loaded++;
        this.loadedJS[time].finish(url);
    }
};

cause.objects.include.prototype.onLoad = function (loadedType, time, url) {
    this[loadedType][time].loaded++;
    this[loadedType][time].finish(url);
};

cause.objects.include.prototype.onError = function (loadedType, time, url) {
    this[loadedType][time].loaded++;
    this[loadedType][time].error++;
    this[loadedType][time].finish(url);
};

/** @property {cause.objects.include} */
cause.include = new cause.objects.include();/** Singleton for helping to detect some object.
 *
 * @namespace
 * @memberOf cause
 */
cause.is = {
	/** Show help when is cause.help('is') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.is":', 'help_title');
		cause.log("\t" +
			'cause.is.array(var) = Test si la variable est un array' + "\n\t" +
			'cause.is.browser(var, [version]) = Test si le navigateur utilisé est "var" et en plus si la version est égale ou plus récente' + "\n\t" +
			'cause.is.element(var) = Test si la variable est un "HTMLElement"' + "\n\t" +
			'cause.is.number(var) = Test si la variable est un nombre' + "\n\t" +
			'cause.is.string(var) = Test si la variable est une chaîne de caractère' + "\n\t" +
			'cause.is.tag(var, [tag]) = Test si la variable est un "HTMLElement" d\'un tag specific', 'help' );
	},

	/** Validate if a value is a array
	 *
	 * @param {mixed} array - Value to validate
	 */
    array: function (array) {
        return Object.prototype.toString.call(array) === '[object Array]';
    },

	/** Validate if user use a specific browser.
	 *
	 * @param {string} browser - Check if it is this browser
	 * @param {integer} version - Check if it is this browser version or newer
	 */
    browser: function (browser, version) {
        if (version && cause.browser[browser.toLowerCase()]) {
            return (cause.browser.major >= version);
        }

        return cause.browser[browser.toLowerCase()];
    },

	/** Check if object is a HTML Element.
	 *
	 * @param {mixed} obj - Object to test
	 * @returns True if the object is a HTML Element
	 */
    element: function (obj) {
  		if (typeof(HTMLElement) === 'object') {
  			return (obj instanceof HTMLElement);
  		} else {
    		return (obj && typeof(obj) === 'object' && obj.nodeType === 1 && typeof(obj.nodeName) ===  'string');
		}
	},

	/** Validate if a value is a number.
	 *
	 * @param {mixed} number - Value to validate
	 */
	number: function (number) {
		return !isNaN(parseFloat(number)) && isFinite(number);
	},

	/** Validate if a value is a string.
	 *
	 * @param {mixed} str: Value to validate
	 */
	string: function (str) {
		if (typeof str === 'string' || str instanceof String) {
			return true;
		}

		return false;
	},

	/** Validate if a object is a specific tag name.
	 *
	 * @param {mixed} obj - Object to test
	 * @param {string} tagName - Check if it is this tag name
	 */
	tag: function (obj, tagName) {
		if (this.element(obj) && tagName) {
			return (obj.nodeType.toLowerCase() === tagName.toLowerCase());
		}

		return this.element(obj);
	}
};
/** Singleton for helping to process JSON.
 *
 * @namespace
 * @memberOf cause
 */
cause.json = {
	/** Show help when is cause.help('json') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.json":', 'help_title');
		cause.log("\t" +
			'cause.json.parse(var); Return l\'object ou false si la chaine n\'est pas un JSON', 'help');
	},

	/** Stringify an object.
	 *
	 * @param {mixed} obj - Object to stringify
	 * @returns JSON string
	 */
	convert: function (obj) {
		if (typeof(obj) == 'object') {
			obj = JSON.stringify(obj);
		}

		return obj;
	},

	/** Function to parse string even if is not a JSON.
	 *
	 * @param {string} str - String to parse
	 * @returns JSON object
	 */
	parse: function (str) {
		try {
      	    return JSON.parse(str);
    	} catch(err) {
        	return str || false;
    	}
	}
};
/** Class for helping to use label.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.labels = function () {
	this.name = 'labels';

	/** Set generic labels for the library cause.
	 *
	 * @deprecated
	 */
	cause.loadLabels = function () {
		if (!cause.helpIsOn) {
			cause.log('Use cause.labels.load() instead of cause.loadLabels()', 'warn');
		}

		cause.labels.load();
	};

	/** Shortcut for "cause.objects.labels.set".
	 *
	 * @param {string} language - Language of label to use
	 * @param {function} callback - Function to execute after set a language
	 */
	cause.locale = this.set.bind(this);

	/** Shortcut for "cause.objects.labels.get".
	 *
	 * @param {string} label - label to return
	 * @returns {string} Text of label
	 */
	cause.localize = this.get.bind(this);

	if (typeof(document) === 'object') {
		cause.$(document).ready((function () {
			if (typeof(Globalize) === 'function') {
				this.load();
			}
		}).bind(this));
	}
};

/** A new series of labels.
 *
 * @memberOf cause.objects.labels
 * @param {string} lang - Abbreviation of language
 * @param {object} labels - Object for series of label
 */
cause.objects.labels.prototype.add = function (lang, labels) {
	causeAvailableLanguage[lang] = cause.extend({}, causeAvailableLanguage[lang] || {}, labels);
};

/** Find and return the text for a specific language.
 *
 * @memberOf cause.objects.labels
 * @param {string} label - label to return
 * @returns {string} Text of label
 */
cause.objects.labels.prototype.get = function (label) {
	if (cause.helpIsOn) {
		return null;
	}

	if (!cause.languages.available.includes(cause.languages.select)) {
		throw 'You need to set a available language : ' + cause.languages.available;
	}

	if (typeof(Globalize) === 'function') {
		return this.replaceTags(this.getWithGlobalize(label));
	} else if (typeof(causeAvailableLanguage[cause.languages.select][label]) !== 'undefined') {
		return this.replaceTags(causeAvailableLanguage[cause.languages.select][label]);
	}

	return label + ' (' + this.get('toDefined') + ')';
};

cause.objects.labels.prototype.replaceTags = function (label) {
	if (!label) {
		return '';
	}
	if (!label.includes('{') || !label.includes('}')) {
		return label;
	}

	var version = '';
	if (myApp && myApp.config && myApp.config.version) {
		version = (myApp.config.version == '__package_version__' ? 'DEV' : myApp.config.version);

		if (version.substr(0, 1) == 'v') {
            version = version.substr(1, version.length);
        }
	}

    var tag = label.match(/{.*}/);
    var replaceBy = {
        '{baseUrl}': cause.baseUrl,
		'{version}': (version ? '<span>Version: ' + version + '</span>, ' : '')
    };

    if (!replaceBy[tag]) {
    	cause.log('Need to defined replaceBy in labels.replaceTags', 'warn');
	}

	return label.replace(tag, replaceBy[tag]);
};

cause.objects.labels.prototype.getWithGlobalize = function (label) {
    try {
		/* Globalize 1.X */
        if (typeof(Globalize.formatMessage) === 'function') {
            return Globalize.formatMessage(label);
			/* Globalize 0.X */
        } else if (typeof(Globalize.localize) === 'function') {
            return Globalize.localize(label);
        }
    } catch (err) {
        if (typeof(causeAvailableLanguage[cause.languages.select][label]) !== 'undefined') {
            return causeAvailableLanguage[cause.languages.select][label];
        }
    }
};

/** Set generic labels for the library cause.
 *
 * @memberOf cause.objects.labels
 */
cause.objects.labels.prototype.load = function () {
	if (cause.helpIsOn) {
		return null;
	}

	this.findLanguage();

	/* Globalize 1.X */
	if (typeof(Globalize.loadMessages) === 'function') {
		Globalize.loadMessages(causeAvailableLanguage);
		/* Globalize 0.X */
	} else if (typeof(Globalize.addCultureInfo) === 'function') {
		Globalize.addCultureInfo('en', {messages: causeAvailableLanguage.en});
		Globalize.addCultureInfo('fr', {messages: causeAvailableLanguage.fr});
	}
};

/** Set the language to use.
 *
 * @memberOf cause.objects.labels
 * @param {string} language - Language of label to use
 * @param {function} callback - Function to execute after set a language
 */
cause.objects.labels.prototype.set = function (language, callback) {
	if (cause.helpIsOn) {
		return null;
	}

	this.findLanguage(language);

	if (!cause.languages.available.includes(cause.languages.select)) {
		cause.log('The language "' + cause.languages.select + '" is not available!');
		return null;
	}

	if (typeof(Globalize) === 'function') {
		/* Globalize 1.X */
		if (typeof(Globalize.locale) === 'function') {
			cause.request.many([
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/main/' + cause.languages.select + '/ca-gregorian.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/main/' + cause.languages.select + '/numbers.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/supplemental/likelySubtags.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/supplemental/timeData.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/supplemental/weekData.json'
			], (function (callback, data) {
				for (var i = 0, j = data.length; i < j; i++) {
					Globalize.load(data[i][0]);
				}

				Globalize.locale(cause.languages.select);

				callback();
			}).bind(this, callback));

			return null;
			/* Globalize 0.X */
		} else if (typeof(Globalize.culture) === 'function') {
			Globalize.culture(cause.languages.select);
		}
	}

	callback();
};

/** Find the right language to use.
 *
 * @memberOf cause.objects.labels
 * @param {string} language - Language of label to use
 */
cause.objects.labels.prototype.findLanguage = function (language) {
	this.setSelectLanguage(language);

	if (typeof(cause.storage) === 'object') {
		cause.storage.set('lang', cause.languages.select);
	}
	if (typeof(myApp) === 'object' && typeof(myApp.config) === 'object') {
		myApp.config.language = cause.languages.select;
	}
};

cause.objects.labels.prototype.setSelectLanguage = function (language) {
    var params = (cause.location ? cause.location.getUrlParams() : {});
    var use = (language ? language : cause.languages.select);

    if (params && params.lang) {
        use = params.lang;
    } else if (typeof(cause.storage) === 'object' && cause.storage.get('lang')) {
        use = cause.storage.get('lang');
    }

    if (use.includes('-')) {
        use = use.split('-');
        use = use[0];
    }

    cause.languages.select = (cause.languages.available.includes(use) ? use : cause.languages.available[0]);
};

/** @property {cause.objects.labels} */
cause.labels = new cause.objects.labels();/** Class for helping with listeners.
 * This class help to execute function on each following event:
 * devtoolschange,
 * domchange, domadded, domremoved, dommodified,
 * fullscreenchange,
 * networkchange, online, offline,
 * orientationchange, resize, visibilitychange,
 * ready
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.listeners = function () {
	this.name = 'listeners';
	this.events = {
		'devtoolschange': [],
		'domchange': [],
		'domadded': [],
		'domremoved': [],
		'dommodified': [],
		'fullscreenchange': [],
		'load': [],
		'networkchange': [],
		'online': [],
		'offline': [],
		'orientationchange': [],
		'ready': [],
		'resize': [],
		'visibilitychange': []
	};
	this.correspondance = {
		'fullscreenchange': 'fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange',
		'visibilitychange': 'visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange'
	};

	if (typeof(window) === 'object') {
		this.initializeDomChangeListener();
		this.initializeDocumentListener();
		this.initializeWindowListener();
	}

	/** Shortcut for "cause.listeners.on".
	 *
	 * @param {string} on - Event name
	 * @param {function} funct - Function to execute when the event is trigger
	 */
	cause.on = this.add.bind(this);

	/** Shortcut for "cause.listeners.off".
	 *
	 * @param {string} on - Event name
	 * @param {function} funct - Function to execute when the event is trigger
	 */
	cause.off = this.remove.bind(this);
};

/** Show help when is cause.help('listeners') is call.
 */
cause.objects.listeners.prototype.help = function () {
	cause.log('Aide pour "cause.listeners":', 'help_title');
	cause.log("\t" +
		'cause.listeners.add = cause.on' + "\n\n\t" +
		'cause.on(name, event) = Ajouter une fonction "event" sur l\'événement "name"' + "\n\n\t" +
		'Les événements disponible sont :' + "\n\t\t" +
		'domchange, domadded, domremoved, dommodified, fullscreenchange, networkchange, online, offline, orientationchange, ready, resize, visibilitychange', 'help');
};

/** DOMCHANGE, DOMADDED, DOMREMOVED, DOMMODIFIED: Detect when the document DOM changed
 */
cause.objects.listeners.prototype.initializeDomChangeListener = function () {
	if (typeof(MutationObserver) === 'function' || typeof(WebKitMutationObserver) === 'function') {
		this.setMutationObserver();

		cause.$(window).on('unload', (function () {
			this.observer.disconnect();
		}).bind(this));

		cause.$(document).ready((function () {
			this.observer.observe(document.body, {
				attributes: true,
				childList: true,
				characterData: true,
				subtree: true
			});
		}).bind(this));
	} else {
		cause.$(window).on('DOMSubtreeModified', cause.debounce((function (e) {
			this.execute('domchange', {
				originalEvent: e.originalEvent,
				records: [],
				type: 'domchanged'
			});
		}).bind(this), 250));
	}
};

/** Set all action to get with mutation observer
 */
cause.objects.listeners.prototype.setMutationObserver = function () {
	this.observer = new (MutationObserver || WebKitMutationObserver)(cause.debounce((function (mutations) {
		/* For the sake of ...observation... let's output the mutation to console to see how this all works */
		this.execute('domchange', {
			originalEvent: null,
			records: mutations,
			type: 'domchange'
		});

		if (this.events.domadded.length > 0 || this.events.domremoved.length > 0 || this.events.dommodified.length > 0) {
			mutations.forEach((function (mutation) {
				if (mutation.type === 'childList') {
					if (mutation.addedNodes.length > 0) {
						this.execute('domadded', {
							originalEvent: null,
							records: [mutation],
							type: 'domadded'
						});
					} else {
						this.execute('domremoved', {
							originalEvent: null,
							records: [mutation],
							type: 'domremoved'
						});
					}
				} else {
					this.execute('dommodified', {
						originalEvent: null,
						records: [mutation],
						type: 'dommodified'
					});
				}
			}).bind(this));
		}
	}).bind(this), 250));
};

cause.objects.listeners.prototype.initializeDocumentListener = function () {
	/* FULLSCREENCHANGE: Detect change of fullscreen mode */
	cause.$(document).on(this.correspondance.fullscreenchange, cause.debounce((function (e) {
		cause.window.changeFullscreen(e);

		this.execute('fullscreenchange', cause.window.isFullscreen(), e);
	}).bind(this), 250));

	/* LOAD : Execute when page is loaded */
	cause.$(document).ready((function (e) {
		this.execute('load', e);

		if (cause.jQuery()) {
			this.execute('ready');
		}
	}).bind(this));

	/* VISIBILITYCHANGE: Detect change of page visibility */
	cause.$(document).on(this.correspondance.visibilitychange, cause.debounce((function (e) {
		this.execute('visibilitychange', (document.visibilityState === 'visible'), e);
	}).bind(this), 250));
};


cause.objects.listeners.prototype.initializeWindowListener = function () {
	/** NETWORKCHANGE: Execute on online and offline
	 This listeners send a boolean for online and a number 0/100 for the quality of connection
	 */

	/* ONLINE: Detect if page is online */
	cause.$(window).on('online', cause.debounce((function (e) {
		cause.connection.online(e);

		var online = true;
		if (typeof(navigator) === 'object') {
			online = navigator.onLine;
		}

		this.execute('networkchange', online, cause.connection.quality, e);
		this.execute('online', e);
	}).bind(this), 250));

	/* OFFLINE: Detect if page is offline */
	cause.$(window).on('offline', cause.debounce((function (e) {
		cause.connection.offline(e);

		var online = true;
		if (typeof(navigator) === 'object') {
			online = navigator.onLine;
		}

		this.execute('networkchange', online, 0, e);
		this.execute('offline', e);
	}).bind(this), 250));

	/* ORIENTATIONCHANGE: Detect change of screen orientation */
	cause.$(window).on('orientationchange', cause.debounce((function (e) {
		this.execute('orientationchange', (window.orientation || 0), e);
	}).bind(this), 250));

	/** READY: Execute everything is loaded
	 This listeners are executed when app.js is ready to be executed
	 onload if the script are include in tag head or when cause.loadAPP() is executed
	 */

	/* RESIZE: Detect change of screen orientation */
	cause.$(window).on('resize', cause.debounce((function (e) {
		if (typeof(cause.window) === 'object') {
			cause.window.changeFullscreen(e);
		}

		this.execute('resize', e);
	}).bind(this), 250));
};

/** Add an event listeners on document or window for specific event.
 *
 * @memberOf cause.objects.listeners
 * @param {string} on - Event name
 * @param {function} funct - Function to execute when the event is trigger
 */
cause.objects.listeners.prototype.add = function (on, funct) {
	if (on) {
		if (this.events[on]) {
			this.events[on].push(funct);
		} else {
			cause.$(document).on(on, funct);
		}
	}
};

/** Remove an event listeners on document or window for specific event.
 *
 * @memberOf cause.objects.listeners
 * @param {string} off - Event name
 * @param {function} funct - Function to execute when the event is trigger
 */
cause.objects.listeners.prototype.remove = function (off, funct) {
	if (off) {
		if (this.events[off]) {
			if (this.events[off].includes(funct)) {
				this.events[off].splice(this.events[on].indexOf(funct), 1);
			} else {
				this.events[off] = [];
			}
		} else {
			cause.$(document).off(off);
		}
	}
};

/** Execute all listeners for an event.
 *
 * @memberOf cause.objects.listeners
 * @param {string} on - Event name
 */
cause.objects.listeners.prototype.execute = function (on) {
	var args = [].slice.call(arguments);

	args.shift();

	for ( var i = 0, j = this.events[on].length; i < j; i++) {
		this.events[on][i].apply(null, args);
	}
};

/** @property {cause.objects.listeners} */
cause.listeners = new cause.objects.listeners();
/** Singleton for helping with URL.
 *
 * @namespace
 * @memberOf cause
 */
cause.location = {
	/** Show help when is cause.help('location') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.location":', 'help_title');
		cause.log("\t" +
			'cause.location.getAbsoluteUrl() = Retourne le "path" absolute d\'un lien' + "\n\t" +
			'cause.location.getUrlParams() = Retourne tout les paramètres d\'un URL' + "\n\t" +
			'cause.location.getQueryUrl() = Retourne un paramètre spécifique d\'un URL', 'help');
	},

	/** Take a relative URL and return an absolute.
	 *
	 * @param {string} url - relative URL
	 * @returns {string} Absolute URL
	 */
	getAbsoluteUrl: function (url) {
		var a = document.createElement('a');
		a.href = url;

		return a.href;
	},

	/** Return all the parameters passed on URL.
	 *
	 * @param {string} href - (optional) search URL, by default the page URL is used.
	 * @returns {object} Object with every parameters
	 */
	getUrlParams: function (href) {
		var params = {};
		var url = (href ? href : location.href);

		if (url.includes('?')) {
			url = url.substr(url.indexOf('?') + 1);
		}

		if (url.includes('#')) {
			params['#'] = url.substr(url.indexOf('#') + 1);

			url = url.substr(0, url.indexOf('#'));
		}

		if (url) {
			var info = url.split('&');

			for (var i = 0, j = info.length; i < j; i++) {
				var p = info[i].split('=');

				params[p[0]] = p[1];
			}
		}
		
		return params;
	},

	/** Return a specific value of GET parameters.
	 *
	 * @param {string} name - Parameter name
	 * @param {string} href - (optional) search URL, by default the page URL is used.
	 * @returns {string} Parameter value
	 */
	getQueryUrl: function (name, href) {
		if (!href) {
			href = window.location.href;
		}

    	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(href);

    	if ( !results ) {
    		return null;
    	} else if ( !results[2] ) {
    		return '';
    	}

    	return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
};
/** Add some message on developer console.
 *
 * @memberOf cause
 * @function
 * @param {string} msg - message to show and/or log
 * @param {string} type - predefined font style
 */
cause.log = (function () {
    var sendLogBy = '';

    /** Show a message inside the cause-console element.
     *
     * @param {string} msg - message to show and/or log
     */
    var logConsoleCause = function (msg) {
        if (cause.$('#cause-console').length === 0) {
            return null;
        }

        var html = '';

        if (typeof(msg) === 'string') {
            html = msg.replaceAll("\n", '<br />').replaceAll("\t", ' &nbsp; &nbsp;');
        } else {
            html += ' Object [<br />';

            for (var i in msg) {
                if (msg.hasOwnProperty(i)) {
                    html += '&nbsp; &nbsp;' + i + ': ' + (typeof(msg[i]) === 'object' ? 'object' : (typeof(msg[i]) === 'function' ? 'function' : msg[i])) + '<br />';
                }
            }

            html += ']';
        }

        cause.$('#cause-console').append(cause.html.parse('<div>' + html + '</div>'));
    };

    /** Show message inside the browser console.
     *
     * @param {string} msg - message to show and/or log
     * @param {string} type - predefined font style
     */
    var logConsoleNative = function (msg, type) {
        if (console && console.log) {
            if (type === 'error') {
                console[(console.error ? 'error' : 'log')]('%c' + msg, 'font-size:1.4em;color:#F5223B');
            } else if (type === 'warn') {
                console[(console.warn ? 'warn' : 'log')]('%c' + msg, 'color:#cc6600;');
            } else if (type === 'help_title') {
                console.log('%c' + msg, 'font-size:1.3em;color:#0306A6;');
            } else if (type === 'help') {
                console.log('%c' + msg + "\n\n", 'color:#3376F2;');
            } else {
                console[(console.warn ? 'warn' : 'log')](msg);
            }
        }
    };

    /** Send message to a monitor service.
     *
     * @param {string} msg - message to show and/or log
     * @param {string} type - predefined font style
     * @todo Send error on server by socket or ajax
     */
    var logSend = function (msg, type) {
        var skip = ['help', 'help_title'];

        if (cause.debug || skip.includes(type)) {
            return null;
        }

        var error = {
            jserror: encodeURIComponent(msg),
            jstype: type
        };

        if (sendLogBy === 'socket') {
            var ws = new this.socket({
                host: 'localhost:79',
                onConnect: function () {
                }
            });
            ws.send(error);
        } else if (sendLogBy === 'ajax') {
            cause.send({
                url: 'http://yourserver.com/',
                data: error
            });
        }
    };

    return function (msg, type) {
        if (msg) {
            logConsoleNative(msg, type);
            logConsoleCause(msg);
            logSend(msg);
        }
    }
}());/** Singleton for helping when we process to menu
 *
 * @namespace
 * @memberOf cause
 */
cause.menu = {
	/** Show help when is cause.help('menu') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.menu":', 'help_title');
		cause.log("\t" +
			'cause.menu.logout() = Génère le menu pour la déconnexion', 'help');
	},

	/** Create the logout menu
	 */
	logout: function () {
        var html = $('<div>');

	    if (myApp.config && myApp.config.webroot) {
            $('<div>').attr({
                'class': 'fa fa-user-circle'
            }).appendTo(html);

            var menu = $('<div>').addClass('submenu').appendTo(html);

            if (myApp.config.user && myApp.config.user.first_name) {
                var name = myApp.config.user.first_name + ' ' + myApp.config.user.last_name;
                $('<a>').html(name.capitalize(true)).appendTo(menu);
            }

            $('<a>').attr({
                href: myApp.config.webroot + '?action=changePassword'
            }).html(cause.localize('changePassword')).appendTo(menu);

            $('<a>').attr({
                href: myApp.config.webroot + '?action=logout'
            }).html(cause.localize('logout')).appendTo(menu);
        } else {
            $('<a>').attr({
                href: './login/?logout'
            }).html(cause.localize('logout')).appendTo(html);
        }

        return html.html();
	}
};/** Singleton for helping when we process to password
 *
 * @namespace
 * @memberOf cause
 */
cause.password = {
    numbers: '0123456789',
    //specials: '!@#$%^&*()_+{}:"<>?\|[];\',./`~',
    specials: '!@#$%^&*()_+{}:"<>?\|[];\',./`~',
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

	/** Show help when is cause.help('password') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.password":', 'help_title');
		cause.log("\t" +
			'cause.password.generate() = Génère un mot de passe' + "\n\t" +
			'cause.password.quality(password) = Retourne la qualité du mot de passe', 'help');
	},

	/** Return a password
	 *
	 * @returns {string} Generated password
	 */
	generate: function () {
		var password = '';

		password += this.specials.pick(1);
        password += this.lowercase.pick(1);
        password += this.uppercase.pick(1);
        password += (this.specials + this.lowercase + this.uppercase + this.numbers).pick(1);

		return password.shuffle();
	},

	/** Test the quality of password
	 *
	 * @param {string} password
	 * @returns {integer} Quality of password, higher is better
	 */
	quality: function (password) {
		if (!password) {
			return 0;
		}

        var score = 0;
        var uniqueLetters = new Object();

        for (var i=0; i<password.length; i++) {
            uniqueLetters[password[i]] = (uniqueLetters[password[i]] || 0) + 1;
            score += 5.0 / uniqueLetters[password[i]];
        }

		var regexSpecial = new RegExp('[' + this.specials.replace(']', '\\]') + ']');
        var checks = {
			digits: /\d/.test(password),
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
			specials: regexSpecial.test(password),
			nonWords: /\W/.test(password)
        };

        for (var i in checks) {
            score += (checks[i] == true ? 10 : 0);
        }

        return parseInt(score);
	}
};/** Add some function to native object "String"
 *
 * @constructor String
 */

/** Capitalize a string.
 *
 * @memberOf String
 * @function capitalize
 * @returns {string}
 */
if (typeof("".capitalize) !== 'function') {
    String.prototype.capitalize = function (all) {
    	if (all) {
            return this.toLowerCase().replace(/\b\w/g, function (word) {
                return word.toUpperCase();
            });
        }

        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }
}

/** Check if a string is include inside another.
 *
 * @memberOf String
 * @function includes
 * @returns {boolean} True if is find
 */
if (typeof("".includes) !== 'function') {
	String.prototype.includes = function (search) {
		return (this.indexOf(search) !== -1 ? true : false);
	};
}

/** Select a number of char inside a string.
 *
 * @memberOf String
 * @function pick
 * @param {string} min - Minimum of char to select
 * @param {string} max - Maximum of char to select
 * @returns {string} Selected char
 */
if (typeof("".pick) !== 'function') {
    String.prototype.pick = function (min, max) {
		var chars = '';
		var n = (typeof max === 'undefined' ? min : min + Math.floor( Math.random() * ( max - min + 1 )));

        for (var i=0; i<n; i++) {
            chars += this.charAt( Math.floor( Math.random() * this.length ));
        }

        return chars;
    };
}

/** Replace all char of a string by a other.
 *
 * @memberOf String
 * @function replaceAll
 * @param {string} search - Char to replace
 * @param {string} replacement - Replacement char
 * @returns {string} String with replacement
 */
if (typeof("".replaceAll) !== 'function') {
	String.prototype.replaceAll = function (search, replacement) {
		return this.replace(new RegExp(search, 'g'), replacement);
	};
}

/** Shuffle every char of a string.
 *
 * @memberOf String
 * @function shuffle
 * @returns {string} String shuffled
 */
if (typeof("".shuffle) !== 'function') {
    String.prototype.shuffle = function () {
        var array = this.split('');
        var tmp, current, top = array.length;

        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array.join('');
    };
}

/** Remove all HTML tag.
 *
 * @memberOf String
 * @function stripTags
 * @returns String without HTML tag
 */
if (typeof("".stripTags) !== 'function') {
	String.prototype.stripTags = function () {
		var div = document.createElement('div');
		div.innerHTML = this;

		return div.innerText;
	};
}

/** Remove all spaces of a string.
 * This function exist until ES5
 *
 * @memberOf String
 * @function trim
 * @returns {string} String with removed space
 */
if (typeof("".trim) !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^s+|s+$/g, '');
    };
}

/** Add some function to native object "Array"
 *
 * @constructor Array
 */

/** Check if an element of array contain.
 *
 * @memberOf Array
 * @function containIndexOf
 * @param {string} search - String to search
 * @returns {integer} Position of find value
 */
if (typeof([].containIndexOf) !== 'function') {
	Array.prototype.containIndexOf = function (search) {
		for (var i = this.length - 1; i >= 0; i--) {
			if (this[i].indexOf(search) > -1) {
				return i;
			}
		}

		return -1;
	};
}

/** Check if a string is include inside an array.
 *
 * @memberOf Array
 * @function includes
 * @returns {boolean} True if is find
 */
if (typeof([].includes) !== 'function') {
	Array.prototype.includes = function (search) {
		return (this.indexOf(search) !== -1 ? true : false);
	};
}

/** Remove an item of array by is value.
 *
 * @memberOf Array
 * @function remove
 * @param {mixed} item - Value to remove
 */
if (typeof([].remove) !== 'function') {
	Array.prototype.remove = function (item) {
		for (var i = this.length - 1; i >= 0; i--) {
			if (this[i] === item) {
				this.splice(i, 1);
			}
		}
	};
}

/** Add some function to native object "Date"
 *
 * @constructor Date
 */

/** Return the week number.
 *
 * @memberOf Date
 * @function getWeek
 */
if (typeof(Date.getWeek) !== 'function') {
    Date.prototype.getWeek = function () {
        var d = new Date(+this);

        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));

        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    };
}/** Class for helping with Rabbit MQ.
 * This class needed "stomp.js".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} host - URL of server
 * @param {string} user - Username
 * @param {string} password - User password
 * @param {string} onConnect - Callback function after connection
 * @param {string} onDisconnect - Callback function after disconnection
 * @param {string} vhost - Virtual host to connect
 */
cause.objects.rabbitMQ = function (host, user, password, onConnect, onDisconnect, vhost) {
	this.name = 'rabbitMQ';
	this.isConnected = false;
	this.client = null;
	this.onConnect = null;
	this.onDisconnect = null;
	this.host = host;
	this.user = user;
	this.password = password;
	this.subkey = [];
	this.useSocket = ('WebSocket' in window || 'MozWebSocket' in window);

	if (typeof(onConnect) === 'function') {
		this.onConnect = onConnect;

		if (typeof(onDisconnect) === 'function') {
			this.onDisconnect = onDisconnect;
			this.vhost = vhost;
		} else {
			this.vhost = onDisconnect;
		}
	} else {
		this.vhost = onConnect;
	}

	/* Initialize the addons "stomp" */
	if (!this.configAreValid()) {
		return null;
	}

	if (typeof(Stomp) === 'object') {
		this.init();
	} else {
		var file = (cause.baseUrl == '//stdev.cauca.ca/cause/' ? 'stomp.js' : 'stomp.min.js');

		cause.include.js(cause.baseUrl + 'js/addons/' + file, this.init.bind(this), function () {
			cause.alert(cause.localize('missingAddons'), 'stomp.min.js');
		});
	}
};

/** Show help when is cause.help('rabbitMQ') is call.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.help = function () {
	cause.log('Aide pour "cause.rabbitMQ":', 'help_title');
	cause.log("\t" +
		'new cause.rabbitMQ(host, user, password, [onConnect], [onDisconnect], [vhost]);' + "\n\n\t" +
		'host = URL du serveur Rabbit MQ' + "\n\t" +
		'user = Nom d\'utilisateur du Rabbit MQ' + "\n\t" +
		'password = Mot de passe du Rabbit MQ' + "\n\t" +
		'onConnect = Fonction à exécuter à la connexion' + "\n\t" +
		'onDisconnect = Fonction à exécuter à la déconnexion' + "\n\t" +
		'vhost = Vhost du Rabbit MQ', 'help');
};

cause.objects.rabbitMQ.prototype.configAreValid = function () {
	if (cause.helpIsOn || !this.host) {
		return false;
	}

	if (!this.user || !this.password) {
		cause.log('You need to pass the host, user and password', 'error');
		return false;
	}

	if (!this.useSocket) {
		cause.log('Use need a browser who support WebSocket', 'error');
		return false;
	}

	return true;
};

/** Callback for StompJS and/or WebSocket is connect.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} type - StompJS or WebSocket
 * @param {object} e - Event object
 */
cause.objects.rabbitMQ.prototype.connect = function (type) {
	if (type === 'stompjs' && typeof(this.onConnect) === 'function') {
		this.isConnected = true;
		this.onConnect();
	} else {
		cause.log(type + ' is connected');
	}
};

/** Callback for StompJS and/or WebSocket is disconnect.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} type - StompJS or WebSocket
 * @param {object} e - Event object
 */
cause.objects.rabbitMQ.prototype.disconnect = function (type) {
	if (type === 'websocket' && typeof(this.onDisconnect) === 'function') {
		this.isConnected = false;
		this.onDisconnect();
	} else {
		cause.log(type + ' is disconnected');
	}
};

/** Subscribe to a exchange.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} routing_key - /exchange/"exchange name"/"routing key"
 * @param {function} callback - Function to execute when subscribe is complete
 * @param {objects} headers - Object with some specific headers
 * @param {string} headers.id - ID of consumer tag (sub-?)
 * @param {boolean} headers.durable - True if durable (default = False)
 * @param {boolean} headers.auto-delete - True if auto delete (default = False)
 */
cause.objects.rabbitMQ.prototype.subscribe = function (routing_key, callback, headers) {
	if (typeof(callback) === 'function') {
		headers = (headers || {});
	} else {
		headers = (callback || {});
		callback = function () {};
	}

	this.subkey.push(this.client.subscribe(routing_key, callback, headers));
};

/** Callback for when StompJS and/or WebSocket generate an error.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} type - StompJS or WebSocket
 * @param {object} e - Event object
 */
cause.objects.rabbitMQ.prototype.error = function (type, e) {
	cause.log(type + ' has an error', 'error');
	cause.log(e);

	this.close();
};

/** Close the Rabbit MQ connection.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.close = function () {
	for (var i = 0, j = this.subkey.length; i < j; i++) {
		this.client.unsubscribe(this.subkey[i]);
	}

	this.client.disconnect(this.disconnect.bind(this, 'stompjs'));

	if (this.ws.readyState === this.ws.OPEN) {
		this.ws.close();
	}
};

/** Send message on Rabbit MQ queue.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.send = function (queue_name, message) {
	this.client.send(queue_name, {
		'content-type': 'text/plain'
	}, message);
};

/** Change the heartbeat.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {integer} outgoing -  Outgoing heartbeat in milliseconds
 * @param {integer} incoming - Incoming heartbeat in milliseconds
 */
cause.objects.rabbitMQ.prototype.setHeartbeat = function (outgoing, incoming) {
	if (this.client) {
		this.client.heartbeat.outgoing = outgoing;
		this.client.heartbeat.incoming = (incoming ? incoming : outgoing);
	}
};

/** Initialize the WebSocket and StompJS.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.init = function () {
	if (this.useSocket) {
		if (!this.host.includes('://')) {
			this.host = 'wss://' + this.host;
		}
		if (this.host.substr(-1, 1) !== '/') {
			this.host += '/ws/';
		}

		// Initialize the WebSocket
		this.ws = new WebSocket(this.host);
		this.ws.addEventListener('open', this.connect.bind(this, 'websocket'));
		this.ws.addEventListener('close', this.disconnect.bind(this, 'websocket'));
		this.ws.addEventListener('error', this.error.bind(this, 'websocket'));

		// Initialize the StompJS
		this.client = Stomp.over(this.ws);
		this.client.debug = function() {};
		this.client.connect(this.user, this.password, this.connect.bind(this, 'stompjs'), this.error.bind(this, 'stompjs'), (this.vhost ? this.vhost : '/'));
		this.client.heartbeat.outgoing = 30000;
		this.client.heartbeat.incoming = 60000;
	}
};

/** This class is replace by cause.objects.rabbitMQ
 *
 * @class
 * @deprecated
 */
cause.rabbitMQ = cause.objects.rabbitMQ;/** Class for helping to send ajax request.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.request = function () {
    /** Shortcut for "cause.objects.request.send"
     *
     * @param {object} params - Object to modify some default value
     * @param {string} params.url
     * @param {string} params.method
     * @param {object} params.data
     * @param {function} params.error
     * @param {function} params.success
     */
	cause.ajax = this.send.bind(this);
};

/** Show help when is cause.help('request') is call.
 *
 * @memberOf cause.objects.request
 */
cause.objects.request.prototype.help = function () {
    cause.log('Aide pour "cause.request":', 'help_title');
    cause.log("\t" +
        'cause.request.send = cause.ajax;' + "\n\n\t" +
        'cause.ajax() = Envoie une requête javascript sur un URL (même paramètre que jQuery)', 'help');
};

/** Create the request without jQuery.
 * This function is not completely functionnal.
 *
 * @memberOf cause.objects.request
 * @param {object} settings - Parameters send to request
 * @param {object} params - Original parameters
 */
cause.objects.request.prototype.createXhr = function (settings, params) {
    var xhr = settings.xhr();
    var data = '';

    xhr.addEventListener('load', (function (xhr, params, e) {
        if (params.dataType == 'blob') {
            this.onSuccess(params, e.target.response, 'success', xhr);
        } else if (params.dataType == 'arraybuffer') {
            this.onSuccess(params, new Uint8Array(e.target.response), 'success', xhr);
        } else {
            this.onSuccess(params, cause.json.parse(e.target.responseText), 'success', xhr);
        }
    }).bind(this, xhr, params));
    xhr.addEventListener('error', (function (xhr, params) {
        this.onError(params, xhr, 'error', '');
    }).bind(this, xhr, params));
    xhr.addEventListener('abort', (function (xhr, params) {
        this.onError(params, xhr, 'abort', '');
    }).bind(this, xhr, params));
    xhr.addEventListener('loadend', (function (xhr, params) {
        this.onComplete(params, xhr, 'success');
    }).bind(this, xhr, params));

    xhr.open(settings.method, settings.url, true);

    if (settings.method === 'POST') {
        data = this.generateQuery(settings.data);
    } else {
        settings.url += (settings.data ? '?' + this.generateQuery(settings.data) : '');
    }

    if (settings.data) {
        if (settings.dataType === 'json') {
            xhr.setRequestHeader('Content-type', 'application/json');
        } else {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
    }

    if (settings.dataType === 'blob' || settings.dataType === 'arraybuffer') {
        xhr.responseType = settings.dataType;
    }

    xhr.send(data);
};

/** Generate the string to pass all value with the request.
 *
 * @memberOf cause.objects.request
 * @param {object} data - Object with every data we like to send
 * @returns {string} Query string to pass
 */
cause.objects.request.prototype.generateQuery = function (data) {
    var str = [];

    for (var key in data) {
        if (typeof(data[key]) === 'object') {
            str.push(key + '=' + JSON.stringify(data[key]));
        } else {
            str.push(key + '=' + data[key]);
        }
    }

    return str.join('&');
};

/** Event executed when the request is completely send.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} xhr - Object of request
 * @param {string} status - Status of header request
 */
cause.objects.request.prototype.onComplete = function (params, xhr, status) {
    if (typeof(params.complete) === 'function') {
        params.complete(data, status, xhr);
    }
};

/** Event executed when the request is successfully send.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {mixed} data - Data receive
 * @param {string} status - Status of header request
 * @param {object} xhr - Object of request
 */
cause.objects.request.prototype.onSuccess = function (params, data, status, xhr) {
    var json_is_detected = (typeof(data) == 'object' && typeof(data.success) == 'boolean');

    if (params.dataType === 'json' || json_is_detected) {
        if (typeof(data.login) != 'undefined' && !data.login && myApp.config) {
            location.href = (myApp.config.webroot ? '/?action=logout' : './login/?logout');
        }
        if (data.error) {
            cause.log(data.error, 'error');
        }
    }

    if (typeof(params.success) === 'function') {
        params.success(data, status, xhr);
    }
};

/** Event executed when the request is successfully send.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} xhr - Object of request
 * @param {string} status - Status of header request
 * @param {object} error - Error type
 */
cause.objects.request.prototype.onError = function (params, xhr, status, error) {
    if (typeof(params.error) === 'function') {
        params.error(xhr, status, error);
    } else {
        cause.log('Request:' + "\n" +
            'we can\'t complete this request' + "\n" +
            'url : ' + (params.url ? params.url : './ajax/') + "\n" +
            'status : ' + status, 'error');
    }
};

/** Event executed when upload progressing.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} e - Event object
 */
cause.objects.request.prototype.onProgressUpload = function (params, e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total;

        if (typeof(params.progress) === 'function') {
            params.progress(e, percentComplete);
        }
    }
};

/** Event executed when download progressing.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} e - Event object
 */
cause.objects.request.prototype.onProgressDownload = function (params, e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total;

        if (typeof(params.progress) === 'function') {
            params.progress(e, percentComplete);
        }
    }
};

/** Event executed when ajax setup the request.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 */
cause.objects.request.prototype.setupXhr = function (params) {
    var xhr = (typeof($) === 'function' ? $.ajaxSettings.xhr() : new XMLHttpRequest());

    /* Upload progress */
    xhr.upload.addEventListener('progress', this.onProgressUpload.bind(this, params), false);

    /* Download progress */
    xhr.addEventListener('progress', this.onProgressDownload.bind(this, params), false);

    return xhr;
};

/** Call many URL and execute one callback when they are finished.
 *
 * @memberOf cause.objects.request
 * @param {string} urls - Array with all URL
 * @param {function} callback - Function when everything is loaded
 */
cause.objects.request.prototype.many = function (urls, callback) {
    var requests = [];

    for (var i = 0, j = urls.length; i < j; i++) {
        requests.push($.get(urls[i]));
    }

    $.when.apply($, requests).done(function () {
        callback(arguments);
    }).fail(function () {
        callback(arguments);
    });
};

/** Send ajax request.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Object to modify some default value
 * @param {string} params.url
 * @param {string} params.method
 * @param {object} params.data
 * @param {object} params.headers
 * @param {function} params.error
 * @param {function} params.success
 */
cause.objects.request.prototype.send = function (params) {
    if (typeof(params) === 'object') {
        var settings = this.setSettings(params);

        if (typeof($) === 'function' && settings.dataType != 'blob' && settings.dataType != 'arraybuffer') {
            $.ajax(settings);
        } else {
            this.createXhr(settings, params);
        }
    }
};

cause.objects.request.prototype.setSettings = function (params) {
    var basicUrl = (myApp.config && myApp.config.webroot ? myApp.config.webroot : './') + 'ajax/';
    var settings = cause.extend({}, {
        url: basicUrl,
        method: 'POST',
        data: null,
        dataType: 'json'
    }, params);

    settings.complete = this.onComplete.bind(this, params);
    settings.error = this.onError.bind(this, params);
    settings.success = this.onSuccess.bind(this, params);
    settings.xhr = this.setupXhr.bind(this, params);
    settings.headers = this.setHeaders(settings);

    if (settings.data) {
        for (var key in settings.data) {
            if (settings.data[key] !== null && typeof(settings.data[key]) == 'object') {
                settings.data[key] = JSON.stringify(settings.data[key]);
            }
        }
    }

    return settings;
};

cause.objects.request.prototype.setHeaders = function (settings) {
    var headers = cause.extend({}, settings.headers || {});

    if (!settings.headers && myApp.config && myApp.config.webservice) {
        if (myApp.config.webservice.access_token) {
            headers['Authorization'] = 'Token ' + myApp.config.webservice.access_token;
        } else if (myApp.config.webservice.token) {
            headers['Authorization'] = 'Token ' + myApp.config.webservice.token;
        } else if (myApp.config.webservice.key) {
            headers['Authorization'] = 'Key ' + myApp.config.webservice.key;
        }
    }

    return headers;
};

/** @property {cause.objects.request} */
cause.request = new cause.objects.request();/** Class for helping with socket
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object|string} config - Object with all config or URL of server
 * @param {string} config.host - URL of server
 * @param {boolean} config.binary - True to send data in binary
 * @param {function} config.onConnect - Callback function to execute after connection
 * @param {function} config.onMessage - Callback function to execute when receiving a message
 * @param {function} config.onDisconnect - Callback function to execute after disconnection
 */
cause.objects.socket = function (config) {
	this.name = 'socket';
	this.isConnected = false;
	this.ws = null;
	this.host = config;
	this.binary = false;
	this.onConnect = null;
	this.onMessage = null;
	this.onDisconnect = null;

	/* Initialize the "websocket" */
	if (cause.helpIsOn || !config) {
		return null;
	}

	if (typeof (config) === 'object') {
		this.host = (config.host || '');
		this.binary = (config.binary || false);
		this.onConnect = (config.onConnect || null);
		this.onMessage = (config.onMessage || null);
		this.onDisconnect = (config.onDisconnect || null);
	}

	this.init();
};

/** Show help when is cause.help('rabbitMQ') is call
 *
 * @memberOf cause.objects.socket
 */
cause.objects.socket.prototype.help = function () {
	cause.log('Aide pour "cause.socket":', 'help_title');
	cause.log("\t" +
		'new cause.socket(config);' + "\n\n\t" +
		'config.host = URL du serveur websocket' + "\n\t" +
		'config.onConnect = Fonction à exécuter à la connexion' + "\n\t" +
		'config.onMessage = Fonction à exécuter à la réception d\'un message' + "\n\t" +
		'config.onDisconnect = Fonction à exécuter à la déconnexion' + "\n\n\t" +
		'new cause.socket(host, [onConnect, [onMessage, [onDisconnect]]]);' + "\n\n\t" +
		'host = URL du serveur websocket' + "\n\t" +
		'onConnect = Fonction à exécuter à la connexion' + "\n\t" +
		'onMessage = Fonction à exécuter à la réception d\'un message' + "\n\t" +
		'onDisconnect = Fonction à exécuter à la déconnexion', 'help');
};

/** Callback for WebSocket is connect.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.connect = function () {
	if (typeof(this.onConnect) == 'function') {
		this.isConnected = true;
		this.onConnect();
	} else {
		cause.log('is connected');
	}
};

/** Callback for WebSocket receiving a message.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.message = function (e) {
	var message = cause.json.parse(e.data);

	if (typeof(this.onMessage) == 'function') {
		this.onMessage(message);
	} else {
		cause.log('message is receive:' + message);
	}
};

/** Callback for WebSocket is disconnect.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.disconnect = function () {
	if (typeof(this.onDisconnect) == 'function') {
		this.isConnected = false;
		this.onDisconnect();
	} else {
		cause.log('is disconnected');
	}
};

/** Callback for when WebSocket generate an error.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.error = function (e) {
	cause.log('Error inside cause.socket');
	cause.log(e);

	this.close();
};

/** Initialize the WebSocket.
 *
 * @memberOf cause.objects.socket
 */
cause.objects.socket.prototype.init = function () {
	var webSocket = (typeof(window) == 'object' ? (window.WebSocket || window.MozWebSocket) : null);

	if (this.host.includes('://')) {
		this.host = 'ws://' + this.host;
	}

	if (webSocket) {
		// Initialize the WebSocket
		this.ws = new webSocket(this.host, 'echo-protocol');
		this.ws.addEventListener('close', this.disconnect.bind(this));
		this.ws.addEventListener('error', this.error.bind(this));
		this.ws.addEventListener('open', this.connect.bind(this));
		this.ws.addEventListener('message', this.message.bind(this));
	}
};

/** Close the websocket connection.
 *
 * @memberOf cause.objects.socket
 */
cause.objects.socket.prototype.close = function () {
	if (this.ws.readyState === this.ws.OPEN) {
		this.ws.close();
	}
};

/** Send data on server.
 *
 * @memberOf cause.objects.socket
 * @param {object|string} data - Data send on server
 * @param {boolean} binary - True to force sending binary data
 */
cause.objects.socket.prototype.send = function (data, binary) {
	if (this.ws.readyState === this.ws.OPEN) {
		this.ws.binaryType = (binary || this.binary ? 'arraybuffer' : 'blob');
		this.ws.send(data);

		if (this.ws.bufferedAmount === 0) {
			// the data is sent
		}
	} else {
		cause.log('could not send, your disconnect');
	}
};/** Class for helping with storage.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} name - Name of database
 * @param {string|float|integer} version - Version of database
 * @param {integer} size - Expected size of database
 * @param {function} update - Callback function to execute when an update is needed
 */
cause.objects.sql = function (name, version, size, update) {
	this.name = 'sql';
	this.db = null;

	if (cause.helpIsOn && !name) {
		return null;
	}

	if (window.openDatabase) {
		try {
			this.db = openDatabase(name, version, 'Cause DB: ' + name, size * 1000);
		} catch(err) {
			if (err === 2) {
				this.update(this.db.version, version, update);
			} else {
				cause.alert(cause.localize('sqlCantCreate'), 'SQL');
			}
		}
	} else {
		cause.alert(cause.localize('sqlNotAvailable'), 'SQL');
	}
};

/** Show help when is cause.help('sql') is call.
 *
 * @memberOf cause.objects.sql
 */
cause.objects.sql.prototype.help = function () {
	cause.log('Aide pour "cause.sql":', 'help_title');
	cause.log("\t" +
		'cause.sql(name, version, size, update);' + "\n\t" +
		'name = Nom de la base de donnée' + "\n\t" +
		'version = Version de la base de donnée' + "\n\t" +
		'size = Espace disque prévue pour la base de donnée en K' + "\n\t" +
		'update = Fonction pour exécuter la mise à jour', 'help');
};

/** Execute a query.
 *
 * @memberOf cause.objects.sql
 * @param {string} query - Query to execute
 * @param {array} params - Query parameters
 * @param {function} callback - Callback function to execute after receive result
 */
cause.objects.sql.prototype.execute = function (query, params, callback) {
	this.db.transaction(function (transaction) {
		transaction.executeSql(query, params || [], callback || function () {}, function () {
			cause.log(cause.localize('sqlQueryError'), 'error');
		});
	});
};

/** Make the update of database version.
 *
 * @memberOf cause.objects.sql
 * @param {float|integer} actualVersion - Actual version
 * @param {string|float|integer} needVersion - Needed version
 * @param {function} update - Callback function to execute when an update is needed
 */
cause.objects.sql.prototype.update = function (actualVersion, needVersion, update) {
	cause.log(cause.localize('update') + ' : ' + actuelVersion + ' -> ' + needVersion, 'warn');

	this.db.changeVersion(actuelVersion, needVersion, (function (actualVersion, needVersion, update) {
		if (typeof(update) == 'function') {
			update(parseFloat(actualVersion), parseFloat(needVersion));
		} else {
			cause.log(cause.localize('sqlNeedToDefineUpdate'), 'error');
		}
	}).bind(this, actualVersion, needVersion, update), function () {
		cause.log(cause.localize('sqlUpdateError'), 'error');
	}, function () {
		cause.log(cause.localize('sqlUpdateSucceed'), 'warn');
	});
};/** Singleton for helping with storage.
 *
 * @namespace
 * @memberOf cause
 */
cause.storage = {
	name: 'storage',

	/** Show help when is cause.help('storage') is call.
	 **/
	help: function () {
		cause.log('Aide pour "cause.storage":', 'help_title');
		cause.log("\t" +
			'cause.storage.set(name, value);' + "\n\t" +
			'cause.storage.get(name);', 'help');
	},

	/** Return a specified value.
	 *
	 * @param {string} name - Name of value
	 * @returns {mixed} Store value
	 */
	get: function (name) {
		if (cause.detect.privateMode()) {
			return null;
		}
		if( typeof(window.localStorage) !== 'object' ) {
			cause.alert(cause.localize('localStorageNotAvailable'), cause.localize('localStorage'));

			return null;
		}

		return cause.json.parse(localStorage.getItem(name));
	},

	/** Set a value.
	 *
	 * @param {string} name - Name of value
	 * @param {object} value - Store value
	 */
	set: function (name, value) {
		if (cause.detect.privateMode()) {
			return null;
		}
		if( typeof(window.localStorage) !== 'object' ) {
			cause.alert(cause.localize('localStorageNotAvailable'), cause.localize('localStorage'));

			return null;
		}

		try {
			localStorage.setItem(name, cause.json.convert(value));
		} catch(err) {
			cause.alert(cause.localize('localStorageSetError'), cause.localize('localStorage'));
		}
	}
};
/** Singleton for helping to detect if something is supported by browser.
 *
 * @namespace
 * @memberOf cause
 */
cause.supported = {
	/** Show help when is cause.help('supported') is call.
	 */
	help: function () {
		cause.log('Aide pour "cause.supported":', 'help_title');
		cause.log("\t" +
			'cause.supported.apng() = Test si le navigateur supporte les .apng' + "\n\t" +
			'cause.supported.bmp() = Test si le navigateur supporte les .bmp ou .dib' + "\n\t" +
			'cause.supported.ico() = Test si le navigateur supporte les .ico' + "\n\t" +
			'cause.supported.svg() = Test si le navigateur supporte les .svg' + "\n\t" +
			'cause.supported.tif () = Test si le navigateur supporte les .tif ou .tiff' + "\n\t" +
			'cause.supported.webp() = Test si le navigateur supporte les .webp' + "\n\t" +
			'cause.supported.xbm() = Test si le navigateur supporte les .xmb', 'help' );
	},

	/** Validate if browser support the APNG.
	 *
	 * @param {function} callback - Function to receive if format is supported
	 */
    apng: function (callback) {
		var image = new Image();
		var supported = false;
		var ctx = document.createElement('canvas').getContext('2d');

		image.onload = image.onerror = function (e) {
			ctx.drawImage(image, 0, 0);
			supported = (e.type === 'load' && ctx.getImageData(0, 0, 1, 1).data[3] === 0 ? true : false);

			if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('APNG is supported : ' + supported);
			}
		};
		
		image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==";
    },

	/** Validate if browser support the BMP/DIB.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
    bmp: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('BMP/DIB is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/bmp;base64,Qk1+AAAAAAAAAHoAAABsAAAAAQAAAAEAAAABABgAAAAAAAQAAAATCwAAEwsAAAAAAAAAAAAAQkdScwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD///8A';    	
  	},

	/** Validate if browser support the ICO.
	 *
	 * @param {function} callback - Function to receive if format is supported
	 */
    ico: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('ICO is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/vndmicrosofticon;base64,AAABAAEAAQECAAEAAQA4AAAAFgAAACgAAAABAAAAAgAAAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAA';    	
  	},

	/** Validate if browser support the SVG.
	 *
	 * @param {function} callback - Function to receive if format is supported
	 */
    svg: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('SVG is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';    	
  	},

	/** Validate if browser support the TIF/TIFF.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
    tif: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('TIF/TIFF is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/tiff;base64,SUkqAAwAAAD///8AEQD+AAQAAQAAAAAAAAAAAQMAAQAAAAEAAAABAQMAAQAAAAEAAAACAQMAAwAAAO4AAAADAQMAAQAAAAEAAAAGAQMAAQAAAAIAAAANAQIAJgAAAPQAAAAOAQIAEgAAABoBAAARAQQAAQAAAAgAAAASAQMAAQAAAAEAAAAVAQMAAQAAAAMAAAAWAQMAAQAAAEAAAAAXAQQAAQAAAAMAAAAaAQUAAQAAAN4AAAAbAQUAAQAAAOYAAAAcAQMAAQAAAAEAAAAoAQMAAQAAAAIAAAAAAAAASAAAAAEAAABIAAAAAQAAAAgACAAIAC9ob21lL21pY2hhZWxqb2xpbi9Eb2N1bWVudHMvdGVzdC50aWYAQ3JlYXRlZCB3aXRoIEdJTVAA';    	
  	},

	/** Validate if browser support the WEBP.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
    webp: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('WEBP is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';    	
  	},

	/** Validate if browser support the XBM.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
  	xbm: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('XBM is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/x-xbitmap;base64,I2RlZmluZSB0ZXN0X3dpZHRoIDEKI2RlZmluZSB0ZXN0X2hlaWdodCAxCnN0YXRpYyB1bnNpZ25lZCBjaGFyIHRlc3RfYml0c1tdID0gewogICAweDAxIH07Cg==';    	
  	}
};
/** Class for helping with worker.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {function|string} exec - Function or script file to execute inside worker
 * @param {function} callback - Function to execute when worker send message
 */
cause.objects.worker = function (exec, callback) {
	this.name = 'worker';
	this.worker = null;
	this.callback = callback;

	window.URL = (window.URL || window.webkitURL);

	if (cause.helpIsOn) {
		return null;
	}

	if (typeof(exec) == 'function') {
		this.init(exec.toString());
	} else {
		cause.ajax({
			url: exec,
			method: 'get',
			dataType: 'html',
			success: (function(code) {
				this.init('function() {' + code + '}');
			}).bind(this),
			error: function() {
				cause.alert(cause.localize('errorWorkerFileNotFound'), cause.localize('error'));
			}
		});
	}
};

/** Show help when is cause.help('worker') is call.
 *
 * @memberOf cause.objects.worker
 */
cause.objects.worker.prototype.help = function () {
	cause.log('Aide pour "cause.worker":', 'help_title');
	cause.log("\t" +
		'new cause.worker(funct)' + "\n\n\t" +
		'funct = Fonction à exécuter dans le worker', 'help');
};

/** Initiliaze the worker.
 *
 * @memberOf cause.objects.worker
 * @param {mixed} data - Information to send to worker
 */
cause.objects.worker.prototype.init = function (code) {
	// Try to include the library cause.js
	if (!code.includes('cause.min.js')) {
		code = code.replace('{', '{ if (typeof(cause) == "undefined") { self.importScripts("' + cause.location.getAbsoluteUrl(cause.baseUrl + 'js/cause.min.js') + '"); }');
	}

	if (!window.URL || !window.Blob || !window.Worker) {
		cause.alert(cause.localize('errorWorker'), cause.localize('error'));

		return null;
	} else {
		var blobURL = window.URL.createObjectURL(
			new Blob(['(', code, ')()'], {
				type: 'application/javascript'
			}));

		this.worker = new Worker(blobURL);
	}

	this.worker.addEventListener('close', function() {
		cause.log('Your worker as close.');
	}, false);
	this.worker.addEventListener('error', function(e) {
		cause.log('Your worker send an error.', 'error');
		cause.log(e);
	}, false);
	this.worker.addEventListener('message', (this.callback || function() {
		cause.log('Your worker send a message. To catch it, you need to pass a callback function.');
	}), false);
};

/** Send data to the web worker.
 *
 * @memberOf cause.objects.worker
 * @param {mixed} data - Information to send to worker
 */
cause.objects.worker.prototype.postMessage = function (data) {
	if (this.worker) {
		this.worker.postMessage(data);
	} else {
		cause.log('You worker is not initialized', 'error');
	}
};

/** Send data to the web worker.
 *
 * @memberOf cause.objects.worker
 * @param {mixed} data - Information to send to worker
 */
cause.objects.worker.prototype.post = cause.objects.worker.prototype.postMessage;/** Class for helping when we process the browser.
 * This class automatically add the browser name in class of tag "body".
 *
 * @constructor
 * @memberOf cause.objects
 * @property {string} agent - Original user agent in lower case
 * @property {boolean} gecko - True if web engine is gecko (firefox)
 * @property {boolean} blink - True if web engine is blink (Chrome, Vilvaldi, Opera). Blink is derived of webkit.
 * @property {boolean} webkit - True if web engine is webkit (Safari)
 * @property {boolean} trident - True if web engine is trident (MSIE)
 * @property {boolean} edgeHTML - True if web engine is edgeHTML (Edge). EdgeHTML is derived of trident.
 * @property {boolean} presto - True if web engine is presto (Old opera). Presto is derived of trident.
 * @property {integer|float|string} engineVersion - Engine version
 * @property {boolean} edge - True if web browser is edge
 * @property {boolean} msie - True if web browser is msie
 * @property {boolean} opera - True if web browser is opera
 * @property {boolean} chrome - True if web browser is chrome
 * @property {boolean} safari - True if web browser is safari
 * @property {boolean} firefox - True if web browser is firefox
 * @property {boolean} vivaldi - True if web browser is vivaldi
 * @property {integer} major - Browser major version
 * @property {integer|float|string} version - Browser version
 */
cause.objects.browser = function () {
    this.name = 'browser';
    this.agent = (typeof(navigator) === 'object' ? navigator.userAgent.toLowerCase() : '' );
    this.pattern = {};

    /* Web engine */
    this.gecko = false;
    this.blink = false;
    this.webkit = false;
    this.trident = false;
    this.edgeHTML = false;
    this.presto = false;
    this.engineVersion = 'unknown';

    /* Browser */
    this.edge = false;
    this.msie = false;
    this.opera = false;
    this.chrome = false;
    this.safari = false;
    this.firefox = false;
    this.vivaldi = false;
    this.major = 'unknown';
    this.version = 'unknown';

    /* Detect */
    this.detectBrowser();

    if (typeof(document) === 'object') {
        cause.$(document).ready((function () {
            this.setBodyClassBrowser();
            this.setBodyClassEngine();
        }).bind(this));
    }
};

/** Show help when is cause.help('browser') is call.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.help = function () {
    cause.log('Aide pour "cause.browser":', 'help_title');
    cause.log("\t" +
        'cause.browser.edge = True when is Microsoft Edge' + "\n\t" +
        'cause.browser.msie = True when is Microsoft Internet Explorer' + "\n\t" +
        'cause.browser.opera = True when is Opera' + "\n\t" +
        'cause.browser.chrome = True when is Chrome' + "\n\t" +
        'cause.browser.safari = True when is Safari' + "\n\t" +
        'cause.browser.firefox = True when is Firefox' + "\n\t" +
        'cause.browser.vivaldi = True when is Vivaldi', 'help');
};

/** Start the browser detection.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectBrowser = function () {
    this.pattern = {};

    if (this.agent.match(/webkit/)) {					// Webkit
        this.detectWebkitBrowser();
    } else if (this.agent.match(/trident|msie/)) {		// Internet Explorer
        this.detectTridentBrowser();
    } else if (this.agent.match(/gecko/)) {			    // Gecko
        this.detectGeckoBrowser();
    } else if (this.agent.match(/presto/)) {		   // Presto
        this.pattern.engine = /presto\/([0-9\.]+)/;
        this.pattern.browser = /version\/([0-9\.]+)/;
        this.presto = true;
        this.opera = true;
    }

    this.setVersion();
};

/** Gecko is mainly used on "Firefox".
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectGeckoBrowser = function () {
    this.pattern.engine = /rv:([0-9\.]+)/;
    this.pattern.browser = /gecko\/([0-9\.]+)/;
    this.gecko = true;

    if (this.agent.match(/firefox/)) {				// Firefox
        this.pattern.browser = /firefox\/([0-9\.]+)/;
        this.firefox = true;
    }
};

/** Trident is mainly used on "MSIE".
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectTridentBrowser = function () {
    this.pattern.engine = /trident\/([0-9\.]+)/;
    this.pattern.browser = /msie ([0-9\.]+)/;
    this.trident = true;
    this.msie = true;

    if (this.agent.match(/rv:/)) {					// Internet Explorer 11 et +
        this.pattern.browser = /rv:([0-9\.]+)/;
    } else if (!this.agent.match(/msie/)) {          // No "rv:" and no "msie", we assume that it's IE 11
        this.pattern.browser = '';
        this.major = 11;
        this.version = '11.0';
    }
};

/** The web engine "webkit" is used on many browser (Edge, Safari).
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectWebkitBrowser = function () {
    this.pattern.engine = /applewebkit\/([0-9\.]+)/;
    this.pattern.browser = /webkit\/([0-9\.]+)/;
    this.webkit = true;

    if (this.agent.match(/edge/)) {                  // Microsoft Edge
        this.pattern.browser = /edge\/([0-9\.]+)/;
        this.edgeHTML = true;
        this.edge = true;
    } else if (this.agent.match(/chrome/)) {
        // The web engine "blink" is used on many browser (Chrome, Opera, Vivaldi)
        this.blink = true;

        if (this.agent.match(/vivaldi/)) {			// Vivaldi
            this.pattern.browser = /vivaldi\/([0-9\.]+)/;
            this.vivaldi = true;
        } else if (this.agent.match(/opr/)) {		// Opera
            this.pattern.browser = /opr\/([0-9\.]+)/;
            this.opera = true;
        } else if (this.agent.match(/crios/)) {      // Chrome on iOS
            this.pattern.browser = /crios\/([0-9\.]+)/;
            this.chrome = true;
        } else {									// Chrome
            this.pattern.browser = /chrom(e|ium)\/([0-9\.]+)/;
            this.chrome = true;
        }
    } else if (this.agent.match(/safari/)) {	   	// Safari
        this.pattern.browser = /version\/([0-9\.]+)/;
        this.safari = true;
    }
};

/** Set version with detected pattern.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.setVersion = function () {
    if (this.pattern.browser) {
        var browserVersion = this.agent.match(this.pattern.browser);

        this.major = ( browserVersion ? (browserVersion[2] ? parseInt(browserVersion[2], 10) : parseInt(browserVersion[1], 10)) : 'unknown' );
        this.version = ( browserVersion ? (browserVersion[2] ? browserVersion[2] : browserVersion[1]) : 'unknown' );
    }

    if (this.pattern.engine) {
        var engineVersion = this.agent.match(this.pattern.engine);

        this.engineVersion = (engineVersion ? parseFloat(engineVersion[1]) : 'unknown');
    }
};

/** Add class on body to use browser with CSS.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.setBodyClassBrowser = function () {
    if (this.chrome) {
        cause.$('body').addClass('chrome');
    } else if (this.edge) {
        cause.$('body').addClass('edge');
    } else if (this.firefox) {
        cause.$('body').addClass('firefox');
    } else if (this.opera) {
        cause.$('body').addClass('opera');
    } else if (this.safari) {
        cause.$('body').addClass('safari');
    } else if (this.vivaldi) {
        cause.$('body').addClass('vivaldi');
    }
};

/** Add class on body to use engine with CSS.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.setBodyClassEngine = function () {
    if (this.blink) {
        cause.$('body').addClass('webkit');
        cause.$('body').addClass('blink');
    } else if (this.edgeHTML) {
        cause.$('body').addClass('webkit');
        cause.$('body').addClass('edgeHTML');
    } else if (this.webkit) {
        cause.$('body').addClass('webkit');
    } else if (this.gekco) {
        cause.$('body').addClass('gekco');
    } else if (this.trident) {
        cause.$('body').addClass('trident');
    }
};

/** @property {cause.objects.browser} */
cause.browser = new cause.objects.browser();/** Singleton for helping when we process the ip address
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.connectionIp = function () {
	this.name = 'connectionIp';
	this.info = {};
	this.total = 0;
	this.return = 0;
	this.callback = null;
	this.localIPs = [];
	this.localCallback = null;
};

/** Find the computer local IP.
 * This function work for now, but we can't be sure that always work (2016/05/26).
 *
 * @memberOf cause.objects.connectionIp
 * @param {function} callback - Function to execute when we found the address
 * @param {integer} type - Number 4, 6 or null to specific a type of address
 */
cause.objects.connectionIp.prototype.local = function (callback, type) {
	this.localIPs = [];
	this.localCallback = callback;

	try {
        if (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection) {
            var myPeerConnection = (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection);
            var pc = new myPeerConnection({iceServers: []});
            var noop = function () {
            };
            var ipRegex = (type === 6 ? /([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g : (type === 4 ? /([0-9]{1,3}(\.[0-9]{1,3}){3})/g : /([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}|[0-9]{1,3}(\.[0-9]{1,3}){3})/g ));

            /* Create a bogus data channel */
            pc.createDataChannel('');

            /* Create offer and set local description */
            pc.createOffer(function (sdp) {
                pc.setLocalDescription(sdp, noop, noop);
            }, noop);

            /* Listen for candidate events */
            pc.onicecandidate = (function (ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
                    return;
                }

                ice.candidate.candidate.match(ipRegex).forEach(this.localFind.bind(this));
            }).bind(this);
		} else {
        	throw 'No RTC';
		}
    } catch (e) {
        if (typeof(this.localCallback) === 'function') {
            this.localCallback([]);
        }
    }
};

/** Store all local ip and execute the callback when we all receive it.
 *
 * @memberOf cause.objects.connectionIp
 * @param {string} ip - New local ip
 */
cause.objects.connectionIp.prototype.localFind = function (ip) {
	this.localIPs.push(ip);

	cause.wait((function () {
		if (typeof(this.localCallback) === 'function') {
			this.localCallback(this.localIPs);
		}
	}).bind(this), 250);
};

/** Check many IP service.
 * The ip-api.com service look the best on may 2016.
 *
 * @memberOf cause.objects.connectionIp
 * @param {function} callback - Function pass to getIp function
 */
cause.objects.connectionIp.prototype.get = function (callback) {
	this.info = {1: {}};
	this.total = 1;
	this.return = 0;
	this.callback = callback;

	cause.ajax({
		url: 'http://ip-api.com/json?callback=',
		dataType: 'json',
		success: this.success.bind(this, 1),
		complete: (function () {
			if (typeof(this.callback) === 'function') {
				this.callback({
					ip: this.info[1].query,
					country_code: this.info[1].countryCode,
					country: this.info[1].country,
					region_name: this.info[1].regionName,
					city: this.info[1].city,
					zip_code: this.info[1].zip,
					timezone: this.info[1].timezone,
					as_name: this.info[1].as,
					latitude: this.info[1].lat + '',
					longitude: this.info[1].lon + ''
				});
			}
		}).bind(this)
	});
};

/** Check many IP service.
 * The ip-api.com look the best on may 2016
 *
 * @memberOf cause.objects.connectionIp
 * @param {function} callback - Function pass to getIp function
 */
cause.objects.connectionIp.prototype.getConfirm = function (callback) {
	this.info = {1: {}, 2: {}, 3: {}, 4: {}, 5: {}};
	this.total = 5;
	this.return = 0;
	this.callback = callback;

	cause.ajax({
		url: 'http://ip-api.com/json?callback=',
		dataType: 'json',
		success: this.success.bind(this, 1),
		complete: this.complete.bind(this, 1)
	});
	cause.ajax({
		url: 'http://api.snoopi.io/v1/',
		dataType: 'json',
		success: this.success.bind(this, 2),
		complete: this.complete.bind(this, 2)
	});
	cause.ajax({
		url: 'http://www.geoplugin.net/json.gp?jsoncallback=?',
		dataType: 'json',
		success: this.success.bind(this, 3),
		complete: this.complete.bind(this, 3)
	});
	cause.ajax({
		url: 'http://gd.geobytes.com/GetCityDetails?callback=?',
		dataType: 'json',
		success: this.success.bind(this, 4),
		complete: this.complete.bind(this, 4)
	});
	cause.ajax({
		url: 'http://ipinfo.io/',
		method: 'GET',
		dataType: 'json',
		success: this.success.bind(this, 5),
		complete: this.complete.bind(this, 5)
	});
};

/** Execute on each IP request.
 *
 * @memberOf cause.objects.connectionIp
 * @param {integer} priority - Priority of specific IP request
 * @param {object} data - Data receive from the request
 */
cause.objects.connectionIp.prototype.success = function (priority, data) {
	this.info[priority] = data;
};

/** Execute on each IP request.
 *
 * @memberOf cause.objects.connectionIp
 */
cause.objects.connectionIp.prototype.complete = function () {
	this.return++;

	if (this.return === this.total) {
		this.finish();
	}
};

/** Validate some information of priority 1 with other service
 *
 * @memberOf cause.objects.connectionIp
 */
cause.objects.connectionIp.prototype.finish = function () {
	var data = {
		source: this.info
	};
	var info5_lat_lon = (this.info[5].loc ? this.info[5].loc.split(',') : []);

	// Confirm 2 source for the IP address
	data.ip = this.confirm(this.info[1].query, [
		this.info[2].remote_address,
		this.info[3].geoplugin_request,
		this.info[4].geobytesremoteip,
		this.info[5].ip]);

	// Confirm 2 source for the country code
	data.countryCode = this.confirm(this.info[1].countryCode, [
		this.info[2].CountryCode,
		this.info[3].geoplugin_countryCode,
		this.info[4].geobytesinternet,
		this.info[5].country]);

	// Confirm 2 source for the country
	data.country = this.confirm(this.info[1].country, [
		this.info[3].geoplugin_countryName,
		this.info[4].geobytescountry]);

	// Confirm 2 source for the region name
	data.regionName = this.confirm(this.info[1].regionName, [
		this.info[2].Region_Full,
		this.info[3].geoplugin_regionName,
		this.info[4].geobytesregion,
		this.info[5].region]);

	// Confirm 2 source for the city
	data.city = this.confirm(this.info[1].city, [
		this.info[2].City,
		this.info[3].geoplugin_city,
		this.info[4].geobytescity,
		this.info[5].city]);

	// Confirm 2 source for the zip code
	data.zipCode = this.confirm(this.info[1].zip, [this.info[5].postal]);

	// Confirm 2 source for the timezone
	data.timezone = this.confirm(this.info[1].timezone, [this.info[2].TimeZone_Name]);

	// Confirm 2 source for the ISP (ASN / AS number)
	data.asName = this.confirm(this.info[1].as, [this.info[5].org]);

	// Confirm 2 source for latitude
	data.latitude = this.confirm(this.info[1].lat + '', [
		this.info[2].Latitude,
		this.info[3].geoplugin_latitude,
		(this.info[4].geobyteslatitude ? this.info[4].geobyteslatitude.substr(0, 7) : ''),
		info5_lat_lon[0]]);

	// Confirm 2 source for longitude
	data.longitude = this.confirm(this.info[1].lon + '', [
		this.info[2].Longitude,
		this.info[3].geoplugin_longitude,
		(this.info[4].geobyteslongitude ? this.info[4].geobyteslongitude.substr(0, 7) : ''),
		info5_lat_lon[1]]);

	if (typeof(this.callback) === 'function') {
		this.callback(data);
	}
};

/** Confirm if the same value are find in second service.
 *
 * @memberOf cause.objects.connectionIp
 * @param {string} check - Value of service in priority 1
 * @param {array} inside - Equivalent value of other service
 */
cause.objects.connectionIp.prototype.confirm = function (check, inside) {
	if (inside.includes(check)) {
		return check;
	}

	return '';
};/** Class for helping when we process the network connection.
 * The quality of connection is percent of 1 Gbps.
 * This class automatically add the "online" or "offline" class on tag "body"
 *
 * @constructor
 * @memberOf cause.objects
 * @property {cause.objects.connectionIp} ip
 */
cause.objects.connection = function () {
	this.name = 'connection';
	this.loadingTime = 0;
	this.renderingTime = 0;
	this.quality = 100;
	this.speed = '';
	this.type = '';
	this.ip = new cause.objects.connectionIp();
	this.qualities = [
		{quality: 100, minimum: (1 * 1024 * 1024 * 1024), loadingTime: 0, estimate: '', type: 'LAN - Gbps'},
		{quality: 90, minimum: (0.5 * 1024 * 1024 * 1024), loadingTime: 0, estimate: '', type: 'LAN'},
		{quality: 80, minimum: (30 * 1024 * 1024), loadingTime: 25, estimate: '30 Mbps (min estimate)', type: 'Fiber'},
		{quality: 70, minimum: (15 * 1024 * 1024), loadingTime: 35, estimate: '30 Mbps (max estimate)', type: 'WIFI'},
		{quality: 60, minimum: (3 * 1024 * 1024), loadingTime: 60, estimate: '4 Mbps (max estimate)', type: 'Regular 4G'},
		{quality: 50, minimum: (1.5 * 1024 * 1024), loadingTime: 0, estimate: '', type: 'DSL'},
		{quality: 40, minimum: (750 * 1024), loadingTime: 100, estimate: '1.5 Mbps (max estimate)', type: 'Good 3G'},
		{quality: 30, minimum: (450 * 1024), loadingTime: 200, estimate: '750 Kbps (max estimate)', type: 'Regular 3G'},
		{quality: 20, minimum: (250 * 1024), loadingTime: 250, estimate: '450 Kbps (max estimate)', type: 'Good 2G'},
		{quality: 10, minimum: (50 * 1024), loadingTime: 500, estimate: '250 Kbps (max estimate)', type: 'Regular 2G'},
		{quality: 5, minimum: (20 * 1024), loadingTime: 1000, estimate: '50 Kbps (max estimate)', type: 'GPRS'}
	];

	/* Calcul loading time when page is ready */
	if (typeof(document) === 'object') {
		cause.$(document).ready((function (e) {
			cause.$('body').addClass('is-online');

			this.estimate(e);
		}).bind(this));
	}
};

/** Show help when is cause.help('connection') is call.
 *
 * @memberOf cause.objects.connection
 */
cause.objects.connection.prototype.help = function () {
	cause.log('Aide pour "cause.connection":', 'help_title');
	cause.log("\t" +
		'cause.connection.testSpeed() = Calcul the connection speed' + "\n\t" +
		'cause.connection.getIp() = Return an object with IP information', 'help');
};

/** Change status for "online".
 *
 * @memberOf cause.objects.connection
 * @param {object} e - Event object of navigator
 */
cause.objects.connection.prototype.online = function () {
	cause.$('body').addClass('is-online');
	cause.$('body').removeClass('is-offline');
};

/** Change status for "offline".
 *
 * @memberOf cause.objects.connection
 * @param {object} e - Event object of navigator
 */
cause.objects.connection.prototype.offline = function () {
	cause.$('body').addClass('is-offline');
	cause.$('body').removeClass('is-online');
};

/** Find all IP information.
 *
 * @memberOf cause.objects.connection
 * @param {function} callback - Function executed when all request are made
 * @param {boolean} confirm - True if we need a confirmed IP information
 */
cause.objects.connection.prototype.getIp = function (callback, confirm) {
	if (this.ip) {
		if (confirm) {
			this.ip.getConfirm(callback);
		} else {
			this.ip.get(callback);
		}
	}
};

/** Download a defined image to test the speed of connection.
 *
 * @memberOf cause.objects.connection
 */
cause.objects.connection.prototype.testSpeed = function () {
	var startTime = (new Date()).getTime();
	var download = new Image();

	download.onload = this.testOnCompleteDownload.bind(this, startTime);
	download.onerror = this.testOnError.bind(this);

	download.src = cause.baseUrl + 'images/test-5mb.jpg?_=' + startTime;
};

cause.objects.connection.prototype.testOnCompleteDownload = function (startTime) {
	var endTime = (new Date()).getTime();
	var duration = (endTime - startTime) / 1000;
	var downloadSize = 4995374;	// If we change the image "cause/images/test5mb.jpg", we need to change this value
	var bitsLoaded = downloadSize * 8;
	var speedBps = (bitsLoaded / duration);

	this.testOnError();

	for (var i=0, j=this.qualities.length; i<j; i++) {
		if (speedBps > this.qualities[i].minimum) {
			this.speed = cause.format.speed(speedBps);
			this.quality = this.qualities[i].quality;
			this.type = this.qualities[i].type;

			break;
		}
	}
};

cause.objects.connection.prototype.testOnError = function () {
	this.quality = 0;
	this.speed = '0 Bps';
	this.type = '';
};

/** Detect approximately the type of connection.
 * This estimate varies with the total size of page loaded.
 *
 * @memberOf cause.objects.connection
 * @param {object} e - Event object of navigator
 */
cause.objects.connection.prototype.estimate = function () {
	if (typeof(window.performance) === 'object') {
		this.loadingTime = window.performance.timing.domLoading - window.performance.timing.navigationStart;
		this.renderingTime = window.performance.timing.domComplete - window.performance.timing.domLoading;

		this.testOnError();

		for (var i=0, j=this.qualities.length; i<j; i++) {
			if (this.loadingTime < this.qualities[i].loadingTime) {
				this.speed = this.qualities[i].estimate;
				this.quality = this.qualities[i].quality;
				this.type = this.qualities[i].type;

				break;
			}
		}
	} else {
		this.quality = 100;
		this.speed = '';
		this.type = '';
	}
};

/** @property {cause.objects.connection} */
cause.connection = new cause.objects.connection();/** Singleton for helping when we want to detect some information.
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
cause.detect = new cause.objects.detect();/** Class for helping when we want an offline application.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.offline = function () {
	this.name = 'offline';

	/* Initialize the "offline" */
	if (!cause.helpIsOn && cause.$('html').attr('manifest')) {
		if (window.applicationCache) {
			this.init();
		} else {
			cause.alert(cause.localize('errorOffline'), cause.localize('error'));
		}
	}
};

/** Show help when is cause.help('offline') is call.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.help = function () {
	cause.log('Aide pour "cause.offline":', 'help_title');
	cause.log("\t" +
		'new cause.offline();', 'help');
};

/** Initialize the application cache.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.init = function () {
	window.applicationCache.addEventListener('cached', this.cached.bind(this), false);
	window.applicationCache.addEventListener('checking', this.checking.bind(this), false);
	window.applicationCache.addEventListener('downloading', this.downloading.bind(this), false);
	window.applicationCache.addEventListener('error', this.error.bind(this), false);
	window.applicationCache.addEventListener('noupdate', this.noUpdate.bind(this), false);
	window.applicationCache.addEventListener('obsolete', this.obsolete.bind(this), false);
	window.applicationCache.addEventListener('progress', this.progress.bind(this), false);
	window.applicationCache.addEventListener('updateready', this.updateReady.bind(this), false);
};

/** Fired after the first cache of the manifest.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.cached = function () {
};

/** Checking for an update. Always the first event fired in the sequence.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.checking = function () {
};

/** An update was found. The browser is fetching resources.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.downloading = function () {
};

/** The manifest returns 404 or 410, the download failed, or the manifest changed while the download was in progress.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.error = function () {
};

/** Fired after the first download of the manifest.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.noUpdate = function () {
};

/** Fired if the manifest file returns a 404 or 410. This results in the application cache being deleted.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.obsolete = function () {
};

/** Fired for each resource listed in the manifest as it is being fetched.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.progress = function () {
};

/** Fired when the manifest resources have been newly redownloaded.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.updateReady = function () {
	if (window.applicationCache.status === window.applicationCache.UPDATEREADY && confirm(cause.localize('offlineUpdate'))) {
		window.location.reload();
	}
};

/** @property {cause.objects.offline} */
cause.offline = new cause.objects.offline();/** Class for helping when we process the operating system.
 * This class automatically add the OS name in class of tag "body".
 *
 * @constructor
 * @memberOf cause.objects
 * @property {string} agent - Original user agent in lower case
 * @property {boolean} iOS - True if web OS is iOS (iphone/ipad)
 * @property {boolean} os2 - True if web OS is os2
 * @property {boolean} qnx - True if web OS is qnx
 * @property {boolean} beOS - True if web OS is beOS
 * @property {boolean} unix - True if web OS is unix
 * @property {boolean} linux - True if web OS is linux
 * @property {boolean} macOS - True if web OS is macOS
 * @property {boolean} sunOS - True if web OS is sunOS
 * @property {boolean} android - True if web OS is android
 * @property {boolean} openBSD - True if web OS is openBSD
 * @property {boolean} windows - True if web OS is windows
 * @property {boolean} chromeOS - True if web OS is chromeOS
 * @property {boolean} blackberry - True if web OS is blackberry
 * @property {integer|float|string} version - OS version
 */
(function () {
    /** Set version of Windows
     */
    var versionMac = function () {
        if (this.agent.match(/mac os x/)) {
            var macVersion = this.agent.match(/mac os x ([0-9\_]+)/);

            this.version = 'Mac OS X' + (macVersion ? ' ' + macVersion[1].replace('_', '.') : '');
        } else if (this.agent.match(/macppc|macintel|mac_powerpc|macintosh/)) {
            this.version = 'Mac OS';
        }
    };

    var versionWindows = function () {
        this.version = 'Windows';

        var windows = [
            {name: 'Windows 10', pattern: /windows nt 10.0|windows 10.0/},
            {name: 'Windows 10 Technical Preview', pattern: /windows nt 6.4/},
            {name: 'Windows 8.1', pattern: /windows nt 6.3|windows 8.1/},
            {name: 'Windows 8', pattern: /windows nt 6.2|windows 8.0|wow64/},
            {name: 'Windows 7 / Server 2008 RC2', pattern: /windows nt 6.1|windows 7/},
            {name: 'Windows Vista', pattern: /windows nt 6.0/},
            {name: 'Windows Server 2003', pattern: /windows nt 5.2/},
            {name: 'Windows XP', pattern: /windows nt 5.1|windows xp/},
            {name: 'Windows 2000', pattern: /windows nt 5.0|windows 2000/},
            {name: 'Windows NT 4.0', pattern: /windows nt 4.0|winnt4.0|winnt|windows nt/},
            {name: 'Windows CE', pattern: /windows ce/},
            {name: 'Windows ME', pattern: /windows me/},
            {name: 'Windows 98', pattern: /windows 98|win98/},
            {name: 'Windows 95', pattern: /windows 95|win95|windows_95/},
            {name: 'Windows 3.11', pattern: /win16/}
        ];

        for (var i=0, j=windows.length; i<j; i++) {
            if (this.agent.match(windows[i].pattern)) {
                this.version = windows[i].name;
                break;
            }
        }
    };

    /** Set version of Windows Phone
     */
    var versionWindowsPhone = function () {
        this.version = 'Windows Phone';

        var windows = [
            {name: 'Windows Phone 10', pattern: /windows phone 10/},
            {name: 'Windows Phone 8.1', pattern: /windows phone 8.1/},
            {name: 'Windows Phone 8', pattern: /windows phone 8/},
            {name: 'Windows Phone 7.5', pattern: /windows phone os 7.5/},
            {name: 'Windows Phone 7', pattern: /windows phone os 7/},
        ];

        for (var i=0, j=windows.length; i<j; i++) {
            if (this.agent.match(windows[i].pattern)) {
                this.version = windows[i].name;
                break;
            }
        }
    };

    cause.objects.os = function () {
        this.name = 'os';
        this.agent = (typeof(navigator) == 'object' ? navigator.userAgent.toLowerCase() : '' );

        // OS
        this.iOS = false;
        this.os2 = false;
        this.qnx = false;
        this.beOS = false;
        this.unix = false;
        this.linux = false;
        this.macOS = false;
        this.sunOS = false;
        this.android = false;
        this.openBSD = false;
        this.windows = false;
        this.chromeOS = false;
        this.blackberry = false;
        this.version = 'unknown';

        this.detectOS();
        this.setBodyClass();
    };

    /** Show help when is cause.help('os') is call
     *
     * @memberOf cause.objects.os
     */
    cause.objects.os.prototype.help = function () {
        cause.log('Aide pour "cause.os":', 'help_title');
        cause.log("\t" +
            'cause.os.iOS = True when is iOS' + "\n\t" +
            'cause.os.mac = True when is Mac' + "\n\t" +
            'cause.os.unix = True when is Unix' + "\n\t" +
            'cause.os.linux = True when is Linux' + "\n\t" +
            'cause.os.android = True when is Android' + "\n\t" +
            'cause.os.windows = True when is Windows', 'help');
    };

    /** Start the OS detection
     *
     * @memberOf cause.objects.os
     */
    cause.objects.os.prototype.detectOS = function () {
        var os = [
            {variable: 'windows', pattern: /win/},
            {variable: 'macOS', pattern: /mac/},
            {variable: 'android', pattern: /android/},
            {variable: 'iOS', pattern: /iphone|ipad|ipod/},
            {variable: 'chromeOS', pattern: /cros/},
            {variable: 'linux', pattern: /linux|x11/},
            {variable: 'blackberry', pattern: /blackberry/},
            {variable: 'openBSD', pattern: /openbsd/},
            {variable: 'unix', pattern: /unix/},
            {variable: 'sunOS', pattern: /sunos/},
            {variable: 'beOS', pattern: /beos/},
            {variable: 'QNX', pattern: /qnx/},
            {variable: 'os2', pattern: /os\/2/}
        ];

        for (var i=0, j=os.length; i<j; i++) {
            if (this.agent.match(os[i].pattern)) {
                this[os[i].variable] = true;
                break;
            }
        }

        this.detectOSVersion();
    };

    cause.objects.os.prototype.detectOSVersion = function () {
        if (this.windows) {
            if (this.agent.match(/phone/)) {
                versionWindowsPhone.call(this);
            } else {
                versionWindows.call(this);
            }
        } else if (this.macOS) {
            versionMac.call(this);
        } else if (this.android) {
            var androidVersion = this.agent.match(/android ([0-9\.]+)/);

            this.version = 'Android' + (androidVersion ? ' ' + androidVersion[1] : '');
        } else if (this.ios) {
            var iOSVersion = this.agent.match(/os ([0-9\_]+)/);

            this.version = 'iOS' + (iOSVersion ? ' ' + iOSVersion[1].replace('_', '.') : '');
        }
    };

    /** Add class on body to use os with CSS.
     *
     * @memberOf cause.objects.os
     */
    cause.objects.os.prototype.setBodyClass = function () {
        if (typeof(document) == 'object') {
            /* On load we add class on body to use with CSS */
            cause.$(document).ready((function () {
                if (this.windows) {
                    cause.$('body').addClass('windows');
                } else if (this.macOS) {
                    cause.$('body').addClass('macos');
                } else if (this.android) {
                    cause.$('body').addClass('android');
                } else if (this.ios) {
                    cause.$('body').addClass('ios');
                } else if (this.chromeOS) {
                    cause.$('body').addClass('chromeos');
                } else if (this.linux) {
                    cause.$('body').addClass('linux');
                }
            }).bind(this));
        }
    };
}());

/** @property {cause.objects.os} */
cause.os = new cause.objects.os();/** Class for validate some element before application start.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.validate = function () {
	cause.log('Start basic validation');

	this.minimum();
};

/** Validate if everything we need is loaded.
 *
 * @memberOf cause.objects.validate
 */
cause.objects.validate.prototype.confirmLoading = function () {
	/* Validate if jQuery is loaded */
	if (!cause.jQuery()) {
		return null;
	}

	if (typeof($) != 'function') {
		return cause.needUpdate();
	}

	/* Validate if Globalize is loaded */
	if (typeof(myApp.config) == 'object') {
        if (typeof(Globalize) != 'function') {
            cause.log('You need to include Globalize in your HTML', 'error');
        } else {
			/* Validate if knockout is loaded */
            if (typeof(ko) != 'object') {
                cause.log('You need to include Knockout in your HTML', 'error');
            } else {
				/* Validate if DevExpress is loaded */
                if (typeof(DevExpress) != 'object') {
                    cause.log('You need to include DevExtreme in your HTML', 'error');
                }
            }
        }
    }
};

/** Show help when is cause.help('validate') is call.
 *
 * @memberOf cause.objects.validate
 */
cause.objects.validate.prototype.help = function () {
	cause.log('Aide pour "cause.validate":', 'help_title');
	cause.log("\t" +
		'Ce module est exécuté automatiquement pour valider certain élément de base', 'help');
};

/** Make the minimum validation.
 *
 * @memberOf cause.objects.validate
 */
cause.objects.validate.prototype.minimum = function () {
	var isAccepted = (typeof(acceptIframe) == 'boolean' && acceptIframe ? true : false);

	if (typeof(top) === 'object' && self !== top && isAccepted !== true) {
		/** Confirm that our page is not included in a frame.
		 * If yes, we return user on the main window.
		 */
		top.location = self.location;
	}

	/* Ask user to update is browser */
	if (typeof(navigator) === 'object') {
		this.browser();
	}

	this.confirmLoading();
};

cause.objects.validate.prototype.browser = function () {
	var isOldMicrosoftBrowser = (cause.browser.msie || cause.browser.presto || (cause.browser.edge && cause.browser.major < 13));
	var isOldWebkitBrowser = (cause.browser.webkit && cause.browser.enginVersion < 537);
	var isOldGeckoBrowser = (cause.browser.gecko && cause.browser.enginVersion < 40);

	if ((isOldMicrosoftBrowser || isOldWebkitBrowser || isOldGeckoBrowser) && !this.acceptOlderBrowser()) {
        cause.needUpdate();
	}
};

cause.objects.validate.prototype.acceptOlderBrowser = function () {
	var listOfBrowser = (typeof(acceptOldBrowser) == 'object' ? acceptOldBrowser : {});

    for (var name in listOfBrowser) {
        if (cause.browser[name] && listOfBrowser[name].includes(cause.browser.major)) {
            return true;
        }
    }

    return false;
};

/** @property {cause.objects.validate} */
cause.validate = new cause.objects.validate();
/** Singleton for helping when we process to browser.
 *
 * @namespace
 * @memberOf cause
 */
cause.window = {
	/** Show help when is cause.help('request') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.window":', 'help_title');
		cause.log("\t" +
			'cause.window.fullscreen() = Place la fenêtre en mode plein écran' + "\n\t" +
			'cause.window.exitFullscreen() = Sort la fenêtre du mode plein écran' + "\n\t" +
			'cause.window.isFullscreen() = Test si le mode plein écran est actif' + "\n\t" +
			'cause.window.open(url, [Vrai pour enlever la barre de menu]) = Ouvre une nouvelle fenêtre', 'help');
	},

	/** Fullscreen status change.
	 *
	 * @param {object} e - Event object of navigator
	 */
	changeFullscreen: function () {
		if (typeof($) == 'function') {
			if (this.isFullscreen()) {
				cause.$('body').addClass('is-fullscreen');
			} else {
				cause.$('body').removeClass('is-fullscreen');
			}
		}
	},

	/** Exit element of fullscreen.
	 */
	exitFullscreen: function () {
		cause.$('.is-fullscreen').removeClass('is-fullscreen');

  		if (document.exitFullscreen) {
    		document.exitFullscreen();
  		} else if (document.mozCancelFullScreen) {
    		document.mozCancelFullScreen();
  		} else if (document.webkitExitFullscreen) {
    		document.webkitExitFullscreen();
  		}
	},

	/** Place element on fullscreen.
	 *
	 * @param {HTMLElement} element - Element we want fullscreen
	 */
	fullscreen: function (element) {
		if (!element) {
			element = document.querySelector('body');
		}

		if (element.requestFullscreen) {
    		element.requestFullscreen();
  		} else if (element.mozRequestFullScreen) {
    		element.mozRequestFullScreen();
  		} else if (element.webkitRequestFullscreen) {
    		element.webkitRequestFullscreen();
  		} else if (element.msRequestFullscreen) {
    		element.msRequestFullscreen();
  		}
	},

	/** Check if element on screen is fullscreen
	 *
	 * @returns {boolean} True if window is fullscreen
	 */
	isFullscreen: function () {
		if ((screen.availHeight || screen.height-30) <= window.innerHeight) {
    		return true;
		}

  		return false;
	},

	/** Open a link on new window
	 *
	 * @param {string} url - Page url
	 * @param {boolean} noToolbar - True to remove all toolbar
	 */
	open: function (url, noToolbar) {
		if (url) {
			var elm = cause.$('<a>');
			var options = ['toolbar=no', 'menubar=no', 'location=no', 'directories=no', 'status=no'];

			if (noToolbar) {
				elm.attr('onclick', 'window.open(\'' + url + '\', \'\', \'' + options.join(',') + '\')');
			} else {
				elm.attr('href', url);
			}

			elm.attr('target', '_blank');
			elm.get(0).click();
		}
	}
};
/** Class for helping when we want to use devExtreme 15.
 *
 * @constructor
 * @memberOf cause.objects
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme15 = function (callback) {
    this.name = 'devExtreme15';
    this.callback = callback;
    this.load();
};

cause.objects.devExtreme15.prototype.load = function () {
    if (!cause.helpIsOn) {
        this.loadCSS();
        this.loadMinimalJS();
    }
};

cause.objects.devExtreme15.prototype.complete = function () {
    this.callback();
};

cause.objects.devExtreme15.prototype.loadMinimalJS = function () {
    cause.include.js([
        cause.baseUrlPlugins + 'jQuery/jquery-2.2.4.min.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/jszip.min.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/knockout-3.4.0.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize.min.js'
    ], this.complete.bind(this), cause.validate.confirmLoading);
};

cause.objects.devExtreme15.prototype.loadCSS = function () {
    var version = parseFloat(cause.version.devExtreme);
    var hasDesktop = document.querySelectorAll('link[href*=DesktopLayout]').length > 0 ? true : false;
    var files = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.css',
        cause.baseUrlPlugins + 'fontAwesome/' + cause.version.fontAwesome + '/css/font-awesome.min.css'
    ];

    if (!hasDesktop) {
        files.push(cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.html');
    }

    cause.include.css(files);
};
/** Class for helping when we want to use devExtreme 16.
 *
 * @constructor
 * @memberOf cause.objects
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme16 = function (callback) {
    this.name = 'devExtreme16';
    this.callback = callback;
    this.load();
};

cause.objects.devExtreme16.prototype.load = function () {
    if (!cause.helpIsOn) {
        this.loadCSS();
        this.loadMinimalJS();
    }
};

cause.objects.devExtreme16.prototype.complete = function () {
    this.callback();
};

cause.objects.devExtreme16.prototype.loadMinimalJS = function () {
    cause.include.js([
        cause.baseUrlPlugins + 'jQuery/jquery-' + (parseFloat(cause.version.devExtreme) > 16.1 ? cause.version.jQuery : '2.2.4') + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/jszip' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/knockout-' + cause.version.knockout + (myApp.config && myApp.config.isdev ? '.debug' : '') + '.js',
        cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr.js'
    ], (function () {
        cause.include.js([
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/cldr/event' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/cldr/supplemental' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
        ], (function () {
            cause.include.js([
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/message' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/number' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
            ], (function () {
                cause.include.js([
                    cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/date' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
                ], this.complete.bind(this), cause.validate.confirmLoading);
            }).bind(this), cause.validate.confirmLoading);
        }).bind(this), cause.validate.confirmLoading);
    }).bind(this), cause.validate.confirmLoading);
};

cause.objects.devExtreme16.prototype.loadCSS = function () {
    var version = parseFloat(cause.version.devExtreme);
    var hasDesktop = document.querySelectorAll('link[href*=DesktopLayout]').length > 0 ? true : false;
    var files = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.css',
        cause.baseUrlPlugins + 'fontAwesome/' + cause.version.fontAwesome + '/css/font-awesome.min.css'
    ];

    if (!hasDesktop) {
        files.push(cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.html');
    }

    cause.include.css(files);
};
/** Class for helping when we want to use devExtreme 17.
 *
 * @constructor
 * @memberOf cause.objects
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme17 = function (callback) {
    this.name = 'devExtreme17';
    this.callback = callback;
    this.load();
};

cause.objects.devExtreme17.prototype.load = function () {
    if (!cause.helpIsOn) {
        this.loadCSS();
        this.loadMinimalJS();
    }
};

cause.objects.devExtreme17.prototype.complete = function () {
    this.callback();
};

cause.objects.devExtreme17.prototype.loadMinimalJS = function () {
    cause.include.js([
        cause.baseUrlPlugins + 'jQuery/jquery-' + cause.version.jQuery + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/jszip' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/knockout-' + cause.version.knockout + (myApp.config && myApp.config.isdev ? '.debug' : '') + '.js',
        cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr.js'
    ], (function () {
        cause.include.js([
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/cldr/event' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/cldr/supplemental' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
        ], (function () {
            cause.include.js([
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/message' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/number' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
            ], (function () {
                cause.include.js([
                    cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/date' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
                ], this.complete.bind(this), cause.validate.confirmLoading);
            }).bind(this), cause.validate.confirmLoading);
        }).bind(this), cause.validate.confirmLoading);
    }).bind(this), cause.validate.confirmLoading);
};

cause.objects.devExtreme17.prototype.loadCSS = function () {
    var version = parseFloat(cause.version.devExtreme);
    var hasDesktop = document.querySelectorAll('link[href*=DesktopLayout]').length > 0 ? true : false;
    var files = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.css',
        cause.baseUrlPlugins + 'fontAwesome/' + cause.version.fontAwesome + '/css/font-awesome.min.css'
    ];

    if (!hasDesktop) {
        files.push(cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.html');
    }

    cause.include.css(files);
};
/** Class for helping when we want to use devExtreme.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.devExtreme = function () {
    this.name = 'devExtreme';
    this.width = 0;
    this.datagrid = {
        createToolbar: function (e) {
            if (e.element.find('.dx-datagrid-header-panel').length == 0) {
                e.element.find('.dx-datagrid-headers').prev().replaceWith('<div class="dx-datagrid-header-panel"><div class="dx-toolbar"></div></div>');
                e.element.find('.dx-datagrid-header-panel .dx-toolbar').dxToolbar({
                    items: []
                });
            }
        },

        extractData: function (grid, key, fields) {
            var total = grid.totalCount();
            var store = new DevExpress.data.ArrayStore({
                data: [],
                onUpdated: function (key, values) {
                    var info = cause.extend({}, key, values);

                    cause.ajax({
                        url: '//' + myApp.config.webservice.host + '/multilang/',
                        method: 'POST',
                        data: info
                    });
                }
            });

            for (var i=0; i<total; i++) {
                grid.byKey(grid.cellValue(i, key)).done(function (data) {
                    for (var j=0, k=fields.length; j<k; j++) {
                        store.insert(data[fields[j]]);
                    }
                });
            }

            return store;
        },

        languageColumns: function () {
            var columns = [];

            for (var i=0, j=cause.languages.available.length; i<j; i++) {
                columns.push({
                    caption: cause.localize(cause.languages.available[i]),
                    dataField: cause.languages.available[i]
                });
            }

            return columns;
        },

        addTranslate: function (e, key, fields, callback) {
            this.createToolbar(e);

            if (!$('.fa.fa-globe', e.element).length) {
                var toolbar = e.element.find('.dx-datagrid-header-panel .dx-toolbar').dxToolbar('instance');
                var items = toolbar.option('items');
                var store = this.extractData(e.component, key, fields);
                var columns = this.languageColumns();

                items.push({
                    location: 'after',
                    widget: 'dxButton',
                    name: 'print',
                    options: {
                        icon: 'fa fa-globe',
                        onClick: (function (store, columns, callback) {
                            if ($('#popupTranslate').length) {
                                $('#popupTranslate').remove();
                            }

                            $('<div id="popupTranslate">').html('<div class="popupGrid" />').appendTo('body');
                            $('#popupTranslate').dxPopup({
                                visible: true,
                                title: cause.localize('translate'),
                                toolbarItems: [{
                                    options: {
                                        text: cause.localize('cancel'),
                                        onClick: function() {
                                            $('#popupTranslate').dxPopup('instance').hide();
                                        }
                                    },
                                    toolbar: 'bottom',
                                    widget: 'dxButton'
                                }],
                                onHidden: function () {
                                    callback();
                                },
                                onShown: function (e) {
                                    $('div.popupGrid', e.component.content()).dxDataGrid({
                                        dataSource: store,
                                        height: (screen.height / 1.7),
                                        paging: {
                                            enabled: false
                                        },
                                        editing: {
                                            mode: 'cell',
                                            allowUpdating: true
                                        },
                                        columns: columns
                                    });
                                }
                            });
                        }).bind(this, store, columns, callback)
                    }
                });
                toolbar.option('items', items);
            }
        },

        addPrint: function (e) {
            this.createToolbar(e);

            if (!$('.fa.fa-print', e.element).length) {
                var toolbar = e.element.find('.dx-datagrid-header-panel .dx-toolbar').dxToolbar('instance');
                var items = toolbar.option('items');

                items.push({
                    location: 'after',
                    widget: 'dxButton',
                    name: 'print',
                    options: {
                        icon: 'fa fa-print',
                        onClick: function () {
                            cause.print(e.element);
                        }
                    }
                });
                toolbar.option('items', items);
            }
        }
    };

    /* Keep this function to keep fonctionnal with first version */
    cause.app = this.app.bind(this);
    cause.loadAPP = this.loadAPP.bind(this);
};

/** Create a new basic application.
 *
 * @memberOf cause.objects.devExtreme
 * @param {object} config - Object with every parameters we need.
 * All parameters for DevExpress.framework.html.HtmlApplication are valid.
 * @param {string} config.device - By default we force "desktop", this way always had the sample theme color.
 * @param {string} config.language - By default we use "fr".
 * @param {string} config.theme - By default we use "generic.light".
 * @param {function} config.load - Function to execute when APP is loaded.
 */
cause.objects.devExtreme.prototype.app = function (config) {
    if (!cause.helpIsOn) {
        cause.log('The application is started');

        DevExpress.ui.themes.current(config.theme ? config.theme : 'generic.light');

        if (cause.$('body').width() >= 1000) {
            DevExpress.devices.current(config.device ? config.device : 'desktop');
        }

        config = cause.extend({}, {
            mode: 'webSite',
            language: (myApp.config ? (myApp.config.language || 'fr') : 'fr'),
            namespace: myApp,    // The application variable absolutely need to be "myApp"
            animationSet: DevExpress.framework.html.animationSets['default'],
            layoutSet: DevExpress.framework.html.layoutSets[(cause.$('body').width() < 1000 ? 'slideout' : 'desktop')],
            logout: cause.localize('logout'),
            navigation: [{
                title: cause.localize('home'),
                onExecute: '#home',
                icon: 'home'
            }]
        }, config);

        if (typeof(config.loaded) === 'function') {
            setTimeout(config.loaded, 1000);
        }

        var app = new DevExpress.framework.html.HtmlApplication(config);
        app.on('viewRendered', this.renderAPP.bind(this, config));

        return app;
    }
};

/** Execute when application is rendered.
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} config - Application configuration
 */
cause.objects.devExtreme.prototype.renderAPP = function (config, e) {
    if (cause.$('body').width() < 1000) {
        $('.dx-content').dxScrollView();
    }

    $('#navBar .dx-item').each((function (menus, nb, element) {
        var title = $(element).html().stripTags().trim();

        this.createSubMenu(menus, title, $('#navBar').parent(), element);
    }).bind(this, config.navigation));
    $('.dx-slideout-menu .dx-item').each((function (menus, nb, element) {
        var title = $(element).html().stripTags().trim();

        this.createSubMenu(menus, title, $('.dx-slideout-menu').parent(), element);
    }).bind(this, config.navigation));
};

/** Create a navbar for navigation with submenu element
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} menus - Application navigation configuration
 * @params {string} title - Text of menu
 * @params {html} container - HTML where we include the submenu
 * @params {html} element - HTML where we show and hide the submenu
 */
cause.objects.devExtreme.prototype.createSubMenu = function (menus, title, container, element) {
    for (var i=0, j=menus.length; i<j; i++) {
        if (menus[i].title == title) {
            if (typeof(menus[i].submenu) == 'object') {
                var uniqueId = cause.unique() + '-submenu';
                var isSlideout = (container.parents('.dx-slideout').length ? true : false);
                var type = (isSlideout ? 'dxList' : (menus[i].submenuType ? menus[i].submenuType : 'dxList'));

                container = (isSlideout ? $('.dx-item-content', element) : container);

                $('<div>').attr('data-submenu-type', type).css({
                    width: (isSlideout ? '100%' : (type == 'dxList' ? $(element).outerWidth() : 'auto')),
                    'margin-left': (isSlideout ? 0 : (type == 'dxList' ? $(element).position().left - 1 : 'auto'))
                }).attr('id', uniqueId).html('<div class="element" />').appendTo(container);

                $('#' + uniqueId + ' .element')[type]({
                    items: menus[i].submenu,
                    height: 'auto',
                    itemTemplate: (function (container, itemData, itemIndex, itemElement) {
                        var title = itemData.title || itemData.text;

                        if (!itemData.submenu) {
                            return title;
                        }

                        $('<div>').html(title).appendTo(itemElement);
                        $('<div>').addClass('subList').html('<div />').appendTo(itemElement);

                        $(itemElement).hover(function (e) {
                            $('.subList', this).css({
                                'opacity': 1,
                                'max-height': '5000px'
                            });
                        }, function (e) {
                            $('.subList', this).css({
                                'opacity': 0,
                                'max-height': 0
                            });
                        });

                        $('.subList div', itemElement)[type]({
                            items: itemData.submenu,
                            height: 'auto',
                            onItemClick: (function (container, e) {
                                this.closeSubMenu(container);

                                location.href = e.itemData.onExecute;
                            }).bind(this, container)
                        });
                    }).bind(this, container),
                    onItemClick: (function (container, e) {
                        this.closeSubMenu(container);

                        location.href = e.itemData.onExecute;
                    }).bind(this, container)
                });

                $('#' + uniqueId).mouseleave((function(container) {
                    this.closeSubMenu(container);
                }).bind(this, container));

                $(element).hover((function (container, uniqueId) {
                    this.closeSubMenu(container);
                    $(uniqueId).css({
                        'opacity': 1,
                        'max-height': '5000px'
                    });
                }).bind(this, container, '#' + uniqueId));
            } else {
                $(element).hover((function (container) {
                    this.closeSubMenu(container);
                }).bind(this, container));
            }
        }
    }
};

cause.objects.devExtreme.prototype.closeSubMenu = function (container) {
    $(container).find("[id^='cause-']").each(function(nb, element) {
        $(element).css({
            'opacity': 0,
            'max-height': 0
        });
    });
};

/** Load every needed by an application.
 * The basic array is ['js/app.js', 'js/home.js', 'views/home.html']
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme.prototype.loadAPP = function (files) {
    if (!cause.helpIsOn) {
        var devExtreme = 'devExtreme' + parseInt(cause.version.devExtreme);
        new cause.objects[devExtreme](this.loadDevExtreme.bind(this, files));

        if (document) {
            this.width = (document.body.clientWidth || document.documentElement.clientWidth || window.innerWidth);

            cause.on('resize', (function () {
                var width = (document.body.clientWidth || document.documentElement.clientWidth || window.innerWidth);

                if ((this.width > 1000 && width < 1000) || (this.width < 1000 && width > 1000)) {
                    location.reload();
                }

                this.width = width;
            }).bind(this));
        }
    }
};

/** Load DevExtreme.
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme.prototype.loadDevExtreme = function (files) {
    cause.log('jQuery is automatically loaded');

    var oldVersion = ['15.2.10', '16.1.7', '16.1.8'];
    var nbLabels = (files.containIndexOf('labels.js') > -1 ? files.containIndexOf('labels.js') : files.containIndexOf('label.js'));
    var toLoad = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/dx.all' + (myApp.config && myApp.config.isdev ? '.debug' : '') + '.js'
    ];

    if (nbLabels > -1) {
        toLoad.push(files[nbLabels]);
        files.splice(nbLabels, 1);
    }

    cause.include.js(toLoad, (function (files) {
        /* When we have devExtreme, we can loaded the layouts */
        cause.log('devExtreme is automatically loaded');

        cause.include.js([
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/localization/dx.' + (oldVersion.includes(cause.version.devExtreme) ? 'all' : 'messages') + '.fr.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.js'
        ], (function (files) {
            cause.include.js([
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.js',
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.js'
            ], (function (files) {
                /* And we finish the application files */
                cause.log('devExtreme layouts is automatically loaded');
                cause.dxMultiLine = new cause.objects.dxMultiLine();
                cause.dxMultiLang = new cause.objects.dxMultiLang();
                cause.dxSortable = new cause.objects.dxSortable();

                this.loadJsFiles(files);
            }).bind(this, files), cause.validate.confirmLoading);
        }).bind(this, files), cause.validate.confirmLoading);
    }).bind(this, files), cause.validate.confirmLoading);
};

/** Load application file.
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme.prototype.loadJsFiles = function (files) {
    cause.include.css(files);

    /* We upload app.js first if this file is in the list */
    var nbApp = files.containIndexOf('app.js');

    if (nbApp > -1) {
        cause.include.js(files[nbApp], (function (files, nbApp) {
            files.splice(nbApp, 1);

            cause.include.js(files, (function () {
                cause.log('The application is loaded');
                cause.labels.load();
                cause.listeners.execute('ready');
            }).bind(this, files), function () {
                cause.alert(cause.localize('missingFile'), cause.localize('error'));
            });
        }).bind(this, files, nbApp), function () {
            cause.alert(cause.localize('missingFile'), cause.localize('error'));
        });
    } else {
        cause.include.js(files, (function () {
            cause.log('The application is loaded');
            cause.labels.load();
            cause.listeners.execute('ready');
        }).bind(this, files), function () {
            cause.alert(cause.localize('missingFile'), cause.localize('error'));
        });
    }
};

/** Add link for each language
 *
 * @memberOf cause.objects.devExtreme
 */
cause.objects.devExtreme.prototype.showLanguage = function () {
    for (var i=0, j=cause.languages.available.length; i<j; i++) {
        if (cause.languages.available[i] !== cause.languages.select) {
            cause.$('<a>').addClass('lang').attr('href', './?lang=' + cause.languages.available[i]).html(cause.languages.available[i]).insertBefore('#menutop #logout');
        }
    }
};

/** @property {cause.objects.devExtreme} */
cause.devExtreme = new cause.objects.devExtreme();/** Class to create a new DevExtreme widget (dxMultiLang)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxMultiLang = function () {
    DevExpress.registerComponent('dxMultiLang', (function (_super) {
        cause.extends(customControl, _super);

        var totalColumn = 0;
        var config = {};
        var container = $('<div>');
        var selectedLanguage = null;

        var _tabChanged = function (e) {
            selectedLanguage = e.addedItems[0].language;

            if (config.value) {
                if (typeof(config.value) != 'object') {
                    var tmpValue = config.value;
                    config.value = { id_language_content: null };

                    for (var i=0, j=cause.languages.available.length; i<j; i++) {
                        config.value[cause.languages.available[i]] = tmpValue;
                    }
                }
            } else {
                config.value = { id_language_content: null };

                for (var i=0, j=cause.languages.available.length; i<j; i++) {
                    config.value[cause.languages.available[i]] = '';
                }
            }

            container.find('input').val(config.value[selectedLanguage]);
        };

        var _createField = function () {
            $('<div class="dx-multilang-container">').html('<input type="text" />').focusin(function (e) {
                $(e.target).parents('.dx-multilang').addClass('focus');
            }).focusout(function (e) {
                $(e.target).parents('.dx-multilang').removeClass('focus');
            }).change(function (e) {
                config.value[selectedLanguage] = e.target.value;

                if (typeof(config.onValueChanged) == 'function') {
                    config.onValueChanged({
                        value: config.value,
                        jQueryEvent: e
                    });
                }
            }).appendTo(container);
        };

        var _createList = function () {
            config.value = (config.value ? config.value : {});
            selectedLanguage = cause.languages.available[0];

            var tabs = [];
            for (var i=0, j=cause.languages.available.length; i<j; i++) {
                tabs.push({
                    language: cause.languages.available[i],
                    text: cause.localize(cause.languages.available[i])
                });
            }

            $('<div>').dxNavBar({
                items: tabs,
                onSelectionChanged: _tabChanged
            }).appendTo(container);
        };

        function customControl(element, options) {
            _super.call(this, element, {});
            config = cause.extend({
                value: null,
                onValueChanged: null
            }, options);

            container.addClass('dx-multilang').addClass('dx-texteditor').html('').appendTo($(element));

            _createList();
            _createField();
        }

        return customControl;
    })(DevExpress.DOMComponent));
};/** Class to create a new DevExtreme widget (dxMultiLine)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxMultiLine = function () {
    DevExpress.registerComponent('dxMultiLine', (function (_super) {
        cause.extends(customControl, _super);

        var totalColumn = 0;
        var config = {};
        var container = $('<div>');

        var _onRemoveClick = function (e) {
            e.element.parents('.row').remove();
        };

        var _onAddingClick = function () {
            _createFormRow();
        };

        var _createAllRow = function () {
            config.value = (config.value ? config.value : []);

            if (config.value.length > 0) {
                for (var i=0, j=config.value.length; i<j; i++) {
                    _createFormRow(config.value[i]);
                }
            } else {
                _createFormRow();
            }
        };

        var _createFormRow = function (values) {
            totalColumn = 0;
            var column = Math.floor(11 / config.items.length);

            if (container.find('.adding').length) {
                var row = $('<div class="row">').insertBefore(container.find('.adding'));
            } else {
                var row = $('<div class="row">').appendTo(container);
            }

            for (var i=0, j=config.items.length; i<j; i++) {
                $('<div class="col' + column + '">').appendTo(row).dxTextBox({
                    value: (values && typeof(values) == 'object' ? values[config.items.dataField] : (values || ''))
                });

                totalColumn += column;
            }

            var divColumn = $('<div class="col' + (12 - totalColumn) + '">').appendTo(row);
            $('<div>').appendTo(divColumn).dxButton({
                icon: 'remove',
                onClick: _onRemoveClick
            });
        };

        var _createAddingRow = function (items) {
            var row = $('<div class="row adding">').appendTo(container);

            $('<div class="col' + totalColumn + '">').appendTo(row);

            var divColumn = $('<div class="col' + (12 - totalColumn) + '">').appendTo(row);
            $('<div>').appendTo(divColumn).dxButton({
                icon: 'add',
                onClick: _onAddingClick
            });
        };

        function customControl(element, options) {
            _super.call(this, element, {});
            config = cause.extend({
                items: [{
                    caption: '',
                    dataField: '',
                    editorType: 'dxTextBox'
                }],
                value: []
            }, options);

            container.addClass('dx-multiline').appendTo($(element));

            _createAllRow();
            _createAddingRow();
        }

        return customControl;
    })(DevExpress.DOMComponent));
};/** Class to create a new DevExtreme widget (dxSortable)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxSortable = function () {
    DevExpress.registerComponent('dxSortable', (function (_super) {
        cause.extends(customControl, _super);

        var totalColumn = 0;
        var config = {};
        var uniqueId = '';
        var container = null;
        var containerUl = null;
        var dragElement = null;
        var viewElement = null;
        var moveInParent = null;
        var sideUpDown = '';
        var rowIndex = 0;

        var _cloneDraggedElement = function () {
            dragElement = viewElement.cloneNode(true);

            $(dragElement).addClass('dx-sortable-dragging').appendTo('body');
        };

        var _dragStarted = function (e) {
            viewElement = e.target;
            moveInParent = null;
            rowIndex = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);

            _cloneDraggedElement();
        };

        var _dragEnded = function (e) {
            var newIndex = Array.prototype.indexOf.call(viewElement.parentNode.children, viewElement);
            var step = (newIndex - rowIndex);
            var node = $('.dx-item', e.target).data();

            if (typeof(config.onEnd) == 'function') {
                if (moveInParent) {
                    config.onEnd(node, step, moveInParent);
                } else {
                    config.onEnd(node, step);
                }
            }
        };

        var _showPreview = function (e) {
            if (config.moveInside) {
                var parent = $(e.target).find('ul');

                if (parent.length == 0) {
                    parent = $('<ul>').addClass('dx-treeview-node-container').addClass('dx-treeview-node-container-opened').appendTo(e.target);
                }

                parent.append(viewElement);
                moveInParent = $('.dx-item', e.target).data();
            } else if (sideUpDown == 'down') {
                $(viewElement).insertAfter(e.target);
            } else {
                $(viewElement).insertBefore(e.target);
            }
        };

        var _initDraggable = function () {
            containerUl.find('li').on({
                dxdragstart: _dragStarted.bind(this),
                dxdragend: function (e) {
                    _dragEnded(e);

                    $(dragElement).remove();
                },
                dxdrag: function (e) {
                    sideUpDown = (parseInt($(dragElement).css('top')) > e.clientY ? 'up' : 'down');

                    $(dragElement).css({
                        'left': e.clientX,
                        'top': e.clientY
                    });
                },
                dxdragenter: _showPreview.bind(this),
                dxdragleave: function () {}
            });
        };

        var _reset = function () {
            setTimeout((function () {
                containerUl = $('ul', container);

                _initDraggable.call(this);
            }).bind(this), 500);
        };

        function customControl(element, options) {
            _super.call(this, element, {});

            config = cause.extend({
                moveInside: false,
                onEnd: null
            }, options || {});
            uniqueId = cause.unique();
            container = $(element).attr('id', uniqueId);
            containerUl = $(element).addClass('dx-sortable').find('ul');

            _initDraggable.call(this);

            this.reset = _reset.bind(this);
        };

        return customControl;
    })(DevExpress.DOMComponent));
};/** Class to simplify the DevExpress "CustomStore".
 * This class needed "DevExtreme" and "jQuery".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} options - Options to implement on store.
 * url, params, autoload, onLoaded, onUpdate, onInsert, onRemove
 */
cause.objects.store = function (options) {
    this.name = 'store';
    this.data = [];
    this.refresh = true;
    this.options = options || {};
    this.setFilter = '';
    this.setSort = '';

    this.createDataSource();

    if (this.options.filter) {
        this.setFilter = this.options.filter;
    }
    if (this.options.sort) {
        this.setSort = this.options.sort;
    }

    if (this.options.autoload) {
        this.dataSource.load();
    }
};

/** Show help when is cause.help('store') is call.
 */
cause.objects.store.prototype.help = function () {
    cause.log('Aide pour "cause.store":', 'help_title');
    cause.log("\t" +
        'new cause.store();', 'help');
};

cause.objects.store.prototype.createDataSource = function() {
    this.dataSource = new DevExpress.data.CustomStore({
        useDefaultSearch: true,
        load: this.onLoad.bind(this),
        byKey: this.onByKey.bind(this),
        insert: this.onInsert.bind(this),
        remove: this.onRemove.bind(this),
        update: this.onUpdate.bind(this)
    });
};

cause.objects.store.prototype.getUrl = function () {
    var basicUrl = (myApp.config && myApp.config.webroot ? myApp.config.webroot : './') + 'ajax/';

    if (!this.options.params) {
        return (this.options.url || basicUrl);
    } else if (typeof(this.options.params) == 'string') {
        return this.options.url + this.options.params;
    } else {
        var params = [];

        for (var i in this.options.params) {
            if (this.options.params.hasOwnProperty(i)) {
                params.push(i + '=' + this.options.params[i]);
            }
        }

        return this.options.url + ( params.length > 0 ? (this.options.url.includes('?') ? '&' : '?') : '' ) + params.join('&');
    }
};

/** Event executed on load to check if really need to reload the store.
 *
 * @param {object} loadOptions - Parameter for loading of CustomStore
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onLoad = function (loadOptions) {
    var deferred = $.Deferred();
    var url = this.getUrl();

    // load data from the remote service
    if (!this.refresh) {
        this.onLoadedAll(deferred, loadOptions, this.data);
    } else {
        cause.ajax({
            url: url,
            method: 'GET',
            headers: (this.options.headers || null),
            success: this.onLoadedAll.bind(this, deferred, loadOptions),
            error: this.onError.bind(this, deferred),
        });
    }

    return deferred.promise();
};

/** Event executed on load by key.
 *
 * @param {string} key - Specific key of store to load
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onByKey = function (key) {
    var deferred = $.Deferred();
    var url = this.getUrl();
    var byKey = (this.options.byKey || false);

    if (byKey) {
        cause.ajax({
            url: url + (myApp.config.webservice ? '' : '?id=') + key,
            method: 'GET',
            headers: (this.options.headers || null),
            success: this.onLoadedByKey.bind(this, deferred),
            error: this.onError.bind(this, deferred),
        });
    } else if (this.options.key) {
        return this.find(this.options.key, key);
    } else {
        return key;
    }

    return deferred.promise();
};

/** Event executed on inserting new element.
 *
 * @param {object} values - Object of new element
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onInsert = function (values) {
    var deferred = $.Deferred();

    if (typeof(this.options.onInsert) == 'function') {
        if (this.options.onInsert(deferred, values)) {
            this.refresh = true;
        }
    } else {
        deferred.resolve(false);
        cause.log('Vous devez définir l\'option onInsert au "store"!', 'error');
    }

    return deferred.promise();
};

/** Event executed on deleting an element.
 *
 * @param {object} values - Object of element to remove
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onRemove = function (values) {
    var deferred = $.Deferred();

    if (typeof(this.options.onRemove) == 'function' ) {
        if (this.options.onRemove(deferred, values)) {
            this.refresh = true;
        }
    } else {
        deferred.resolve(false);
        cause.log('Vous devez définir l\'option onRemove au "store"!', 'error');
    }

    return deferred.promise();
};

/** Event executed on updating an element.
 *
 * @param {string} key - Key of element to update
 * @param {object} values - Object of element to update
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onUpdate = function (key, values) {
    var deferred = $.Deferred();

    if (typeof(this.options.onUpdate) == 'function') {
        if (this.options.onUpdate(deferred, key, values)) {
            this.refresh = true;
        }
    } else {
        deferred.resolve(false);
        cause.log('Vous devez définir l\'option onUpdate au "store"!', 'error');
    }

    return deferred.promise();
};

cause.objects.store.prototype.validateData = function (data) {
    if (typeof(data.login) != 'undefined' && data.login === false) {
        cause.log('needToLogin', 'error');
    } else if (data.error) {
        cause.log(data.error, 'error');
    } else if (typeof(data) == 'object' && typeof(data.length) == 'number') {
        this.data = data;
    } else if (typeof(data) == 'object' && typeof(data.success) == 'boolean') {
        if (this.options.root && typeof(data[this.options.root]) == 'object') {
            this.data = data[this.options.root];
        } else if (typeof(data.result) == 'object') {
            this.data = data.result;
        }
    }
};

cause.objects.store.prototype.setQuery = function (loadOptions) {
    var query = DevExpress.data.query(this.data);
    var filter = (loadOptions.filter || this.setFilter);

    if (filter && typeof(filter) !== 'function') {
        if (typeof(filter.columnIndex) !== 'undefined' || typeof(filter[0].columnIndex) !== 'undefined') {
            query = query.filter(filter);
        } else if (typeof(filter[0]) == 'object') {
            query = query.filter(filter);
        } else {
            query = query.filter.call(this, filter[0], filter[1], filter[2]);
        }
    }

    // Set a sort on data
    var sort = (loadOptions.sort || this.setSort);
    if (sort) {
        for (var i=0, j=(sort.length || 0); i<j; i++) {
            if (sort[i].selector) {
                query = query.sortBy(sort[i].selector, sort[i].desc);
            } else {
                query = query.sortBy(sort[i]);
            }
        }
    }

    return query;
};

cause.objects.store.prototype.onError = function (deferred, xhr, error) {
    deferred.resolve(false);

    if (typeof(this.options.onError) == 'function') {
        this.options.onError(xhr, error);
    }
};

/** Event executed after loading.
 *
 * @param {object} deferred - Callback queue
 * @param {object} loadOptions - Parameter for loading of CustomStore
 * @param {object} data - Loaded data
 */
cause.objects.store.prototype.onLoadedAll = function (deferred, loadOptions, data) {
    this.data = [];
    this.refresh = false;

    this.validateData(data);

    var query = this.setQuery(loadOptions);
    var total = query.toArray().length;

    if (loadOptions.take || loadOptions.skip) {
        query = query.slice(loadOptions.skip, loadOptions.take);
    }

    if (loadOptions.requireTotalCount === true) {
        deferred.resolve(query.toArray(), {
            totalCount: total
        });
    } else {
        deferred.resolve(query.toArray());
    }

    if (typeof(this.options.onLoaded) == 'function') {
        this.options.onLoaded(this.data, query.toArray());
    }
};

/** Event executed after key loading.
 *
 * @param {object} deferred - Callback queue
 * @param {object} data - Loaded data
 */
cause.objects.store.prototype.onLoadedByKey = function (deferred, data) {
    cause.log(data);
    deferred.resolve(data);
};

/** Apply sort on store.
 *
 * @param {mixed} * - Every parameters are pass to sort dataSource
 */
cause.objects.store.prototype.sort = function () {
    this.setSort = arguments;
    this.dataSource.load({
        sort: arguments
    });
};

/** Apply filter on store.
 *
 * @param {mixed} * - Every parameters are pass to filter dataSource
 */
cause.objects.store.prototype.filter = function () {
    this.setFilter = arguments;
    this.dataSource.load({
        filter: arguments
    });
};

/** Find an element with a key who had a specific value.
 *
 * @param {string} key - Object key to search
 * @param {object} value - Object value to find
 * @returns {object} Object if exist
 */
cause.objects.store.prototype.find = function (key, value) {
    for (var i=0,j=this.data.length; i<j; i++) {
        if (this.data[i] && this.data[i][key] === value) {
            return this.data[i];
        }
    }

    return false;
};

/** Load the store.
 *
 * @param {object} opts - Parameter to add on URL
 */
cause.objects.store.prototype.load = function (opts) {
    this.options.params = opts;

    this.createDataSource();
    this.dataSource.load();
};

/** Force to reload the store.
 *
 * @param {object} opts - Parameter to add on URL
 */
cause.objects.store.prototype.reload = function (opts) {
    this.refresh = true;
    this.load(opts);
};

/** Remove an specific element of store.
 *
 * @param {array} keys - Every key to remove
 */
cause.objects.store.prototype.remove = function (keys) {
    this.onRemove(keys);
};

/** This class is replace by cause.objects.store
 *
 * @class
 * @deprecated
 */
cause.store = cause.objects.store;/** Class for helping with chart.
 * This class needed "chart.js" or "DevExtreme" to create chart
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.chart = function (config) {
	this.name = 'chart';
	this.chart = null;
	this.config = cause.extend({}, {
		datasets: [{
			data: [0, 1, -2, 2, -3, 3],
			fill: false,
			label: 'Default'
		}],
		height: 400,
		labels: [1, 2, 3, 4, 5],
		options: {
			responsive: false
		},
		selector: '',
		type: 'line',
		width: 400
	}, (config || {}));

	/* Initialize the "chart" */
	if (!cause.helpIsOn) {
		if (typeof(DevExpress) === 'object') {
			this.initDevExtreme();
		} else if (typeof(Chart) === 'function') {
			this.initChartJS();
		} else {
            cause.include.js(cause.baseUrlPlugins + 'chart.js/' + cause.version.chartJS + '/dist/Chart.min.js', this.initChartJS.bind(this), function () {
                cause.alert(cause.localize('missingPlugins'), 'chart.js ' + cause.version.chartJS);
            });
		}
	}
};

/** Show help when is cause.help('chart') is call.
 *
 * @memberOf cause.objects.chart
 */
cause.objects.chart.prototype.help = function () {
	cause.log('Aide pour "cause.chart":', 'help_title');
	cause.log("\t" +
		'new cause.chart(config);' + "\n\n\t" +
		'config.datasets = Array d\'object pour créer le graphique' + "\n\t" +
		"\t" + 'backgroundColor = Array pour chaque couleur sur l\'axe des Y' + "\n\t" +
		"\t" + 'data = Array' + "\n\t" +
		"\t" + 'label = Text de l\'élément pour la légende' + "\n\t" +
		'config.labels = Array d\'élément sur l\'axe des X' + "\n\t" +
		'config.selector = HTML sélecteur' + "\n\t" +
		'config.type = Type de graphique (bar, line, doughnut, pie, radar, polarArea)', 'help');
};

/** Initialize the chart with DevExtreme.
 *
 * @memberOf cause.objects.chart
 */
cause.objects.chart.prototype.initDevExtreme = function () {
	var id = cause.unique();
	var dxType = 'dxChart';
	var config = cause.extend({}, {
		dataSource: this.config.datasets.data,
		series: this.config.labels
	});

	if (this.config.type === 'pie' || this.config.type === 'doughnut') {
		dxType = 'dxPieChart';
	} else if (this.config.type === 'polarArea' || this.config.type === 'radar') {
		dxType = 'dxPolarChart';
	}

	this.tag = cause.$('<div id="' + id + '" height="' + this.config.height + '" width="' + this.config.width + '">').appendTo(this.config.selector);
	this.chart = $('#' + id)[dxType](config);
};

/** Initialize the chart with chart.js
 *
 * @memberOf cause.objects.chart
 */
cause.objects.chart.prototype.initChartJS = function () {
	var id = cause.unique();
	var config = cause.extend({}, {
		data: {
			labels: this.config.labels,
			datasets: this.config.datasets
		},
		options: this.config.options,
		type: this.config.type
	});

	this.tag = cause.$('<canvas id="' + id + '" height="' + this.config.height + '" width="' + this.config.width + '">').appendTo(this.config.selector);
	this.chart = new Chart(document.getElementById(id), config);
};
/** Class for helping for editing some type of file.
 * This class needed "WodoTextEditor" to edit "Open Document", "codeMirror" to edit script file and the class "wysiwyg" for other file
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.editor = function (config) {
	this.name = 'editor';
	this.config = cause.extend({}, {
		filename: '',
		editor: 'textarea'
	}, (config || {}));
	this.editor = null;

	/* Select and load the right plugins */
	if (!cause.helpIsOn) {
		if (this.config.editor === 'codeMirror') {
			if (typeof(CodeMirror) === 'object') {
				this.initCodeMirror();
			} else {
				cause.include.css(cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/lib/codemirror.css');
				cause.include.js(cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/lib/codemirror.js', (function () {
					cause.include.js([
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/css/css.js',
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/htmlmixed/htmlmixed.js',
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/javascript/javascript.js',
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/xml/xml.js'
					], this.initCodeMirror.bind(this), function () {
						cause.alert(cause.localize('missingPlugins'), 'CodeMirror "mode" ' + cause.version.codeMirror);
					});
				}).bind(this), this.fallback.bind(this));
			}
		} else if (this.config.editor === 'wodotexteditor') {
			if (typeof(Wodo) === 'object') {
				this.initWodoTextEditor.call(this);
			} else {
				cause.include.js([
                    cause.baseUrlPlugins + 'wodoTextEditor/' + cause.version.wodoTextEditor + '/wodotexteditor/wodotexteditor.js'
				], this.initWodoTextEditor.bind(this), this.fallback.bind(this));
			}
		} else {
			this.initTextArea();
		}
	}
};

/** Show help when is cause.help('editor') is call
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.help = function () {
	cause.log('Aide pour "cause.editor":', 'help_title');
	cause.log("\t" +
		'new cause.editor(config);' + "\n\n\t" +
		'config.editor = Editor we could use (textarea, codeMirror, wodoTextEditor), default is "textarea"', 'help');
};

cause.objects.editor.prototype.onLoad = function () {
	cause.log('onload');
};

cause.objects.editor.prototype.onSave = function () {
	cause.log('onsave');
};

/** Initialize the TextArea.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.initTextArea = function () {
	var id = cause.unique();
	var elm = cause.$('<div style="height:98%" id="' + id + '"></div>').get(0);
	var view = new cause.objects.view(elm, {
		save: this.onSave.bind(this)
	});

	cause.ajax({
		url: this.config.filename,
		method: 'GET',
		dataType: 'html',
		success: (function (id, data) {
			$('#' + id).html(data);

			this.editor = new cause.objects.wysiwyg({
				selector: '#' + id,
				onSave: this.onSave.bind(this)
			});
			this.onLoad();
		}).bind(this, id),
		error: function () {
			cause.alert(cause.localize('fileDoesnotExist'), cause.localize('editor'));
		}
	});

	return view;
};

/** Initialize the CodeMirror.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.initCodeMirror = function () {
	var id = cause.unique();
	var ext = (this.config.filename.includes('.') ? this.config.filename.substr(this.config.filename.lastIndexOf('.') + 1) : '');
	var elm = cause.$('<div style="height:98%" id="' + id + '"></div>').get(0);
	var view = new cause.objects.view(elm, {
		save: this.onSave.bind(this)
	});

	cause.ajax({
		url: this.config.filename,
		method: 'GET',
		dataType: 'html',
		success: (function (id, ext, data) {
			this.editor = CodeMirror(function (elt) {
				cause.$('#' + id).replaceWith(elt);
			}, {
				extraKeys: {
					'Ctrl-S': this.onSave.bind(this)
				},
				lineNumbers: true,
				lineWrapping: true,
				mode: (ext === 'js' ? 'javascript' : (ext === 'css' ? 'css' : 'htmlmixed')),
				value: data
			});
			this.editor.setSize("100%", "98%");
			this.onLoad();
		}).bind(this, id, ext),
		error: function () {
			cause.alert(cause.localize('fileDoesnotExist'), cause.localize('editor'));
		}
	});

	return view;
};

/** Initialize the WodoTextEditor.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.initWodoTextEditor = function () {
	var id = cause.unique();
	var elm = cause.$('<div id="' + id + '"></div>').get(0);
	var view = new cause.objects.view(elm, {
		save: this.onSave.bind(this)
	});

	var config = {
		//allFeaturesEnabled: true,
		loadCallback: this.onLoad.bind(this),
		saveCallback: this.onSave.bind(this),
		userData: {
			fullName: 'Cause ' + cause.version.cause,
			color: 'black'
		}
	};

	Wodo.createTextEditor(id, config, (function (error, editor) {
		if (error) {
			cause.alert(cause.localize('error'), 'WodoTextEditor : ' + error);
		} else if (this.config.filename) {
			cause.log(this.config);
			editor.openDocumentFromUrl(this.config.filename, this.onInitialize);
		}
	}).bind(this));

	return view;
};

/** This function is execute if plugins is not found.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.fallback = function () {
	if (this.config.editor === 'codeMirror') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'CodeMirror ' + cause.version.codeMirror, 5000);
	} else if (this.config.editor === 'wodotexteditor') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'WodoTextEditor ' + cause.version.wodoTextEditor, 5000);
	}

	this.config.editor = 'textarea';
	this.initTextArea();
};/** Class for helping with knockout.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.knockout = function () {
    this.name = 'knockout';

    cause.$(document).ready((function () {
        if (typeof(ko) === 'object') {
            this.binding();
        }
    }).bind(this));
};

/** Create some specific binding.
 *
 * @memberOf cause.objects.knockout
 */
cause.objects.knockout.prototype.binding = function () {
    ko.bindingHandlers.placeholder = {
        init: function (element, valueAccessor) {
            var underlyingObservable = valueAccessor();

            ko.applyBindingsToNode(element, {
                attr: {
                    placeholder: underlyingObservable
                }
            });
        }
    };

    ko.bindingHandlers.title = {
        init: function (element, valueAccessor) {
            var underlyingObservable = valueAccessor();

            ko.applyBindingsToNode(element, {
                attr: {
                    title: underlyingObservable
                }
            });
        }
    };
};

/** @property {cause.objects.knockout} */
cause.knockout = new cause.objects.knockout();/** Class for helping with map.
 * This class needed "google maps" or "bing maps".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.maps = function (config) {
	this.name = 'maps';
	this.map = null;
	this.markers =  [];
	this.isInitialized = false;
	this.config = cause.extend({}, {
		apiKey: '',
		disabled: false,
		height: 400,
		selector: '',
		type: 'google',
		width: '100%'
	}, (config || {}));

	/* Initialize the "maps" */
	if (!cause.helpIsOn) {
		if (this.config.type === 'google') {
			if (typeof(google) === 'object') {
				this.initGoogle();
			} else {
				cause.include.js('//www.google.ca/jsapi', this.initGoogle.bind(this), function () {
					cause.alert(cause.localize('missingPlugins'), 'Google JSAPI');
				});
			}
		} else if (this.config.type === 'bing') {
			if (typeof(Microsoft) === 'object' && typeof(Microsoft.Maps) === 'object') {
				this.initBingMaps();
			} else {
				cause.include.js('//www.bing.com/api/maps/mapcontrol?mkt=' + cause.languages.select, this.initBingMaps.bind(this), function () {
					cause.alert(cause.localize('missingPlugins'), 'BING MAPS API');
				});
			}
		}
	}
};

/** Show help when is cause.help('maps') is call.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.help = function () {
	cause.log('Aide pour "cause.maps":', 'help_title');
	cause.log("\t" +
		'new cause.map(config);' + "\n\n\t" +
		'config.apiKey = Key/Credentials pour utiliser l\'API' + "\n\t" +
		'config.disabled = Désactivé toute les fonctions de la carte' + "\n\t" +
		'config.selector = HTML sélecteur' + "\n\t" +
		'config.type = Type de map utilisé ("google", "bing")', 'help');
};

/** Initialize the Google JSAPI.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initGoogle = function () {
	if (typeof(google.maps) === 'object') {
		this.initGoogleMaps();
	} else {
		google.load('maps', cause.version.googleMaps, {
			other_params: 'sensor=false',
			language: cause.languages.select,
			callback: this.initGoogleMaps.bind(this)
		});
	}
};

/** Initialize the map with Google Maps.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initGoogleMaps = function () {
	cause.$(this.config.selector).height(this.config.height);
	cause.$(this.config.selector).width(this.config.width);

	var config = {
		center: (this.config.center || {
			lat: 0,
			lng: 0
		}),
		zoom: (this.config.zoom || 8)
	};

	this.map = new google.maps.Map(cause.$(this.config.selector).get(0), config);

	google.maps.event.addDomListener(this.map, 'tilesloaded', this.initialize.bind(this));
};

/** Initialize the map with Bing Maps.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initBingMaps = function () {
	cause.$(this.config.selector).height(this.config.height);
	cause.$(this.config.selector).width(this.config.width);

	var config = {
		center: (this.config.center || {
			lat: 0,
			lng: 0
		}),
		credentials: this.config.apiKey,
		zoom: (this.config.zoom || 8)
	};

	try {
		this.map = new Microsoft.Maps.Map(this.config.selector, config);

		Microsoft.Maps.Events.addHandler(this.map, 'tiledownloadcomplete', this.initialize.bind(this));
	} catch(e) {
		setTimeout(this.initBingMaps.bind(this), 100);
	}
};

/** Execute when map is loaded.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initialize = function () {
	if (this.isInitialized) {
		return null;
	}

	if (!this.config.center && typeof(navigator) === 'object' && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((function (position) {
			this.center({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});
		}).bind(this), function () {});
	}

	this.isInitialized = true;
	this.config.disabled = !this.config.disabled;

	this.toggle();
};

/** Toggle enabled / disabled mode.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.toggle = function () {
	this.config.disabled = !this.config.disabled;

	if (this.config.type === 'google') {
		this.map.setOptions({
			clickableIcons: !this.config.disabled,
			disableDefaultUI: this.config.disabled,
			disableDoubleClickZoom: this.config.disabled,
			draggable: !this.config.disabled,
			fullscreenControl: !this.config.disabled,
			panControl: !this.config.disabled,
			rotateControl: !this.config.disabled,
			scaleControl: !this.config.disabled,
			scrollwheel: !this.config.disabled,
			streetViewControl: !this.config.disabled,
			zoomControl: !this.config.disabled
		});
	} else if (this.config.type === 'bing') {
		this.map.setOptions({
			disableKeyboardInput: this.config.disabled,
			disableMouseInput: this.config.disabled,
			disablePanning: this.config.disabled,
			disableTouchInput: this.config.disabled,
			disableUserInput: this.config.disabled,
			disableZooming: this.config.disabled,
			showDashboard: !this.config.disabled,
			showMapTypeSelector: !this.config.disabled,
			showScalebar: !this.config.disabled
		});
	}
};

/** Move the center of map.
 *
 * @memberOf cause.objects.map
 * @param {object} position
 * @param {float} position.lat
 * @param {float} position.lng
 */
cause.objects.maps.prototype.center = function (position) {
	if (this.config.type === 'google') {
		this.map.setCenter(position);
	} else if (this.config.type === 'bing') {
		this.map.setView({
			center: new Microsoft.Maps.Location(position.lat, position.lng)
		});
	}
};

/** Add a marker on map.
 *
 * @memberOf cause.objects.map
 * @param {object} marker
 * @param {string} marker.title
 * @param {object} marker.position
 * @param {float} marker.position.lat
 * @param {float} marker.position.lng
 */
cause.objects.maps.prototype.addMarker = function (marker) {
	if (this.config.type === 'google') {
		this.markers.push(new google.maps.Marker({
			position: marker.position,
			map: this.map,
			title: marker.title
		}));
	} else if (this.config.type === 'bing') {
		var location = new Microsoft.Maps.Location(marker.position.lat, marker.position.lng);
		var options = new Microsoft.Maps.PushpinOptions({
			title: marker.title
		});

		this.markers.push(new Microsoft.Maps.Pushpin(location, options));
		this.map.entities.push(this.markers[this.markers.length - 1]);
	}

	return (this.markers.length - 1);
};

/** Remove one marker from the map.
 *
 * @memberOf cause.objects.map
 * @param {integer} nb
 */
cause.objects.maps.prototype.removeMarker = function (nb) {
	if (this.markers[nb]) {
		if (this.config.type === 'google') {
			this.markers[nb].setMap(null);
		} else if (this.config.type === 'bing') {
			this.map.entities.splice(nb, 1);
		}

		this.markers.splice(nb, 1);
	}
};

/** Remove all markers from the map.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.removeAllMarkers = function () {
	for (var i=(this.markers.length - 1); i>=0; i--) {
		this.removeMarker(i);
	}

	this.markers = [];
};/** Class for helping with media player.
 * This class needed "jplayer" or "html 5".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object with all config
 */
cause.objects.player = function (config) {
	if (!cause.helpIsOn) {
		if (cause.is.element(config)) {
			config = {selector: config};
		} else if (typeof(config.get) === 'function') {
			config = {selector: config.get(0)};
		}
	}

	this.name = 'player';
	this.tag = '';
	this.config = cause.extend({}, {
		autoplay: false,
		loop: false,
		media: [],
		muted: false,
		player: 'html5',
		poster: '',
		repeat: false,
		selector: '',
		width: 0,
		height: 0
	}, (config || {}));

	/* Initialize the "player" */
	if (!cause.helpIsOn) {
		this.setConfig();

		if (this.config.player === 'html5') {
			this.initHtml5();
		} else if (this.config.player === 'jPlayer') {
			if (typeof($.jPlayer) === 'function') {
				this.initJPlayer();
			} else {
				cause.include.css(cause.baseUrlPlugins + 'jPlayer/' + cause.version.jPlayer + '/dist/skin/pink.flag/css/jplayer.pink.flag.min.css');
				cause.include.js(cause.baseUrlPlugins + 'jPlayer/' + cause.version.jPlayer + '/dist/jplayer/jquery.jplayer.min.js', this.initJPlayer.bind(this), this.fallback.bind(this));
			}
		}
	}
};

/** Show help when is cause.help('player') is call.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.help = function () {
	cause.log('Aide pour "cause.player":', 'help_title');
	cause.log("\t" +
		'new cause.player(config);' + "\n\n\t" +
		'config.player = Player we could use (html5, jPlayer), default is "html5"' + "\n\t" +
		'config.selector = HTML sélecteur', 'help');
};

/** Detect the config if "config" is a video or audio tag.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.setConfig = function () {
	var id = cause.unique();
	var tag = cause.$(this.config.selector);

	if (tag.length === 0) {
		return null;
	}

	this.setMedia(tag);
	this.config.autoplay = (tag.attr('autoplay') === 'autoplay' ? true : false);
	this.config.loop = (tag.attr('loop') === 'loop' ? true : false);
	this.config.poster = (tag.attr('poster') ? tag.attr('poster') : '');
	this.config.selector = '#' + id;

	tag.replaceWith('<div id="' + id + '">');
};

cause.objects.player.prototype.setMedia = function (tag) {
	if (tag.get(0).nodeName !== 'VIDEO' && tag.get(0).nodeName !== 'AUDIO' && !cause.is.array(this.config.media)) {
		this.config.media = (this.config.media ? [this.config.media] : []);
	}

	tag.find('source').each((function (nb, elm) {
		this.config.media.push(elm.src);
	}).bind(this));

	if (tag.attr('src')) {
		this.config.media.push(tag.attr('src'));
	}
};

/** Return the media type.
 *
 * @memberOf cause.objects.player
 * @param {string} file - Path of file
 * @param {boolean} format - If true we return the file format instead of codecs
 * @returns {string} Type of file
 */
cause.objects.player.prototype.findType = function (file, format) {
	var ext = file.substr(file.lastIndexOf('.') + 1).toLowerCase();
	var codecs = {
		'video/mp4': ['m4v', 'mp4'],
		'video/ogg': ['ogv', 'ogg'],
		'video/webm': ['webmv', 'webm'],
		'audio/mp4': ['m4a', 'mp4'],
		'audio/mpeg': ['mp3'],
		'audio/ogg': ['oga', 'ogg'],
		'audio/wav': ['wav'],
		'audio/webm': ['webma', 'webm']
	};

	for (var i in codecs) {
		if (codecs[i].includes(ext)) {
			return (format ? codecs[i][0] : i);
		}
	}

	return '';
};

/** Pause media.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.pause = function () {
	if (this.config.player === 'html5') {
		if (cause.$(this.tag).length > 0) {
			cause.$(this.tag).get(0).pause();
		}
	} else if (this.config.player === 'jPlayer') {
		$(this.tag).jPlayer('pause');
	}
};

/** Play media.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.play = function () {
	if (this.config.player === 'html5') {
		if (cause.$(this.tag).length > 0) {
			cause.$(this.tag).get(0).play();
		}
	} else if (this.config.player === 'jPlayer') {
		$(this.tag).jPlayer('play');
	}
};

/** Stop media.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.stop = function () {
	if (this.config.player === 'html5') {
		if (cause.$(this.tag).length > 0) {
			cause.$(this.tag).get(0).pause();
			cause.$(this.tag).get(0).currentTime = 0;
		}
	} else if (this.config.player === 'jPlayer') {
		$(this.tag).jPlayer('stop');
	}
};

/** Initialize the media with HTML5 tag.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.initHtml5 = function () {
	var tag = 'video';
	var source = '';
	var attrs = [
		'controls="controls"',
		'preload="metadata"',
		(this.config.autoplay ? 'autoplay="autoplay"' : ''),
		(this.config.loop ? 'loop="loop"' : ''),
		(this.config.muted ? 'muted="muted"' : ''),
		(this.config.poster ? 'poster="' + this.config.poster + '"' : ''),
		(this.config.height ? 'height="' + this.config.height + '"' : ''),
		(this.config.width ? 'width="' + this.config.width + '"' : '')
	];

	for (var i = 0, j = this.config.media.length; i < j; i++) {
		if (this.config.media[i].includes('.vtt')) {
			source += '<track src="' + this.config.media[i] + '" kind="subtitles" />';
		} else {
			var type = this.findType(this.config.media[i]);

			tag = (type ? type.substr(0,5) : '');
			source += '<source src="' + this.config.media[i] + '" type="' + type + '" />';
		}
	}

	$(this.config.selector).html('<' + tag + ' ' + attrs.join(' ') + '>' + source + cause.localize('yourBrowserDontSupport') + '</' + tag + '>');

	this.tag = this.config.selector + ' ' + tag;
};

/** Initialize the media with jPlayer plugins.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.initJPlayer = function () {
	var id = cause.unique();
	var size = {};
	var types = [];
	var medias = {
		title: (this.config.title ? this.config.title : ''),
		poster: (this.config.poster ? this.config.poster : '')
	};

	if (this.config.width) {
		size.width = this.config.width;
		size.height = '100%';
	} else if (this.config.height) {
		size.height = this.config.height;
		size.width = '100%';
	}

	for (var i = 0, j = this.config.media.length; i < j; i++) {
		var type = this.findType(this.config.media[i], true);

		medias[type] = this.config.media[i];
		types.push(type);
	}

	var config = cause.extend({}, {
		ready: (function (id, medias) {
			$('#' + id).jPlayer('setMedia', medias);

			if (this.config.autoplay) {
				$('#' + id).jPlayer('play');
			}
		}).bind(this, id, medias),
		cssSelectorAncestor: this.config.selector,
		globalVolume: true,
		loop: this.config.loop,
		repeat: this.config.repeat,
		size: size,
		supplied: types.join(', '),
		swfPath: cause.baseUrlPlugins + 'jPlayer/' + cause.version.jPlayer + '/dist/jplayer/',
		toggleDuration: true,
		useStateClassSkin: true
	});

	$(this.config.selector).addClass('jp-video');
	$(this.config.selector).html(
		'<div class="jp-type-single">' +
		'<div id="' + id + '" class="jp-jplayer"></div>' +
		'<div class="jp-gui">' +
		'<div class="jp-video-play"><button class="jp-video-play-icon" role="button" tabindex="0">play</button></div>' +
		'<div class="jp-interface">' +
		'<div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div>' +
		'<div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>' +
		'<div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>' +
		'<div class="jp-details"><div class="jp-title" aria-label="title">&nbsp;</div></div>' +
		'<div class="jp-controls-holder">' +
		'<div class="jp-volume-controls">' +
		'<button class="jp-mute" role="button" tabindex="0">mute</button>' +
		'<button class="jp-volume-max" role="button" tabindex="0">max volume</button>' +
		'<div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div>' +
		'</div>' +
		'<div class="jp-controls">' +
		'<button class="jp-play" role="button" tabindex="0">play</button>' +
		'<button class="jp-stop" role="button" tabindex="0">stop</button>' +
		'</div>' +
		'<div class="jp-toggles">' +
		'<button class="jp-repeat" role="button" tabindex="0">repeat</button>' +
		'<button class="jp-full-screen" role="button" tabindex="0">full screen</button>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="jp-no-solution">' +
		'<span>Update Required</span>' +
		'To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.' +
		'</div>' +
		'</div>');

	$('#' + id).jPlayer(config);

	this.tag = this.config.selector + ' #' + id;
};

/** This function is execute if plugins is not found.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.fallback = function () {
	DevExpress.ui.notify(cause.localize('missingPlugins'), 'jPlayer ' + cause.version.jPlayer, 5000);

	this.config.player = 'html5';
	this.initHtml5();
};/** Class for helping with print screen.
 * This class needed "html2canvas".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {mixed} element - Element we like to print
 * @param {object} params - The canvas with the image of screen
 * @param {function} params.(onrendered|success) - Function call when rendering is finish
 * @param {boolean} params.download - Force to download the PNG
 * @param {string} params.insert - Append the generated canvas inside element
 * @param {integer} params.width - Set the width of canvas
 * @param {integer} params.height - Set the height of canvas
 */
cause.objects.printScreen = function (element, params) {
	if (!cause.is.element(element)) {
		params = (element || {});
		element = document.body;
	}

	this.name = 'print_screen';
	this.element = element;
	this.options = cause.extend({}, params);

	/* Initialize the addons "html2canvas" */
    this.options.onrendered = this.onRendered.bind(this, (params || {}));

	if (!cause.helpIsOn) {
		if (typeof(html2canvas) == 'object') {
			html2canvas(this.element, this.options);
		} else {
			cause.include.js(cause.baseUrlPlugins + 'html2canvas/' + cause.version.html2canvas + '/html2canvas.min.js', (function () {
				html2canvas(this.element, this.options);
			}).bind(this), function () {
				cause.alert(cause.localize('missingPlugins'), 'html2canvas ' + cause.version.html2canvas);
			});
		}
	}
};

/** Show help when is cause.help('print_screen') is call.
 *
 * @memberOf cause.objects.printScreen
 */
cause.objects.printScreen.prototype.help = function () {
	cause.log('Aide pour "cause.print_screen":', 'help_title');
	cause.log("\t" +
		'new cause.print_screen();', 'help');
};

/** Executed when the rendering of print screen is finish.
 *
 * @memberOf cause.objects.printScreen
 * @param {object} params: Object with all options pass to addons
 * @param {HTMLElement} canvas: The canvas with the image of screen
 */
cause.objects.printScreen.prototype.onRendered = function (params, canvas) {
	if (params.width) {
		canvas.style.width = params.width + 'px';
	}
	if (params.height) {
		canvas.style.height = params.height + 'px';
	}

	if (typeof(params.onrendered) == 'function') {
		params.onrendered(canvas);
	} else if (typeof(params.success) == 'function') {
		params.success(canvas);
	} else if (params.download) {
		cause.$('<a>').attr('href', canvas.toDataURL()).attr('download', 'cause_print_screen.png').get(0).click();
	} else if (params.insert) {
		cause.$(canvas).appendTo(params.insert);
	}
};/** Class for helping with media recording.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object with all config
 */
cause.objects.record = function (config) {
	this.name = 'record';
	this.config = cause.extend({}, {
		autorecord: false,
        encoding: 'wav' // mp3, ogg, wav
	}, (config || {}));

	/* Initialize the "record" */
	if (!cause.helpIsOn) {
        if (typeof(WebAudioRecorder) == 'object') {
            this.init();
        } else {
            cause.include.js(cause.baseUrlPlugins + 'webAudioRecorderJs/' + cause.version.webAudioRecorderJs + '/WebAudioRecorder.min.js', this.init.bind(this), function () {
                cause.alert(cause.localize('missingPlugins'), 'web-audio-recorder-js');
            });
        }
	}
};

/** Show help when is cause.help('record') is call.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.help = function () {
    cause.log('Aide pour "cause.record":', 'help_title');
    cause.log("\t" +
        'new cause.record(config);' + "\n\n\t" +
        'config.autorecord = Start recording automatically on load, default is "false"' + "\n\t" +
        'config.encoding = Type of recording file (mp3, ogg, wav), default is "wav"', 'help');
};

/** Initialize the recording.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.init = function () {
    if (typeof(navigator) == 'object') {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.URL = window.URL || window.webkitURL;

        if (navigator.getUserMedia) {
            if (['webm'].includes(this.config.encoding)) {
                this.initVideo();
            } else {
                this.initAudio();
            }
        } else {
            cause.alert(cause.localize('errorUserMedia'), cause.localize('error'));
        }
    }
};

/** Initialize the WebAudioRecorder plugins for audio recording and encoding.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.initAudio = function () {
    var audioContext = new AudioContext;
    var mixer = audioContext.createGain();

    if (audioContext.createScriptProcessor == null) {
        audioContext.createScriptProcessor = audioContext.createJavaScriptNode;
    }

    mixer.connect(audioContext.destination);

    this.recorder = new WebAudioRecorder(mixer, {
        workerDir: cause.baseUrlPlugins + 'webAudioRecorderJs/' + cause.version.webAudioRecorderJs + '/',
        encoding: this.config.encoding,
        options: {
            timeLimit: 300 // time in second
        },
        onEncoderLoaded: (function () {
            if (this.config.autorecord) {
                this.start();
            }
        }).bind(this),
        onTimeout: (function () {
            cause.alert(cause.localize('timeoutWebAudioRecorder'), cause.localize('timeout'));
        }).bind(this),
        onComplete: (function (recorder) {
            this.download(blob, recorder.encoding);
        }).bind(this),
        onError: (function () {
            cause.alert(cause.localize('errorWebAudioRecorder'), cause.localize('error'));
        }).bind(this)
    });
};

/** Initiliaze the video recording and encoding.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.initVideo = function () {
    navigator.getUserMedia({
        audio: true,
        video: true
    }, (function (stream) {
        this.download(stream, 'webm');
    }.bind(this)), (function () {
        cause.alert(cause.localize('errorVideoRecorder'), cause.localize('error'));
    }.bind(this)));
};

/** Start the recording.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.start = function () {
    if (this.recorder && !this.recorder.isRecording()) {
        this.recorder.startRecording();
    } else if (this.recorder && this.recorder.isRecording()) {
        cause.log('Recorder already recording', 'error');
    } else {
        cause.log('Recorder is not initialised', 'error');
    }
};

/** Stop the recording.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.stop = function () {
    if (this.recorder && this.recorder.isRecording()) {
        this.recorder.finishRecording();
    } else if (this.recorder && !this.recorder.isRecording()) {
        cause.log('Recorder is not recording', 'error');
    } else {
        cause.log('Recorder is not initialised', 'error');
    }
};

/** Download the generated file.
 *
 * @memberOf cause.objects.record
 * @param {Blob} blob - Object of encoded file
 * @param {string} encoding - String of file type
 */
cause.objects.record.prototype.download = function (blob, encoding) {
    var url = window.URL.createObjectURL(blob);

    cause.$('<a>').attr('download', 'record.' + encoding).attr('href', url).get(0).click();
};/** Class to create a custom WYSIWYG.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object with all configuration
 */
cause.objects.wysiwygCustom = function (config) {
	this.elm = null;
	this.tags = {	/* Tags the wysiwyg can create */
		'strong': {
			icon: 'bold'
		},
		'em': {
			icon: 'italic'
		},
		'u': {
			icon: 'underline'
		},
		'a': {
			attrs: {'href': ''},
			icon: 'link'
		},
		'img': {
			attrs: {'src': '', 'alt': ''},
			close: true,
			icon: 'picture-o',
			modify: true
		}
	};
	this.tagsModify = {	/* Tags the wysiwyg who need icon for remove, when this append the main icon modify */
		'a': {
			icon: 'chain-broken'
		}
	};

    this.escapeKeys = [
        16 /* Shift key */, 17 /* Ctrl */, 18 /* Alt */,
        35 /* End */, 36 /* Home */,
        37 /* Arrow left */, 38 /* Arrow top */, 39 /* Arrow right */, 40 /* Arrow bottom */
    ];

	this.config = config;
	this.history = [];
    this.historyPosition = -1;
	this.init();
};

/** Set a selection inside textarea.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {integer} start - Position to start the selection
 * @param {integer} length - The length of the selection
 */
cause.objects.wysiwygCustom.prototype.focus = function (start, length) {
	cause.html.setSelection(cause.$('textarea', this.elm).get(0), start, length);

	setTimeout((function () {
		cause.$('textarea', this.elm).focus();
		this.activeTools();
	}).bind(this), 100);
};

/** Initialize the custom WYSIWYG.
 *
 * @memberOf cause.objects.wysiwygCustom
 */
cause.objects.wysiwygCustom.prototype.init = function () {
	var div = cause.$(this.config.selector);
	var html = '';

	for (var i in this.tags) {
		if (this.tags.hasOwnProperty(i)) {
			html += '<i class="fa fa-' + this.tags[i].icon + '" aria-hidden="true"></i>';

			if (this.tagsModify[i]) {
				html += '<i class="fa fa-' + this.tagsModify[i].icon + '" aria-hidden="true" disabled="disabled"></i>';
			}
		}
	}

	this.elm = cause.$('<div class="wysiwyg"><div class="tools">' + html + '</div><textarea /></div>');

	cause.$('textarea', this.elm).height(div.height());
	cause.$('textarea', this.elm).width(div.width());
	cause.$('textarea', this.elm).html(div.html());
	cause.$(this.config.selector).replaceWith(this.elm);

	for (var j in this.tags) {
		if (this.tags.hasOwnProperty(j)) {
			cause.$('.tools .fa-' + this.tags[j].icon, this.elm).mousedown(this.clickIcon.bind(this, j));

			if (this.tagsModify[j]) {
				cause.$('.tools .fa-' + this.tagsModify[j].icon, this.elm).mousedown(this.tagsRemove.bind(this, j));
			}
		}
	}

	this.setup();
};

/** Active all function we need.
 *
 * @memberOf cause.objects.wysiwygCustom
 */
cause.objects.wysiwygCustom.prototype.setup = function () {
	if (typeof(this.config.onSetup) === 'function') {
		this.config.onSetup(this);
	}

	cause.$('textarea', this.elm).mouseup((function () {
		this.activeTools();
	}).bind(this));
	cause.$('textarea', this.elm).keydown(this.keydown.bind(this));
    cause.$('textarea', this.elm).keyup(this.keyup.bind(this));

	if (typeof(this.config.onInitialize) === 'function') {
		this.config.onInitialize(this);
	}

    this.addHistory('setup');
};

cause.objects.wysiwygCustom.prototype.keydown = function (e) {
    if (typeof(this.config.onKey) === 'function') {
        this.config.onKey(this, e);
    }

    if (e.ctrlKey && e.keyCode === 83) {    /* Ctrl+S */
        if (typeof(this.config.onSave) === 'function') {
            cause.debounce(this.config.onSave, 200);
        }

        e.preventDefault();
    } else if (e.ctrlKey && e.keyCode === 90) {    /* Ctrl+Z */
        this.undo();
        e.preventDefault();
    } else if (!this.escapeKeys.includes(e.keyCode)) {
        this.activeTools();

        if (typeof(this.config.onChange) === 'function') {
            cause.debounce(this.config.onChange, 200);
        }
    }
};

cause.objects.wysiwygCustom.prototype.keyup = function (e) {
	if (!this.escapeKeys.includes(e.keyCode)) {
        this.addHistory('keyup');
    }
};

cause.objects.wysiwygCustom.prototype.addHistory = function (event) {
	if (this.historyPosition > -1) {
		this.history.splice(this.historyPosition);
	}

    this.history.push({
		time: new Date(),
        event: event,
		content: cause.$('textarea', this.elm).val()
	});

    this.historyPosition = this.history.length;
};

cause.objects.wysiwygCustom.prototype.undo = function () {
    this.historyPosition = (this.historyPosition > 1 ? this.historyPosition - 2 : 0);

    if (this.history[this.historyPosition]) {
        cause.$('textarea', this.elm).val(this.history[this.historyPosition].content);
    }
};

/** Select or unselect an icon.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} icon - Icon to check
 * @param {string} tagName - Tag to check
 */
cause.objects.wysiwygCustom.prototype.activeIcon = function (icon, tagName) {
	var active = this.tagsInside(tagName);

	if (active) {
		cause.$('.tools .fa-' + icon, this.elm).addClass('select');
	} else {
		cause.$('.tools .fa-' + icon, this.elm).removeClass('select');
	}

	return active;
};

/** Check if the cursor is inside toolbar tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 */
cause.objects.wysiwygCustom.prototype.activeTools = function () {
	for (var i in this.tags) {
		if (this.tags.hasOwnProperty(i)) {
			this.activeIcon(this.tags[i].icon, i);
		}
	}

	for (var j in this.tagsModify) {
		if (this.tagsModify.hasOwnProperty(j)) {
			if (this.activeIcon(this.tagsModify[j].icon, j)) {
				cause.$('.tools .fa-' + this.tagsModify[j].icon, this.elm).removeAttr('disabled');
			} else {
				cause.$('.tools .fa-' + this.tagsModify[j].icon, this.elm).attr('disabled', 'disabled');
			}
		}
	}
};

/** Check if we need to add or remove the tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to add
 * @param {object} e - Event object
 */
cause.objects.wysiwygCustom.prototype.clickIcon = function (tagName, e) {
	if (cause.$(e.target, this.elm).attr('disabled') !== 'disabled') {
		if (cause.$(e.target, this.elm).hasClass('select')) {
			if (this.tags[tagName].close || this.tagsModify[tagName]) {
				this.tagsModify(tagName);
			} else {
				this.tagsRemove(tagName);
			}
		} else {
			this.tagsAdd(tagName);
		}

        this.addHistory('clickIcon');
	}
};

/** Place a selection between tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to add
 */
cause.objects.wysiwygCustom.prototype.tagsAdd = function (tagName) {
	var selection = cause.html.getSelection();

	if (selection !== false && (selection.selectionStart || selection.selectionEnd)) {
		var text = cause.$('textarea', this.elm).val();
		var content = {
			before: text.substr(0, selection.selectionStart),
			content: text.substr(selection.selectionStart, selection.selectionEnd - selection.selectionStart),
			after: text.substr(selection.selectionEnd)
		};

		this.tagsAskAttrs(tagName, content);
	}
};

cause.objects.wysiwygCustom.prototype.tagsAskAttrs = function (tagName, content, attrs) {
	/** Open a dialog, so user can enter all attributes value.
	 *
	 * @memberOf cause.objects.wysiwygCustom
	 * @param {string} tagName - Tag name to set attributes
	 * @param {string} content - Split of wysiwyg content for selected tag
	 * @param {object} attrs - Object with all actual attributes
	 */
	var message = '<div>';

	if (this.tags[tagName].attrs) {
		for (var attr in this.tags[tagName].attrs) {
			if (this.tags[tagName].attrs.hasOwnProperty(attr)) {
				message += '<br>' + attr + ' = <input type="text" id="' + attr + '" value="' + (attrs && attrs[attr] ? attrs[attr] : '') + '" />';
			}
		}

		cause.dialog(message + '</div>', cause.localize('wysiwyg'), (function (tagName, content, button) {
			var attrs = {};

			if (cause.$(button[0].element[0]).parents('.dx-dialog').length > 0) {
				cause.$(button[0].element[0]).parents('.dx-dialog').find('input').each(function (nb, elm) {
					var domElement = cause.$(elm);
					attrs[domElement.attr('id')] = domElement.val();
				});
			} else {
				cause.$(button[0].element[0]).parents('.alert-box').find('input').each(function (nb, elm) {
					var domElement = cause.$(elm);
					attrs[domElement.attr('id')] = domElement.val();
				});
			}

			var tag = this.tagsBuild(tagName, content.content, attrs);

			cause.$('textarea', this.elm).val(content.before + tag + content.after);
			this.focus(content.before.length, tag.length);
		}).bind(this, tagName, content));
	} else {
		var tag = this.tagsBuild(tagName, content.content);

		cause.$('textarea', this.elm).val(content.before + tag + content.after);
		this.focus(content.before.length, tag.length);
	}
};

/** Create the HTML for tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to create
 * @param {string} content - Content inside of tag
 * @param {object} attrs - All attributs of tag
 */
cause.objects.wysiwygCustom.prototype.tagsBuild = function (tagName, content, attrs) {
	var attributes = '';

	if (this.tags[tagName].attrs) {
		for (var attr in this.tags[tagName].attrs) {
			if (attrs && attrs[attr]) {
				attributes += ' ' + attr + '="' + attrs[attr] + '"';
			} else {
				attributes += ' ' + attr + '="' + this.tags[tagName].attrs[attr] + '"';
			}
		}
	}

	if (this.tags[tagName].close) {
		return '<' + tagName + attributes + ' />';
	} else {
		return '<' + tagName + attributes + '>' + content + '</' + tagName + '>';
	}
};

/** Check if the selection is inside or content a specific tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to check
 */
cause.objects.wysiwygCustom.prototype.tagsInside = function (tagName) {
	var selection = cause.html.getSelection();

	if (selection) {
		var content = cause.$('textarea', this.elm).val();
		var before = content.substr(0, selection.selectionStart);
		var select = content.substr(selection.selectionStart, selection.selectionEnd - selection.selectionStart);
		var after = content.substr(selection.selectionEnd);

		if (before.match(new RegExp('<' + tagName)) || select.includes('<' + tagName)) {
			var foundEndTag = (this.tags[tagName].close && (after.includes('\/>') || select.includes('\/>')));
			var foundCloseTag = (after.match(new RegExp('<\/' + tagName + '>')) || select.includes('<\/' + tagName + '>'));

			if (foundEndTag || foundCloseTag) {
				return true;
			}
		}
	}

	return false;
};

/** Modify attribute of a tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to modify
 * @param {object} e - Event object
 */
cause.objects.wysiwygCustom.prototype.tagsModify = function (tagName, e) {
	var selection = cause.html.getSelection();

	if (!selection || !(!e || cause.$(e.target, this.elm).attr('disabled') !== 'disabled') || !this.tags[tagName].attrs) {
		return null;
	}

	var content = this.tagsSplit(tagName);
	var attrs = {};

	for (var attr in this.tags[tagName].attrs) {
		if (this.tags[tagName].attrs.hasOwnProperty(attr)) {
			var value = content.tag.match(new RegExp(attr + '="(.*)"'))

			if (value && value[1]) {
				attrs[attr] = value[1];
			}
		}
	}

	this.tagsAskAttrs(tagName, content, attrs);
};

/** Remove tag from each side of selection.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to remove
 * @param {object} e - Event object
 */
cause.objects.wysiwygCustom.prototype.tagsRemove = function (tagName, e) {
	if (!e || cause.$(e.target, this.elm).attr('disabled') !== 'disabled') {
		var selection = cause.html.getSelection();

		if (selection && (selection.selectionStart || selection.selectionEnd)) {
			var content = this.tagsSplit(tagName);

			cause.$('textarea', this.elm).val(content.before + content.content + content.after);
			this.focus(content.before.length, content.content.length);
		}
	}
};

/** Split content base on specific tag of the selection.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name
 */
cause.objects.wysiwygCustom.prototype.tagsSplit = function (tagName) {
	var selection = cause.html.getSelection();
	var content = cause.$('textarea', this.elm).val();
	var beforeTag = content.substr(0, selection.selectionStart);
	var selectTag = content.substr(selection.selectionStart, selection.selectionEnd - selection.selectionStart);
	var afterTag = content.substr(selection.selectionEnd);
	var tag = '';

	if (beforeTag.includes('<' + tagName)) {
		/* Search for the tag before the selection */
		var start = beforeTag.lastIndexOf('<' + tagName);
		var tmp = beforeTag.substr(start);
		if (tmp.includes('>')) {
            tag = tmp.substr(tmp.indexOf('>') + 1);
            beforeTag = beforeTag.substr(0, beforeTag.lastIndexOf('<' + tagName)) + tmp.substr(tmp.indexOf('>') + 1);
		} else {
            if (selectTag.includes('>')) {
                tag = tmp + selectTag.substr(0, selectTag.indexOf('>') + 1);
                beforeTag = beforeTag.substr(0, beforeTag.lastIndexOf('<' + tagName));
                selectTag = selectTag.substr(selectTag.indexOf('>') + 1);
            } else {
                tag = tmp + selectTag + afterTag.substr(0, afterTag.indexOf('>') + 1);
                beforeTag = beforeTag.substr(0, beforeTag.lastIndexOf('<' + tagName));
                selectTag = '';
                afterTag = afterTag.substr(afterTag.indexOf('>') + 1);
            }
		}
	} else if (selectTag.indexOf('<' + tagName) === 0) {
		/* Search for the tag inside the selection */
		tag = selectTag.substr(0, selectTag.indexOf('>') + 1);
		selectTag = selectTag.substr(selectTag.indexOf('>') + 1);
	}

	if (afterTag.includes('</' + tagName)) {
		/* Search for the tag after the selection */
		afterTag = afterTag.substr(0, afterTag.lastIndexOf('</' + tagName)) + afterTag.substr(afterTag.lastIndexOf(tagName + '>') + 1 + tagName.length);
	} else if (selectTag.includes('<\/' + tagName)) {
		/* Search for the tag inside the selection */
		selectTag = selectTag.substr(0, selectTag.indexOf('</' + tagName));
	}

	return {
		after: afterTag,
		before: beforeTag,
		content: selectTag,
		tag: tag
	};
};/** Class for helping with WYSIWYG
 * This class needed "tinyMCE", "CKEditor" or "html 5".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object all possible configuration
 */
cause.objects.wysiwyg = function (config) {
	this.name = 'wysiwyg';
	this.plugins = {
		'tinymce': [
			'advlist anchor autolink charmap code colorpicker contextmenu',
			'directionality emoticons fullscreen hr image imagetools insertdatetime',
			'link lists media nonbreaking noneditable pagebreak paste preview print',
			'save searchreplace spellchecker tabfocus table template textcolor',
			'textpattern visualblocks visualchars wordcount'
    	]
	};
	this.config = cause.extend({}, {
		editor: 'tinymce',
		filename: '',
		selector: '.editable',
		height: null,
		inline: false,
		mode: 'full',
		statusbar: true
	}, (config || {}));

	/* Select and load the right plugins */
	if (!cause.helpIsOn) {
		if (this.config.filename) {
			this.loadFile();
		} else {
			this.init();
		}
	}
};

/** Show help when is cause.help('wysiwyg') is call.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.help = function () {
	cause.log('Aide pour "cause.wysiwyg":', 'help_title');
	cause.log("\t" +
		'new cause.editor(config);' + "\n\n\t" +
		'config.editor = Editor we use (custom, tinymce, ckeditor), default is "tinymce"' + "\n\t" +
		'config.selector = String to select element' + "\n\t" +
		'config.height = Height of editor, default is auto' + "\n\t" +
		'config.inline = True when editor is inline, default is false' + "\n\t" +
		'config.mode = String to select function mode (simple, full), default is "full"' + "\n\t" +
		'config.statusbar = False to hide the status bar, default is true', 'help');
};

/** Check to initialize the best possible editor.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.init = function () {
	if (this.config.editor === 'tinymce') {
		if (typeof(tinymce) === 'object') {
			this.initTinyMCE.call(this);
		} else {
			cause.include.js([
				cause.baseUrlPlugins + 'tinymce/' + cause.version.tinymce + '/js/tinymce/jquery.tinymce.min.js',
				cause.baseUrlPlugins + 'tinymce/' + cause.version.tinymce + '/js/tinymce/tinymce.min.js'
			], this.initTinyMCE.bind(this), this.fallback.bind(this));
		}
	} else if (this.config.editor === 'ckeditor') {
		if (typeof(ckeditor) === 'object') {
			this.initCkEditor.call(this);
		} else {
			cause.include.js([
				cause.baseUrlPlugins + 'ckeditor/' + cause.version.ckeditor + '/ckeditor.js'
			], this.initCkEditor.bind(this), this.fallback.bind(this));
		}
	} else {
		this.initCustom();
	}
};

/** Load the specified file.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.loadFile = function () {
	cause.ajax({
		url: this.config.filename,
		method: 'GET',
		dataType: 'html',
		success: (function (data) {
			cause.$(this.config.selector).html(data);

			this.init();
		}).bind(this),
		error: function () {
			cause.alert(cause.localize('fileDoesnotExist'), cause.localize('wysiwyg'));
		}
	});
};

/** Execute when content of editor changed.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onChange = function () {
	cause.log(this.config.editor + ' content change');
};

/** Execute when the editor file picker is call.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {object} arguments - Specific to each plugin
 * @param {function} arguments.0 - tinymce callback
 * @param {string} arguments.1 - tinymce value
 * @param {string} arguments.2 - tinymce meta
 */
cause.objects.wysiwyg.prototype.onFilePicker = function () {
	if (this.config.editor === 'tinymce') {
		tinymce.activeEditor.windowManager.open({
			title: 'Select image',
			body: [
				{type: 'textbox', name: 'source', label: 'Source'}
			],
			onsubmit: (function(callback, e) {
				cause.log(e);
			}).bind(this, arguments[0])
		});
	} else {
		cause.log(this.config.editor + ' file picker need to be defined');
	}
};

/** Execute when the editor is initialize.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onInitialize = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (typeof(this.config.onLoad) === 'function') {
		this.config.onLoad();
	} else {
		cause.log(this.config.editor + ' is initialize');
		cause.log(editor);
	}
};

/** Execute when the editor has a key press.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onKey = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (typeof(this.config.onKey) === 'function') {
		this.config.onKey();
	} else {
		cause.log(this.config.editor + ' on keyup');
		cause.log(editor);
	}
};

/** Execute when save is execute on editor.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onSave = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (typeof(this.config.onSave) === 'function') {
		this.config.onSave();
	} else {
		cause.log(this.config.editor + ' is saved');
		cause.log(editor);
	}
};

/** Execute when the editor is loaded.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onSetup = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (this.config.editor === 'tinymce') {
		editor.on('change', this.onChange.bind(this));
		editor.on('keydown', this.onKey.bind(this));
		editor.on('SaveContent', this.onSave.bind(this));
	}

	cause.log(this.config.editor + ' is loaded');
};

/** Initialize the CKEditor.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.initCkEditor = function () {
	var elm = cause.$(this.config.selector);
	var id = (elm.attr('id') ? elm.attr('id') : cause.unique());
	var config = {
		contentsCss: [],
		enterMode: CKEDITOR.ENTER_DIV,
		filebrowserBrowseUrl: '',
		filebrowserUploadUrl: '',
		height: this.config.height,
		language: 'fr_FR',
		on: {
			change: this.onChange.bind(this),
			instanceReady: this.onInitialize.bind(this),
			//key: this.onKey.bind(this),
			loaded: this.onSetup.bind(this),
			save: this.onSave.bind(this)
		},
		toolbar: null
	};

	elm.attr('id', id);

	if (this.config.inline) {
		CKEDITOR.inline(id, config);
	} else {
		CKEDITOR.replace(id, config);
	}
};

/** Initialize the TinyMCE.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.initTinyMCE = function () {
	var config = {
		browser_spellcheck: true,
		content_css: [],
		//content_security_policy: "default-src 'self'",
		file_browser_callback_types: 'file image media',
		file_picker_types: 'file image media',
		forced_root_block: 'div',
		height: this.config.height,
		image_advtab: true,
		inline: this.config.inline,
		language: 'fr_FR',
		plugins: this.plugins[this.config.editor],
		selector: this.config.selector,
		statusbar: this.config.statusbar,
		templates: [],
		theme: 'modern',
		/* Callback */
		//file_picker_callback: this.onFilePicker.bind(this),
		init_instance_callback: this.onInitialize.bind(this),
		setup: this.onSetup.bind(this)
	};

	/* Setup each toolbar */
	config.toolbar1 = 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image';

	if (this.config.mode === 'full') {
		config.toolbar2 = 'print preview media | forecolor backcolor emoticons';
	}

	tinymce.init(config);
};

/** Build a custom basic editor.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.initCustom = function () {
	var config = {
		selector: this.config.selector,
		onChange: this.onChange.bind(this),
		//onFilePicker: this.onFilePicker.bind(this),
		onInitialize: this.onInitialize.bind(this),
		//onKey: this.onKey.bind(this),
		onSave: this.onSave.bind(this),
		onSetup: this.onSetup.bind(this)
	};

	this.editor = new cause.objects.wysiwygCustom(config);
};

/** This function is execute if plugins is not found.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.fallback = function () {
	if (this.config.editor === 'tinymce') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'TinyMCE ' + cause.version.tinymce, 5000);
	} else if (this.config.editor === 'ckeditor') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'CKEditor ' + cause.version.ckeditor, 5000);
	}

	this.config.editor = 'custom';
	this.initCustom();
};/* English labels */
causeAvailableLanguage.en = {
    'cancel': 'Cancel',
    'changePassword': 'Change my password',
    'confirmChangedPassword': 'Your password has been changed, please log in again',
    'confirmPassword': 'Password confirmation',
    'copyright': '{version}All rights reserved © CAUCA',
    'email': 'Email',
    'emailSendWindowBlock': 'The email window appears to have been blocked at the opening!<br /><br />Please allow it to open in your browser<br />Or <a>click here</a>',
    'editor': 'Editor',
    'en': 'English',
    'english': 'English',
    'error': 'Error',
    'errorJQuery': 'Your browser is not supported! Please update',
    'errorLoginInformation': 'Please verify your login information',
    'errorOffline': 'Your browser doesn\'t support the offline mode',
    'errorUserMedia': 'Your browser doesn\'t support the audio/video recording',
    'errorVideoRecorder': 'An error occurred during video recording',
    'errorWebAudioRecorder': 'An error occurred during recording',
    'errorWorker': 'Your browser doesn\'t support the web worker.',
    'errorWorkerFileNotFound': 'Web worker file not found.',
    'fileDoesnotExist': 'This file does not seem to exist!',
    'fileLoadingError': 'An error occurred while loading the file!',
    'fileTypeBrowserNotSupported': 'This file type is not supported by your browser!',
    'fileTypeNotSupported': 'This file type is not supported!',
    'fileViewer': 'File viewer',
    'fr': 'French',
    'french': 'French',
    'fullscreen': 'Fullscreen',
    'header': '',
    'help': 'Help',
    'home': 'Home',
    'localStorage': 'Local storage',
    'localStorageNotAvailable': 'Local storage not available',
    'localStorageSetError': 'Error when saving on local storage',
    'login': 'Login',
    'logout': 'Logout',
    'logoutOf': 'Logout of ',
    'missingAddons': 'This addons can\'t be found in folder "cause/js/addons/"',
    'missingFile': 'A loaded file is missing',
    'missingPlugins': 'This plugins can\'t be found in folder "/plugins/"',
    'modify': 'Modify',
    'no': 'No',
    'offline': 'Offline',
    'ok': 'Ok',
    'offlineUpdate': 'A new version of this site is available. Load it?',
    'online': 'Online',
    'password': 'Password',
    'poweredBy': 'Powered by <div class="image minilogo" />',
    'replaceBy': 'Replace by',
    'sqlCantCreate': 'Can\'t create the database',
    'sqlNeedToDefineUpdate': 'You need to pass a "update" function',
    'sqlNotAvailable': 'Web database is not available',
    'sqlUpdateError': 'DB can\'t be updated',
    'sqlUpdateSucceed': 'DB has been updated',
    'sqlQueryError': 'An error occurs on query',
    'timeout': 'Timeout',
    'timeoutWebAudioRecorder': 'You exceeded the maximum accepted time',
    'toDefined': 'To defined',
    'translate': 'Translate',
    'update': 'Update',
    'username': 'Username',
    'version': 'Version',
    'wysiwyg': 'HTML editor',
    'yes': 'Yes',
    'yourBrowserDontSupport': 'Your browser doesn\'t support this option! Please update',
    'yourBrowserIsNotSupported': 'Your browser is not supported! Please update'
};/* French labels */
causeAvailableLanguage.fr = {
    'cancel': 'Annuler',
    'changePassword': 'Modifier mon mot de passe',
    'confirmChangedPassword': 'Votre mot de passe à été modifié, veuillez-vous connecter à nouveau',
    'confirmPassword': 'Confirmation du mot de passe',
    'copyright': '{version}Tous droits réservés © CAUCA',
    'email': 'Courriel',
    'emailSendWindowBlock': 'La fenêtre de courriel semble avoir été bloqué à l\'ouverture!<br /><br />Veuillez permettre à celle-ci de s\'ouvrir dans votre navigateur.<br />Ou <a>cliquez ici</a>',
    'editor': 'Éditeur',
    'en': 'Anglais',
    'english': 'Anglais',
    'error': 'Erreur',
    'errorJQuery': 'Votre navigateur n\'est pas supporté! Veuillez le mettre à jour',
    'errorLoginInformation': 'Veuillez valider vos informations de connexion',
    'errorOffline': 'Votre navigateur ne supporte pas le mode hors ligne',
    'errorUserMedia': 'Votre navigateur ne supporte pas l\'enregistrement audio/vidéo',
    'errorVideoRecorder': 'Une erreur est survenue durant l\'enregistrement vidéo',
    'errorWebAudioRecorder': 'Une erreur est survenue durant l\'enregistrement',
    'errorWorker': 'Votre navigateur ne supporte pas les web worker.',
    'errorWorkerFileNotFound': 'Le fichier pour le web worker est introuvable.',
    'fileDoesnotExist': 'Ce fichier ne semble pas exister!',
    'fileLoadingError': 'Une erreur est survenue lors du chargement du fichier!',
    'fileTypeBrowserNotSupported': 'Ce type de fichier n\'est pas supporté par votre navigateur!',
    'fileTypeNotSupported': 'Ce type de fichier n\'est pas supporté!',
    'fileViewer': 'Visionneur de fichier',
    'fr': 'Français',
    'french': 'Français',
    'fullscreen': 'Plein écran',
    'header': '',
    'help': 'Aide',
    'home': 'Accueil',
    'localStorage': 'Stockage local',
    'localStorageNotAvailable': 'Stockage non disponible',
    'localStorageSetError': 'Erreur lors de la sauvegarde local',
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'logoutOf': 'Déconnexion de ',
    'missingAddons': 'Ce addons n\'est pas présent dans le dossier "cause/js/addons/"',
    'missingFile': 'Un fichier chargé est manquant',
    'missingPlugins': 'Ce plugins n\'est pas présent dans le dossier "/plugins/"',
    'modify': 'Modifier',
    'no': 'Non',
    'offline': 'Hors ligne',
    'ok': 'Ok',
    'offlineUpdate': 'Une nouvelle version est disponible, Voulez-vous la charger?',
    'online': 'En ligne',
    'password': 'Mot de passe',
    'poweredBy': 'Propulsé par <div class="image minilogo" />',
    'replaceBy': 'Remplacer par',
    'sqlCantCreate': 'Impossible de créer la base de donnée',
    'sqlNeedToDefineUpdate': 'Vous devez créer une fonction pour la mise à jour',
    'sqlNotAvailable': 'La base de donnée web n\'est pas disponible',
    'sqlUpdateError': 'Impossible de mettre la BD à jour',
    'sqlUpdateSucceed': 'La BD a été mise à jour',
    'sqlQueryError': 'Une erreur est survenue lors de la requête',
    'timeout': 'Délai écouler',
    'timeoutWebAudioRecorder': 'Vous avez dépassé le temps maximum accepté',
    'toDefined': 'À définir',
    'translate': 'Traduction',
    'update': 'Mise à jour',
    'username': 'Nom d\'utilisateur',
    'version': 'Version',
    'wysiwyg': 'Éditeur HTML',
    'yes': 'Oui',
    'yourBrowserDontSupport': 'Votre navigateur ne supporte pas cette option! Veuillez le mettre à jour',
    'yourBrowserIsNotSupported': 'Votre navigateur n\'est pas supporté! Veuillez le mettre à jour'
};/** Class for helping when we process to view some web page.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewHtml = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.ext = '';
	this.name = '';
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['', 'asp', 'aspx', 'htm', 'html', 'mht', 'php', 'shtml', 'txt'];

	this.init();
};

/** Check if browser support some none standard format.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.init = function () {
	if (!cause.is.element(this.filename)) {
		var link = (this.filename.includes('?') ? this.filename.substr(0, this.filename.indexOf('?')) : this.filename);

		this.name = (link.includes('/') ? link.substr(link.lastIndexOf('/') + 1) : (link.includes('://') ? '' : link));
		this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');
	}

	this.opendoc();
};

/** All check are finish.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.opendoc = function () {
	this.show();
};

/** Show the last loaded frame.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.openpage = function (frame) {
	if (this.supported.includes(this.ext)) {
		cause.$(frame).height(cause.$('#cause-view .content').height() - 10);

		if (typeof(this.callback) == 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) == 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current frame.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.show = function () {
	if (cause.is.element(this.filename)) {
		cause.$('#cause-view canvas').replaceWith(this.filename);

		if (typeof(this.callback) == 'function') {
			setTimeout((function () {
				this.callback();
			}).bind(this), 100);
		}
	} else {
		var frame = cause.$('<iframe>');

		cause.$('#cause-view canvas').replaceWith(frame.get(0));

		frame.on('load', this.openpage.bind(this, frame.get(0)));
		frame.on('error', this.onError.bind(this));
		frame.attr('src', this.filename);
	}
};/** Class for helping when we process to view some image.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewImage = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.validate = 0;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['gif', 'jpg', 'jpeg', 'png'];

	this.init();
};

/** Check if browser support some none standard format.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	cause.supported.apng((function (apng) {
		if (apng) {
			this.supported.push('apng');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.bmp((function (bmp) {
		if (bmp) {
			this.supported.push('bmp');
			this.supported.push('dib');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.ico((function (ico) {
		if (ico) {
			this.supported.push('ico');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.svg((function (svg) {
		if (svg) {
			this.supported.push('svg');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.tif ((function (tif) {
		if (tif) {
			this.supported.push('tif');
			this.supported.push('tiff');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.webp((function (webp) {
		if (webp) {
			this.supported.push('webp');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.xbm((function (xbm) {
		if (xbm) {
			this.supported.push('xbm');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
};

/** All check are finish.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.opendoc = function () {
	if (this.validate === 7) {
		this.show();
	}
};

/** Show the last loaded image.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.openpage = function (image) {
	if (this.supported.includes(this.ext)) {
		$('#cause-view canvas').replaceWith(image);

		if (typeof(this.callback) === 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeBrowserNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) === 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current image.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.show = function () {
	var image = cause.$('<img>');

	image.on('load', this.openpage.bind(this, image.get(0)));
	image.on('error', this.onError.bind(this));
	image.attr('src', this.filename);
};
/** Class for helping when we process to view some element.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} file - Path of file to visualize
 * @param {object} listeners - Object with some custom listeners
 */
cause.objects.view = function (file, listeners) {
	this.name = 'view';
	this.doc = null;
	this.file = file;
	this.listeners = listeners;

	if (!cause.helpIsOn && this.file) {
		this.open();
	}
};

/** Show help when is cause.help('rabbitMQ') is call.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.help = function () {
	cause.log('Aide pour "cause.view":', 'help_title');
	cause.log("\t" +
		'new cause.view(file);' + "\n\n\t" +
		'file = URL du fichier à visualiser', 'help');
};

/** Select the right viewer for the file and open it.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.open = function () {
	var ext = this.findExtension();
	var format = [
		{viewer: 'viewHtml', ext: ['', 'asp', 'aspx', 'htm', 'html', 'shtml', 'php', 'txt', 'mht']},
		{viewer: 'viewImage', ext: ['bmp', 'dib', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'apng', 'svg', 'tif', 'tiff', 'webp', 'xbm']},
		{viewer: 'viewMedia', ext: ['m4v', 'm4a', 'mp3', 'mp4', 'ogv', 'oga', 'ogg', 'wav', 'webm', 'webmv', 'webma']},
		{viewer: 'viewPdf', ext: ['pdf']},
		{viewer: 'viewOdf', ext: ['odp', 'ods', 'odt']},
		{viewer: 'viewOdf', ext: ['odp', 'ods', 'odt']},
		{viewer: 'viewHtml', ext: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'], prefix: 'https://view.officeapps.live.com/op/embed.aspx?src='}
	];

	for (var i=0, j=format.length; i<j; i++) {
		if (format[i].ext.includes(ext)) {
			this.show();

			if (format[i].prefix) {
				this.doc = new cause.objects[format[i].viewer](format[i].prefix + encodeURI(this.file), this.loaded.bind(this));
			} else {
				this.doc = new cause.objects[format[i].viewer](this.file, this.loaded.bind(this));
			}

			return null;
		}
	}

	cause.alert(cause.localize('fileTypeNotSupported'), cause.localize('fileViewer'));
};

cause.objects.view.prototype.findExtension = function () {
	if (cause.is.element(this.file)) {
		return '';
	}

	if (!this.file.includes('://') && this.file.substr(0,1) !== '/') {
		this.file = location.href.substr(0, location.href.lastIndexOf('/') + 1) + this.file;
	}

	var name = (this.file.includes('/') ? this.file.substr(this.file.lastIndexOf('/') + 1) : (this.file.includes('://') ? '' : this.file));

	return (name.includes('.') ? name.substr(name.lastIndexOf('.') + 1) : '');
};

/** Set toolbar after loading.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.loaded = function () {
	if (this.doc && !this.doc.error) {
		var name = cause.localize('editor');

		if (!cause.is.element(this.file)) {
			name = this.file.substr(this.file.lastIndexOf('/') + 1);
		}

		cause.$('#cause-view .toolbar .title').html(name ? name : this.file);
		cause.$('#cause-view .toolbar .page').html(this.doc.pagecurrent + ' / ' + this.doc.pagetotal);

		if (this.doc.multipage) {
			cause.$('#cause-view .toolbar .page').removeAttr('disabled');

			if (this.doc.pagecurrent > 1) {
				cause.$('#cause-view .toolbar .fa-fast-backward').removeAttr('disabled');
				cause.$('#cause-view .toolbar .fa-step-backward').removeAttr('disabled');
			}

			if (this.doc.pagecurrent < this.doc.pagetotal) {
				cause.$('#cause-view .toolbar .fa-step-forward').removeAttr('disabled');
				cause.$('#cause-view .toolbar .fa-fast-forward').removeAttr('disabled');
			}
		}
	} else {
		this.hide();

		cause.alert(cause.localize('fileLoadingError'), cause.localize('fileViewer'));
	}
};

/** Block right click on document.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.contextmenu = function (e) {
	e.preventDefault();
};

/** Go to the previous page.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.prev = function () {
	if (this.doc && typeof(this.doc.prev) == 'function') {
		this.doc.prev();
	}
};

/** Go to the next page.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.next = function () {
	if (this.doc && typeof(this.doc.next) == 'function') {
		this.doc.next();
	}
};

/** Go to specific page.
 *
 * @memberOf cause.objects.view
 * @param {integer} nb - Page number
 */
cause.objects.view.prototype.goTo = function (nb) {
	if (this.doc && typeof(this.doc.goTo) == 'function') {
		this.doc.goTo(nb);
	}
};

/** Hide the viewer.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.hide = function () {
	cause.$('#cause-view').remove();
};

/** Show the viewer.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.show = function () {
	var elm = cause.$('#cause-view');
	var hasCustom = (this.listeners && typeof(this.listeners) == 'object' ? true : false);
	var page = '<i class="fa fa-fast-backward" aria-hidden="true" disabled="disabled"></i><i class="fa fa-step-backward" aria-hidden="true" disabled="disabled"></i>' +
		'<span class="page" disabled="disabled">1 / 1</span>' +
		'<i class="fa fa-step-forward" aria-hidden="true" disabled="disabled"></i><i class="fa fa-fast-forward" aria-hidden="true" disabled="disabled"></i>';

	if (elm.length > 0) {
		return null;
	}

	elm = cause.$('<div>').attr('id', 'cause-view').appendTo('body');
	elm.html('<div class="toolbar">' +
		'<div class="left">' + page + '</div>' +
		'<div class="right"><i class="fa fa-times" aria-hidden="true"></i></div>' +
		'<div class="title">&nbsp;</div>' +
		'</div><div class="content"><canvas></canvas></div>');

	elm.find('.fa-times').click(this.hide.bind(this));
	elm.find('.fa-fast-backward').click(this.goTo.bind(this, 1));
	elm.find('.fa-step-backward').click(this.prev.bind(this));
	elm.find('.fa-step-forward').click(this.next.bind(this));
	elm.find('.fa-fast-forward').click(this.goTo.bind(this, 0));

	if (hasCustom) {
		for (var action in this.listeners) {
			if (this.listeners.hasOwnProperty(action)) {
				cause.$('<i class="fa fa-' + action + '" aria-hidden="true"></i>').appendTo('#cause-view .left');
				cause.$('.fa-' + action).click(this.listeners[action]);
			}
		}
	}

	elm.find('.content').contextmenu(this.contextmenu.bind(this));
};/** Class for helping when we process to view an audio or a video.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewMedia = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['m4v', 'mp4', 'ogv', 'ogg', 'webmv', 'webm', 'm4a', 'mp4', 'mp3', 'oga', 'ogg', 'wav', 'webma', 'webm'];

	this.init();
};

/** Load the document.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	this.opendoc(this);
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.opendoc = function () {
	this.show();
};

/** Show the last loaded image.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.openpage = function () {
	if (this.supported.includes(this.ext)) {
		if (typeof(this.callback) == 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeBrowserNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) == 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current image.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.show = function () {
	this.player = new cause.objects.player({
		selector: '#cause-view .content',
		media: [this.filename],
		autoplay: true,
		loop: true,
		width: '100%'
	});

	this.openpage.bind(this);
};/** Class for helping when we process to view some ODF.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewOdf = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['odp', 'ods', 'odt'];

	if (typeof(webodf) == 'object') {
		this.init();
	} else {
		cause.include.js(cause.baseUrlPlugins + 'webODF/' + cause.version.webodf + '/webodf-debug.js', this.init.bind(this), function () {
			cause.alert(cause.localize('missingPlugins'), 'WebODF ' + cause.version.webodf);
		});
	}
};

/** Load the document.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	cause.$('#cause-view canvas').replaceWith('<div id="cause-view-odf"></div>');

	this.doc = new odf.OdfCanvas(cause.$('#cause-view-odf').get(0));
	this.doc.addListener('statereadychange', this.opendoc.bind(this));
	this.doc.load(this.filename);
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.opendoc = function () {
	this.pagetotal = this.getPages().length;

	if (this.pagetotal > 0) {
		this.multipage = (this.pagetotal > 1 ? true : false);
		this.show();
	} else {
		this.pagetotal = 1
		this.openpage();
	}
};

/** Show the last loaded page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.openpage = function () {
	if (typeof(this.callback) == 'function') {
		this.callback();
	}
};

/** Load the current page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.show = function () {
	this.doc.showPage(this.pagecurrent);
	this.openpage();
};

/** Go to the previous page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.prev = function () {
	if (this.pagecurrent > 1) {
		this.pagecurrent--;
	}

	this.show();
};

/** Go to the next page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.next = function () {
	if (this.pagecurrent < this.pagetotal) {
		this.pagecurrent++;
	}

	this.show();
};

/** Go to a specific page.
 *
 * @memberOf cause.objects.viewOdf
 * @param {integer} nb - Page number
 */
cause.objects.viewOdf.prototype.goTo = function (nb) {
	if (nb > 0 && nb < this.pagetotal) {
		this.pagecurrent = nb;
	} else {
		this.pagecurrent = this.pagetotal;
	}

	this.show();
};

/** Return an array with all pages.
 *
 * @memberOf cause.objects.viewOdf
 * @returns {array} all pages
 */
cause.objects.viewOdf.prototype.getPages = function () {
	var root = this.doc.odfContainer().rootElement;
	var pageNodes = Array.prototype.slice.call(root.getElementsByTagNameNS(this.nsResolver('draw'), 'page'));
	var pages = [];

	for (var i = 0, j = pageNodes.length; i < j; i++) {
		pages.push([
			pageNodes[i].getAttribute('draw:name'),
			pageNodes[i]
		]);
	}

	return pages;
};

/** Return the type of document.
 *
 * @memberOf cause.objects.viewOdf
 * @param {string} prefix - Type of document
 * @returns {string} NS for specified document
 */
cause.objects.viewOdf.prototype.nsResolver = function (prefix) {
	var ns = {
		'draw': "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
		'presentation': "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
		'text': "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
		'office': "urn:oasis:names:tc:opendocument:xmlns:office:1.0"
	};

	return ns[prefix] || cause.log('prefix [' + prefix + '] unknown.');
};
/** Class for helping when we process to view a PDF.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewPdf = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['pdf'];

	if (typeof(PDFJS) == 'object') {
		this.init();
	} else {
		cause.include.js([
			cause.baseUrlPlugins + 'pdf.js/' + cause.version.pdfjs + '/build/pdf.js',
			cause.baseUrlPlugins + 'pdf.js/' + cause.version.pdfjs + '/build/pdf.worker.js'
		], this.init.bind(this), function () {
			cause.alert(cause.localize('missingPlugins'), 'PDF.JS ' + cause.version.pdfjs);
		});
	}
};

/** Load the document.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	PDFJS.getDocument(this.filename).then(this.opendoc.bind(this));
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.opendoc = function (pdf) {
	this.doc = pdf;
	this.pagecurrent = 1;
	this.pagetotal = this.doc.numPages;
	this.multipage = (this.doc.numPages > 1 ? true : false);
	this.show();
};

/** Show the last loaded page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.openpage = function (page) {
	var viewport = page.getViewport(1);
	var max = (window.innerWidth * 0.9);
	var scale = (max / viewport.width);
	var canvas = cause.$('#cause-view canvas').get(0);
	var context = canvas.getContext('2d', {alpha: false});

	viewport = page.getViewport(scale);
	canvas.width = viewport.width;
	canvas.height = viewport.height;

	page.render({
		canvasContext: context,
		viewport: viewport
	});

	if (typeof(this.callback) == 'function') {
		this.callback();
	}
};

/** Load the current page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.show = function () {
	this.doc.getPage(this.pagecurrent).then(this.openpage.bind(this));
};

/** Go to the previous page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.prev = function () {
	if (this.pagecurrent > 1) {
		this.pagecurrent--;
	}

	this.show();
};

/** Go to the next page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.next = function () {
	if (this.pagecurrent < this.pagetotal) {
		this.pagecurrent++;
	}

	this.show();
};

/** Go to a specific page.
 *
 * @memberOf cause.objects.viewPdf
 * @param {integer} nb - Page number
 */
cause.objects.viewPdf.prototype.goTo = function (nb) {
	if (nb > 0 && nb < this.pagetotal) {
		this.pagecurrent = nb;
	} else {
		this.pagecurrent = this.pagetotal;
	}

	this.show();
};/** Class for helping when we process to view a PSD.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewPsd = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['psd'];

	if (typeof(PSD) == 'object') {
		this.init();
	} else {
		cause.include.js([
			cause.baseUrlPlugins + 'psd.js/' + cause.version.psdjs + '/psd.min.js',
		], this.init.bind(this), function () {
			cause.alert(cause.localize('missingPlugins'), 'PSD.JS ' + cause.version.psdjs);
		});
	}
};

/** Load the document.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	var PSD = require('psd');
	PSD.fromURL(this.filename).then(this.opendoc.bind(this));
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.opendoc = function (psd) {
	this.doc = psd;
	this.show();
};

/** Show the last loaded page.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.openpage = function (image) {
	if (this.supported.includes(this.ext)) {
		$('#cause-view canvas').replaceWith(image);

		if (typeof(this.callback) == 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeBrowserNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) == 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current page.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.show = function () {
	var image = cause.$('<img>');
	var png = this.doc.image.toPng();

	image.on('load', this.openpage.bind(this, image.get(0)));
	image.on('error', this.onError.bind(this));
	image.width('100%');
	image.attr('src', png.src);
};