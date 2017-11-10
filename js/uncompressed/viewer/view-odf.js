/** Class for helping when we process to view some ODF.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} filename - URL of file
 * @param {function} callback - Callback function to execute after load
 */
cause.objects.viewOdf = function (filename, callback) {
	this.filename = filename;
	this.callback = callback;
	this.error = false;
	this.multipage = false;
	this.doc = null;
	this.pagecurrent = 1;
	this.pagetotal = 1;
	this.supported = ['odp', 'ods', 'odt'];

	if (typeof(webodf) == 'object') {
		this.init();
	} else {
		cause.include.js(cause.baseUrlPlugins + 'webODF/' + cause.version.webodf + '/webodf-debug.js', this.init.bind(this), function () {
			cause.alert(cause.localize('missingPlugins'), 'WebODF ' + cause.version.webodf);
		});
	}
};

/** Load the document.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.init = function () {
	this.name = (this.filename.includes('/') ? this.filename.substr(this.filename.lastIndexOf('/') + 1) : (this.filename.includes('://') ? '' : this.filename));
	this.ext = (this.name.includes('.') ? this.name.substr(this.name.lastIndexOf('.') + 1) : '');

	cause.$('#cause-view canvas').replaceWith('<div id="cause-view-odf"></div>');

	this.doc = new odf.OdfCanvas(cause.$('#cause-view-odf').get(0));
	this.doc.addListener('statereadychange', this.opendoc.bind(this));
	this.doc.load(this.filename);
};

/** Document is loaded.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.opendoc = function () {
	this.pagetotal = this.getPages().length;

	if (this.pagetotal > 0) {
		this.multipage = (this.pagetotal > 1 ? true : false);
		this.show();
	} else {
		this.pagetotal = 1
		this.openpage();
	}
};

/** Show the last loaded page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.openpage = function () {
	if (typeof(this.callback) == 'function') {
		this.callback();
	}
};

/** Load the current page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.show = function () {
	this.doc.showPage(this.pagecurrent);
	this.openpage();
};

/** Go to the previous page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.prev = function () {
	if (this.pagecurrent > 1) {
		this.pagecurrent--;
	}

	this.show();
};

/** Go to the next page.
 *
 * @memberOf cause.objects.viewOdf
 */
cause.objects.viewOdf.prototype.next = function () {
	if (this.pagecurrent < this.pagetotal) {
		this.pagecurrent++;
	}

	this.show();
};

/** Go to a specific page.
 *
 * @memberOf cause.objects.viewOdf
 * @param {integer} nb - Page number
 */
cause.objects.viewOdf.prototype.goTo = function (nb) {
	if (nb > 0 && nb < this.pagetotal) {
		this.pagecurrent = nb;
	} else {
		this.pagecurrent = this.pagetotal;
	}

	this.show();
};

/** Return an array with all pages.
 *
 * @memberOf cause.objects.viewOdf
 * @returns {array} all pages
 */
cause.objects.viewOdf.prototype.getPages = function () {
	var root = this.doc.odfContainer().rootElement;
	var pageNodes = Array.prototype.slice.call(root.getElementsByTagNameNS(this.nsResolver('draw'), 'page'));
	var pages = [];

	for (var i = 0, j = pageNodes.length; i < j; i++) {
		pages.push([
			pageNodes[i].getAttribute('draw:name'),
			pageNodes[i]
		]);
	}

	return pages;
};

/** Return the type of document.
 *
 * @memberOf cause.objects.viewOdf
 * @param {string} prefix - Type of document
 * @returns {string} NS for specified document
 */
cause.objects.viewOdf.prototype.nsResolver = function (prefix) {
	var ns = {
		'draw': "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
		'presentation': "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
		'text': "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
		'office': "urn:oasis:names:tc:opendocument:xmlns:office:1.0"
	};

	return ns[prefix] || cause.log('prefix [' + prefix + '] unknown.');
};
