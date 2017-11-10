/** Function for helping to use cause library.
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
