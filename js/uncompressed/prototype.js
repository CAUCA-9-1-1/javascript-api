/** Add some function to native object "String"
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
}