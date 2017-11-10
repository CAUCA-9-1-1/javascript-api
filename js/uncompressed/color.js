/** Singleton for helping when we process to color
 *
 * @namespace
 * @memberOf cause
 */
cause.color = {
	/** Show help when is cause.help('color') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.color":', 'help_title');
		cause.log("\t" +
			'cause.color.hslToRgb() = Convert HSL vers RGB', 'help');
	},

	/** Convert HSL to RGB
	 *
	 * @param {integer} h
	 * @param {integer} s
	 * @param {integer} l
	 * @returns {array} RGB
	 */
	hslToRgb: function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            var hue2rgb = function (p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	}
};