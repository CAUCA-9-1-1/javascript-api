/** Class for helping to send ajax request.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.request = function () {
    /** Shortcut for "cause.objects.request.send"
     *
     * @param {object} params - Object to modify some default value
     * @param {string} params.url
     * @param {string} params.method
     * @param {object} params.data
     * @param {function} params.error
     * @param {function} params.success
     */
	cause.ajax = this.send.bind(this);
};

/** Show help when is cause.help('request') is call.
 *
 * @memberOf cause.objects.request
 */
cause.objects.request.prototype.help = function () {
    cause.log('Aide pour "cause.request":', 'help_title');
    cause.log("\t" +
        'cause.request.send = cause.ajax;' + "\n\n\t" +
        'cause.ajax() = Envoie une requête javascript sur un URL (même paramètre que jQuery)', 'help');
};

/** Create the request without jQuery.
 * This function is not completely functionnal.
 *
 * @memberOf cause.objects.request
 * @param {object} settings - Parameters send to request
 * @param {object} params - Original parameters
 */
cause.objects.request.prototype.createXhr = function (settings, params) {
    var xhr = settings.xhr();
    var data = '';

    xhr.addEventListener('load', (function (xhr, params, e) {
        if (params.dataType == 'blob') {
            this.onSuccess(params, e.target.response, 'success', xhr);
        } else if (params.dataType == 'arraybuffer') {
            this.onSuccess(params, new Uint8Array(e.target.response), 'success', xhr);
        } else {
            this.onSuccess(params, cause.json.parse(e.target.responseText), 'success', xhr);
        }
    }).bind(this, xhr, params));
    xhr.addEventListener('error', (function (xhr, params) {
        this.onError(params, xhr, 'error', '');
    }).bind(this, xhr, params));
    xhr.addEventListener('abort', (function (xhr, params) {
        this.onError(params, xhr, 'abort', '');
    }).bind(this, xhr, params));
    xhr.addEventListener('loadend', (function (xhr, params) {
        this.onComplete(params, xhr, 'success');
    }).bind(this, xhr, params));

    xhr.open(settings.method, settings.url, true);

    if (settings.method === 'POST') {
        data = this.generateQuery(settings.data);
    } else {
        settings.url += (settings.data ? '?' + this.generateQuery(settings.data) : '');
    }

    if (settings.data) {
        if (settings.dataType === 'json') {
            xhr.setRequestHeader('Content-type', 'application/json');
        } else {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
    }

    if (settings.dataType === 'blob' || settings.dataType === 'arraybuffer') {
        xhr.responseType = settings.dataType;
    }

    xhr.send(data);
};

/** Generate the string to pass all value with the request.
 *
 * @memberOf cause.objects.request
 * @param {object} data - Object with every data we like to send
 * @returns {string} Query string to pass
 */
cause.objects.request.prototype.generateQuery = function (data) {
    var str = [];

    for (var key in data) {
        if (typeof(data[key]) === 'object') {
            str.push(key + '=' + JSON.stringify(data[key]));
        } else {
            str.push(key + '=' + data[key]);
        }
    }

    return str.join('&');
};

/** Event executed when the request is completely send.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} xhr - Object of request
 * @param {string} status - Status of header request
 */
cause.objects.request.prototype.onComplete = function (params, xhr, status) {
    if (typeof(params.complete) === 'function') {
        params.complete(data, status, xhr);
    }
};

/** Event executed when the request is successfully send.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {mixed} data - Data receive
 * @param {string} status - Status of header request
 * @param {object} xhr - Object of request
 */
cause.objects.request.prototype.onSuccess = function (params, data, status, xhr) {
    var json_is_detected = (typeof(data) == 'object' && typeof(data.success) == 'boolean');

    if (params.dataType === 'json' || json_is_detected) {
        if (typeof(data.login) != 'undefined' && !data.login && myApp.config) {
            location.href = (myApp.config.webroot ? '/?action=logout' : './login/?logout');
        }
        if (data.error) {
            cause.log(data.error, 'error');
        }
    }

    if (typeof(params.success) === 'function') {
        params.success(data, status, xhr);
    }
};

/** Event executed when the request is successfully send.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} xhr - Object of request
 * @param {string} status - Status of header request
 * @param {object} error - Error type
 */
cause.objects.request.prototype.onError = function (params, xhr, status, error) {
    if (typeof(params.error) === 'function') {
        params.error(xhr, status, error);
    } else {
        cause.log('Request:' + "\n" +
            'we can\'t complete this request' + "\n" +
            'url : ' + (params.url ? params.url : './ajax/') + "\n" +
            'status : ' + status, 'error');
    }
};

/** Event executed when upload progressing.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} e - Event object
 */
cause.objects.request.prototype.onProgressUpload = function (params, e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total;

        if (typeof(params.progress) === 'function') {
            params.progress(e, percentComplete);
        }
    }
};

/** Event executed when download progressing.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 * @param {object} e - Event object
 */
cause.objects.request.prototype.onProgressDownload = function (params, e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total;

        if (typeof(params.progress) === 'function') {
            params.progress(e, percentComplete);
        }
    }
};

/** Event executed when ajax setup the request.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Data sent
 */
cause.objects.request.prototype.setupXhr = function (params) {
    var xhr = (typeof($) === 'function' ? $.ajaxSettings.xhr() : new XMLHttpRequest());

    /* Upload progress */
    xhr.upload.addEventListener('progress', this.onProgressUpload.bind(this, params), false);

    /* Download progress */
    xhr.addEventListener('progress', this.onProgressDownload.bind(this, params), false);

    return xhr;
};

/** Call many URL and execute one callback when they are finished.
 *
 * @memberOf cause.objects.request
 * @param {string} urls - Array with all URL
 * @param {function} callback - Function when everything is loaded
 */
cause.objects.request.prototype.many = function (urls, callback) {
    var requests = [];

    for (var i = 0, j = urls.length; i < j; i++) {
        requests.push($.get(urls[i]));
    }

    $.when.apply($, requests).done(function () {
        callback(arguments);
    }).fail(function () {
        callback(arguments);
    });
};

/** Send ajax request.
 *
 * @memberOf cause.objects.request
 * @param {object} params - Object to modify some default value
 * @param {string} params.url
 * @param {string} params.method
 * @param {object} params.data
 * @param {object} params.headers
 * @param {function} params.error
 * @param {function} params.success
 */
cause.objects.request.prototype.send = function (params) {
    if (typeof(params) === 'object') {
        var settings = this.setSettings(params);

        if (typeof($) === 'function' && settings.dataType != 'blob' && settings.dataType != 'arraybuffer') {
            $.ajax(settings);
        } else {
            this.createXhr(settings, params);
        }
    }
};

cause.objects.request.prototype.setSettings = function (params) {
    var basicUrl = (myApp.config && myApp.config.webroot ? myApp.config.webroot : './') + 'ajax/';
    var settings = cause.extend({}, {
        url: basicUrl,
        method: 'POST',
        data: null,
        dataType: 'json'
    }, params);

    settings.complete = this.onComplete.bind(this, params);
    settings.error = this.onError.bind(this, params);
    settings.success = this.onSuccess.bind(this, params);
    settings.xhr = this.setupXhr.bind(this, params);
    settings.headers = this.setHeaders(settings);

    if (settings.data) {
        for (var key in settings.data) {
            if (settings.data[key] !== null && typeof(settings.data[key]) == 'object') {
                settings.data[key] = JSON.stringify(settings.data[key]);
            }
        }
    }

    return settings;
};

cause.objects.request.prototype.setHeaders = function (settings) {
    var headers = cause.extend({}, settings.headers || {});

    if (!settings.headers && myApp.config && myApp.config.webservice) {
        if (myApp.config.webservice.access_token) {
            headers['Authorization'] = 'Token ' + myApp.config.webservice.access_token;
        } else if (myApp.config.webservice.token) {
            headers['Authorization'] = 'Token ' + myApp.config.webservice.token;
        } else if (myApp.config.webservice.key) {
            headers['Authorization'] = 'Key ' + myApp.config.webservice.key;
        }
    }

    return headers;
};

/** @property {cause.objects.request} */
cause.request = new cause.objects.request();