/** Singleton for helping with storage.
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
