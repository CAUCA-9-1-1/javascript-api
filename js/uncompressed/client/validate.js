/** Class for validate some element before application start.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.validate = function () {
	cause.log('Start basic validation');

	this.minimum();
};

/** Validate if everything we need is loaded.
 *
 * @memberOf cause.objects.validate
 */
cause.objects.validate.prototype.confirmLoading = function () {
	/* Validate if jQuery is loaded */
	if (!cause.jQuery()) {
		return null;
	}

	if (typeof($) != 'function') {
		return cause.needUpdate();
	}

	/* Validate if Globalize is loaded */
	if (typeof(myApp.config) == 'object') {
        if (typeof(Globalize) != 'function') {
            cause.log('You need to include Globalize in your HTML', 'error');
        } else {
			/* Validate if knockout is loaded */
            if (typeof(ko) != 'object') {
                cause.log('You need to include Knockout in your HTML', 'error');
            } else {
				/* Validate if DevExpress is loaded */
                if (typeof(DevExpress) != 'object') {
                    cause.log('You need to include DevExtreme in your HTML', 'error');
                }
            }
        }
    }
};

/** Show help when is cause.help('validate') is call.
 *
 * @memberOf cause.objects.validate
 */
cause.objects.validate.prototype.help = function () {
	cause.log('Aide pour "cause.validate":', 'help_title');
	cause.log("\t" +
		'Ce module est exécuté automatiquement pour valider certain élément de base', 'help');
};

/** Make the minimum validation.
 *
 * @memberOf cause.objects.validate
 */
cause.objects.validate.prototype.minimum = function () {
	var isAccepted = (typeof(acceptIframe) == 'boolean' && acceptIframe ? true : false);

	if (typeof(top) === 'object' && self !== top && isAccepted !== true) {
		/** Confirm that our page is not included in a frame.
		 * If yes, we return user on the main window.
		 */
		top.location = self.location;
	}

	/* Ask user to update is browser */
	if (typeof(navigator) === 'object') {
		this.browser();
	}

	this.confirmLoading();
};

cause.objects.validate.prototype.browser = function () {
	var isOldMicrosoftBrowser = (cause.browser.msie || cause.browser.presto || (cause.browser.edge && cause.browser.major < 13));
	var isOldWebkitBrowser = (cause.browser.webkit && cause.browser.enginVersion < 537);
	var isOldGeckoBrowser = (cause.browser.gecko && cause.browser.enginVersion < 40);

	if ((isOldMicrosoftBrowser || isOldWebkitBrowser || isOldGeckoBrowser) && !this.acceptOlderBrowser()) {
        cause.needUpdate();
	}
};

cause.objects.validate.prototype.acceptOlderBrowser = function () {
	var listOfBrowser = (typeof(acceptOldBrowser) == 'object' ? acceptOldBrowser : {});

    for (var name in listOfBrowser) {
        if (cause.browser[name] && listOfBrowser[name].includes(cause.browser.major)) {
            return true;
        }
    }

    return false;
};

/** @property {cause.objects.validate} */
cause.validate = new cause.objects.validate();
