/** Singleton for helping with image.
 *
 * @namespace
 * @memberOf cause
 */
cause.image = (function () {
	var toDataUrlFromFileReader = function (url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();

            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', url);
        xhr.send();
    };

	var toDataUrlFromCanvas = function () {
        var img = new Image();
        var canvas = document.createElement('canvas');

        img.crossOrigin = 'anonymous';
        img.onload = function () {
            canvas.height = this.height;
            canvas.width = this.width;
            canvas.getContext('2d').drawImage(this, 0, 0);

            callback(canvas.toDataURL('image/png'));
        };

        img.src = url;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = url;
        }
    };

	/** Show help when is cause.help('image') is call
	 */
	var help = function () {
		cause.log('Aide pour "cause.image":', 'help_title');
		cause.log("\t" +
			'cause.image.toDataUrl(url, callback) = Convert image to dataurl', 'help');
	};

	/** Convert an image to a dataurl.
	 *
	 * @param {string} url - URL of image
	 * @param {function} callback - function to execute when convert is finish
	 */
	var toDataUrl = function (url, callback) {
		if (typeof(FileReader) == 'function') {
            toDataUrlFromFileReader(url, callback);
		} else {
            toDataUrlFromCanvas(url, callback);
		}
	};

	return function() {
	    this.help = help;
	    this.toDataUrl = toDataUrl;
    };
}());
