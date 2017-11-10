/** Singleton for helping when we process the ip address
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.connectionIp = function () {
	this.name = 'connectionIp';
	this.info = {};
	this.total = 0;
	this.return = 0;
	this.callback = null;
	this.localIPs = [];
	this.localCallback = null;
};

/** Find the computer local IP.
 * This function work for now, but we can't be sure that always work (2016/05/26).
 *
 * @memberOf cause.objects.connectionIp
 * @param {function} callback - Function to execute when we found the address
 * @param {integer} type - Number 4, 6 or null to specific a type of address
 */
cause.objects.connectionIp.prototype.local = function (callback, type) {
	this.localIPs = [];
	this.localCallback = callback;

	try {
        if (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection) {
            var myPeerConnection = (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection);
            var pc = new myPeerConnection({iceServers: []});
            var noop = function () {
            };
            var ipRegex = (type === 6 ? /([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g : (type === 4 ? /([0-9]{1,3}(\.[0-9]{1,3}){3})/g : /([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}|[0-9]{1,3}(\.[0-9]{1,3}){3})/g ));

            /* Create a bogus data channel */
            pc.createDataChannel('');

            /* Create offer and set local description */
            pc.createOffer(function (sdp) {
                pc.setLocalDescription(sdp, noop, noop);
            }, noop);

            /* Listen for candidate events */
            pc.onicecandidate = (function (ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
                    return;
                }

                ice.candidate.candidate.match(ipRegex).forEach(this.localFind.bind(this));
            }).bind(this);
		} else {
        	throw 'No RTC';
		}
    } catch (e) {
        if (typeof(this.localCallback) === 'function') {
            this.localCallback([]);
        }
    }
};

/** Store all local ip and execute the callback when we all receive it.
 *
 * @memberOf cause.objects.connectionIp
 * @param {string} ip - New local ip
 */
cause.objects.connectionIp.prototype.localFind = function (ip) {
	this.localIPs.push(ip);

	cause.wait((function () {
		if (typeof(this.localCallback) === 'function') {
			this.localCallback(this.localIPs);
		}
	}).bind(this), 250);
};

/** Check many IP service.
 * The ip-api.com service look the best on may 2016.
 *
 * @memberOf cause.objects.connectionIp
 * @param {function} callback - Function pass to getIp function
 */
cause.objects.connectionIp.prototype.get = function (callback) {
	this.info = {1: {}};
	this.total = 1;
	this.return = 0;
	this.callback = callback;

	cause.ajax({
		url: 'http://ip-api.com/json?callback=',
		dataType: 'json',
		success: this.success.bind(this, 1),
		complete: (function () {
			if (typeof(this.callback) === 'function') {
				this.callback({
					ip: this.info[1].query,
					country_code: this.info[1].countryCode,
					country: this.info[1].country,
					region_name: this.info[1].regionName,
					city: this.info[1].city,
					zip_code: this.info[1].zip,
					timezone: this.info[1].timezone,
					as_name: this.info[1].as,
					latitude: this.info[1].lat + '',
					longitude: this.info[1].lon + ''
				});
			}
		}).bind(this)
	});
};

/** Check many IP service.
 * The ip-api.com look the best on may 2016
 *
 * @memberOf cause.objects.connectionIp
 * @param {function} callback - Function pass to getIp function
 */
cause.objects.connectionIp.prototype.getConfirm = function (callback) {
	this.info = {1: {}, 2: {}, 3: {}, 4: {}, 5: {}};
	this.total = 5;
	this.return = 0;
	this.callback = callback;

	cause.ajax({
		url: 'http://ip-api.com/json?callback=',
		dataType: 'json',
		success: this.success.bind(this, 1),
		complete: this.complete.bind(this, 1)
	});
	cause.ajax({
		url: 'http://api.snoopi.io/v1/',
		dataType: 'json',
		success: this.success.bind(this, 2),
		complete: this.complete.bind(this, 2)
	});
	cause.ajax({
		url: 'http://www.geoplugin.net/json.gp?jsoncallback=?',
		dataType: 'json',
		success: this.success.bind(this, 3),
		complete: this.complete.bind(this, 3)
	});
	cause.ajax({
		url: 'http://gd.geobytes.com/GetCityDetails?callback=?',
		dataType: 'json',
		success: this.success.bind(this, 4),
		complete: this.complete.bind(this, 4)
	});
	cause.ajax({
		url: 'http://ipinfo.io/',
		method: 'GET',
		dataType: 'json',
		success: this.success.bind(this, 5),
		complete: this.complete.bind(this, 5)
	});
};

/** Execute on each IP request.
 *
 * @memberOf cause.objects.connectionIp
 * @param {integer} priority - Priority of specific IP request
 * @param {object} data - Data receive from the request
 */
cause.objects.connectionIp.prototype.success = function (priority, data) {
	this.info[priority] = data;
};

/** Execute on each IP request.
 *
 * @memberOf cause.objects.connectionIp
 */
cause.objects.connectionIp.prototype.complete = function () {
	this.return++;

	if (this.return === this.total) {
		this.finish();
	}
};

/** Validate some information of priority 1 with other service
 *
 * @memberOf cause.objects.connectionIp
 */
cause.objects.connectionIp.prototype.finish = function () {
	var data = {
		source: this.info
	};
	var info5_lat_lon = (this.info[5].loc ? this.info[5].loc.split(',') : []);

	// Confirm 2 source for the IP address
	data.ip = this.confirm(this.info[1].query, [
		this.info[2].remote_address,
		this.info[3].geoplugin_request,
		this.info[4].geobytesremoteip,
		this.info[5].ip]);

	// Confirm 2 source for the country code
	data.countryCode = this.confirm(this.info[1].countryCode, [
		this.info[2].CountryCode,
		this.info[3].geoplugin_countryCode,
		this.info[4].geobytesinternet,
		this.info[5].country]);

	// Confirm 2 source for the country
	data.country = this.confirm(this.info[1].country, [
		this.info[3].geoplugin_countryName,
		this.info[4].geobytescountry]);

	// Confirm 2 source for the region name
	data.regionName = this.confirm(this.info[1].regionName, [
		this.info[2].Region_Full,
		this.info[3].geoplugin_regionName,
		this.info[4].geobytesregion,
		this.info[5].region]);

	// Confirm 2 source for the city
	data.city = this.confirm(this.info[1].city, [
		this.info[2].City,
		this.info[3].geoplugin_city,
		this.info[4].geobytescity,
		this.info[5].city]);

	// Confirm 2 source for the zip code
	data.zipCode = this.confirm(this.info[1].zip, [this.info[5].postal]);

	// Confirm 2 source for the timezone
	data.timezone = this.confirm(this.info[1].timezone, [this.info[2].TimeZone_Name]);

	// Confirm 2 source for the ISP (ASN / AS number)
	data.asName = this.confirm(this.info[1].as, [this.info[5].org]);

	// Confirm 2 source for latitude
	data.latitude = this.confirm(this.info[1].lat + '', [
		this.info[2].Latitude,
		this.info[3].geoplugin_latitude,
		(this.info[4].geobyteslatitude ? this.info[4].geobyteslatitude.substr(0, 7) : ''),
		info5_lat_lon[0]]);

	// Confirm 2 source for longitude
	data.longitude = this.confirm(this.info[1].lon + '', [
		this.info[2].Longitude,
		this.info[3].geoplugin_longitude,
		(this.info[4].geobyteslongitude ? this.info[4].geobyteslongitude.substr(0, 7) : ''),
		info5_lat_lon[1]]);

	if (typeof(this.callback) === 'function') {
		this.callback(data);
	}
};

/** Confirm if the same value are find in second service.
 *
 * @memberOf cause.objects.connectionIp
 * @param {string} check - Value of service in priority 1
 * @param {array} inside - Equivalent value of other service
 */
cause.objects.connectionIp.prototype.confirm = function (check, inside) {
	if (inside.includes(check)) {
		return check;
	}

	return '';
};