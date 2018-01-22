/** Class for helping when we want to use devExtreme.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.devExtreme = function () {
    this.name = 'devExtreme';
    this.width = 0;

    /* Keep this function to keep fonctionnal with first version */
    cause.app = this.app.bind(this);
    cause.loadAPP = this.loadAPP.bind(this);
};

/** Create a new basic application.
 *
 * @memberOf cause.objects.devExtreme
 * @param {object} config - Object with every parameters we need.
 * All parameters for DevExpress.framework.html.HtmlApplication are valid.
 * @param {string} config.device - By default we force "desktop", this way always had the sample theme color.
 * @param {string} config.language - By default we use "fr".
 * @param {string} config.theme - By default we use "generic.light".
 * @param {function} config.load - Function to execute when APP is loaded.
 */
cause.objects.devExtreme.prototype.app = function (config) {
    if (!cause.helpIsOn) {
        cause.log('The application is started');

        DevExpress.ui.themes.current(config.theme ? config.theme : 'generic.light');

        if (cause.$('body').width() >= 1000) {
            DevExpress.devices.current(config.device ? config.device : 'desktop');
        }

        config = cause.extend({}, {
            mode: 'webSite',
            language: (myApp.config ? (myApp.config.language || 'fr') : 'fr'),
            namespace: myApp,    // The application variable absolutely need to be "myApp"
            animationSet: DevExpress.framework.html.animationSets['default'],
            layoutSet: DevExpress.framework.html.layoutSets[(cause.$('body').width() < 1000 ? 'slideout' : 'desktop')],
            logout: cause.localize('logout'),
            navigation: [{
                title: cause.localize('home'),
                onExecute: '#home',
                icon: 'home'
            }]
        }, config);

        if (typeof(config.loaded) === 'function') {
            setTimeout(config.loaded, 1000);
        }

        var app = new DevExpress.framework.html.HtmlApplication(config);
        app.on('viewRendered', this.renderAPP.bind(this, config));

        return app;
    }
};

/** Execute when application is rendered.
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} config - Application configuration
 */
cause.objects.devExtreme.prototype.renderAPP = function (config, e) {
    if (cause.$('body').width() < 1000) {
        $('.dx-content').dxScrollView();
    }

    $('#navBar .dx-item').each((function (menus, nb, element) {
        var title = $(element).html().stripTags().trim();

        this.createSubMenu(menus, title, $('#navBar').parent(), element);
    }).bind(this, config.navigation));
    $('.dx-slideout-menu .dx-item').each((function (menus, nb, element) {
        var title = $(element).html().stripTags().trim();

        this.createSubMenu(menus, title, $('.dx-slideout-menu').parent(), element);
    }).bind(this, config.navigation));
};

/** Create a navbar for navigation with submenu element
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} menus - Application navigation configuration
 * @params {string} title - Text of menu
 * @params {html} container - HTML where we include the submenu
 * @params {html} element - HTML where we show and hide the submenu
 */
cause.objects.devExtreme.prototype.createSubMenu = function (menus, title, container, element) {
    for (var i=0, j=menus.length; i<j; i++) {
        if (menus[i].title == title) {
            if (typeof(menus[i].submenu) == 'object') {
                var uniqueId = cause.unique() + '-submenu';
                var isSlideout = (container.parents('.dx-slideout').length ? true : false);
                var type = (isSlideout ? 'dxList' : (menus[i].submenuType ? menus[i].submenuType : 'dxList'));

                container = (isSlideout ? $('.dx-item-content', element) : container);

                $('<div>').attr('data-submenu-type', type).css({
                    width: (isSlideout ? '100%' : (type == 'dxList' ? $(element).outerWidth() : 'auto')),
                    'margin-left': (isSlideout ? 0 : (type == 'dxList' ? $(element).position().left - 1 : 'auto'))
                }).attr('id', uniqueId).html('<div class="element" />').appendTo(container);

                $('#' + uniqueId + ' .element')[type]({
                    items: menus[i].submenu,
                    height: 'auto',
                    itemTemplate: (function (container, itemData, itemIndex, itemElement) {
                        var title = itemData.title || itemData.text;

                        if (!itemData.submenu) {
                            return title;
                        }

                        $('<div>').html(title).appendTo(itemElement);
                        $('<div>').addClass('subList').html('<div />').appendTo(itemElement);

                        $(itemElement).hover(function (e) {
                            $('.subList', this).css({
                                'opacity': 1,
                                'max-height': '5000px'
                            });
                        }, function (e) {
                            $('.subList', this).css({
                                'opacity': 0,
                                'max-height': 0
                            });
                        });

                        $('.subList div', itemElement)[type]({
                            items: itemData.submenu,
                            height: 'auto',
                            onItemClick: (function (container, e) {
                                this.closeSubMenu(container);

                                location.href = e.itemData.onExecute;
                            }).bind(this, container)
                        });
                    }).bind(this, container),
                    onItemClick: (function (container, e) {
                        this.closeSubMenu(container);

                        location.href = e.itemData.onExecute;
                    }).bind(this, container)
                });

                $('#' + uniqueId).mouseleave((function(container) {
                    this.closeSubMenu(container);
                }).bind(this, container));

                $(element).hover((function (container, uniqueId) {
                    this.closeSubMenu(container);
                    $(uniqueId).css({
                        'opacity': 1,
                        'max-height': '5000px'
                    });
                }).bind(this, container, '#' + uniqueId));
            } else {
                $(element).hover((function (container) {
                    this.closeSubMenu(container);
                }).bind(this, container));
            }
        }
    }
};

cause.objects.devExtreme.prototype.closeSubMenu = function (container) {
    $(container).find("[id^='cause-']").each(function(nb, element) {
        $(element).css({
            'opacity': 0,
            'max-height': 0
        });
    });
};

/** Load every needed by an application.
 * The basic array is ['js/app.js', 'js/home.js', 'views/home.html']
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme.prototype.loadAPP = function (files) {
    if (!cause.helpIsOn) {
        var devExtreme = 'devExtreme' + parseInt(cause.version.devExtreme);
        new cause.objects[devExtreme](this.loadDevExtreme.bind(this, files));

        if (document) {
            this.width = (document.body.clientWidth || document.documentElement.clientWidth || window.innerWidth);

            cause.on('resize', (function () {
                var width = (document.body.clientWidth || document.documentElement.clientWidth || window.innerWidth);

                if ((this.width > 1000 && width < 1000) || (this.width < 1000 && width > 1000)) {
                    location.reload();
                }

                this.width = width;
            }).bind(this));
        }
    }
};

/** Load DevExtreme.
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme.prototype.loadDevExtreme = function (files) {
    cause.log('jQuery is automatically loaded');

    var oldVersion = ['15.2.10', '16.1.7', '16.1.8'];
    var nbLabels = (files.containIndexOf('labels.js') > -1 ? files.containIndexOf('labels.js') : files.containIndexOf('label.js'));
    var toLoad = [
        cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/dx.all' + (myApp.config && myApp.config.isdev ? '.debug' : '') + '.js'
    ];

    if (nbLabels > -1) {
        toLoad.push(files[nbLabels]);
        files.splice(nbLabels, 1);
    }

    cause.include.js(toLoad, (function (files) {
        /* When we have devExtreme, we can loaded the layouts */
        cause.log('devExtreme is automatically loaded');

        cause.include.js([
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/js/localization/dx.' + (oldVersion.includes(cause.version.devExtreme) ? 'all' : 'messages') + '.fr.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Simple/SimpleLayout.js',
            cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Desktop/DesktopLayout.js'
        ], (function (files) {
            cause.include.js([
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/SlideOut/SlideOutLayout.js',
                cause.baseUrlPlugins + 'devExtreme/' + cause.version.devExtreme + '/layouts/Popup/PopupLayout.js'
            ], (function (files) {
                /* And we finish the application files */
                cause.log('devExtreme layouts is automatically loaded');
                cause.dxDataGrid = new cause.objects.dxDataGrid();
                cause.dxMultiLine = new cause.objects.dxMultiLine();
                cause.dxMultiLang = new cause.objects.dxMultiLang();
                cause.dxSortable = new cause.objects.dxSortable();

                this.loadJsFiles(files);
            }).bind(this, files), cause.validate.confirmLoading);
        }).bind(this, files), cause.validate.confirmLoading);
    }).bind(this, files), cause.validate.confirmLoading);
};

/** Load application file.
 *
 * @memberOf cause.objects.devExtreme
 * @params {array} files - Every URL of application file
 */
cause.objects.devExtreme.prototype.loadJsFiles = function (files) {
    cause.include.css(files);

    /* We upload app.js first if this file is in the list */
    var nbApp = files.containIndexOf('app.js');

    if (nbApp > -1) {
        cause.include.js(files[nbApp], (function (files, nbApp) {
            files.splice(nbApp, 1);

            cause.include.js(files, (function () {
                cause.log('The application is loaded');
                cause.labels.load();
                cause.listeners.execute('ready');
            }).bind(this, files), function () {
                cause.alert(cause.localize('missingFile'), cause.localize('error'));
            });
        }).bind(this, files, nbApp), function () {
            cause.alert(cause.localize('missingFile'), cause.localize('error'));
        });
    } else {
        cause.include.js(files, (function () {
            cause.log('The application is loaded');
            cause.labels.load();
            cause.listeners.execute('ready');
        }).bind(this, files), function () {
            cause.alert(cause.localize('missingFile'), cause.localize('error'));
        });
    }
};

/** Add link for each language
 *
 * @memberOf cause.objects.devExtreme
 */
cause.objects.devExtreme.prototype.showLanguage = function () {
    for (var i=0, j=cause.languages.available.length; i<j; i++) {
        if (cause.languages.available[i] !== cause.languages.select) {
            cause.$('<a>').addClass('lang').attr('href', './?lang=' + cause.languages.available[i]).html(cause.languages.available[i]).insertBefore('#menutop #logout');
        }
    }
};

/** @property {cause.objects.devExtreme} */
cause.devExtreme = new cause.objects.devExtreme();