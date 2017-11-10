/** Class for helping with worker.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {function|string} exec - Function or script file to execute inside worker
 * @param {function} callback - Function to execute when worker send message
 */
cause.objects.worker = function (exec, callback) {
	this.name = 'worker';
	this.worker = null;
	this.callback = callback;

	window.URL = (window.URL || window.webkitURL);

	if (cause.helpIsOn) {
		return null;
	}

	if (typeof(exec) == 'function') {
		this.init(exec.toString());
	} else {
		cause.ajax({
			url: exec,
			method: 'get',
			dataType: 'html',
			success: (function(code) {
				this.init('function() {' + code + '}');
			}).bind(this),
			error: function() {
				cause.alert(cause.localize('errorWorkerFileNotFound'), cause.localize('error'));
			}
		});
	}
};

/** Show help when is cause.help('worker') is call.
 *
 * @memberOf cause.objects.worker
 */
cause.objects.worker.prototype.help = function () {
	cause.log('Aide pour "cause.worker":', 'help_title');
	cause.log("\t" +
		'new cause.worker(funct)' + "\n\n\t" +
		'funct = Fonction à exécuter dans le worker', 'help');
};

/** Initiliaze the worker.
 *
 * @memberOf cause.objects.worker
 * @param {mixed} data - Information to send to worker
 */
cause.objects.worker.prototype.init = function (code) {
	// Try to include the library cause.js
	if (!code.includes('cause.min.js')) {
		code = code.replace('{', '{ if (typeof(cause) == "undefined") { self.importScripts("' + cause.location.getAbsoluteUrl(cause.baseUrl + 'js/cause.min.js') + '"); }');
	}

	if (!window.URL || !window.Blob || !window.Worker) {
		cause.alert(cause.localize('errorWorker'), cause.localize('error'));

		return null;
	} else {
		var blobURL = window.URL.createObjectURL(
			new Blob(['(', code, ')()'], {
				type: 'application/javascript'
			}));

		this.worker = new Worker(blobURL);
	}

	this.worker.addEventListener('close', function() {
		cause.log('Your worker as close.');
	}, false);
	this.worker.addEventListener('error', function(e) {
		cause.log('Your worker send an error.', 'error');
		cause.log(e);
	}, false);
	this.worker.addEventListener('message', (this.callback || function() {
		cause.log('Your worker send a message. To catch it, you need to pass a callback function.');
	}), false);
};

/** Send data to the web worker.
 *
 * @memberOf cause.objects.worker
 * @param {mixed} data - Information to send to worker
 */
cause.objects.worker.prototype.postMessage = function (data) {
	if (this.worker) {
		this.worker.postMessage(data);
	} else {
		cause.log('You worker is not initialized', 'error');
	}
};

/** Send data to the web worker.
 *
 * @memberOf cause.objects.worker
 * @param {mixed} data - Information to send to worker
 */
cause.objects.worker.prototype.post = cause.objects.worker.prototype.postMessage;