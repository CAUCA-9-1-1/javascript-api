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
