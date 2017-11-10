/** Class for helping with knockout.
 *
 * @constructor
 * @memberOf cause.objects
 */
cause.objects.knockout = function () {
    this.name = 'knockout';

    cause.$(document).ready((function () {
        if (typeof(ko) === 'object') {
            this.binding();
        }
    }).bind(this));
};

/** Create some specific binding.
 *
 * @memberOf cause.objects.knockout
 */
cause.objects.knockout.prototype.binding = function () {
    ko.bindingHandlers.placeholder = {
        init: function (element, valueAccessor) {
            var underlyingObservable = valueAccessor();

            ko.applyBindingsToNode(element, {
                attr: {
                    placeholder: underlyingObservable
                }
            });
        }
    };

    ko.bindingHandlers.title = {
        init: function (element, valueAccessor) {
            var underlyingObservable = valueAccessor();

            ko.applyBindingsToNode(element, {
                attr: {
                    title: underlyingObservable
                }
            });
        }
    };
};

/** @property {cause.objects.knockout} */
cause.knockout = new cause.objects.knockout();