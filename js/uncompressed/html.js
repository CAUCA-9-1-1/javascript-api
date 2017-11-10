/** Singleton for helping for html.
 *
 * @namespace
 * @memberOf cause
 */
cause.html = {
	/** Show help when is cause.help('html') is call.
	 **/
	help: function () {
		cause.log('Aide pour "cause.html":', 'help_title');
		cause.log("\t" +
			'cause.html.autoSize(node element) = Automatiquement définir la grandeur d\'un élément', 'help');
	},

	/** Automaticaly resize a html element.
	 *
	 * @param {HTMLElment} elm: Element to automatically resize with is content
	 */
    autoSize: function (elm) {
        var div = document.createElement('div');

        div.style.visibility = 'hidden';
        div.style.position = 'absolute';
        div.style.width = elm.offsetWidth;
        div.innerHTML = elm.value.replace(/\n/g, '<br>');

        document.body.appendChild(div);
        elm.style.height=(div.offsetHeight + 22) + 'px';
        div.parentNode.removeChild(div);
    },

	createTagHTML: function (tagName, attrs) {
		var tag = document.createElement(tagName);

		if (attrs) {
			for (var attr in attrs) {
				switch(attr) {
					case 'onload':
                    case 'onerror':
						tag[attr] = attrs[attr];
						break;
					default:
                        if (attrs.hasOwnProperty(attr)) {
                            tag.setAttribute(attr, attrs[attr]);
                        }
				}
			}
		}

		return tag;
	},

	/** Return the position of cursor
	 */
	getCaretPosition: function () {
		var isTextTag = (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT'));

		if (window.getSelection && isTextTag) {
			return (document.activeElement.selectionStart || 0 );
		}

		return 0;
	},

	/** Return the selected tag or text
	 */
	getSelection: function () {
        if (window.getSelection) {
		    if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
				return {
					selectionStart: document.activeElement.selectionStart,
					selectionEnd: document.activeElement.selectionEnd
				};
            } else {
		        return window.getSelection();
            }
        }

		return false;
	},

	/** Set the selected text
	 */
	setSelection: function (element, start, length) {
        if (window.getSelection) {
			var domToSetSelection = (element || document.activeElement);
			var lengthOfSelection = (length || 0);

		    if (domToSetSelection && (domToSetSelection.tagName === 'TEXTAREA' || domToSetSelection.tagName === 'INPUT')) {
				domToSetSelection.selectionStart = start;
				domToSetSelection.selectionEnd = start + lengthOfSelection;
            }
        }
	},

	/** Convert HTML to a DOM element.
	 *
	 * @param {string} html - Code HTML to convert
	 * @returns {HTMLElement} Dom element
	 */
	parse: function (html) {
		var dom = document.createElement('div');

		dom.innerHTML = html;

		return (dom.childNodes && dom.childNodes.length > 0 ? dom.childNodes[0] : null);
	}
};
