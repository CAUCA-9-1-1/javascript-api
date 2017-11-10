/** Class for helping when we process to view a PDF.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewPdf = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['pdf'];

	if (typeof(PDFJS) == 'object') {
		this.init();
	} else {
		cause.include.js([
			cause.baseUrlPlugins + 'pdf.js/' + cause.version.pdfjs + '/build/pdf.js',
			cause.baseUrlPlugins + 'pdf.js/' + cause.version.pdfjs + '/build/pdf.worker.js'
		], this.init.bind(this), function () {
			cause.alert(cause.localize('missingPlugins'), 'PDF.JS ' + cause.version.pdfjs);
		});
	}
};

/** Load the document.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	PDFJS.getDocument(this.filename).then(this.opendoc.bind(this));
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.opendoc = function (pdf) {
	this.doc = pdf;
	this.pagecurrent = 1;
	this.pagetotal = this.doc.numPages;
	this.multipage = (this.doc.numPages > 1 ? true : false);
	this.show();
};

/** Show the last loaded page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.openpage = function (page) {
	var viewport = page.getViewport(1);
	var max = (window.innerWidth * 0.9);
	var scale = (max / viewport.width);
	var canvas = cause.$('#cause-view canvas').get(0);
	var context = canvas.getContext('2d', {alpha: false});

	viewport = page.getViewport(scale);
	canvas.width = viewport.width;
	canvas.height = viewport.height;

	page.render({
		canvasContext: context,
		viewport: viewport
	});

	if (typeof(this.callback) == 'function') {
		this.callback();
	}
};

/** Load the current page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.show = function () {
	this.doc.getPage(this.pagecurrent).then(this.openpage.bind(this));
};

/** Go to the previous page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.prev = function () {
	if (this.pagecurrent > 1) {
		this.pagecurrent--;
	}

	this.show();
};

/** Go to the next page.
 *
 * @memberOf cause.objects.viewPdf
 */
cause.objects.viewPdf.prototype.next = function () {
	if (this.pagecurrent < this.pagetotal) {
		this.pagecurrent++;
	}

	this.show();
};

/** Go to a specific page.
 *
 * @memberOf cause.objects.viewPdf
 * @param {integer} nb - Page number
 */
cause.objects.viewPdf.prototype.goTo = function (nb) {
	if (nb > 0 && nb < this.pagetotal) {
		this.pagecurrent = nb;
	} else {
		this.pagecurrent = this.pagetotal;
	}

	this.show();
};