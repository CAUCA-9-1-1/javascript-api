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
