/** Singleton for helping when we process to password
 *
 * @namespace
 * @memberOf cause
 */
cause.password = {
    numbers: '0123456789',
    //specials: '!@#$%^&*()_+{}:"<>?\|[];\',./`~',
    specials: '!@#$%^&*()_+{}:"<>?\|[];\',./`~',
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

	/** Show help when is cause.help('password') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.password":', 'help_title');
		cause.log("\t" +
			'cause.password.generate() = Génère un mot de passe' + "\n\t" +
			'cause.password.quality(password) = Retourne la qualité du mot de passe', 'help');
	},

	/** Return a password
	 *
	 * @returns {string} Generated password
	 */
	generate: function () {
		var password = '';

		password += this.specials.pick(1);
        password += this.lowercase.pick(1);
        password += this.uppercase.pick(1);
        password += (this.specials + this.lowercase + this.uppercase + this.numbers).pick(1);

		return password.shuffle();
	},

	/** Test the quality of password
	 *
	 * @param {string} password
	 * @returns {integer} Quality of password, higher is better
	 */
	quality: function (password) {
		if (!password) {
			return 0;
		}

        var score = 0;
        var uniqueLetters = new Object();

        for (var i=0; i<password.length; i++) {
            uniqueLetters[password[i]] = (uniqueLetters[password[i]] || 0) + 1;
            score += 5.0 / uniqueLetters[password[i]];
        }

		var regexSpecial = new RegExp('[' + this.specials.replace(']', '\\]') + ']');
        var checks = {
			digits: /\d/.test(password),
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
			specials: regexSpecial.test(password),
			nonWords: /\W/.test(password)
        };

        for (var i in checks) {
            score += (checks[i] == true ? 10 : 0);
        }

        return parseInt(score);
	}
};