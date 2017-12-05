/** Class for helping to use label.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.labels = function () {
	this.name = 'labels';

	/** Set generic labels for the library cause.
	 *
	 * @deprecated
	 */
	cause.loadLabels = function () {
		if (!cause.helpIsOn) {
			cause.log('Use cause.labels.load() instead of cause.loadLabels()', 'warn');
		}

		cause.labels.load();
	};

	/** Shortcut for "cause.objects.labels.set".
	 *
	 * @param {string} language - Language of label to use
	 * @param {function} callback - Function to execute after set a language
	 */
	cause.locale = this.set.bind(this);

	/** Shortcut for "cause.objects.labels.get".
	 *
	 * @param {string} label - label to return
	 * @returns {string} Text of label
	 */
	cause.localize = this.get.bind(this);

	if (typeof(document) === 'object') {
		cause.$(document).ready((function () {
			if (typeof(Globalize) === 'function') {
				this.load();
			}
		}).bind(this));
	}
};

/** A new series of labels.
 *
 * @memberOf cause.objects.labels
 * @param {string} lang - Abbreviation of language
 * @param {object} labels - Object for series of label
 */
cause.objects.labels.prototype.add = function (lang, labels) {
	causeAvailableLanguage[lang] = cause.extend({}, causeAvailableLanguage[lang] || {}, labels);
};

/** Find and return the text for a specific language.
 *
 * @memberOf cause.objects.labels
 * @param {string} label - label to return
 * @returns {string} Text of label
 */
cause.objects.labels.prototype.get = function (label) {
	if (cause.helpIsOn) {
		return null;
	}

	if (!cause.languages.available.includes(cause.languages.select)) {
		throw 'You need to set a available language : ' + cause.languages.available;
	}

	if (typeof(Globalize) === 'function') {
		return this.replaceTags(this.getWithGlobalize(label));
	} else if (typeof(causeAvailableLanguage[cause.languages.select][label]) !== 'undefined') {
		return this.replaceTags(causeAvailableLanguage[cause.languages.select][label]);
	}

	return label + ' (' + this.get('toDefined') + ')';
};

cause.objects.labels.prototype.replaceTags = function (label) {
	if (!label) {
		return '';
	}
	if (!label.includes('{') || !label.includes('}')) {
		return label;
	}

	var version = '';
	if (myApp && myApp.config && myApp.config.version) {
		version = (myApp.config.version == '__package_version__' ? 'DEV' : myApp.config.version);

		if (version.substr(0, 1) == 'v') {
            version = version.substr(1, version.length);
        }
	}

    var tag = label.match(/{.*}/);
    var replaceBy = {
        '{baseUrl}': cause.baseUrl,
		'{version}': (version ? '<span>Version: ' + version + '</span>, ' : '')
    };

    if (!replaceBy[tag]) {
    	cause.log('Need to defined replaceBy in labels.replaceTags', 'warn');
	}

	return label.replace(tag, replaceBy[tag]);
};

cause.objects.labels.prototype.getWithGlobalize = function (label) {
    try {
		/* Globalize 1.X */
        if (typeof(Globalize.formatMessage) === 'function') {
            return Globalize.formatMessage(label);
			/* Globalize 0.X */
        } else if (typeof(Globalize.localize) === 'function') {
            return Globalize.localize(label);
        }
    } catch (err) {
        if (typeof(causeAvailableLanguage[cause.languages.select][label]) !== 'undefined') {
            return causeAvailableLanguage[cause.languages.select][label];
        }
    }
};

/** Set generic labels for the library cause.
 *
 * @memberOf cause.objects.labels
 */
cause.objects.labels.prototype.load = function () {
	if (cause.helpIsOn) {
		return null;
	}

	this.findLanguage();

	/* Globalize 1.X */
	if (typeof(Globalize.loadMessages) === 'function') {
		Globalize.loadMessages(causeAvailableLanguage);
		/* Globalize 0.X */
	} else if (typeof(Globalize.addCultureInfo) === 'function') {
		Globalize.addCultureInfo('en', {messages: causeAvailableLanguage.en});
		Globalize.addCultureInfo('fr', {messages: causeAvailableLanguage.fr});
	}
};

/** Set the language to use.
 *
 * @memberOf cause.objects.labels
 * @param {string} language - Language of label to use
 * @param {function} callback - Function to execute after set a language
 */
cause.objects.labels.prototype.set = function (language, callback) {
	if (cause.helpIsOn) {
		return null;
	}

	this.findLanguage(language);

	if (!cause.languages.available.includes(cause.languages.select)) {
		cause.log('The language "' + cause.languages.select + '" is not available!');
		return null;
	}

	if (typeof(Globalize) === 'function') {
		/* Globalize 1.X */
		if (typeof(Globalize.locale) === 'function') {
			cause.request.many([
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/main/' + cause.languages.select + '/ca-gregorian.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/main/' + cause.languages.select + '/numbers.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/supplemental/likelySubtags.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/supplemental/timeData.json',
                cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr-data/supplemental/weekData.json'
			], (function (callback, data) {
				for (var i = 0, j = data.length; i < j; i++) {
					Globalize.load(data[i][0]);
				}

				Globalize.locale(cause.languages.select);

				callback();
			}).bind(this, callback));

			return null;
			/* Globalize 0.X */
		} else if (typeof(Globalize.culture) === 'function') {
			Globalize.culture(cause.languages.select);
		}
	}

	callback();
};

/** Find the right language to use.
 *
 * @memberOf cause.objects.labels
 * @param {string} language - Language of label to use
 */
cause.objects.labels.prototype.findLanguage = function (language) {
	this.setSelectLanguage(language);

	if (typeof(cause.storage) === 'object') {
		cause.storage.set('lang', cause.languages.select);
	}
	if (typeof(myApp) === 'object' && typeof(myApp.config) === 'object') {
		myApp.config.language = cause.languages.select;
	}
};

cause.objects.labels.prototype.setSelectLanguage = function (language) {
    var params = (cause.location ? cause.location.getUrlParams() : {});
    var use = (language ? language : cause.languages.select);

    if (params && params.lang) {
        use = params.lang;
    } else if (typeof(cause.storage) === 'object' && cause.storage.get('lang')) {
        use = cause.storage.get('lang');
    }

    if (use.includes('-')) {
        use = use.split('-');
        use = use[0];
    }

    cause.languages.select = (cause.languages.available.includes(use) ? use : cause.languages.available[0]);
};

/** @property {cause.objects.labels} */
cause.labels = new cause.objects.labels();