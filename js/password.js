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
    myApp.app.router.register(":view", { view: "password" });
    myApp.app.navigate();
};

myApp.password = function () {
    // Return the view object
    var _view = {
        viewShown: function() {
            var message = $('#errorMessage').html();

            if (message) {
                if (message.indexOf(' ') === -1) {
                    message = cause.localize(message);
                }

                _view.msgLogin(message);
            }

            $('form').submit(function (e) {
                var isValid = true;

                $('.dx-validator').each(function (index, element) {
                    isValid = (isValid ? $(element).dxValidator('instance').validate().isValid : false);
                });

                if (!isValid) {
                    e.preventDefault();
                }
            });
        },
        selectAction: function () {
            if (myApp.config && myApp.config.webroot) {
                return myApp.config.webroot + '?action=changePassword';
            } else {
                return './';
            }
        },
        comparisonTarget: function () {
            return $('input[name="password"]').val();
        },
        msgLogin: ko.observable('')
    };

    return _view;
};

cause.on('ready', function () {
    var language = (myApp.config ? (myApp.config.language || 'fr') : 'fr');

    cause.locale(language, myApp.start);
});
