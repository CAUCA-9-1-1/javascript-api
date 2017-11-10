/** Class for helping when we process the operating system.
 * This class automatically add the OS name in class of tag "body".
 *
 * @constructor
 * @memberOf cause.objects
 * @property {string} agent - Original user agent in lower case
 * @property {boolean} iOS - True if web OS is iOS (iphone/ipad)
 * @property {boolean} os2 - True if web OS is os2
 * @property {boolean} qnx - True if web OS is qnx
 * @property {boolean} beOS - True if web OS is beOS
 * @property {boolean} unix - True if web OS is unix
 * @property {boolean} linux - True if web OS is linux
 * @property {boolean} macOS - True if web OS is macOS
 * @property {boolean} sunOS - True if web OS is sunOS
 * @property {boolean} android - True if web OS is android
 * @property {boolean} openBSD - True if web OS is openBSD
 * @property {boolean} windows - True if web OS is windows
 * @property {boolean} chromeOS - True if web OS is chromeOS
 * @property {boolean} blackberry - True if web OS is blackberry
 * @property {integer|float|string} version - OS version
 */
(function () {
    /** Set version of Windows
     */
    var versionMac = function () {
        if (this.agent.match(/mac os x/)) {
            var macVersion = this.agent.match(/mac os x ([0-9\_]+)/);

            this.version = 'Mac OS X' + (macVersion ? ' ' + macVersion[1].replace('_', '.') : '');
        } else if (this.agent.match(/macppc|macintel|mac_powerpc|macintosh/)) {
            this.version = 'Mac OS';
        }
    };

    var versionWindows = function () {
        this.version = 'Windows';

        var windows = [
            {name: 'Windows 10', pattern: /windows nt 10.0|windows 10.0/},
            {name: 'Windows 10 Technical Preview', pattern: /windows nt 6.4/},
            {name: 'Windows 8.1', pattern: /windows nt 6.3|windows 8.1/},
            {name: 'Windows 8', pattern: /windows nt 6.2|windows 8.0|wow64/},
            {name: 'Windows 7 / Server 2008 RC2', pattern: /windows nt 6.1|windows 7/},
            {name: 'Windows Vista', pattern: /windows nt 6.0/},
            {name: 'Windows Server 2003', pattern: /windows nt 5.2/},
            {name: 'Windows XP', pattern: /windows nt 5.1|windows xp/},
            {name: 'Windows 2000', pattern: /windows nt 5.0|windows 2000/},
            {name: 'Windows NT 4.0', pattern: /windows nt 4.0|winnt4.0|winnt|windows nt/},
            {name: 'Windows CE', pattern: /windows ce/},
            {name: 'Windows ME', pattern: /windows me/},
            {name: 'Windows 98', pattern: /windows 98|win98/},
            {name: 'Windows 95', pattern: /windows 95|win95|windows_95/},
            {name: 'Windows 3.11', pattern: /win16/}
        ];

        for (var i=0, j=windows.length; i<j; i++) {
            if (this.agent.match(windows[i].pattern)) {
                this.version = windows[i].name;
                break;
            }
        }
    };

    /** Set version of Windows Phone
     */
    var versionWindowsPhone = function () {
        this.version = 'Windows Phone';

        var windows = [
            {name: 'Windows Phone 10', pattern: /windows phone 10/},
            {name: 'Windows Phone 8.1', pattern: /windows phone 8.1/},
            {name: 'Windows Phone 8', pattern: /windows phone 8/},
            {name: 'Windows Phone 7.5', pattern: /windows phone os 7.5/},
            {name: 'Windows Phone 7', pattern: /windows phone os 7/},
        ];

        for (var i=0, j=windows.length; i<j; i++) {
            if (this.agent.match(windows[i].pattern)) {
                this.version = windows[i].name;
                break;
            }
        }
    };

    cause.objects.os = function () {
        this.name = 'os';
        this.agent = (typeof(navigator) == 'object' ? navigator.userAgent.toLowerCase() : '' );

        // OS
        this.iOS = false;
        this.os2 = false;
        this.qnx = false;
        this.beOS = false;
        this.unix = false;
        this.linux = false;
        this.macOS = false;
        this.sunOS = false;
        this.android = false;
        this.openBSD = false;
        this.windows = false;
        this.chromeOS = false;
        this.blackberry = false;
        this.version = 'unknown';

        this.detectOS();
        this.setBodyClass();
    };

    /** Show help when is cause.help('os') is call
     *
     * @memberOf cause.objects.os
     */
    cause.objects.os.prototype.help = function () {
        cause.log('Aide pour "cause.os":', 'help_title');
        cause.log("\t" +
            'cause.os.iOS = True when is iOS' + "\n\t" +
            'cause.os.mac = True when is Mac' + "\n\t" +
            'cause.os.unix = True when is Unix' + "\n\t" +
            'cause.os.linux = True when is Linux' + "\n\t" +
            'cause.os.android = True when is Android' + "\n\t" +
            'cause.os.windows = True when is Windows', 'help');
    };

    /** Start the OS detection
     *
     * @memberOf cause.objects.os
     */
    cause.objects.os.prototype.detectOS = function () {
        var os = [
            {variable: 'windows', pattern: /win/},
            {variable: 'macOS', pattern: /mac/},
            {variable: 'android', pattern: /android/},
            {variable: 'iOS', pattern: /iphone|ipad|ipod/},
            {variable: 'chromeOS', pattern: /cros/},
            {variable: 'linux', pattern: /linux|x11/},
            {variable: 'blackberry', pattern: /blackberry/},
            {variable: 'openBSD', pattern: /openbsd/},
            {variable: 'unix', pattern: /unix/},
            {variable: 'sunOS', pattern: /sunos/},
            {variable: 'beOS', pattern: /beos/},
            {variable: 'QNX', pattern: /qnx/},
            {variable: 'os2', pattern: /os\/2/}
        ];

        for (var i=0, j=os.length; i<j; i++) {
            if (this.agent.match(os[i].pattern)) {
                this[os[i].variable] = true;
                break;
            }
        }

        this.detectOSVersion();
    };

    cause.objects.os.prototype.detectOSVersion = function () {
        if (this.windows) {
            if (this.agent.match(/phone/)) {
                versionWindowsPhone.call(this);
            } else {
                versionWindows.call(this);
            }
        } else if (this.macOS) {
            versionMac.call(this);
        } else if (this.android) {
            var androidVersion = this.agent.match(/android ([0-9\.]+)/);

            this.version = 'Android' + (androidVersion ? ' ' + androidVersion[1] : '');
        } else if (this.ios) {
            var iOSVersion = this.agent.match(/os ([0-9\_]+)/);

            this.version = 'iOS' + (iOSVersion ? ' ' + iOSVersion[1].replace('_', '.') : '');
        }
    };

    /** Add class on body to use os with CSS.
     *
     * @memberOf cause.objects.os
     */
    cause.objects.os.prototype.setBodyClass = function () {
        if (typeof(document) == 'object') {
            /* On load we add class on body to use with CSS */
            cause.$(document).ready((function () {
                if (this.windows) {
                    cause.$('body').addClass('windows');
                } else if (this.macOS) {
                    cause.$('body').addClass('macos');
                } else if (this.android) {
                    cause.$('body').addClass('android');
                } else if (this.ios) {
                    cause.$('body').addClass('ios');
                } else if (this.chromeOS) {
                    cause.$('body').addClass('chromeos');
                } else if (this.linux) {
                    cause.$('body').addClass('linux');
                }
            }).bind(this));
        }
    };
}());

/** @property {cause.objects.os} */
cause.os = new cause.objects.os();