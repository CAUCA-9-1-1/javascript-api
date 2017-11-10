/** Class to create a new DevExtreme widget (dxMultiLine)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxMultiLine = function () {
    DevExpress.registerComponent('dxMultiLine', (function (_super) {
        cause.extends(customControl, _super);

        var totalColumn = 0;
        var config = {};
        var container = $('<div>');

        var _onRemoveClick = function (e) {
            e.element.parents('.row').remove();
        };

        var _onAddingClick = function () {
            _createFormRow();
        };

        var _createAllRow = function () {
            config.value = (config.value ? config.value : []);

            if (config.value.length > 0) {
                for (var i=0, j=config.value.length; i<j; i++) {
                    _createFormRow(config.value[i]);
                }
            } else {
                _createFormRow();
            }
        };

        var _createFormRow = function (values) {
            totalColumn = 0;
            var column = Math.floor(11 / config.items.length);

            if (container.find('.adding').length) {
                var row = $('<div class="row">').insertBefore(container.find('.adding'));
            } else {
                var row = $('<div class="row">').appendTo(container);
            }

            for (var i=0, j=config.items.length; i<j; i++) {
                $('<div class="col' + column + '">').appendTo(row).dxTextBox({
                    value: (values && typeof(values) == 'object' ? values[config.items.dataField] : (values || ''))
                });

                totalColumn += column;
            }

            var divColumn = $('<div class="col' + (12 - totalColumn) + '">').appendTo(row);
            $('<div>').appendTo(divColumn).dxButton({
                icon: 'remove',
                onClick: _onRemoveClick
            });
        };

        var _createAddingRow = function (items) {
            var row = $('<div class="row adding">').appendTo(container);

            $('<div class="col' + totalColumn + '">').appendTo(row);

            var divColumn = $('<div class="col' + (12 - totalColumn) + '">').appendTo(row);
            $('<div>').appendTo(divColumn).dxButton({
                icon: 'add',
                onClick: _onAddingClick
            });
        };

        function customControl(element, options) {
            _super.call(this, element, {});
            config = cause.extend({
                items: [{
                    caption: '',
                    dataField: '',
                    editorType: 'dxTextBox'
                }],
                value: []
            }, options);

            container.addClass('dx-multiline').appendTo($(element));

            _createAllRow();
            _createAddingRow();
        }

        return customControl;
    })(DevExpress.DOMComponent));
};