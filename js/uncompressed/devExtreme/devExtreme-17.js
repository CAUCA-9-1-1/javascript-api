/** Class for helping when we want to use devExtreme 17.
 *
 * @constructor
 * @memberOf cause.objects
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme17 = function (callback) {
    this.name = 'devExtreme17';
    this.callback = callback;
    this.load();
};

cause.objects.devExtreme17.prototype.load = function () {
    if (!cause.helpIsOn) {
        this.loadCSS();
        this.loadMinimalJS();
    }
};

cause.objects.devExtreme17.prototype.complete = function () {
    this.callback();
};

cause.objects.devExtreme17.prototype.loadMinimalJS = function () {
    cause.include.js([
        cause.baseUrlPlugins + 'jQuery/jquery-' + cause.version.jQuery + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/jszip' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/knockout-' + cause.version.knockout + (myApp.config && myApp.config.isdev ? '.debug' : '') + '.js',
        cause.baseUrlPlugins + 'cldrjs/' + cause.version.cldrjs + '/cldr.js'
    ], (function () {
        cause.include.js([
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/cldr/event' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/cldr/supplemental' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
        ], (function () {
            cause.include.js([
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/message' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js',
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/number' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
            ], (function () {
                cause.include.js([
                    cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize/date' + (myApp.config && myApp.config.isdev ? '' : '.min') + '.js'
                ], this.complete.bind(this), cause.validate.confirmLoading);
            }).bind(this), cause.validate.confirmLoading);
        }).bind(this), cause.validate.confirmLoading);
    }).bind(this), cause.validate.confirmLoading);
};

cause.objects.devExtreme17.prototype.loadCSS = function () {
    var hasMobile = document.querySelectorAll('link[href*=MobileLayout]').length > 0 ? true : false;
    var hasDesktop = document.querySelectorAll('link[href*=DesktopLayout]').length > 0 ? true : false;
    var files = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.css',
        cause.baseUrlPlugins + 'fontAwesome/' + cause.version.fontAwesome + '/css/font-awesome.min.css'
    ];

    if (hasMobile) {
        var url = document.querySelectorAll('link[href*=MobileLayout]')[0].href;
        url = url.replace('.html', '.css');
        url = url.replace(location.origin, '');

        files.push(url);
    }
    if (!hasDesktop) {
        files.push(cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.html');
    }

    cause.include.css(files);
};
