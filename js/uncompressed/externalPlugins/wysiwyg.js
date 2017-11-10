/** Class for helping with WYSIWYG
 * This class needed "tinyMCE", "CKEditor" or "html 5".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object all possible configuration
 */
cause.objects.wysiwyg = function (config) {
	this.name = 'wysiwyg';
	this.plugins = {
		'tinymce': [
			'advlist anchor autolink charmap code colorpicker contextmenu',
			'directionality emoticons fullscreen hr image imagetools insertdatetime',
			'link lists media nonbreaking noneditable pagebreak paste preview print',
			'save searchreplace spellchecker tabfocus table template textcolor',
			'textpattern visualblocks visualchars wordcount'
    	]
	};
	this.config = cause.extend({}, {
		editor: 'tinymce',
		filename: '',
		selector: '.editable',
		height: null,
		inline: false,
		mode: 'full',
		statusbar: true
	}, (config || {}));

	/* Select and load the right plugins */
	if (!cause.helpIsOn) {
		if (this.config.filename) {
			this.loadFile();
		} else {
			this.init();
		}
	}
};

/** Show help when is cause.help('wysiwyg') is call.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.help = function () {
	cause.log('Aide pour "cause.wysiwyg":', 'help_title');
	cause.log("\t" +
		'new cause.editor(config);' + "\n\n\t" +
		'config.editor = Editor we use (custom, tinymce, ckeditor), default is "tinymce"' + "\n\t" +
		'config.selector = String to select element' + "\n\t" +
		'config.height = Height of editor, default is auto' + "\n\t" +
		'config.inline = True when editor is inline, default is false' + "\n\t" +
		'config.mode = String to select function mode (simple, full), default is "full"' + "\n\t" +
		'config.statusbar = False to hide the status bar, default is true', 'help');
};

/** Check to initialize the best possible editor.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.init = function () {
	if (this.config.editor === 'tinymce') {
		if (typeof(tinymce) === 'object') {
			this.initTinyMCE.call(this);
		} else {
			cause.include.js([
				cause.baseUrlPlugins + 'tinymce/' + cause.version.tinymce + '/js/tinymce/jquery.tinymce.min.js',
				cause.baseUrlPlugins + 'tinymce/' + cause.version.tinymce + '/js/tinymce/tinymce.min.js'
			], this.initTinyMCE.bind(this), this.fallback.bind(this));
		}
	} else if (this.config.editor === 'ckeditor') {
		if (typeof(ckeditor) === 'object') {
			this.initCkEditor.call(this);
		} else {
			cause.include.js([
				cause.baseUrlPlugins + 'ckeditor/' + cause.version.ckeditor + '/ckeditor.js'
			], this.initCkEditor.bind(this), this.fallback.bind(this));
		}
	} else {
		this.initCustom();
	}
};

/** Load the specified file.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.loadFile = function () {
	cause.ajax({
		url: this.config.filename,
		method: 'GET',
		dataType: 'html',
		success: (function (data) {
			cause.$(this.config.selector).html(data);

			this.init();
		}).bind(this),
		error: function () {
			cause.alert(cause.localize('fileDoesnotExist'), cause.localize('wysiwyg'));
		}
	});
};

/** Execute when content of editor changed.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onChange = function () {
	cause.log(this.config.editor + ' content change');
};

/** Execute when the editor file picker is call.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {object} arguments - Specific to each plugin
 * @param {function} arguments.0 - tinymce callback
 * @param {string} arguments.1 - tinymce value
 * @param {string} arguments.2 - tinymce meta
 */
cause.objects.wysiwyg.prototype.onFilePicker = function () {
	if (this.config.editor === 'tinymce') {
		tinymce.activeEditor.windowManager.open({
			title: 'Select image',
			body: [
				{type: 'textbox', name: 'source', label: 'Source'}
			],
			onsubmit: (function(callback, e) {
				cause.log(e);
			}).bind(this, arguments[0])
		});
	} else {
		cause.log(this.config.editor + ' file picker need to be defined');
	}
};

/** Execute when the editor is initialize.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onInitialize = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (typeof(this.config.onLoad) === 'function') {
		this.config.onLoad();
	} else {
		cause.log(this.config.editor + ' is initialize');
		cause.log(editor);
	}
};

/** Execute when the editor has a key press.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onKey = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (typeof(this.config.onKey) === 'function') {
		this.config.onKey();
	} else {
		cause.log(this.config.editor + ' on keyup');
		cause.log(editor);
	}
};

/** Execute when save is execute on editor.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onSave = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (typeof(this.config.onSave) === 'function') {
		this.config.onSave();
	} else {
		cause.log(this.config.editor + ' is saved');
		cause.log(editor);
	}
};

/** Execute when the editor is loaded.
 *
 * @memberOf cause.objects.wysiwyg
 * @param {mixed} args - Specific to each plugin
 */
cause.objects.wysiwyg.prototype.onSetup = function (args) {
	var editor = (args.editor ? args.editor : args);

	if (this.config.editor === 'tinymce') {
		editor.on('change', this.onChange.bind(this));
		editor.on('keydown', this.onKey.bind(this));
		editor.on('SaveContent', this.onSave.bind(this));
	}

	cause.log(this.config.editor + ' is loaded');
};

/** Initialize the CKEditor.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.initCkEditor = function () {
	var elm = cause.$(this.config.selector);
	var id = (elm.attr('id') ? elm.attr('id') : cause.unique());
	var config = {
		contentsCss: [],
		enterMode: CKEDITOR.ENTER_DIV,
		filebrowserBrowseUrl: '',
		filebrowserUploadUrl: '',
		height: this.config.height,
		language: 'fr_FR',
		on: {
			change: this.onChange.bind(this),
			instanceReady: this.onInitialize.bind(this),
			//key: this.onKey.bind(this),
			loaded: this.onSetup.bind(this),
			save: this.onSave.bind(this)
		},
		toolbar: null
	};

	elm.attr('id', id);

	if (this.config.inline) {
		CKEDITOR.inline(id, config);
	} else {
		CKEDITOR.replace(id, config);
	}
};

/** Initialize the TinyMCE.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.initTinyMCE = function () {
	var config = {
		browser_spellcheck: true,
		content_css: [],
		//content_security_policy: "default-src 'self'",
		file_browser_callback_types: 'file image media',
		file_picker_types: 'file image media',
		forced_root_block: 'div',
		height: this.config.height,
		image_advtab: true,
		inline: this.config.inline,
		language: 'fr_FR',
		plugins: this.plugins[this.config.editor],
		selector: this.config.selector,
		statusbar: this.config.statusbar,
		templates: [],
		theme: 'modern',
		/* Callback */
		//file_picker_callback: this.onFilePicker.bind(this),
		init_instance_callback: this.onInitialize.bind(this),
		setup: this.onSetup.bind(this)
	};

	/* Setup each toolbar */
	config.toolbar1 = 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image';

	if (this.config.mode === 'full') {
		config.toolbar2 = 'print preview media | forecolor backcolor emoticons';
	}

	tinymce.init(config);
};

/** Build a custom basic editor.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.initCustom = function () {
	var config = {
		selector: this.config.selector,
		onChange: this.onChange.bind(this),
		//onFilePicker: this.onFilePicker.bind(this),
		onInitialize: this.onInitialize.bind(this),
		//onKey: this.onKey.bind(this),
		onSave: this.onSave.bind(this),
		onSetup: this.onSetup.bind(this)
	};

	this.editor = new cause.objects.wysiwygCustom(config);
};

/** This function is execute if plugins is not found.
 *
 * @memberOf cause.objects.wysiwyg
 */
cause.objects.wysiwyg.prototype.fallback = function () {
	if (this.config.editor === 'tinymce') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'TinyMCE ' + cause.version.tinymce, 5000);
	} else if (this.config.editor === 'ckeditor') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'CKEditor ' + cause.version.ckeditor, 5000);
	}

	this.config.editor = 'custom';
	this.initCustom();
};