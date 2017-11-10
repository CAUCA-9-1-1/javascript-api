/** Class for helping when we process the browser.
 * This class automatically add the browser name in class of tag "body".
 *
 * @constructor
 * @memberOf cause.objects
 * @property {string} agent - Original user agent in lower case
 * @property {boolean} gecko - True if web engine is gecko (firefox)
 * @property {boolean} blink - True if web engine is blink (Chrome, Vilvaldi, Opera). Blink is derived of webkit.
 * @property {boolean} webkit - True if web engine is webkit (Safari)
 * @property {boolean} trident - True if web engine is trident (MSIE)
 * @property {boolean} edgeHTML - True if web engine is edgeHTML (Edge). EdgeHTML is derived of trident.
 * @property {boolean} presto - True if web engine is presto (Old opera). Presto is derived of trident.
 * @property {integer|float|string} engineVersion - Engine version
 * @property {boolean} edge - True if web browser is edge
 * @property {boolean} msie - True if web browser is msie
 * @property {boolean} opera - True if web browser is opera
 * @property {boolean} chrome - True if web browser is chrome
 * @property {boolean} safari - True if web browser is safari
 * @property {boolean} firefox - True if web browser is firefox
 * @property {boolean} vivaldi - True if web browser is vivaldi
 * @property {integer} major - Browser major version
 * @property {integer|float|string} version - Browser version
 */
cause.objects.browser = function () {
    this.name = 'browser';
    this.agent = (typeof(navigator) === 'object' ? navigator.userAgent.toLowerCase() : '' );
    this.pattern = {};

    /* Web engine */
    this.gecko = false;
    this.blink = false;
    this.webkit = false;
    this.trident = false;
    this.edgeHTML = false;
    this.presto = false;
    this.engineVersion = 'unknown';

    /* Browser */
    this.edge = false;
    this.msie = false;
    this.opera = false;
    this.chrome = false;
    this.safari = false;
    this.firefox = false;
    this.vivaldi = false;
    this.major = 'unknown';
    this.version = 'unknown';

    /* Detect */
    this.detectBrowser();

    if (typeof(document) === 'object') {
        cause.$(document).ready((function () {
            this.setBodyClassBrowser();
            this.setBodyClassEngine();
        }).bind(this));
    }
};

/** Show help when is cause.help('browser') is call.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.help = function () {
    cause.log('Aide pour "cause.browser":', 'help_title');
    cause.log("\t" +
        'cause.browser.edge = True when is Microsoft Edge' + "\n\t" +
        'cause.browser.msie = True when is Microsoft Internet Explorer' + "\n\t" +
        'cause.browser.opera = True when is Opera' + "\n\t" +
        'cause.browser.chrome = True when is Chrome' + "\n\t" +
        'cause.browser.safari = True when is Safari' + "\n\t" +
        'cause.browser.firefox = True when is Firefox' + "\n\t" +
        'cause.browser.vivaldi = True when is Vivaldi', 'help');
};

/** Start the browser detection.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectBrowser = function () {
    this.pattern = {};

    if (this.agent.match(/webkit/)) {					// Webkit
        this.detectWebkitBrowser();
    } else if (this.agent.match(/trident|msie/)) {		// Internet Explorer
        this.detectTridentBrowser();
    } else if (this.agent.match(/gecko/)) {			    // Gecko
        this.detectGeckoBrowser();
    } else if (this.agent.match(/presto/)) {		   // Presto
        this.pattern.engine = /presto\/([0-9\.]+)/;
        this.pattern.browser = /version\/([0-9\.]+)/;
        this.presto = true;
        this.opera = true;
    }

    this.setVersion();
};

/** Gecko is mainly used on "Firefox".
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectGeckoBrowser = function () {
    this.pattern.engine = /rv:([0-9\.]+)/;
    this.pattern.browser = /gecko\/([0-9\.]+)/;
    this.gecko = true;

    if (this.agent.match(/firefox/)) {				// Firefox
        this.pattern.browser = /firefox\/([0-9\.]+)/;
        this.firefox = true;
    }
};

/** Trident is mainly used on "MSIE".
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectTridentBrowser = function () {
    this.pattern.engine = /trident\/([0-9\.]+)/;
    this.pattern.browser = /msie ([0-9\.]+)/;
    this.trident = true;
    this.msie = true;

    if (this.agent.match(/rv:/)) {					// Internet Explorer 11 et +
        this.pattern.browser = /rv:([0-9\.]+)/;
    } else if (!this.agent.match(/msie/)) {          // No "rv:" and no "msie", we assume that it's IE 11
        this.pattern.browser = '';
        this.major = 11;
        this.version = '11.0';
    }
};

/** The web engine "webkit" is used on many browser (Edge, Safari).
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.detectWebkitBrowser = function () {
    this.pattern.engine = /applewebkit\/([0-9\.]+)/;
    this.pattern.browser = /webkit\/([0-9\.]+)/;
    this.webkit = true;

    if (this.agent.match(/edge/)) {                  // Microsoft Edge
        this.pattern.browser = /edge\/([0-9\.]+)/;
        this.edgeHTML = true;
        this.edge = true;
    } else if (this.agent.match(/chrome/)) {
        // The web engine "blink" is used on many browser (Chrome, Opera, Vivaldi)
        this.blink = true;

        if (this.agent.match(/vivaldi/)) {			// Vivaldi
            this.pattern.browser = /vivaldi\/([0-9\.]+)/;
            this.vivaldi = true;
        } else if (this.agent.match(/opr/)) {		// Opera
            this.pattern.browser = /opr\/([0-9\.]+)/;
            this.opera = true;
        } else if (this.agent.match(/crios/)) {      // Chrome on iOS
            this.pattern.browser = /crios\/([0-9\.]+)/;
            this.chrome = true;
        } else {									// Chrome
            this.pattern.browser = /chrom(e|ium)\/([0-9\.]+)/;
            this.chrome = true;
        }
    } else if (this.agent.match(/safari/)) {	   	// Safari
        this.pattern.browser = /version\/([0-9\.]+)/;
        this.safari = true;
    }
};

/** Set version with detected pattern.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.setVersion = function () {
    if (this.pattern.browser) {
        var browserVersion = this.agent.match(this.pattern.browser);

        this.major = ( browserVersion ? (browserVersion[2] ? parseInt(browserVersion[2], 10) : parseInt(browserVersion[1], 10)) : 'unknown' );
        this.version = ( browserVersion ? (browserVersion[2] ? browserVersion[2] : browserVersion[1]) : 'unknown' );
    }

    if (this.pattern.engine) {
        var engineVersion = this.agent.match(this.pattern.engine);

        this.engineVersion = (engineVersion ? parseFloat(engineVersion[1]) : 'unknown');
    }
};

/** Add class on body to use browser with CSS.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.setBodyClassBrowser = function () {
    if (this.chrome) {
        cause.$('body').addClass('chrome');
    } else if (this.edge) {
        cause.$('body').addClass('edge');
    } else if (this.firefox) {
        cause.$('body').addClass('firefox');
    } else if (this.opera) {
        cause.$('body').addClass('opera');
    } else if (this.safari) {
        cause.$('body').addClass('safari');
    } else if (this.vivaldi) {
        cause.$('body').addClass('vivaldi');
    }
};

/** Add class on body to use engine with CSS.
 *
 * @memberOf cause.objects.browser
 */
cause.objects.browser.prototype.setBodyClassEngine = function () {
    if (this.blink) {
        cause.$('body').addClass('webkit');
        cause.$('body').addClass('blink');
    } else if (this.edgeHTML) {
        cause.$('body').addClass('webkit');
        cause.$('body').addClass('edgeHTML');
    } else if (this.webkit) {
        cause.$('body').addClass('webkit');
    } else if (this.gekco) {
        cause.$('body').addClass('gekco');
    } else if (this.trident) {
        cause.$('body').addClass('trident');
    }
};

/** @property {cause.objects.browser} */
cause.browser = new cause.objects.browser();