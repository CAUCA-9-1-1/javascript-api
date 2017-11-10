if (!window.myApp) {
    window.myApp = {
        config: {
            language: 'fr'
        }
    };
}

myApp.start = function() {
    /** Initialize the application
    **/
    cause.log('Start the application');
    cause.labels.load();

    myApp.app = cause.app({
        navigation: [{
            title: cause.localize('home'),
            onExecute: './',
            icon: 'home'
        }]
    });
    myApp.app.router.register(":view", { view: "login" });
    myApp.app.navigate();
};

myApp.login = function () {
    // Return the view object
    var _view = {
        viewShown: function() {
            $('#menutop #logout').hide();

            var message = $('#errorMessage').html();

            if (message) {
                if (message.indexOf(' ') === -1) {
                    message = cause.localize(message);
                }

                _view.msgLogin(message);
            }
        },
        selectAction: function () {
            if (myApp.config && myApp.config.webroot) {
                return myApp.config.webroot;
            } else {
                return './';
            }
        },
        msgLogin: ko.observable('')
    };

    return _view;
};

cause.on('ready', function () {
    var language = (myApp.config ? (myApp.config.language || 'fr') : 'fr');

    cause.locale(language, myApp.start);
});
