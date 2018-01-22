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

	this.name = 'printScreen';
	this.element = element;
	this.options = cause.extend({}, params);

	/* Initialize the addons "html2canvas" */
	if (!cause.helpIsOn) {
		if (typeof(html2canvas) == 'object') {
			html2canvas(this.element, this.options).then(this.onRendered.bind(this));
		} else {
			cause.include.js(cause.baseUrlPlugins + 'html2canvas/' + cause.version.html2canvas + '/html2canvas.min.js', (function () {
				html2canvas(this.element, this.options).then(this.onRendered.bind(this));
			}).bind(this), function () {
				cause.alert(cause.localize('missingPlugins'), 'html2canvas ' + cause.version.html2canvas);
			});
		}
	}
};

/** Show help when is cause.help('printScreen') is call.
 *
 * @memberOf cause.objects.printScreen
 */
cause.objects.printScreen.prototype.help = function () {
	cause.log('Aide pour "cause.objects.printScreen":', 'help_title');
	cause.log("\t" + 'new cause.objects.printScreen();', 'help');
};

/** Executed when the rendering of print screen is finish.
 *
 * @memberOf cause.objects.printScreen
 * @param {HTMLElement} canvas: The canvas with the image of screen
 */
cause.objects.printScreen.prototype.onRendered = function (canvas) {
	if (typeof(this.options.onrendered) == 'function') {
		this.options.onrendered(canvas);
	} else if (typeof(this.options.success) == 'function') {
		this.options.success(canvas);
	} else if (this.options.download) {
		var name = (typeof(this.options.download) == 'string' ? this.options.download : 'cause_print_screen.png');

		name += (name.includes('.png') ? '' : '.png');
		cause.$('<a>').attr('href', canvas.toDataURL()).attr('download', name).get(0).click();
	} else if (this.options.insert) {
		cause.$(canvas).appendTo(this.options.insert);
	}
};