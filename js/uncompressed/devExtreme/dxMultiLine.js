/** Class to create a new DevExtreme widget (dxMultiLine)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxMultiLine = function () {
    DevExpress.registerComponent('dxMultiLine', (function (_super) {
        cause.extends(customControl, _super);

        function customControl(element, options) {
            _super.call(this, element, {});

            this.option = function(key, value) {
                if (value) {
                    this.config[key] = value;

                    $('.row', this.container).remove();
                    _createAllRow.call(this);
                    _createAddingRow.call(this);
                }

                return (this.config[key] ? this.config[key] : null);
            };

            this.totalRow = 0;
            this.totalColumn = 0;
            this.config = {};
            this.container = $('<div>');

            var _onRemoveClick = function (e) {
                var rowIndex = _findRowIndex(e.component);

                this.config.value.splice(rowIndex, 1);
                e.element.parents('.row').remove();

                if (typeof(this.config.onValueChanged) == 'function') {
                    this.config.onValueChanged({
                        element: element,
                        component: this,
                        value: this.config.value
                    });
                }
            };

            var _onAddingClick = function () {
                _createFormRow.call(this, this.config.newRowValue || null);
            };

            var _findRowIndex = function(component) {
                var rowIndex = -1;
                var row = component.element().parents('.row');

                row.parent('div').find('.row').each(function(index, element) {
                    if ($(element).attr('data-row') == row.attr('data-row')) {
                        rowIndex = index;
                    }
                });

                return rowIndex;
            };

            var _onValueChanged = function(colIndex, e) {
                var rowIndex = _findRowIndex.call(this, e.component);

                if (this.config.items[colIndex].dataField) {
                    if (!this.config.value[rowIndex]) {
                        this.config.value[rowIndex] = {};
                    }

                    this.config.value[rowIndex][this.config.items[colIndex].dataField] = e.value;
                } else {
                    this.config.value[rowIndex] = e.value;
                }

                if (typeof(this.config.onValueChanged) == 'function') {
                    this.config.onValueChanged({
                        element: element,
                        component: this,
                        value: this.config.value
                    });
                }
            };

            var _createAllRow = function () {
                this.totalRow = 0;
                this.config.value = (this.config.value ? this.config.value : []);

                if (this.config.value.length > 0) {
                    for (var i=0, j=this.config.value.length; i<j; i++) {
                        _createFormRow.call(this, this.config.value[i]);
                    }
                } else {
                    _createFormRow.call(this, this.config.newRowValue || null);
                }
            };

            var _createFormRow = function (values) {
                this.totalRow++;
                this.totalColumn = 0;

                var column = Math.floor(11 / this.config.items.length);

                if (this.container.find('.adding').length) {
                    var row = $('<div>').addClass('row').attr('data-row', this.totalRow).insertBefore(this.container.find('.adding'));
                } else {
                    var row = $('<div>').addClass('row').attr('data-row', this.totalRow).appendTo(this.container);
                }

                for (var i=0, j=this.config.items.length; i<j; i++) {
                    var editorType = (this.config.items[i].editorType || 'dxTextBox');
                    var editorOptions = (this.config.items[i].editorOptions || {});

                    editorOptions = $.extend(editorOptions, {
                        value: _findValue.call(this, i, values),
                        onValueChanged: _onValueChanged.bind(this, i)
                    });

                    $('<div class="col' + column + '">').appendTo(row)[editorType](editorOptions);

                    this.totalColumn += column;
                }

                var divColumn = $('<div class="col' + (12 - this.totalColumn) + '">').appendTo(row);
                $('<div>').appendTo(divColumn).dxButton({
                    icon: 'remove',
                    onClick: _onRemoveClick.bind(this)
                });
            };

            var _findValue = function (colIndex, values) {
                if (values && typeof(values) == 'object') {
                    if (this.config.items[colIndex].dataField) {
                        return values[this.config.items[colIndex].dataField] || '';
                    }
                }

                return (values || '');
            };

            var _createAddingRow = function (items) {
                var row = $('<div class="row adding">').appendTo(this.container);

                $('<div class="col' + this.totalColumn + '">').appendTo(row);

                var divColumn = $('<div class="col' + (12 - this.totalColumn) + '">').appendTo(row);
                $('<div>').appendTo(divColumn).dxButton({
                    icon: 'add',
                    onClick: _onAddingClick.bind(this)
                });
            };

            this.config = cause.extend({
                items: [{
                    caption: '',
                    dataField: '',
                    editorType: 'dxTextBox'
                }],
                value: []
            }, options);

            this.container.addClass('dx-multiline').appendTo($(element));

            if (typeof(this.config.onInitialized) == 'function') {
                this.config.onInitialized({
                    component: this
                });
            }

            _createAllRow.call(this);
            _createAddingRow.call(this);
        }

        return customControl;
    })(DevExpress.DOMComponent));
};