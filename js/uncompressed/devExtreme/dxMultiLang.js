/** Class to create a new DevExtreme widget (dxMultiLang)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxMultiLang = function () {
    DevExpress.registerComponent('dxMultiLang', (function (_super) {
        cause.extends(customControl, _super);

        var totalColumn = 0;
        var config = {};
        var container = $('<div>');
        var selectedLanguage = null;

        var _tabChanged = function (e) {
            selectedLanguage = e.addedItems[0].language;

            if (config.value) {
                if (typeof(config.value) != 'object') {
                    var tmpValue = config.value;
                    config.value = { id_language_content: null };

                    for (var i=0, j=cause.languages.available.length; i<j; i++) {
                        config.value[cause.languages.available[i]] = tmpValue;
                    }
                }
            } else {
                config.value = { id_language_content: null };

                for (var i=0, j=cause.languages.available.length; i<j; i++) {
                    config.value[cause.languages.available[i]] = '';
                }
            }

            container.find('input').val(config.value[selectedLanguage]);
        };

        var _createField = function () {
            $('<div class="dx-multilang-container">').html('<input type="text" />').focusin(function (e) {
                $(e.target).parents('.dx-multilang').addClass('focus');
            }).focusout(function (e) {
                $(e.target).parents('.dx-multilang').removeClass('focus');
            }).change(function (e) {
                config.value[selectedLanguage] = e.target.value;

                if (typeof(config.onValueChanged) == 'function') {
                    config.onValueChanged({
                        value: config.value,
                        jQueryEvent: e
                    });
                }
            }).appendTo(container);
        };

        var _createList = function () {
            config.value = (config.value ? config.value : {});
            selectedLanguage = cause.languages.available[0];

            var tabs = [];
            for (var i=0, j=cause.languages.available.length; i<j; i++) {
                tabs.push({
                    language: cause.languages.available[i],
                    text: cause.localize(cause.languages.available[i])
                });
            }

            $('<div>').dxNavBar({
                items: tabs,
                onSelectionChanged: _tabChanged
            }).appendTo(container);
        };

        function customControl(element, options) {
            _super.call(this, element, {});
            config = cause.extend({
                value: null,
                onValueChanged: null
            }, options);

            container.addClass('dx-multilang').addClass('dx-texteditor').html('').appendTo($(element));

            _createList();
            _createField();
        }

        return customControl;
    })(DevExpress.DOMComponent));
};