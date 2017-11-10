/** Check if script src look to had jQuery.
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
};