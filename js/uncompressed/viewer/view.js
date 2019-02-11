/** Class for helping when we process to view some element.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} file - Path of file to visualize
 * @param {object} listeners - Object with some custom listeners
 */
cause.objects.view = function (file, listeners) {
	this.name = 'view';
	this.doc = null;
	this.file = file;
	this.listeners = listeners;

	if (!cause.helpIsOn && this.file) {
		this.open();
	}
};

/** Show help when is cause.help('rabbitMQ') is call.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.help = function () {
	cause.log('Aide pour "cause.view":', 'help_title');
	cause.log("\t" +
		'new cause.view(file);' + "\n\n\t" +
		'file = URL du fichier à visualiser', 'help');
};

/** Select the right viewer for the file and open it.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.open = function () {
	var ext = this.findExtension();
	var format = [
		{viewer: 'viewHtml', ext: ['', 'asp', 'aspx', 'htm', 'html', 'shtml', 'php', 'txt', 'mht']},
		{viewer: 'viewImage', ext: ['bmp', 'dib', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'apng', 'svg', 'tif', 'tiff', 'webp', 'xbm']},
		{viewer: 'viewMedia', ext: ['m4v', 'm4a', 'mp3', 'mp4', 'ogv', 'oga', 'ogg', 'wav', 'webm', 'webmv', 'webma']},
		{viewer: 'viewPdf', ext: ['pdf']},
		{viewer: 'viewOdf', ext: ['odp', 'ods', 'odt']},
		{viewer: 'viewOdf', ext: ['odp', 'ods', 'odt']},
		{viewer: 'viewHtml', ext: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'], prefix: 'https://view.officeapps.live.com/op/embed.aspx?src='}
	];

	for (var i=0, j=format.length; i<j; i++) {
		if (format[i].ext.includes(ext)) {
			this.show();

			if (format[i].prefix) {
				this.doc = new cause.objects[format[i].viewer](format[i].prefix + encodeURI(this.file), this.loaded.bind(this));
			} else {
				this.doc = new cause.objects[format[i].viewer](this.file, this.loaded.bind(this));
			}

			return null;
		}
	}

	cause.alert(cause.localize('fileTypeNotSupported'), cause.localize('fileViewer'));
};

cause.objects.view.prototype.findExtension = function () {
	if (cause.is.element(this.file)) {
		return '';
	}

	if (!this.file.includes('://') && this.file.substr(0,1) !== '/') {
		this.file = location.href.substr(0, location.href.lastIndexOf('/') + 1) + this.file;
	}

	var name = (this.file.includes('/') ? this.file.substr(this.file.lastIndexOf('/') + 1) : (this.file.includes('://') ? '' : this.file));

	return (name.includes('.') ? name.substr(name.lastIndexOf('.') + 1) : '');
};

/** Set toolbar after loading.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.loaded = function () {
	if (this.doc && !this.doc.error) {
		var name = cause.localize('editor');

		if (!cause.is.element(this.file)) {
			name = this.file.substr(this.file.lastIndexOf('/') + 1);
		}

		cause.$('#cause-view .toolbar .title').html(name ? name : this.file);
		cause.$('#cause-view .toolbar .page').html(this.doc.pagecurrent + ' / ' + this.doc.pagetotal);

		if (this.doc.multipage) {
			cause.$('#cause-view .toolbar .page').removeAttr('disabled');

			if (this.doc.pagecurrent > 1) {
				cause.$('#cause-view .toolbar .fa-fast-backward').removeAttr('disabled');
				cause.$('#cause-view .toolbar .fa-step-backward').removeAttr('disabled');
			}

			if (this.doc.pagecurrent < this.doc.pagetotal) {
				cause.$('#cause-view .toolbar .fa-step-forward').removeAttr('disabled');
				cause.$('#cause-view .toolbar .fa-fast-forward').removeAttr('disabled');
			}
		}

		if (typeof(this.doc.print) === 'function') {
				cause.$('#cause-view .toolbar .fa-print').removeAttr('disabled');
			}
	} else {
		this.hide();

		cause.alert(cause.localize('fileLoadingError'), cause.localize('fileViewer'));
	}
};

/** Block right click on document.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.contextmenu = function (e) {
	e.preventDefault();
};

/** Go to the previous page.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.prev = function () {
	if (this.doc && typeof(this.doc.prev) == 'function') {
		this.doc.prev();
	}
};

/** Go to the next page.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.next = function () {
	if (this.doc && typeof(this.doc.next) == 'function') {
		this.doc.next();
	}
};

/** Go to specific page.
 *
 * @memberOf cause.objects.view
 * @param {integer} nb - Page number
 */
cause.objects.view.prototype.goTo = function (nb) {
	if (this.doc && typeof(this.doc.goTo) == 'function') {
		this.doc.goTo(nb);
	}
};

cause.objects.view.prototype.print = function () {
	if (this.doc && typeof(this.doc.print) == 'function') {
		this.doc.print();
	}
};

/** Hide the viewer.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.hide = function () {
	cause.$('#cause-view').remove();
};

/** Show the viewer.
 *
 * @memberOf cause.objects.view
 */
cause.objects.view.prototype.show = function () {
	var elm = cause.$('#cause-view');
	var hasCustom = (this.listeners && typeof(this.listeners) == 'object' ? true : false);
	var page = '<i class="fa fa-fast-backward" aria-hidden="true" disabled="disabled"></i><i class="fa fa-step-backward" aria-hidden="true" disabled="disabled"></i>' +
		'<span class="page" disabled="disabled">1 / 1</span>' +
		'<i class="fa fa-step-forward" aria-hidden="true" disabled="disabled"></i><i class="fa fa-fast-forward" aria-hidden="true" disabled="disabled"></i>' +
		'<i class="fa fa-print" aria-hidden="true" disabled="disabled"></i>';

	if (elm.length > 0) {
		return null;
	}

	elm = cause.$('<div>').attr('id', 'cause-view').appendTo('body');
	elm.html('<div class="toolbar">' +
		'<div class="left">' + page + '</div>' +
		'<div class="right"><i class="fa fa-times" aria-hidden="true"></i></div>' +
		'<div class="title">&nbsp;</div>' +
		'</div><div class="content"><canvas></canvas></div>');

	elm.find('.fa-times').click(this.hide.bind(this));
	elm.find('.fa-fast-backward').click(this.goTo.bind(this, 1));
	elm.find('.fa-step-backward').click(this.prev.bind(this));
	elm.find('.fa-step-forward').click(this.next.bind(this));
	elm.find('.fa-fast-forward').click(this.goTo.bind(this, 0));
	elm.find('.fa-print').click(this.print.bind(this, 0));

	if (hasCustom) {
		for (var action in this.listeners) {
			if (this.listeners.hasOwnProperty(action)) {
				cause.$('<i class="fa fa-' + action + '" aria-hidden="true"></i>').appendTo('#cause-view .left');
				cause.$('.fa-' + action).click(this.listeners[action]);
			}
		}
	}

	elm.find('.content').contextmenu(this.contextmenu.bind(this));
};