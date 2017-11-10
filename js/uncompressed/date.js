/** Singleton for helping when we process to date
 *
 * @namespace
 * @memberOf cause
 */
cause.date = {
	/** Show help when is cause.help('date') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.date":', 'help_title');
		cause.log("\t" +
			'cause.date.parse("string date") = Convertie une chaine de caractère en objet date' + "\n\t" +
			'cause.date.format(date, format, [UTC]) = Convertie une date dans un format spécifique', 'help');
	},

	/** Return a date object from a string
	 *
	 * @param {string} date - String of date
	 */
	parse: function (date) {
		var time = new Date(date);
		
		if (!isNaN(time.getTime())) {
			return time;
        }

        return this.parseGMT(date);
	},

	parseGMT: function (date) {
        var time = new Date(date.replaceAll(' ', 'T') + 'Z');

        if (!isNaN(time.getTime())) {
            return time;
        }

        return this.parseString(date);
	},

	parseString: function (date) {
		var info = date.replaceAll(' ', '-').replaceAll(':', '-').replaceAll('/', '-').split('-');

		time = new Date();
		time.setFullYear(info[0]);
		time.setMonth(parseInt(info[1]) + 1);
		time.setDate(info[2]);
		time.setHours(info[3]);
		time.setMinutes(info[4]);
		time.setSeconds(info[5]);
		time.setMilliseconds(0);

		time.setUTCFullYear(info[0]);
		time.setUTCMonth(parseInt(info[1]) + 1);
		time.setUTCDate(info[2]);
		time.setUTCHours(info[3]);
		time.setUTCMinutes(info[4]);
		time.setUTCSeconds(info[5]);
		time.setUTCMilliseconds(0);

        return time;
	},

	/** Format date
	 *
	 * @param {string} date - Date string
	 * @param {string} format - Format of date
	 * @param {boolean} utc - True for UTC date
	 * @returns {string} New date string
	 */
	format: function (date, format, utc) {
		return dateFormat(date, format, utc);
	}
};