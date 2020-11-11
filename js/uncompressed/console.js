/** Class for helping with console.
 * This class detect if the developer console is open.
 * If the property "block" is true, we redirect the visitor to another page.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.console = function () {
    this.name = 'console';
    this.time = 2;
    this.open = false;
    this.block = false;
    this.nbTest = 0;
    this.interval = null;
    this.orientation = '';

    /* Execute the basic detection when loading page */
    if (typeof(document) === 'object') {
        cause.$(document).ready((function () {
            cause.on('resize', this.detect.bind(this));
            cause.on('devtoolschange', this.change.bind(this));

            this.detect();

            if (this.block && !cause.debug) {
                this.interval = setInterval(this.eachInterval.bind(this), this.time * 1000);
            }
        }).bind(this));
    }
};

/** Show help when is cause.help('console') is call.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.help = function () {
    cause.log('Aide pour "cause.console":', 'help_title');
    cause.log("\t" +
        'cause.console.detect() = Test à savoir si les outils de développement sont ouvert', 'help' );
};

/** Function executed on every interval to test if console is open.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.eachInterval = function () {
    if (!this.open || this.nbTest > 3) {
        this.nbTest = 0;
        this.detectWithProfile();
        this.detectWithPrintingImage();
    } else {
        this.nbTest++;
    }
};

/** Redirect the user if the developer tools is detected.
 *
 * @memberOf cause.objects.console
 * @param {boolean} enable - True if detected
 */
cause.objects.console.prototype.change = function (enable) {
    if (this.block && !cause.debug) {
        var url = (cause.baseUrl.indexOf('.') === 0 ? cause.baseUrl.substr(1) : cause.baseUrl);
        var isin_doc = location.pathname.includes(url + 'html/index.html');

        if (enable && !isin_doc) {
            location.href = cause.baseUrl + 'html/index.html#devtools';
        }
    }
};

/** Detect if a developer console is open.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detect = function () {
    this.detectWithSize();
    this.detectWithProfile();
    this.detectWithPrintingImage();

    return this.open;
};

/** Use the screen size to detect if a developer tools is open.
 * This detection work when developer tools is docked.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detectWithSize = function () {
    var widthThreshold = (window.outerWidth - window.innerWidth > 30);
    var heightThreshold = (window.outerHeight - window.innerHeight > 160);
    var orientation = (widthThreshold ? 'vertical' : (heightThreshold ? 'horizontal' : '' ));

    if (widthThreshold || heightThreshold) {
        if (!this.open || this.orientation !== orientation) {
            cause.listeners.execute('devtoolschange', true, orientation);
        }

        this.open = true;
    } else {
        if (this.open) {
            cause.listeners.execute('devtoolschange', false, '');
        }

        this.open = false;
    }

    this.orientation = orientation;
}

/** Use the console.profile() to detect if a developer console is open.
 * console.profiles has been remove from webkit, we can't use this method anymore.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detectWithProfile = function () {
    if (typeof(console.profiles) === 'object') {
        console.profile();
        console.profileEnd();

        if (this.block && !cause.debug && typeof(console.clear) === 'function') {
            console.clear();
        }

        if (console.profiles.length > 0 && !this.open) {
            cause.listeners.execute('devtoolschange', true, this.orientation || 'undock');
        } else if (console.profiles.length === 0 && this.open) {
            cause.listeners.execute('devtoolschange', false, '');
        }

        this.open = (console.profiles.length > 0);
    }
};

/** Use the print in console of image to detect if a developer console is open.
 * In chrome the developer tools always get the ID of print image.
 *
 * @memberOf cause.objects.console
 */
cause.objects.console.prototype.detectWithPrintingImage = function () {
    if (!this.image) {
        this.image = new Image();
        this.image.__defineGetter__('id', (function () {
            /* If this is execute, a developer tools is detected */
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            if (!this.open) {
                cause.listeners.execute('devtoolschange', true, this.orientation || 'undock');
            }

            this.orientation = (this.orientation || 'undock');
            this.timeout = null;
            this.open = true;
        }).bind(this));
    }

    this.timeout = setTimeout((function () {
        /* If timeout is executed, there is no developer tools detected */
        clearTimeout(this.timeout);

        if (this.open) {
            cause.listeners.execute('devtoolschange', false, '');
        }

        this.orientation = '';
        this.timeout = null;
        this.open = false;
    }).bind(this), (this.time * 800));

    if (this.block && !cause.debug && typeof(console.clear) === 'function') {
        console.clear();
    }
};

/** @property {cause.objects.console} */
cause.console = new cause.objects.console();