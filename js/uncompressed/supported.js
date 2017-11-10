/** Singleton for helping to detect if something is supported by browser.
 *
 * @namespace
 * @memberOf cause
 */
cause.supported = {
	/** Show help when is cause.help('supported') is call.
	 */
	help: function () {
		cause.log('Aide pour "cause.supported":', 'help_title');
		cause.log("\t" +
			'cause.supported.apng() = Test si le navigateur supporte les .apng' + "\n\t" +
			'cause.supported.bmp() = Test si le navigateur supporte les .bmp ou .dib' + "\n\t" +
			'cause.supported.ico() = Test si le navigateur supporte les .ico' + "\n\t" +
			'cause.supported.svg() = Test si le navigateur supporte les .svg' + "\n\t" +
			'cause.supported.tif () = Test si le navigateur supporte les .tif ou .tiff' + "\n\t" +
			'cause.supported.webp() = Test si le navigateur supporte les .webp' + "\n\t" +
			'cause.supported.xbm() = Test si le navigateur supporte les .xmb', 'help' );
	},

	/** Validate if browser support the APNG.
	 *
	 * @param {function} callback - Function to receive if format is supported
	 */
    apng: function (callback) {
		var image = new Image();
		var supported = false;
		var ctx = document.createElement('canvas').getContext('2d');

		image.onload = image.onerror = function (e) {
			ctx.drawImage(image, 0, 0);
			supported = (e.type === 'load' && ctx.getImageData(0, 0, 1, 1).data[3] === 0 ? true : false);

			if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('APNG is supported : ' + supported);
			}
		};
		
		image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==";
    },

	/** Validate if browser support the BMP/DIB.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
    bmp: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('BMP/DIB is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/bmp;base64,Qk1+AAAAAAAAAHoAAABsAAAAAQAAAAEAAAABABgAAAAAAAQAAAATCwAAEwsAAAAAAAAAAAAAQkdScwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD///8A';    	
  	},

	/** Validate if browser support the ICO.
	 *
	 * @param {function} callback - Function to receive if format is supported
	 */
    ico: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('ICO is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/vndmicrosofticon;base64,AAABAAEAAQECAAEAAQA4AAAAFgAAACgAAAABAAAAAgAAAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAA';    	
  	},

	/** Validate if browser support the SVG.
	 *
	 * @param {function} callback - Function to receive if format is supported
	 */
    svg: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('SVG is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';    	
  	},

	/** Validate if browser support the TIF/TIFF.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
    tif: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('TIF/TIFF is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/tiff;base64,SUkqAAwAAAD///8AEQD+AAQAAQAAAAAAAAAAAQMAAQAAAAEAAAABAQMAAQAAAAEAAAACAQMAAwAAAO4AAAADAQMAAQAAAAEAAAAGAQMAAQAAAAIAAAANAQIAJgAAAPQAAAAOAQIAEgAAABoBAAARAQQAAQAAAAgAAAASAQMAAQAAAAEAAAAVAQMAAQAAAAMAAAAWAQMAAQAAAEAAAAAXAQQAAQAAAAMAAAAaAQUAAQAAAN4AAAAbAQUAAQAAAOYAAAAcAQMAAQAAAAEAAAAoAQMAAQAAAAIAAAAAAAAASAAAAAEAAABIAAAAAQAAAAgACAAIAC9ob21lL21pY2hhZWxqb2xpbi9Eb2N1bWVudHMvdGVzdC50aWYAQ3JlYXRlZCB3aXRoIEdJTVAA';    	
  	},

	/** Validate if browser support the WEBP.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
    webp: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('WEBP is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';    	
  	},

	/** Validate if browser support the XBM.
	 *
	 * @param {function} callback - Function to receive if format is supported.
	 */
  	xbm: function (callback) {
    	var image = new Image();
    	var supported = false;

    	image.onload = image.onerror = function (e) {
      		supported = (e.type === 'load' && image.width === 1 ? true : false);
      		
      		if (typeof(callback) === 'function') {
				callback(supported);
			} else {
				cause.log('XBM is supported : ' + supported);
			}
    	};

    	image.src = 'data:image/x-xbitmap;base64,I2RlZmluZSB0ZXN0X3dpZHRoIDEKI2RlZmluZSB0ZXN0X2hlaWdodCAxCnN0YXRpYyB1bnNpZ25lZCBjaGFyIHRlc3RfYml0c1tdID0gewogICAweDAxIH07Cg==';    	
  	}
};
