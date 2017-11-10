/** Class for helping for editing some type of file.
 * This class needed "WodoTextEditor" to edit "Open Document", "codeMirror" to edit script file and the class "wysiwyg" for other file
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.editor = function (config) {
	this.name = 'editor';
	this.config = cause.extend({}, {
		filename: '',
		editor: 'textarea'
	}, (config || {}));
	this.editor = null;

	/* Select and load the right plugins */
	if (!cause.helpIsOn) {
		if (this.config.editor === 'codeMirror') {
			if (typeof(CodeMirror) === 'object') {
				this.initCodeMirror();
			} else {
				cause.include.css(cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/lib/codemirror.css');
				cause.include.js(cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/lib/codemirror.js', (function () {
					cause.include.js([
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/css/css.js',
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/htmlmixed/htmlmixed.js',
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/javascript/javascript.js',
                        cause.baseUrlPlugins + 'codeMirror/' + cause.version.codeMirror + '/mode/xml/xml.js'
					], this.initCodeMirror.bind(this), function () {
						cause.alert(cause.localize('missingPlugins'), 'CodeMirror "mode" ' + cause.version.codeMirror);
					});
				}).bind(this), this.fallback.bind(this));
			}
		} else if (this.config.editor === 'wodotexteditor') {
			if (typeof(Wodo) === 'object') {
				this.initWodoTextEditor.call(this);
			} else {
				cause.include.js([
                    cause.baseUrlPlugins + 'wodoTextEditor/' + cause.version.wodoTextEditor + '/wodotexteditor/wodotexteditor.js'
				], this.initWodoTextEditor.bind(this), this.fallback.bind(this));
			}
		} else {
			this.initTextArea();
		}
	}
};

/** Show help when is cause.help('editor') is call
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.help = function () {
	cause.log('Aide pour "cause.editor":', 'help_title');
	cause.log("\t" +
		'new cause.editor(config);' + "\n\n\t" +
		'config.editor = Editor we could use (textarea, codeMirror, wodoTextEditor), default is "textarea"', 'help');
};

cause.objects.editor.prototype.onLoad = function () {
	cause.log('onload');
};

cause.objects.editor.prototype.onSave = function () {
	cause.log('onsave');
};

/** Initialize the TextArea.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.initTextArea = function () {
	var id = cause.unique();
	var elm = cause.$('<div style="height:98%" id="' + id + '"></div>').get(0);
	var view = new cause.objects.view(elm, {
		save: this.onSave.bind(this)
	});

	cause.ajax({
		url: this.config.filename,
		method: 'GET',
		dataType: 'html',
		success: (function (id, data) {
			$('#' + id).html(data);

			this.editor = new cause.objects.wysiwyg({
				selector: '#' + id,
				onSave: this.onSave.bind(this)
			});
			this.onLoad();
		}).bind(this, id),
		error: function () {
			cause.alert(cause.localize('fileDoesnotExist'), cause.localize('editor'));
		}
	});

	return view;
};

/** Initialize the CodeMirror.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.initCodeMirror = function () {
	var id = cause.unique();
	var ext = (this.config.filename.includes('.') ? this.config.filename.substr(this.config.filename.lastIndexOf('.') + 1) : '');
	var elm = cause.$('<div style="height:98%" id="' + id + '"></div>').get(0);
	var view = new cause.objects.view(elm, {
		save: this.onSave.bind(this)
	});

	cause.ajax({
		url: this.config.filename,
		method: 'GET',
		dataType: 'html',
		success: (function (id, ext, data) {
			this.editor = CodeMirror(function (elt) {
				cause.$('#' + id).replaceWith(elt);
			}, {
				extraKeys: {
					'Ctrl-S': this.onSave.bind(this)
				},
				lineNumbers: true,
				lineWrapping: true,
				mode: (ext === 'js' ? 'javascript' : (ext === 'css' ? 'css' : 'htmlmixed')),
				value: data
			});
			this.editor.setSize("100%", "98%");
			this.onLoad();
		}).bind(this, id, ext),
		error: function () {
			cause.alert(cause.localize('fileDoesnotExist'), cause.localize('editor'));
		}
	});

	return view;
};

/** Initialize the WodoTextEditor.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.initWodoTextEditor = function () {
	var id = cause.unique();
	var elm = cause.$('<div id="' + id + '"></div>').get(0);
	var view = new cause.objects.view(elm, {
		save: this.onSave.bind(this)
	});

	var config = {
		//allFeaturesEnabled: true,
		loadCallback: this.onLoad.bind(this),
		saveCallback: this.onSave.bind(this),
		userData: {
			fullName: 'Cause ' + cause.version.cause,
			color: 'black'
		}
	};

	Wodo.createTextEditor(id, config, (function (error, editor) {
		if (error) {
			cause.alert(cause.localize('error'), 'WodoTextEditor : ' + error);
		} else if (this.config.filename) {
			cause.log(this.config);
			editor.openDocumentFromUrl(this.config.filename, this.onInitialize);
		}
	}).bind(this));

	return view;
};

/** This function is execute if plugins is not found.
 *
 * @memberOf cause.objects.editor
 */
cause.objects.editor.prototype.fallback = function () {
	if (this.config.editor === 'codeMirror') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'CodeMirror ' + cause.version.codeMirror, 5000);
	} else if (this.config.editor === 'wodotexteditor') {
		DevExpress.ui.notify(cause.localize('missingPlugins'), 'WodoTextEditor ' + cause.version.wodoTextEditor, 5000);
	}

	this.config.editor = 'textarea';
	this.initTextArea();
};