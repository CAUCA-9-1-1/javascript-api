/** Singleton for helping to detect some object.
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
