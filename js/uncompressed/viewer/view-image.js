/** Class for helping when we process to view some image.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewImage = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.validate = 0;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['gif', 'jpg', 'jpeg', 'png'];

	this.init();
};

/** Check if browser support some none standard format.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	cause.supported.apng((function (apng) {
		if (apng) {
			this.supported.push('apng');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.bmp((function (bmp) {
		if (bmp) {
			this.supported.push('bmp');
			this.supported.push('dib');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.ico((function (ico) {
		if (ico) {
			this.supported.push('ico');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.svg((function (svg) {
		if (svg) {
			this.supported.push('svg');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.tif ((function (tif) {
		if (tif) {
			this.supported.push('tif');
			this.supported.push('tiff');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.webp((function (webp) {
		if (webp) {
			this.supported.push('webp');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
	cause.supported.xbm((function (xbm) {
		if (xbm) {
			this.supported.push('xbm');
		}

		this.validate++;
		this.opendoc();
	}).bind(this));
};

/** All check are finish.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.opendoc = function () {
	if (this.validate === 7) {
		this.show();
	}
};

/** Show the last loaded image.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.openpage = function (image) {
	if (this.supported.includes(this.ext)) {
		$('#cause-view canvas').replaceWith(image);

		if (typeof(this.callback) === 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeBrowserNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) === 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current image.
 *
 * @memberOf cause.objects.viewImage
 */
cause.objects.viewImage.prototype.show = function () {
	var image = cause.$('<img>');

	image.on('load', this.openpage.bind(this, image.get(0)));
	image.on('error', this.onError.bind(this));
	image.attr('src', this.filename);
};
