/** Class for helping with media player.
 * This class needed "jplayer" or "html 5".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object with all config
 */
cause.objects.player = function (config) {
	if (!cause.helpIsOn) {
		if (cause.is.element(config)) {
			config = {selector: config};
		} else if (typeof(config.get) === 'function') {
			config = {selector: config.get(0)};
		}
	}

	this.name = 'player';
	this.tag = '';
	this.config = cause.extend({}, {
		autoplay: false,
		loop: false,
		media: [],
		muted: false,
		player: 'html5',
		poster: '',
		repeat: false,
		selector: '',
		width: 0,
		height: 0
	}, (config || {}));

	/* Initialize the "player" */
	if (!cause.helpIsOn) {
		this.setConfig();

		if (this.config.player === 'html5') {
			this.initHtml5();
		} else if (this.config.player === 'jPlayer') {
			if (typeof($.jPlayer) === 'function') {
				this.initJPlayer();
			} else {
				cause.include.css(cause.baseUrlPlugins + 'jPlayer/' + cause.version.jPlayer + '/dist/skin/pink.flag/css/jplayer.pink.flag.min.css');
				cause.include.js(cause.baseUrlPlugins + 'jPlayer/' + cause.version.jPlayer + '/dist/jplayer/jquery.jplayer.min.js', this.initJPlayer.bind(this), this.fallback.bind(this));
			}
		}
	}
};

/** Show help when is cause.help('player') is call.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.help = function () {
	cause.log('Aide pour "cause.player":', 'help_title');
	cause.log("\t" +
		'new cause.player(config);' + "\n\n\t" +
		'config.player = Player we could use (html5, jPlayer), default is "html5"' + "\n\t" +
		'config.selector = HTML sélecteur', 'help');
};

/** Detect the config if "config" is a video or audio tag.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.setConfig = function () {
	var id = cause.unique();
	var tag = cause.$(this.config.selector);

	if (tag.length === 0) {
		return null;
	}

	this.setMedia(tag);
	this.config.autoplay = (tag.attr('autoplay') === 'autoplay' ? true : false);
	this.config.loop = (tag.attr('loop') === 'loop' ? true : false);
	this.config.poster = (tag.attr('poster') ? tag.attr('poster') : '');
	this.config.selector = '#' + id;

	tag.replaceWith('<div id="' + id + '">');
};

cause.objects.player.prototype.setMedia = function (tag) {
	if (tag.get(0).nodeName !== 'VIDEO' && tag.get(0).nodeName !== 'AUDIO' && !cause.is.array(this.config.media)) {
		this.config.media = (this.config.media ? [this.config.media] : []);
	}

	tag.find('source').each((function (nb, elm) {
		this.config.media.push(elm.src);
	}).bind(this));

	if (tag.attr('src')) {
		this.config.media.push(tag.attr('src'));
	}
};

/** Return the media type.
 *
 * @memberOf cause.objects.player
 * @param {string} file - Path of file
 * @param {boolean} format - If true we return the file format instead of codecs
 * @returns {string} Type of file
 */
cause.objects.player.prototype.findType = function (file, format) {
	var ext = file.substr(file.lastIndexOf('.') + 1).toLowerCase();
	var codecs = {
		'video/mp4': ['m4v', 'mp4'],
		'video/ogg': ['ogv', 'ogg'],
		'video/webm': ['webmv', 'webm'],
		'audio/mp4': ['m4a', 'mp4'],
		'audio/mpeg': ['mp3'],
		'audio/ogg': ['oga', 'ogg'],
		'audio/wav': ['wav'],
		'audio/webm': ['webma', 'webm']
	};

	for (var i in codecs) {
		if (codecs[i].includes(ext)) {
			return (format ? codecs[i][0] : i);
		}
	}

	return '';
};

/** Pause media.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.pause = function () {
	if (this.config.player === 'html5') {
		if (cause.$(this.tag).length > 0) {
			cause.$(this.tag).get(0).pause();
		}
	} else if (this.config.player === 'jPlayer') {
		$(this.tag).jPlayer('pause');
	}
};

/** Play media.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.play = function () {
	if (this.config.player === 'html5') {
		if (cause.$(this.tag).length > 0) {
			cause.$(this.tag).get(0).play();
		}
	} else if (this.config.player === 'jPlayer') {
		$(this.tag).jPlayer('play');
	}
};

/** Stop media.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.stop = function () {
	if (this.config.player === 'html5') {
		if (cause.$(this.tag).length > 0) {
			cause.$(this.tag).get(0).pause();
			cause.$(this.tag).get(0).currentTime = 0;
		}
	} else if (this.config.player === 'jPlayer') {
		$(this.tag).jPlayer('stop');
	}
};

/** Initialize the media with HTML5 tag.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.initHtml5 = function () {
	var tag = 'video';
	var source = '';
	var attrs = [
		'controls="controls"',
		'preload="metadata"',
		(this.config.autoplay ? 'autoplay="autoplay"' : ''),
		(this.config.loop ? 'loop="loop"' : ''),
		(this.config.muted ? 'muted="muted"' : ''),
		(this.config.poster ? 'poster="' + this.config.poster + '"' : ''),
		(this.config.height ? 'height="' + this.config.height + '"' : ''),
		(this.config.width ? 'width="' + this.config.width + '"' : '')
	];

	for (var i = 0, j = this.config.media.length; i < j; i++) {
		if (this.config.media[i].includes('.vtt')) {
			source += '<track src="' + this.config.media[i] + '" kind="subtitles" />';
		} else {
			var type = this.findType(this.config.media[i]);

			tag = (type ? type.substr(0,5) : '');
			source += '<source src="' + this.config.media[i] + '" type="' + type + '" />';
		}
	}

	$(this.config.selector).html('<' + tag + ' ' + attrs.join(' ') + '>' + source + cause.localize('yourBrowserDontSupport') + '</' + tag + '>');

	this.tag = this.config.selector + ' ' + tag;
};

/** Initialize the media with jPlayer plugins.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.initJPlayer = function () {
	var id = cause.unique();
	var size = {};
	var types = [];
	var medias = {
		title: (this.config.title ? this.config.title : ''),
		poster: (this.config.poster ? this.config.poster : '')
	};

	if (this.config.width) {
		size.width = this.config.width;
		size.height = '100%';
	} else if (this.config.height) {
		size.height = this.config.height;
		size.width = '100%';
	}

	for (var i = 0, j = this.config.media.length; i < j; i++) {
		var type = this.findType(this.config.media[i], true);

		medias[type] = this.config.media[i];
		types.push(type);
	}

	var config = cause.extend({}, {
		ready: (function (id, medias) {
			$('#' + id).jPlayer('setMedia', medias);

			if (this.config.autoplay) {
				$('#' + id).jPlayer('play');
			}
		}).bind(this, id, medias),
		cssSelectorAncestor: this.config.selector,
		globalVolume: true,
		loop: this.config.loop,
		repeat: this.config.repeat,
		size: size,
		supplied: types.join(', '),
		swfPath: cause.baseUrlPlugins + 'jPlayer/' + cause.version.jPlayer + '/dist/jplayer/',
		toggleDuration: true,
		useStateClassSkin: true
	});

	$(this.config.selector).addClass('jp-video');
	$(this.config.selector).html(
		'<div class="jp-type-single">' +
		'<div id="' + id + '" class="jp-jplayer"></div>' +
		'<div class="jp-gui">' +
		'<div class="jp-video-play"><button class="jp-video-play-icon" role="button" tabindex="0">play</button></div>' +
		'<div class="jp-interface">' +
		'<div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div>' +
		'<div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>' +
		'<div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>' +
		'<div class="jp-details"><div class="jp-title" aria-label="title">&nbsp;</div></div>' +
		'<div class="jp-controls-holder">' +
		'<div class="jp-volume-controls">' +
		'<button class="jp-mute" role="button" tabindex="0">mute</button>' +
		'<button class="jp-volume-max" role="button" tabindex="0">max volume</button>' +
		'<div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div>' +
		'</div>' +
		'<div class="jp-controls">' +
		'<button class="jp-play" role="button" tabindex="0">play</button>' +
		'<button class="jp-stop" role="button" tabindex="0">stop</button>' +
		'</div>' +
		'<div class="jp-toggles">' +
		'<button class="jp-repeat" role="button" tabindex="0">repeat</button>' +
		'<button class="jp-full-screen" role="button" tabindex="0">full screen</button>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="jp-no-solution">' +
		'<span>Update Required</span>' +
		'To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.' +
		'</div>' +
		'</div>');

	$('#' + id).jPlayer(config);

	this.tag = this.config.selector + ' #' + id;
};

/** This function is execute if plugins is not found.
 *
 * @memberOf cause.objects.player
 */
cause.objects.player.prototype.fallback = function () {
	DevExpress.ui.notify(cause.localize('missingPlugins'), 'jPlayer ' + cause.version.jPlayer, 5000);

	this.config.player = 'html5';
	this.initHtml5();
};