/** Class for helping when we process to view an audio or a video.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewMedia = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['m4v', 'mp4', 'ogv', 'ogg', 'webmv', 'webm', 'm4a', 'mp4', 'mp3', 'oga', 'ogg', 'wav', 'webma', 'webm'];

	this.init();
};

/** Load the document.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	this.opendoc(this);
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.opendoc = function () {
	this.show();
};

/** Show the last loaded image.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.openpage = function () {
	if (this.supported.includes(this.ext)) {
		if (typeof(this.callback) == 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeBrowserNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) == 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current image.
 *
 * @memberOf cause.objects.viewMedia
 */
cause.objects.viewMedia.prototype.show = function () {
	this.player = new cause.objects.player({
		selector: '#cause-view .content',
		media: [this.filename],
		autoplay: true,
		loop: true,
		width: '100%'
	});

	this.openpage.bind(this);
};