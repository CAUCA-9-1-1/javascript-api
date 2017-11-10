/** Add some message on developer console.
 *
 * @memberOf cause
 * @function
 * @param {string} msg - message to show and/or log
 * @param {string} type - predefined font style
 */
cause.log = (function () {
    var sendLogBy = '';

    /** Show a message inside the cause-console element.
     *
     * @param {string} msg - message to show and/or log
     */
    var logConsoleCause = function (msg) {
        if (cause.$('#cause-console').length === 0) {
            return null;
        }

        var html = '';

        if (typeof(msg) === 'string') {
            html = msg.replaceAll("\n", '<br />').replaceAll("\t", ' &nbsp; &nbsp;');
        } else {
            html += ' Object [<br />';

            for (var i in msg) {
                if (msg.hasOwnProperty(i)) {
                    html += '&nbsp; &nbsp;' + i + ': ' + (typeof(msg[i]) === 'object' ? 'object' : (typeof(msg[i]) === 'function' ? 'function' : msg[i])) + '<br />';
                }
            }

            html += ']';
        }

        cause.$('#cause-console').append(cause.html.parse('<div>' + html + '</div>'));
    };

    /** Show message inside the browser console.
     *
     * @param {string} msg - message to show and/or log
     * @param {string} type - predefined font style
     */
    var logConsoleNative = function (msg, type) {
        if (console && console.log) {
            if (type === 'error') {
                console[(console.error ? 'error' : 'log')]('%c' + msg, 'font-size:1.4em;color:#F5223B');
            } else if (type === 'warn') {
                console[(console.warn ? 'warn' : 'log')]('%c' + msg, 'color:#cc6600;');
            } else if (type === 'help_title') {
                console.log('%c' + msg, 'font-size:1.3em;color:#0306A6;');
            } else if (type === 'help') {
                console.log('%c' + msg + "\n\n", 'color:#3376F2;');
            } else {
                console[(console.warn ? 'warn' : 'log')](msg);
            }
        }
    };

    /** Send message to a monitor service.
     *
     * @param {string} msg - message to show and/or log
     * @param {string} type - predefined font style
     * @todo Send error on server by socket or ajax
     */
    var logSend = function (msg, type) {
        var skip = ['help', 'help_title'];

        if (cause.debug || skip.includes(type)) {
            return null;
        }

        var error = {
            jserror: encodeURIComponent(msg),
            jstype: type
        };

        if (sendLogBy === 'socket') {
            var ws = new this.socket({
                host: 'localhost:79',
                onConnect: function () {
                }
            });
            ws.send(error);
        } else if (sendLogBy === 'ajax') {
            cause.send({
                url: 'http://yourserver.com/',
                data: error
            });
        }
    };

    return function (msg, type) {
        if (msg) {
            logConsoleNative(msg, type);
            logConsoleCause(msg);
            logSend(msg);
        }
    }
}());