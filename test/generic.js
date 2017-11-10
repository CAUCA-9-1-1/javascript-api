function causeTest(casper, test, nbSuccess) {
    this.test = test;
    this.total = nbSuccess;
    this.casper = casper;
    this.errors = [];
    this.successes = [];

    this.casper.options.viewportSize = {
        width: 1024,
        height: 768
    };
    this.casper.options.waitTimeout = 10000;

    this.casper.test.on('success', this.success.bind(this));
    this.casper.on('page.error', this.error.bind(this));
};

/** Check if cause is working
 */
causeTest.prototype.cause = function () {
    this.test.assertTitleMatches(/CAUSE.js - documentation/i);

    var results = [];
    var loaded = this.casper.evaluate(function () {
        return (typeof(window.cause) === 'object');
    });

    if (loaded) {
        /* Test all singleton */
        results.push(this.casper.evaluate(function () {
            var singletons = ['cookie', 'date', 'format', 'html', 'image', 'is', 'json', 'location', 'offline', 'storage', 'supported', 'validate', 'window'];

            for (var i=0, j=singletons.length; i<j; i++) {
                if (typeof(window.cause[singletons[i]]) !== 'object') {
                    return false;
                }
            }

            return true;
        }));
        /* Test all objects */
        results.push(this.casper.evaluate(function () {
            var objects = ['browser', 'connection', 'console', 'detect', 'devExtreme', 'include', 'labels', 'listeners', 'os', 'request'];

            for (var i=0, j=objects.length; i<j; i++) {
                if (typeof(window.cause[objects[i]]) !== 'object') {
                    return false;
                }
            }

            return true;
        }));
        /* Test all classes */
        results.push(this.casper.evaluate(function () {
            var classes = ['chart', 'editor', 'knockout', 'maps', 'player', 'printScreen', 'rabbitMQ', 'record', 'socket', 'sql', 'store', 'view', 'worker', 'wysiwyg'];

            for (var i=0, j=classes.length; i<j; i++) {
                if (typeof(window.cause.objects[classes[i]]) !== 'function') {
                    return false;
                }
            }

            return true;
        }));

        if (results.indexOf(false) > -1) {
            this.test.fail('CAUSE is loaded with error');
        } else {
            this.test.pass('CAUSE is loaded');
        }
    } else {
        this.test.fail('CAUSE is not defined');
    }
};

/** Check if DevExtreme is working
 *
 * @param {string} selector - Selector of element inside page
 */
causeTest.prototype.devExtreme = function (selector) {
    this.casper.waitForSelector(selector, (function() {
        var loaded = this.casper.evaluate(function () {
            return (typeof(window.DevExpress) === 'object');
        });

        if (loaded) {
            this.test.pass('DevExtreme is loaded');
            this.casper.captureSelector('test.png', 'html');
        } else {
            this.test.pass('DevExtreme is not defined');
        }
    }).bind(this));
};

/** Stock every error on executed page
 *
 * @param {string} msg - String of error message
 * @param {object} trace - Object of error tracing
 */
causeTest.prototype.error = function (msg) {
    this.casper.echo('Error: ' + msg, 'ERROR');
    this.errors.push(msg);
};

/** Finish the test
 */
causeTest.prototype.finish = function () {
    if (this.total === this.successes.length) {
        this.casper.echo('Everything look fine!', 'TRACE');
    } else {
        this.casper.echo('Problem detected!', 'ERROR');
    }

    // Finish all test
    this.test.done();
};

/** Check if server is UP
 *
 * @param {regex} pattern - RegExp pattern to validate the page title
 */
causeTest.prototype.server = function (pattern) {
    this.test.assertTitleMatches(pattern);
};

/** Stock every success test
 *
 * @param {object} success - Object for successful test
 */
causeTest.prototype.success = function (success) {
    this.successes.push(success);
};
