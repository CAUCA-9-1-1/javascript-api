/** Class for helping when we want to use devExtreme 15.
 *
 * @constructor
 * @memberOf cause.objects
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme15 = function (callback) {
    this.name = 'devExtreme15';
    this.callback = callback;
    this.load();
};

cause.objects.devExtreme15.prototype.load = function () {
    if (!cause.helpIsOn) {
        this.loadCSS();
        this.loadMinimalJS();
    }
};

cause.objects.devExtreme15.prototype.complete = function () {
    this.callback();
};

cause.objects.devExtreme15.prototype.loadMinimalJS = function () {
    cause.include.js([
        cause.baseUrlPlugins + 'jQuery/jquery-2.2.4.min.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/jszip.min.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/knockout-3.4.0.js',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/globalize.min.js'
    ], this.complete.bind(this), cause.validate.confirmLoading);
};

cause.objects.devExtreme15.prototype.loadCSS = function () {
    var version = parseFloat(cause.version.devExtreme);
    var hasDesktop = document.querySelectorAll('link[href*=DesktopLayout]').length > 0 ? true : false;
    var files = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.html',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/css/dx.common.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/css/dx.spa.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.css',
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.css',
        cause.baseUrlPlugins + 'fontAwesome/' + cause.version.fontAwesome + '/css/font-awesome.min.css'
    ];

    if (!hasDesktop) {
        files.push(cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.html');
    }

    cause.include.css(files);
};
