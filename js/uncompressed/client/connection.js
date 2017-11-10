/** Class for helping when we process the network connection.
 * The quality of connection is percent of 1 Gbps.
 * This class automatically add the "online" or "offline" class on tag "body"
 *
 * @constructor
 * @memberOf cause.objects
 * @property {cause.objects.connectionIp} ip
 */
cause.objects.connection = function () {
	this.name = 'connection';
	this.loadingTime = 0;
	this.renderingTime = 0;
	this.quality = 100;
	this.speed = '';
	this.type = '';
	this.ip = new cause.objects.connectionIp();
	this.qualities = [
		{quality: 100, minimum: (1 * 1024 * 1024 * 1024), loadingTime: 0, estimate: '', type: 'LAN - Gbps'},
		{quality: 90, minimum: (0.5 * 1024 * 1024 * 1024), loadingTime: 0, estimate: '', type: 'LAN'},
		{quality: 80, minimum: (30 * 1024 * 1024), loadingTime: 25, estimate: '30 Mbps (min estimate)', type: 'Fiber'},
		{quality: 70, minimum: (15 * 1024 * 1024), loadingTime: 35, estimate: '30 Mbps (max estimate)', type: 'WIFI'},
		{quality: 60, minimum: (3 * 1024 * 1024), loadingTime: 60, estimate: '4 Mbps (max estimate)', type: 'Regular 4G'},
		{quality: 50, minimum: (1.5 * 1024 * 1024), loadingTime: 0, estimate: '', type: 'DSL'},
		{quality: 40, minimum: (750 * 1024), loadingTime: 100, estimate: '1.5 Mbps (max estimate)', type: 'Good 3G'},
		{quality: 30, minimum: (450 * 1024), loadingTime: 200, estimate: '750 Kbps (max estimate)', type: 'Regular 3G'},
		{quality: 20, minimum: (250 * 1024), loadingTime: 250, estimate: '450 Kbps (max estimate)', type: 'Good 2G'},
		{quality: 10, minimum: (50 * 1024), loadingTime: 500, estimate: '250 Kbps (max estimate)', type: 'Regular 2G'},
		{quality: 5, minimum: (20 * 1024), loadingTime: 1000, estimate: '50 Kbps (max estimate)', type: 'GPRS'}
	];

	/* Calcul loading time when page is ready */
	if (typeof(document) === 'object') {
		cause.$(document).ready((function (e) {
			cause.$('body').addClass('is-online');

			this.estimate(e);
		}).bind(this));
	}
};

/** Show help when is cause.help('connection') is call.
 *
 * @memberOf cause.objects.connection
 */
cause.objects.connection.prototype.help = function () {
	cause.log('Aide pour "cause.connection":', 'help_title');
	cause.log("\t" +
		'cause.connection.testSpeed() = Calcul the connection speed' + "\n\t" +
		'cause.connection.getIp() = Return an object with IP information', 'help');
};

/** Change status for "online".
 *
 * @memberOf cause.objects.connection
 * @param {object} e - Event object of navigator
 */
cause.objects.connection.prototype.online = function () {
	cause.$('body').addClass('is-online');
	cause.$('body').removeClass('is-offline');
};

/** Change status for "offline".
 *
 * @memberOf cause.objects.connection
 * @param {object} e - Event object of navigator
 */
cause.objects.connection.prototype.offline = function () {
	cause.$('body').addClass('is-offline');
	cause.$('body').removeClass('is-online');
};

/** Find all IP information.
 *
 * @memberOf cause.objects.connection
 * @param {function} callback - Function executed when all request are made
 * @param {boolean} confirm - True if we need a confirmed IP information
 */
cause.objects.connection.prototype.getIp = function (callback, confirm) {
	if (this.ip) {
		if (confirm) {
			this.ip.getConfirm(callback);
		} else {
			this.ip.get(callback);
		}
	}
};

/** Download a defined image to test the speed of connection.
 *
 * @memberOf cause.objects.connection
 */
cause.objects.connection.prototype.testSpeed = function () {
	var startTime = (new Date()).getTime();
	var download = new Image();

	download.onload = this.testOnCompleteDownload.bind(this, startTime);
	download.onerror = this.testOnError.bind(this);

	download.src = cause.baseUrl + 'images/test-5mb.jpg?_=' + startTime;
};

cause.objects.connection.prototype.testOnCompleteDownload = function (startTime) {
	var endTime = (new Date()).getTime();
	var duration = (endTime - startTime) / 1000;
	var downloadSize = 4995374;	// If we change the image "cause/images/test5mb.jpg", we need to change this value
	var bitsLoaded = downloadSize * 8;
	var speedBps = (bitsLoaded / duration);

	this.testOnError();

	for (var i=0, j=this.qualities.length; i<j; i++) {
		if (speedBps > this.qualities[i].minimum) {
			this.speed = cause.format.speed(speedBps);
			this.quality = this.qualities[i].quality;
			this.type = this.qualities[i].type;

			break;
		}
	}
};

cause.objects.connection.prototype.testOnError = function () {
	this.quality = 0;
	this.speed = '0 Bps';
	this.type = '';
};

/** Detect approximately the type of connection.
 * This estimate varies with the total size of page loaded.
 *
 * @memberOf cause.objects.connection
 * @param {object} e - Event object of navigator
 */
cause.objects.connection.prototype.estimate = function () {
	if (typeof(window.performance) === 'object') {
		this.loadingTime = window.performance.timing.domLoading - window.performance.timing.navigationStart;
		this.renderingTime = window.performance.timing.domComplete - window.performance.timing.domLoading;

		this.testOnError();

		for (var i=0, j=this.qualities.length; i<j; i++) {
			if (this.loadingTime < this.qualities[i].loadingTime) {
				this.speed = this.qualities[i].estimate;
				this.quality = this.qualities[i].quality;
				this.type = this.qualities[i].type;

				break;
			}
		}
	} else {
		this.quality = 100;
		this.speed = '';
		this.type = '';
	}
};

/** @property {cause.objects.connection} */
cause.connection = new cause.objects.connection();