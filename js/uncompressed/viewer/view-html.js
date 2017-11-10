/** Class for helping when we process to view some web page.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewHtml = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.ext = '';
	this.name = '';
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['', 'asp', 'aspx', 'htm', 'html', 'mht', 'php', 'shtml', 'txt'];

	this.init();
};

/** Check if browser support some none standard format.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.init = function () {
	if (!cause.is.element(this.filename)) {
		var link = (this.filename.includes('?') ? this.filename.substr(0, this.filename.indexOf('?')) : this.filename);

		this.name = (link.includes('/') ? link.substr(link.lastIndexOf('/') + 1) : (link.includes('://') ? '' : link));
		this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');
	}

	this.opendoc();
};

/** All check are finish.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.opendoc = function () {
	this.show();
};

/** Show the last loaded frame.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.openpage = function (frame) {
	if (this.supported.includes(this.ext)) {
		cause.$(frame).height(cause.$('#cause-view .content').height() - 10);

		if (typeof(this.callback) == 'function') {
			this.callback();
		}
	} else {
		cause.alert(cause.localize('fileTypeNotSupported'), cause.localize('fileViewer'));
	}
};

/** Show an error.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.onError = function () {
	this.error = true;

	if (typeof(this.callback) == 'function') {
		this.callback();
	} else {
		cause.alert(cause.localize('fileDoesnotExist'), cause.localize('fileViewer'));
	}
};

/** Load the current frame.
 *
 * @memberOf cause.objects.viewHtml
 */
cause.objects.viewHtml.prototype.show = function () {
	if (cause.is.element(this.filename)) {
		cause.$('#cause-view canvas').replaceWith(this.filename);

		if (typeof(this.callback) == 'function') {
			setTimeout((function () {
				this.callback();
			}).bind(this), 100);
		}
	} else {
		var frame = cause.$('<iframe>');

		cause.$('#cause-view canvas').replaceWith(frame.get(0));

		frame.on('load', this.openpage.bind(this, frame.get(0)));
		frame.on('error', this.onError.bind(this));
		frame.attr('src', this.filename);
	}
};