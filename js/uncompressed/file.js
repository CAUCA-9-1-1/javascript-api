/** Class for helping for file treatment.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.file = function (config) {
	this.name = 'file';
	this.config = cause.extend({}, {
		file: '',
		local: false
	}, (config || {}));
};

/** Show help when is cause.help('file') is call
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.help = function () {
	cause.log('Aide pour "cause.objects.file":', 'help_title');
	cause.log("\t" +
		'new cause.objects.file(config);' + "\n\n\t" +
		'config.file = Complete path of file to use' + "\n\t" +
        'config.local = True to search on local computer (only with nodejs)', 'help');
};

/** Read content of file
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.read = function (callback) {
	if (this.config.local) {
        return cause.log('Not implemented yet', 'warn');
    }

    var onExternalServer = false;
	if (this.config.file.indexOf('://') > -1) {
        var name = this.config.file.substr(this.config.file.indexOf('://') + 3).split('/');

        onExternalServer = (name[0] != location.host);
	}

	if (onExternalServer) {
        return this.readFromExternalServer(callback);
	}

	this.readFromSameServer(callback);
};

cause.objects.file.prototype.readFromExternalServer = function (callback) {
    var element = $('<iframe>').attr('src', this.config.file);

    element.on('load', (function (callback, e) {
		cause.log('todo : save iframe of external URL');
	}).bind(this, callback));
    element.appendTo('body');
};

cause.objects.file.prototype.readFromSameServer = function (callback) {
    cause.ajax({
        url: this.config.file,
        method: 'GET',
        dataType: 'blob',
        progress: this.onProgress.bind(this),
        success: this.onLoaded.bind(this, callback),
        error: this.onError.bind(this)
    });
};

/** Execute when the request send error
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.onError = function () {
    cause.log('File: file not found', 'error');
};

/** Execute when the request send progress information
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.onProgress = function (e, percentage) {
    console.log(percentage);
};

/** File is read
 *
 * @memberOf cause.objects.file
 */
cause.objects.file.prototype.onLoaded = function (callback, content, status) {
	if (status != 'success') {
        cause.log('File: error on reading file', 'error');
        return;
    }

	if (!callback) {
        cause.log('File: you need to pass a callback function to receive file content', 'warn');
		return;
    }

	callback(content);
};