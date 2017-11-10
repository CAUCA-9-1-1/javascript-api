/** Class for helping with map.
 * This class needed "google maps" or "bing maps".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.maps = function (config) {
	this.name = 'maps';
	this.map = null;
	this.markers =  [];
	this.isInitialized = false;
	this.config = cause.extend({}, {
		apiKey: '',
		disabled: false,
		height: 400,
		selector: '',
		type: 'google',
		width: '100%'
	}, (config || {}));

	/* Initialize the "maps" */
	if (!cause.helpIsOn) {
		if (this.config.type === 'google') {
			if (typeof(google) === 'object') {
				this.initGoogle();
			} else {
				cause.include.js('//www.google.ca/jsapi', this.initGoogle.bind(this), function () {
					cause.alert(cause.localize('missingPlugins'), 'Google JSAPI');
				});
			}
		} else if (this.config.type === 'bing') {
			if (typeof(Microsoft) === 'object' && typeof(Microsoft.Maps) === 'object') {
				this.initBingMaps();
			} else {
				cause.include.js('//www.bing.com/api/maps/mapcontrol?mkt=' + cause.languages.select, this.initBingMaps.bind(this), function () {
					cause.alert(cause.localize('missingPlugins'), 'BING MAPS API');
				});
			}
		}
	}
};

/** Show help when is cause.help('maps') is call.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.help = function () {
	cause.log('Aide pour "cause.maps":', 'help_title');
	cause.log("\t" +
		'new cause.map(config);' + "\n\n\t" +
		'config.apiKey = Key/Credentials pour utiliser l\'API' + "\n\t" +
		'config.disabled = Désactivé toute les fonctions de la carte' + "\n\t" +
		'config.selector = HTML sélecteur' + "\n\t" +
		'config.type = Type de map utilisé ("google", "bing")', 'help');
};

/** Initialize the Google JSAPI.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initGoogle = function () {
	if (typeof(google.maps) === 'object') {
		this.initGoogleMaps();
	} else {
		google.load('maps', cause.version.googleMaps, {
			other_params: 'sensor=false',
			language: cause.languages.select,
			callback: this.initGoogleMaps.bind(this)
		});
	}
};

/** Initialize the map with Google Maps.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initGoogleMaps = function () {
	cause.$(this.config.selector).height(this.config.height);
	cause.$(this.config.selector).width(this.config.width);

	var config = {
		center: (this.config.center || {
			lat: 0,
			lng: 0
		}),
		zoom: (this.config.zoom || 8)
	};

	this.map = new google.maps.Map(cause.$(this.config.selector).get(0), config);

	google.maps.event.addDomListener(this.map, 'tilesloaded', this.initialize.bind(this));
};

/** Initialize the map with Bing Maps.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initBingMaps = function () {
	cause.$(this.config.selector).height(this.config.height);
	cause.$(this.config.selector).width(this.config.width);

	var config = {
		center: (this.config.center || {
			lat: 0,
			lng: 0
		}),
		credentials: this.config.apiKey,
		zoom: (this.config.zoom || 8)
	};

	try {
		this.map = new Microsoft.Maps.Map(this.config.selector, config);

		Microsoft.Maps.Events.addHandler(this.map, 'tiledownloadcomplete', this.initialize.bind(this));
	} catch(e) {
		setTimeout(this.initBingMaps.bind(this), 100);
	}
};

/** Execute when map is loaded.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.initialize = function () {
	if (this.isInitialized) {
		return null;
	}

	if (!this.config.center && typeof(navigator) === 'object' && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((function (position) {
			this.center({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});
		}).bind(this), function () {});
	}

	this.isInitialized = true;
	this.config.disabled = !this.config.disabled;

	this.toggle();
};

/** Toggle enabled / disabled mode.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.toggle = function () {
	this.config.disabled = !this.config.disabled;

	if (this.config.type === 'google') {
		this.map.setOptions({
			clickableIcons: !this.config.disabled,
			disableDefaultUI: this.config.disabled,
			disableDoubleClickZoom: this.config.disabled,
			draggable: !this.config.disabled,
			fullscreenControl: !this.config.disabled,
			panControl: !this.config.disabled,
			rotateControl: !this.config.disabled,
			scaleControl: !this.config.disabled,
			scrollwheel: !this.config.disabled,
			streetViewControl: !this.config.disabled,
			zoomControl: !this.config.disabled
		});
	} else if (this.config.type === 'bing') {
		this.map.setOptions({
			disableKeyboardInput: this.config.disabled,
			disableMouseInput: this.config.disabled,
			disablePanning: this.config.disabled,
			disableTouchInput: this.config.disabled,
			disableUserInput: this.config.disabled,
			disableZooming: this.config.disabled,
			showDashboard: !this.config.disabled,
			showMapTypeSelector: !this.config.disabled,
			showScalebar: !this.config.disabled
		});
	}
};

/** Move the center of map.
 *
 * @memberOf cause.objects.map
 * @param {object} position
 * @param {float} position.lat
 * @param {float} position.lng
 */
cause.objects.maps.prototype.center = function (position) {
	if (this.config.type === 'google') {
		this.map.setCenter(position);
	} else if (this.config.type === 'bing') {
		this.map.setView({
			center: new Microsoft.Maps.Location(position.lat, position.lng)
		});
	}
};

/** Add a marker on map.
 *
 * @memberOf cause.objects.map
 * @param {object} marker
 * @param {string} marker.title
 * @param {object} marker.position
 * @param {float} marker.position.lat
 * @param {float} marker.position.lng
 */
cause.objects.maps.prototype.addMarker = function (marker) {
	if (this.config.type === 'google') {
		this.markers.push(new google.maps.Marker({
			position: marker.position,
			map: this.map,
			title: marker.title
		}));
	} else if (this.config.type === 'bing') {
		var location = new Microsoft.Maps.Location(marker.position.lat, marker.position.lng);
		var options = new Microsoft.Maps.PushpinOptions({
			title: marker.title
		});

		this.markers.push(new Microsoft.Maps.Pushpin(location, options));
		this.map.entities.push(this.markers[this.markers.length - 1]);
	}

	return (this.markers.length - 1);
};

/** Remove one marker from the map.
 *
 * @memberOf cause.objects.map
 * @param {integer} nb
 */
cause.objects.maps.prototype.removeMarker = function (nb) {
	if (this.markers[nb]) {
		if (this.config.type === 'google') {
			this.markers[nb].setMap(null);
		} else if (this.config.type === 'bing') {
			this.map.entities.splice(nb, 1);
		}

		this.markers.splice(nb, 1);
	}
};

/** Remove all markers from the map.
 *
 * @memberOf cause.objects.map
 */
cause.objects.maps.prototype.removeAllMarkers = function () {
	for (var i=(this.markers.length - 1); i>=0; i--) {
		this.removeMarker(i);
	}

	this.markers = [];
};