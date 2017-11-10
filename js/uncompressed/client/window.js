/** Singleton for helping when we process to browser.
 *
 * @namespace
 * @memberOf cause
 */
cause.window = {
	/** Show help when is cause.help('request') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.window":', 'help_title');
		cause.log("\t" +
			'cause.window.fullscreen() = Place la fenêtre en mode plein écran' + "\n\t" +
			'cause.window.exitFullscreen() = Sort la fenêtre du mode plein écran' + "\n\t" +
			'cause.window.isFullscreen() = Test si le mode plein écran est actif' + "\n\t" +
			'cause.window.open(url, [Vrai pour enlever la barre de menu]) = Ouvre une nouvelle fenêtre', 'help');
	},

	/** Fullscreen status change.
	 *
	 * @param {object} e - Event object of navigator
	 */
	changeFullscreen: function () {
		if (typeof($) == 'function') {
			if (this.isFullscreen()) {
				cause.$('body').addClass('is-fullscreen');
			} else {
				cause.$('body').removeClass('is-fullscreen');
			}
		}
	},

	/** Exit element of fullscreen.
	 */
	exitFullscreen: function () {
		cause.$('.is-fullscreen').removeClass('is-fullscreen');

  		if (document.exitFullscreen) {
    		document.exitFullscreen();
  		} else if (document.mozCancelFullScreen) {
    		document.mozCancelFullScreen();
  		} else if (document.webkitExitFullscreen) {
    		document.webkitExitFullscreen();
  		}
	},

	/** Place element on fullscreen.
	 *
	 * @param {HTMLElement} element - Element we want fullscreen
	 */
	fullscreen: function (element) {
		if (!element) {
			element = document.querySelector('body');
		}

		if (element.requestFullscreen) {
    		element.requestFullscreen();
  		} else if (element.mozRequestFullScreen) {
    		element.mozRequestFullScreen();
  		} else if (element.webkitRequestFullscreen) {
    		element.webkitRequestFullscreen();
  		} else if (element.msRequestFullscreen) {
    		element.msRequestFullscreen();
  		}
	},

	/** Check if element on screen is fullscreen
	 *
	 * @returns {boolean} True if window is fullscreen
	 */
	isFullscreen: function () {
		if ((screen.availHeight || screen.height-30) <= window.innerHeight) {
    		return true;
		}

  		return false;
	},

	/** Open a link on new window
	 *
	 * @param {string} url - Page url
	 * @param {boolean} noToolbar - True to remove all toolbar
	 */
	open: function (url, noToolbar) {
		if (url) {
			var elm = cause.$('<a>');
			var options = ['toolbar=no', 'menubar=no', 'location=no', 'directories=no', 'status=no'];

			if (noToolbar) {
				elm.attr('onclick', 'window.open(\'' + url + '\', \'\', \'' + options.join(',') + '\')');
			} else {
				elm.attr('href', url);
			}

			elm.attr('target', '_blank');
			elm.get(0).click();
		}
	}
};
