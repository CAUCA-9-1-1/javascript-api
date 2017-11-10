/** Class for helping when we want an offline application.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.offline = function () {
	this.name = 'offline';

	/* Initialize the "offline" */
	if (!cause.helpIsOn && cause.$('html').attr('manifest')) {
		if (window.applicationCache) {
			this.init();
		} else {
			cause.alert(cause.localize('errorOffline'), cause.localize('error'));
		}
	}
};

/** Show help when is cause.help('offline') is call.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.help = function () {
	cause.log('Aide pour "cause.offline":', 'help_title');
	cause.log("\t" +
		'new cause.offline();', 'help');
};

/** Initialize the application cache.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.init = function () {
	window.applicationCache.addEventListener('cached', this.cached.bind(this), false);
	window.applicationCache.addEventListener('checking', this.checking.bind(this), false);
	window.applicationCache.addEventListener('downloading', this.downloading.bind(this), false);
	window.applicationCache.addEventListener('error', this.error.bind(this), false);
	window.applicationCache.addEventListener('noupdate', this.noUpdate.bind(this), false);
	window.applicationCache.addEventListener('obsolete', this.obsolete.bind(this), false);
	window.applicationCache.addEventListener('progress', this.progress.bind(this), false);
	window.applicationCache.addEventListener('updateready', this.updateReady.bind(this), false);
};

/** Fired after the first cache of the manifest.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.cached = function () {
};

/** Checking for an update. Always the first event fired in the sequence.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.checking = function () {
};

/** An update was found. The browser is fetching resources.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.downloading = function () {
};

/** The manifest returns 404 or 410, the download failed, or the manifest changed while the download was in progress.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.error = function () {
};

/** Fired after the first download of the manifest.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.noUpdate = function () {
};

/** Fired if the manifest file returns a 404 or 410. This results in the application cache being deleted.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.obsolete = function () {
};

/** Fired for each resource listed in the manifest as it is being fetched.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.progress = function () {
};

/** Fired when the manifest resources have been newly redownloaded.
 *
 * @memberOf cause.objects.offline
 */
cause.objects.offline.prototype.updateReady = function () {
	if (window.applicationCache.status === window.applicationCache.UPDATEREADY && confirm(cause.localize('offlineUpdate'))) {
		window.location.reload();
	}
};

/** @property {cause.objects.offline} */
cause.offline = new cause.objects.offline();