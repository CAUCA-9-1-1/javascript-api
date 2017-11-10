/** Show an alert message and try to make it asynchrone.
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
}