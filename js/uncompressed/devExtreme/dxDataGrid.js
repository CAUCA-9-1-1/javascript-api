/** Class to create a new DevExtreme widget (dxMultiLang)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxDataGrid = function () {
    DevExpress.registerComponent('dxDataGrid', DevExpress.ui.dxDataGrid.inherit({
        _renderContent: function () {
            this.callBase();

            var config = this.option();

            if (config.isPrintable !== false) {
                this._addPrintButton(config.isPrintable);
            }
        },

        _createToolbar: function () {
            if (this._$element.find('.dx-datagrid-header-panel').length == 0) {
                this._$element.find('.dx-datagrid-headers').prev().replaceWith('<div class="dx-datagrid-header-panel"><div class="dx-toolbar"></div></div>');
                this._$element.find('.dx-datagrid-header-panel .dx-toolbar').dxToolbar({
                    items: []
                });
            }
        },

        _addPrintButton: function(startPrint) {
            this._createToolbar();

            if (typeof(startPrint) !== 'function') {
                startPrint = function (element) {
                    cause.print(element);
                }
            }

            if (!$('.fa.fa-print', this._$element).length) {
                var toolbar = this._$element.find('.dx-datagrid-header-panel .dx-toolbar').dxToolbar('instance');
                var items = toolbar.option('items');

                items.push({
                    location: 'after',
                    widget: 'dxButton',
                    name: 'print',
                    options: {
                        icon: 'fa fa-print',
                        onClick: startPrint.bind(this, this._$element)
                    }
                });
                toolbar.option('items', items);
            }
        },

        _extractData: function (grid, key, fields) {
            var total = grid.totalCount();
            var store = new DevExpress.data.ArrayStore({
                data: [],
                onUpdated: function (key, values) {
                    var info = cause.extend({}, key, values);

                    cause.ajax({
                        url: '//' + myApp.config.webservice.host + '/multilang/',
                        method: 'POST',
                        data: info
                    });
                }
            });

            for (var i=0; i<total; i++) {
                grid.byKey(grid.cellValue(i, key)).done(function (data) {
                    for (var j=0, k=fields.length; j<k; j++) {
                        store.insert(data[fields[j]]);
                    }
                });
            }

            return store;
        },

        _languageColumns: function () {
            var columns = [];

            for (var i=0, j=cause.languages.available.length; i<j; i++) {
                columns.push({
                    caption: cause.localize(cause.languages.available[i]),
                    dataField: cause.languages.available[i]
                });
            }

            return columns;
        },

        _addTranslate: function (e, key, fields, callback) {
            this._createToolbar(e);

            if (!$('.fa.fa-globe', e.element).length) {
                var toolbar = e.element.find('.dx-datagrid-header-panel .dx-toolbar').dxToolbar('instance');
                var items = toolbar.option('items');
                var store = this._extractData(e.component, key, fields);
                var columns = this._languageColumns();

                items.push({
                    location: 'after',
                    widget: 'dxButton',
                    name: 'print',
                    options: {
                        icon: 'fa fa-globe',
                        onClick: (function (store, columns, callback) {
                            if ($('#popupTranslate').length) {
                                $('#popupTranslate').remove();
                            }

                            $('<div id="popupTranslate">').html('<div class="popupGrid" />').appendTo('body');
                            $('#popupTranslate').dxPopup({
                                visible: true,
                                title: cause.localize('translate'),
                                toolbarItems: [{
                                    options: {
                                        text: cause.localize('cancel'),
                                        onClick: function() {
                                            $('#popupTranslate').dxPopup('instance').hide();
                                        }
                                    },
                                    toolbar: 'bottom',
                                    widget: 'dxButton'
                                }],
                                onHidden: function () {
                                    callback();
                                },
                                onShown: function (e) {
                                    $('div.popupGrid', e.component.content()).dxDataGrid({
                                        dataSource: store,
                                        height: (screen.height / 1.7),
                                        paging: {
                                            enabled: false
                                        },
                                        editing: {
                                            mode: 'cell',
                                            allowUpdating: true
                                        },
                                        columns: columns
                                    });
                                }
                            });
                        }).bind(this, store, columns, callback)
                    }
                });
                toolbar.option('items', items);
            }
        },
    }));
};
