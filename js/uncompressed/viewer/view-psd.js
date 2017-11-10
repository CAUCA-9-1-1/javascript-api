/** Class for helping when we process to view a PSD.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewPsd = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['psd'];

	if (typeof(PSD) == 'object') {
		this.init();
	} else {
		cause.include.js([
			cause.baseUrlPlugins + 'psd.js/' + cause.version.psdjs + '/psd.min.js',
		], this.init.bind(this), function () {
			cause.alert(cause.localize('missingPlugins'), 'PSD.JS ' + cause.version.psdjs);
		});
	}
};

/** Load the document.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	var PSD = require('psd');
	PSD.fromURL(this.filename).then(this.opendoc.bind(this));
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.opendoc = function (psd) {
	this.doc = psd;
	this.show();
};

/** Show the last loaded page.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.openpage = function (image) {
	if (this.supported.includes(this.ext)) {
		$('#cause-view canvas').replaceWith(image);

		if (typeof(this.callback) == 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeBrowserNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) == 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current page.
 *
 * @memberOf cause.objects.viewPsd
 */
cause.objects.viewPsd.prototype.show = function () {
	var image = cause.$('<img>');
	var png = this.doc.image.toPng();

	image.on('load', this.openpage.bind(this, image.get(0)));
	image.on('error', this.onError.bind(this));
	image.width('100%');
	image.attr('src', png.src);
};