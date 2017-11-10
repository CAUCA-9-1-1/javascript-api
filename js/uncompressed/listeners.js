/** Class for helping with listeners.
 * This class help to execute function on each following event:
 * devtoolschange,
 * domchange, domadded, domremoved, dommodified,
 * fullscreenchange,
 * networkchange, online, offline,
 * orientationchange, resize, visibilitychange,
 * ready
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.listeners = function () {
	this.name = 'listeners';
	this.events = {
		'devtoolschange': [],
		'domchange': [],
		'domadded': [],
		'domremoved': [],
		'dommodified': [],
		'fullscreenchange': [],
		'load': [],
		'networkchange': [],
		'online': [],
		'offline': [],
		'orientationchange': [],
		'ready': [],
		'resize': [],
		'visibilitychange': []
	};
	this.correspondance = {
		'fullscreenchange': 'fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange',
		'visibilitychange': 'visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange'
	};

	if (typeof(window) === 'object') {
		this.initializeDomChangeListener();
		this.initializeDocumentListener();
		this.initializeWindowListener();
	}

	/** Shortcut for "cause.listeners.on".
	 *
	 * @param {string} on - Event name
	 * @param {function} funct - Function to execute when the event is trigger
	 */
	cause.on = this.add.bind(this);

	/** Shortcut for "cause.listeners.off".
	 *
	 * @param {string} on - Event name
	 * @param {function} funct - Function to execute when the event is trigger
	 */
	cause.off = this.remove.bind(this);
};

/** Show help when is cause.help('listeners') is call.
 */
cause.objects.listeners.prototype.help = function () {
	cause.log('Aide pour "cause.listeners":', 'help_title');
	cause.log("\t" +
		'cause.listeners.add = cause.on' + "\n\n\t" +
		'cause.on(name, event) = Ajouter une fonction "event" sur l\'événement "name"' + "\n\n\t" +
		'Les événements disponible sont :' + "\n\t\t" +
		'domchange, domadded, domremoved, dommodified, fullscreenchange, networkchange, online, offline, orientationchange, ready, resize, visibilitychange', 'help');
};

/** DOMCHANGE, DOMADDED, DOMREMOVED, DOMMODIFIED: Detect when the document DOM changed
 */
cause.objects.listeners.prototype.initializeDomChangeListener = function () {
	if (typeof(MutationObserver) === 'function' || typeof(WebKitMutationObserver) === 'function') {
		this.setMutationObserver();

		cause.$(window).on('unload', (function () {
			this.observer.disconnect();
		}).bind(this));

		cause.$(document).ready((function () {
			this.observer.observe(document.body, {
				attributes: true,
				childList: true,
				characterData: true,
				subtree: true
			});
		}).bind(this));
	} else {
		cause.$(window).on('DOMSubtreeModified', cause.debounce((function (e) {
			this.execute('domchange', {
				originalEvent: e.originalEvent,
				records: [],
				type: 'domchanged'
			});
		}).bind(this), 250));
	}
};

/** Set all action to get with mutation observer
 */
cause.objects.listeners.prototype.setMutationObserver = function () {
	this.observer = new (MutationObserver || WebKitMutationObserver)(cause.debounce((function (mutations) {
		/* For the sake of ...observation... let's output the mutation to console to see how this all works */
		this.execute('domchange', {
			originalEvent: null,
			records: mutations,
			type: 'domchange'
		});

		if (this.events.domadded.length > 0 || this.events.domremoved.length > 0 || this.events.dommodified.length > 0) {
			mutations.forEach((function (mutation) {
				if (mutation.type === 'childList') {
					if (mutation.addedNodes.length > 0) {
						this.execute('domadded', {
							originalEvent: null,
							records: [mutation],
							type: 'domadded'
						});
					} else {
						this.execute('domremoved', {
							originalEvent: null,
							records: [mutation],
							type: 'domremoved'
						});
					}
				} else {
					this.execute('dommodified', {
						originalEvent: null,
						records: [mutation],
						type: 'dommodified'
					});
				}
			}).bind(this));
		}
	}).bind(this), 250));
};

cause.objects.listeners.prototype.initializeDocumentListener = function () {
	/* FULLSCREENCHANGE: Detect change of fullscreen mode */
	cause.$(document).on(this.correspondance.fullscreenchange, cause.debounce((function (e) {
		cause.window.changeFullscreen(e);

		this.execute('fullscreenchange', cause.window.isFullscreen(), e);
	}).bind(this), 250));

	/* LOAD : Execute when page is loaded */
	cause.$(document).ready((function (e) {
		this.execute('load', e);

		if (cause.jQuery()) {
			this.execute('ready');
		}
	}).bind(this));

	/* VISIBILITYCHANGE: Detect change of page visibility */
	cause.$(document).on(this.correspondance.visibilitychange, cause.debounce((function (e) {
		this.execute('visibilitychange', (document.visibilityState === 'visible'), e);
	}).bind(this), 250));
};


cause.objects.listeners.prototype.initializeWindowListener = function () {
	/** NETWORKCHANGE: Execute on online and offline
	 This listeners send a boolean for online and a number 0/100 for the quality of connection
	 */

	/* ONLINE: Detect if page is online */
	cause.$(window).on('online', cause.debounce((function (e) {
		cause.connection.online(e);

		var online = true;
		if (typeof(navigator) === 'object') {
			online = navigator.onLine;
		}

		this.execute('networkchange', online, cause.connection.quality, e);
		this.execute('online', e);
	}).bind(this), 250));

	/* OFFLINE: Detect if page is offline */
	cause.$(window).on('offline', cause.debounce((function (e) {
		cause.connection.offline(e);

		var online = true;
		if (typeof(navigator) === 'object') {
			online = navigator.onLine;
		}

		this.execute('networkchange', online, 0, e);
		this.execute('offline', e);
	}).bind(this), 250));

	/* ORIENTATIONCHANGE: Detect change of screen orientation */
	cause.$(window).on('orientationchange', cause.debounce((function (e) {
		this.execute('orientationchange', (window.orientation || 0), e);
	}).bind(this), 250));

	/** READY: Execute everything is loaded
	 This listeners are executed when app.js is ready to be executed
	 onload if the script are include in tag head or when cause.loadAPP() is executed
	 */

	/* RESIZE: Detect change of screen orientation */
	cause.$(window).on('resize', cause.debounce((function (e) {
		if (typeof(cause.window) === 'object') {
			cause.window.changeFullscreen(e);
		}

		this.execute('resize', e);
	}).bind(this), 250));
};

/** Add an event listeners on document or window for specific event.
 *
 * @memberOf cause.objects.listeners
 * @param {string} on - Event name
 * @param {function} funct - Function to execute when the event is trigger
 */
cause.objects.listeners.prototype.add = function (on, funct) {
	if (on) {
		if (this.events[on]) {
			this.events[on].push(funct);
		} else {
			cause.$(document).on(on, funct);
		}
	}
};

/** Remove an event listeners on document or window for specific event.
 *
 * @memberOf cause.objects.listeners
 * @param {string} off - Event name
 * @param {function} funct - Function to execute when the event is trigger
 */
cause.objects.listeners.prototype.remove = function (off, funct) {
	if (off) {
		if (this.events[off]) {
			if (this.events[off].includes(funct)) {
				this.events[off].splice(this.events[on].indexOf(funct), 1);
			} else {
				this.events[off] = [];
			}
		} else {
			cause.$(document).off(off);
		}
	}
};

/** Execute all listeners for an event.
 *
 * @memberOf cause.objects.listeners
 * @param {string} on - Event name
 */
cause.objects.listeners.prototype.execute = function (on) {
	var args = [].slice.call(arguments);

	args.shift();

	for ( var i = 0, j = this.events[on].length; i < j; i++) {
		this.events[on][i].apply(null, args);
	}
};

/** @property {cause.objects.listeners} */
cause.listeners = new cause.objects.listeners();
