/** Class to create a custom WYSIWYG.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object with all configuration
 */
cause.objects.wysiwygCustom = function (config) {
	this.elm = null;
	this.tags = {	/* Tags the wysiwyg can create */
		'strong': {
			icon: 'bold'
		},
		'em': {
			icon: 'italic'
		},
		'u': {
			icon: 'underline'
		},
		'a': {
			attrs: {'href': ''},
			icon: 'link'
		},
		'img': {
			attrs: {'src': '', 'alt': ''},
			close: true,
			icon: 'picture-o',
			modify: true
		}
	};
	this.tagsModify = {	/* Tags the wysiwyg who need icon for remove, when this append the main icon modify */
		'a': {
			icon: 'chain-broken'
		}
	};

    this.escapeKeys = [
        16 /* Shift key */, 17 /* Ctrl */, 18 /* Alt */,
        35 /* End */, 36 /* Home */,
        37 /* Arrow left */, 38 /* Arrow top */, 39 /* Arrow right */, 40 /* Arrow bottom */
    ];

	this.config = config;
	this.history = [];
    this.historyPosition = -1;
	this.init();
};

/** Set a selection inside textarea.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {integer} start - Position to start the selection
 * @param {integer} length - The length of the selection
 */
cause.objects.wysiwygCustom.prototype.focus = function (start, length) {
	cause.html.setSelection(cause.$('textarea', this.elm).get(0), start, length);

	setTimeout((function () {
		cause.$('textarea', this.elm).focus();
		this.activeTools();
	}).bind(this), 100);
};

/** Initialize the custom WYSIWYG.
 *
 * @memberOf cause.objects.wysiwygCustom
 */
cause.objects.wysiwygCustom.prototype.init = function () {
	var div = cause.$(this.config.selector);
	var html = '';

	for (var i in this.tags) {
		if (this.tags.hasOwnProperty(i)) {
			html += '<i class="fa fa-' + this.tags[i].icon + '" aria-hidden="true"></i>';

			if (this.tagsModify[i]) {
				html += '<i class="fa fa-' + this.tagsModify[i].icon + '" aria-hidden="true" disabled="disabled"></i>';
			}
		}
	}

	this.elm = cause.$('<div class="wysiwyg"><div class="tools">' + html + '</div><textarea /></div>');

	cause.$('textarea', this.elm).height(div.height());
	cause.$('textarea', this.elm).width(div.width());
	cause.$('textarea', this.elm).html(div.html());
	cause.$(this.config.selector).replaceWith(this.elm);

	for (var j in this.tags) {
		if (this.tags.hasOwnProperty(j)) {
			cause.$('.tools .fa-' + this.tags[j].icon, this.elm).mousedown(this.clickIcon.bind(this, j));

			if (this.tagsModify[j]) {
				cause.$('.tools .fa-' + this.tagsModify[j].icon, this.elm).mousedown(this.tagsRemove.bind(this, j));
			}
		}
	}

	this.setup();
};

/** Active all function we need.
 *
 * @memberOf cause.objects.wysiwygCustom
 */
cause.objects.wysiwygCustom.prototype.setup = function () {
	if (typeof(this.config.onSetup) === 'function') {
		this.config.onSetup(this);
	}

	cause.$('textarea', this.elm).mouseup((function () {
		this.activeTools();
	}).bind(this));
	cause.$('textarea', this.elm).keydown(this.keydown.bind(this));
    cause.$('textarea', this.elm).keyup(this.keyup.bind(this));

	if (typeof(this.config.onInitialize) === 'function') {
		this.config.onInitialize(this);
	}

    this.addHistory('setup');
};

cause.objects.wysiwygCustom.prototype.keydown = function (e) {
    if (typeof(this.config.onKey) === 'function') {
        this.config.onKey(this, e);
    }

    if (e.ctrlKey && e.keyCode === 83) {    /* Ctrl+S */
        if (typeof(this.config.onSave) === 'function') {
            cause.debounce(this.config.onSave, 200);
        }

        e.preventDefault();
    } else if (e.ctrlKey && e.keyCode === 90) {    /* Ctrl+Z */
        this.undo();
        e.preventDefault();
    } else if (!this.escapeKeys.includes(e.keyCode)) {
        this.activeTools();

        if (typeof(this.config.onChange) === 'function') {
            cause.debounce(this.config.onChange, 200);
        }
    }
};

cause.objects.wysiwygCustom.prototype.keyup = function (e) {
	if (!this.escapeKeys.includes(e.keyCode)) {
        this.addHistory('keyup');
    }
};

cause.objects.wysiwygCustom.prototype.addHistory = function (event) {
	if (this.historyPosition > -1) {
		this.history.splice(this.historyPosition);
	}

    this.history.push({
		time: new Date(),
        event: event,
		content: cause.$('textarea', this.elm).val()
	});

    this.historyPosition = this.history.length;
};

cause.objects.wysiwygCustom.prototype.undo = function () {
    this.historyPosition = (this.historyPosition > 1 ? this.historyPosition - 2 : 0);

    if (this.history[this.historyPosition]) {
        cause.$('textarea', this.elm).val(this.history[this.historyPosition].content);
    }
};

/** Select or unselect an icon.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} icon - Icon to check
 * @param {string} tagName - Tag to check
 */
cause.objects.wysiwygCustom.prototype.activeIcon = function (icon, tagName) {
	var active = this.tagsInside(tagName);

	if (active) {
		cause.$('.tools .fa-' + icon, this.elm).addClass('select');
	} else {
		cause.$('.tools .fa-' + icon, this.elm).removeClass('select');
	}

	return active;
};

/** Check if the cursor is inside toolbar tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 */
cause.objects.wysiwygCustom.prototype.activeTools = function () {
	for (var i in this.tags) {
		if (this.tags.hasOwnProperty(i)) {
			this.activeIcon(this.tags[i].icon, i);
		}
	}

	for (var j in this.tagsModify) {
		if (this.tagsModify.hasOwnProperty(j)) {
			if (this.activeIcon(this.tagsModify[j].icon, j)) {
				cause.$('.tools .fa-' + this.tagsModify[j].icon, this.elm).removeAttr('disabled');
			} else {
				cause.$('.tools .fa-' + this.tagsModify[j].icon, this.elm).attr('disabled', 'disabled');
			}
		}
	}
};

/** Check if we need to add or remove the tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to add
 * @param {object} e - Event object
 */
cause.objects.wysiwygCustom.prototype.clickIcon = function (tagName, e) {
	if (cause.$(e.target, this.elm).attr('disabled') !== 'disabled') {
		if (cause.$(e.target, this.elm).hasClass('select')) {
			if (this.tags[tagName].close || this.tagsModify[tagName]) {
				this.tagsModify(tagName);
			} else {
				this.tagsRemove(tagName);
			}
		} else {
			this.tagsAdd(tagName);
		}

        this.addHistory('clickIcon');
	}
};

/** Place a selection between tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to add
 */
cause.objects.wysiwygCustom.prototype.tagsAdd = function (tagName) {
	var selection = cause.html.getSelection();

	if (selection !== false && (selection.selectionStart || selection.selectionEnd)) {
		var text = cause.$('textarea', this.elm).val();
		var content = {
			before: text.substr(0, selection.selectionStart),
			content: text.substr(selection.selectionStart, selection.selectionEnd - selection.selectionStart),
			after: text.substr(selection.selectionEnd)
		};

		this.tagsAskAttrs(tagName, content);
	}
};

cause.objects.wysiwygCustom.prototype.tagsAskAttrs = function (tagName, content, attrs) {
	/** Open a dialog, so user can enter all attributes value.
	 *
	 * @memberOf cause.objects.wysiwygCustom
	 * @param {string} tagName - Tag name to set attributes
	 * @param {string} content - Split of wysiwyg content for selected tag
	 * @param {object} attrs - Object with all actual attributes
	 */
	var message = '<div>';

	if (this.tags[tagName].attrs) {
		for (var attr in this.tags[tagName].attrs) {
			if (this.tags[tagName].attrs.hasOwnProperty(attr)) {
				message += '<br>' + attr + ' = <input type="text" id="' + attr + '" value="' + (attrs && attrs[attr] ? attrs[attr] : '') + '" />';
			}
		}

		cause.dialog(message + '</div>', cause.localize('wysiwyg'), (function (tagName, content, button) {
			var attrs = {};

			if (cause.$(button[0].element[0]).parents('.dx-dialog').length > 0) {
				cause.$(button[0].element[0]).parents('.dx-dialog').find('input').each(function (nb, elm) {
					var domElement = cause.$(elm);
					attrs[domElement.attr('id')] = domElement.val();
				});
			} else {
				cause.$(button[0].element[0]).parents('.alert-box').find('input').each(function (nb, elm) {
					var domElement = cause.$(elm);
					attrs[domElement.attr('id')] = domElement.val();
				});
			}

			var tag = this.tagsBuild(tagName, content.content, attrs);

			cause.$('textarea', this.elm).val(content.before + tag + content.after);
			this.focus(content.before.length, tag.length);
		}).bind(this, tagName, content));
	} else {
		var tag = this.tagsBuild(tagName, content.content);

		cause.$('textarea', this.elm).val(content.before + tag + content.after);
		this.focus(content.before.length, tag.length);
	}
};

/** Create the HTML for tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to create
 * @param {string} content - Content inside of tag
 * @param {object} attrs - All attributs of tag
 */
cause.objects.wysiwygCustom.prototype.tagsBuild = function (tagName, content, attrs) {
	var attributes = '';

	if (this.tags[tagName].attrs) {
		for (var attr in this.tags[tagName].attrs) {
			if (attrs && attrs[attr]) {
				attributes += ' ' + attr + '="' + attrs[attr] + '"';
			} else {
				attributes += ' ' + attr + '="' + this.tags[tagName].attrs[attr] + '"';
			}
		}
	}

	if (this.tags[tagName].close) {
		return '<' + tagName + attributes + ' />';
	} else {
		return '<' + tagName + attributes + '>' + content + '</' + tagName + '>';
	}
};

/** Check if the selection is inside or content a specific tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to check
 */
cause.objects.wysiwygCustom.prototype.tagsInside = function (tagName) {
	var selection = cause.html.getSelection();

	if (selection) {
		var content = cause.$('textarea', this.elm).val();
		var before = content.substr(0, selection.selectionStart);
		var select = content.substr(selection.selectionStart, selection.selectionEnd - selection.selectionStart);
		var after = content.substr(selection.selectionEnd);

		if (before.match(new RegExp('<' + tagName)) || select.includes('<' + tagName)) {
			var foundEndTag = (this.tags[tagName].close && (after.includes('\/>') || select.includes('\/>')));
			var foundCloseTag = (after.match(new RegExp('<\/' + tagName + '>')) || select.includes('<\/' + tagName + '>'));

			if (foundEndTag || foundCloseTag) {
				return true;
			}
		}
	}

	return false;
};

/** Modify attribute of a tag.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to modify
 * @param {object} e - Event object
 */
cause.objects.wysiwygCustom.prototype.tagsModify = function (tagName, e) {
	var selection = cause.html.getSelection();

	if (!selection || !(!e || cause.$(e.target, this.elm).attr('disabled') !== 'disabled') || !this.tags[tagName].attrs) {
		return null;
	}

	var content = this.tagsSplit(tagName);
	var attrs = {};

	for (var attr in this.tags[tagName].attrs) {
		if (this.tags[tagName].attrs.hasOwnProperty(attr)) {
			var value = content.tag.match(new RegExp(attr + '="(.*)"'))

			if (value && value[1]) {
				attrs[attr] = value[1];
			}
		}
	}

	this.tagsAskAttrs(tagName, content, attrs);
};

/** Remove tag from each side of selection.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name to remove
 * @param {object} e - Event object
 */
cause.objects.wysiwygCustom.prototype.tagsRemove = function (tagName, e) {
	if (!e || cause.$(e.target, this.elm).attr('disabled') !== 'disabled') {
		var selection = cause.html.getSelection();

		if (selection && (selection.selectionStart || selection.selectionEnd)) {
			var content = this.tagsSplit(tagName);

			cause.$('textarea', this.elm).val(content.before + content.content + content.after);
			this.focus(content.before.length, content.content.length);
		}
	}
};

/** Split content base on specific tag of the selection.
 *
 * @memberOf cause.objects.wysiwygCustom
 * @param {string} tagName - Tag name
 */
cause.objects.wysiwygCustom.prototype.tagsSplit = function (tagName) {
	var selection = cause.html.getSelection();
	var content = cause.$('textarea', this.elm).val();
	var beforeTag = content.substr(0, selection.selectionStart);
	var selectTag = content.substr(selection.selectionStart, selection.selectionEnd - selection.selectionStart);
	var afterTag = content.substr(selection.selectionEnd);
	var tag = '';

	if (beforeTag.includes('<' + tagName)) {
		/* Search for the tag before the selection */
		var start = beforeTag.lastIndexOf('<' + tagName);
		var tmp = beforeTag.substr(start);
		if (tmp.includes('>')) {
            tag = tmp.substr(tmp.indexOf('>') + 1);
            beforeTag = beforeTag.substr(0, beforeTag.lastIndexOf('<' + tagName)) + tmp.substr(tmp.indexOf('>') + 1);
		} else {
            if (selectTag.includes('>')) {
                tag = tmp + selectTag.substr(0, selectTag.indexOf('>') + 1);
                beforeTag = beforeTag.substr(0, beforeTag.lastIndexOf('<' + tagName));
                selectTag = selectTag.substr(selectTag.indexOf('>') + 1);
            } else {
                tag = tmp + selectTag + afterTag.substr(0, afterTag.indexOf('>') + 1);
                beforeTag = beforeTag.substr(0, beforeTag.lastIndexOf('<' + tagName));
                selectTag = '';
                afterTag = afterTag.substr(afterTag.indexOf('>') + 1);
            }
		}
	} else if (selectTag.indexOf('<' + tagName) === 0) {
		/* Search for the tag inside the selection */
		tag = selectTag.substr(0, selectTag.indexOf('>') + 1);
		selectTag = selectTag.substr(selectTag.indexOf('>') + 1);
	}

	if (afterTag.includes('</' + tagName)) {
		/* Search for the tag after the selection */
		afterTag = afterTag.substr(0, afterTag.lastIndexOf('</' + tagName)) + afterTag.substr(afterTag.lastIndexOf(tagName + '>') + 1 + tagName.length);
	} else if (selectTag.includes('<\/' + tagName)) {
		/* Search for the tag inside the selection */
		selectTag = selectTag.substr(0, selectTag.indexOf('</' + tagName));
	}

	return {
		after: afterTag,
		before: beforeTag,
		content: selectTag,
		tag: tag
	};
};