/** Singleton for helping when we format some string.
 *
 * @namespace
 * @memberOf cause
 */
cause.format = {
	/** Show help when is cause.help('format') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.format":', 'help_title');
		cause.log("\t" +
			'cause.format.meter(meter) = Convertie un nombre de mètre en KM' + "\n\t" +
			'cause.format.date(date, format, [UTC]) = Convertie une date dans un format spécifique', 'help');
	},

	/** Format date
	 *
	 * @param {string} date - Date string
	 * @param {string} format - Format of date
	 * @param {boolean} utc - True for UTC date
	 * @returns {string} New date string
	 */
	date: cause.date.format,

	/** Return formatted meter.
	 *
	 * @param {integer} meter - Number of total meter
	 * @returns {string} Number of meter with abbreviation
	 */
	meter: function (meter) {
		meter = parseInt(meter);

		if (meter) {
			if (meter > 1000) {
				var km = (Math.round(meter / 100) / 10);
				
				return km + ' km';
			}
	
			return meter + ' m';
		}
	},

	/** Return formatted speed transfer.
	 *
	 * @param {integer} speedBps -Transfered bits
	 * @returns {string} transfer speed
	 */
	speed: function (speedBps) {
		if (speedBps < 1024) {
			return speedBps.toFixed(2) + ' Bps';
		}

		var speedKbps = (speedBps / 1024);
		if (speedKbps < 1024) {
			return speedKbps.toFixed(2) + ' Kbps';
		}

		var speedMbps = (speedKbps / 1024);
		if (speedMbps < 1024) {
			return speedMbps.toFixed(2) + ' Mbps';
		}

		return (speedMbps / 1024).toFixed(2) + ' Gbps';
	},

	/** Return formatted time.
	 */
	time: function (totalSeconds, format) {
		var time = new Date();
		var hours   = Math.floor(totalSeconds / 3600);
		var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		time.setHours(hours);
		time.setMinutes(minutes);
		time.setSeconds(seconds);

		return this.date(time, format || 'H:MM:ss');
	}
};