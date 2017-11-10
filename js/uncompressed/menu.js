/** Singleton for helping when we process to menu
 *
 * @namespace
 * @memberOf cause
 */
cause.menu = {
	/** Show help when is cause.help('menu') is call
	 */
	help: function () {
		cause.log('Aide pour "cause.menu":', 'help_title');
		cause.log("\t" +
			'cause.menu.logout() = Génère le menu pour la déconnexion', 'help');
	},

	/** Create the logout menu
	 */
	logout: function () {
        var html = $('<div>');

	    if (myApp.config && myApp.config.webroot) {
            $('<div>').attr({
                'class': 'fa fa-user-circle'
            }).appendTo(html);

            var menu = $('<div>').addClass('submenu').appendTo(html);

            if (myApp.config.user && myApp.config.user.first_name) {
                var name = myApp.config.user.first_name + ' ' + myApp.config.user.last_name;
                $('<a>').html(name.capitalize(true)).appendTo(menu);
            }

            $('<a>').attr({
                href: myApp.config.webroot + '?action=changePassword'
            }).html(cause.localize('changePassword')).appendTo(menu);

            $('<a>').attr({
                href: myApp.config.webroot + '?action=logout'
            }).html(cause.localize('logout')).appendTo(menu);
        } else {
            $('<a>').attr({
                href: './login/?logout'
            }).html(cause.localize('logout')).appendTo(html);
        }

        return html.html();
	}
};