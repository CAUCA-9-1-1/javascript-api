/** Singleton for helping when we use cookie.
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
