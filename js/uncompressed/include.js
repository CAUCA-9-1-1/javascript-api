/** Class for helping with including file
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.include = function () {
    this.loadedJS = {};
    this.loadedCSS = {};

    /** Function for helping to swith version.
     *
     * @deprecated
     * @param {array|string} url - File URL or an array of URL
     */
    cause.loadCSS = function (url) {
        if (!cause.helpIsOn) {
            cause.log('Use cause.include.css() instead of cause.loadCSS()', 'warn');
        }

        cause.include.css(url);
    };

    /** Function for helping to swith version.
     *
     * @deprecated
     * @param {array|string} url - File URL or an array of URL
     */
    cause.loadJS = function (url, callback, error) {
        if (!cause.helpIsOn) {
            cause.log('Use cause.include.js() instead of cause.loadJS()', 'warn');
        }

        cause.include.js(url, callback, error);
    };
};

/** Show help when is cause.help('include') is call.
 *
 * @memberOf cause.objects.include
 */
cause.objects.include.prototype.help = function () {
    cause.log('Aide pour "cause.include":', 'help_title');
    cause.log("\t" +
        'cause.include.css(url) = Include CSS file on page' + "\n\t" +
        'cause.include.js(url, callback) = Include JS file on page', 'help');
};

/** Load a specific link file (CSS, HTML).
 *
 * @memberOf cause.objects.include
 * @param {string} url - File URL or an array of URL
 */
cause.objects.include.prototype.css = function (url, callback, error) {
    if (!url) {
        return null;
    }

    var time = (new Date()).getTime();

    url = (cause.is.array(url) ? url : [url]);

    this.loadedCSS[time] = {
        loaded: 0,
        error: 0,
        total: 0,
        finish: this.allUrlIsLoaded.bind(this, 'loadedCSS', time, callback, error)
    };

    for (var i=0, j=url.length; i<j; i++) {
        var attrs = (typeof(url[i]) != 'object' ? {href: url[i]} : url[i]);

        if (attrs.href.includes('.html') || attrs.href.includes('.css')) {
            this.loadedCSS[time].total++;

            attrs = cause.extend({}, {
                rel: (attrs.href.includes('.html') ? 'dx-template' : 'stylesheet'),
                type: (attrs.href.includes('.html') ? 'text/html' : 'text/css'),
                onerror: this.onError.bind(this, 'loadedCSS', time, attrs.href),
                onload: this.onLoad.bind(this, 'loadedCSS', time, attrs.href)
            }, attrs);

            document.getElementsByTagName('head')[0].appendChild(cause.html.createTagHTML('link', attrs));
        }
    }
};

/** Load a specific script file.
 *
 * @memberOf cause.objects.include
 * @param {array|string} url - File URL or an array of URL
 * @param {function} callback - Function to execute when file is loaded
 * @param {function} error - Function to execute when file can't be load
 */
cause.objects.include.prototype.js = function (url, callback, error) {
    if (!url) {
        return null;
    }

    var time = (new Date()).getTime();

    url = (cause.is.array(url) ? url : [url]);

    this.loadedJS[time] = {
        loaded: 0,
        error: 0,
        total: 0,
        finish: this.allUrlIsLoaded.bind(this, 'loadedJS', time, callback, error)
    };

    for (var i = 0, j = url.length; i < j; i++) {
        if (url[i].includes('.js') || url[i].includes('/jsapi') || url[i].includes('/api.') || url[i].includes('/api/')) {
            this.loadedJS[time].total++;

            var attrs = {
                src: url[i],
                type: 'text/javascript',
                onerror: this.onError.bind(this, 'loadedJS', time, url[i]),
                onload: this.onLoad.bind(this, 'loadedJS', time, url[i])
            };
            var tag = cause.html.createTagHTML('script', attrs);

            if (tag.readyState) {
                tag.onreadystatechange = this.onReadyStateChange.bind(this, tag, 'loadedJS', time, url[i]);
            }

            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    }
};

cause.objects.include.prototype.allUrlIsLoaded = function (loadedType, time, callback, error, url) {
    if (this[loadedType][time].loaded === this[loadedType][time].total) {
        if (loadedType === 'loadedCSS') {
            cause.log('Callback on CSS work!', 'warn');
        }

        if (this[loadedType][time].error > 0) {
            if (typeof(error) === 'function') {
                error();
            } else {
                cause.log('File "' + url + '" cannot be found!', 'error');
            }
        } else if (typeof(callback) === 'function') {
            callback(time);
        }
    }
};

cause.objects.include.prototype.onReadyStateChange = function (tag, loadedType, time, url) {
    if (tag.readyState === 'loaded' || tag.readyState === 'complete') {
        tag.onreadystatechange = null;

        this.loadedJS[time].loaded++;
        this.loadedJS[time].finish(url);
    }
};

cause.objects.include.prototype.onLoad = function (loadedType, time, url) {
    this[loadedType][time].loaded++;
    this[loadedType][time].finish(url);
};

cause.objects.include.prototype.onError = function (loadedType, time, url) {
    this[loadedType][time].loaded++;
    this[loadedType][time].error++;
    this[loadedType][time].finish(url);
};

/** @property {cause.objects.include} */
cause.include = new cause.objects.include();