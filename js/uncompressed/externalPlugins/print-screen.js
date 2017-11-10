/** Class for helping with print screen.
 * This class needed "html2canvas".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {mixed} element - Element we like to print
 * @param {object} params - The canvas with the image of screen
 * @param {function} params.(onrendered|success) - Function call when rendering is finish
 * @param {boolean} params.download - Force to download the PNG
 * @param {string} params.insert - Append the generated canvas inside element
 * @param {integer} params.width - Set the width of canvas
 * @param {integer} params.height - Set the height of canvas
 */
cause.objects.printScreen = function (element, params) {
	if (!cause.is.element(element)) {
		params = (element || {});
		element = document.body;
	}

	this.name = 'print_screen';
	this.element = element;
	this.options = cause.extend({}, params);

	/* Initialize the addons "html2canvas" */
    this.options.onrendered = this.onRendered.bind(this, (params || {}));

	if (!cause.helpIsOn) {
		if (typeof(html2canvas) == 'object') {
			html2canvas(this.element, this.options);
		} else {
			cause.include.js(cause.baseUrlPlugins + 'html2canvas/' + cause.version.html2canvas + '/html2canvas.min.js', (function () {
				html2canvas(this.element, this.options);
			}).bind(this), function () {
				cause.alert(cause.localize('missingPlugins'), 'html2canvas ' + cause.version.html2canvas);
			});
		}
	}
};

/** Show help when is cause.help('print_screen') is call.
 *
 * @memberOf cause.objects.printScreen
 */
cause.objects.printScreen.prototype.help = function () {
	cause.log('Aide pour "cause.print_screen":', 'help_title');
	cause.log("\t" +
		'new cause.print_screen();', 'help');
};

/** Executed when the rendering of print screen is finish.
 *
 * @memberOf cause.objects.printScreen
 * @param {object} params: Object with all options pass to addons
 * @param {HTMLElement} canvas: The canvas with the image of screen
 */
cause.objects.printScreen.prototype.onRendered = function (params, canvas) {
	if (params.width) {
		canvas.style.width = params.width + 'px';
	}
	if (params.height) {
		canvas.style.height = params.height + 'px';
	}

	if (typeof(params.onrendered) == 'function') {
		params.onrendered(canvas);
	} else if (typeof(params.success) == 'function') {
		params.success(canvas);
	} else if (params.download) {
		cause.$('<a>').attr('href', canvas.toDataURL()).attr('download', 'cause_print_screen.png').get(0).click();
	} else if (params.insert) {
		cause.$(canvas).appendTo(params.insert);
	}
};