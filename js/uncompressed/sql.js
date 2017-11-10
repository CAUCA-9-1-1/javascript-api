/** Class for helping with storage.
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
};