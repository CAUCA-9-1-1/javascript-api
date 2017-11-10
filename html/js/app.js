var myApp = {
    start: function () {
        /** Initialize the application
         */
        this.app = cause.app({
            navigation: [{
                title: 'Accueil',
                onExecute: '#home',
                icon: 'home'
            },{
                title: 'Fonction',
                onExecute: '#function'
            },{
                title: 'Exemple',
                onExecute: '#test'
            },{
                title: 'Documentation',
                onExecute: '#docs'
            },{
                title: 'Standard',
                onExecute: '#standard'
            }],
            loaded: function () {
                cause.log('Start the application');
                cause.devExtreme.showLanguage();
            }
        });

        this.app.router.register(":view", {view: "home"});
        this.app.router.register(":view", {view: "devtools"});
        this.app.navigate();
    }
};

cause.on('ready', function () {
    /** Execute when everything is loaded on page
     */
    if (typeof(myApp.start) == 'function') {
        cause.locale('fr', myApp.start.bind(myApp));
    } else {
        cause.log('You need to create the myApp.start function in your app.js', 'error');
    }
});
