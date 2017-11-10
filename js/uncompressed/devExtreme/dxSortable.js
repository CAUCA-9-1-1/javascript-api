/** Class to create a new DevExtreme widget (dxSortable)
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.dxSortable = function () {
    DevExpress.registerComponent('dxSortable', (function (_super) {
        cause.extends(customControl, _super);

        var totalColumn = 0;
        var config = {};
        var uniqueId = '';
        var container = null;
        var containerUl = null;
        var dragElement = null;
        var viewElement = null;
        var moveInParent = null;
        var sideUpDown = '';
        var rowIndex = 0;

        var _cloneDraggedElement = function () {
            dragElement = viewElement.cloneNode(true);

            $(dragElement).addClass('dx-sortable-dragging').appendTo('body');
        };

        var _dragStarted = function (e) {
            viewElement = e.target;
            moveInParent = null;
            rowIndex = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);

            _cloneDraggedElement();
        };

        var _dragEnded = function (e) {
            var newIndex = Array.prototype.indexOf.call(viewElement.parentNode.children, viewElement);
            var step = (newIndex - rowIndex);
            var node = $('.dx-item', e.target).data();

            if (typeof(config.onEnd) == 'function') {
                if (moveInParent) {
                    config.onEnd(node, step, moveInParent);
                } else {
                    config.onEnd(node, step);
                }
            }
        };

        var _showPreview = function (e) {
            if (config.moveInside) {
                var parent = $(e.target).find('ul');

                if (parent.length == 0) {
                    parent = $('<ul>').addClass('dx-treeview-node-container').addClass('dx-treeview-node-container-opened').appendTo(e.target);
                }

                parent.append(viewElement);
                moveInParent = $('.dx-item', e.target).data();
            } else if (sideUpDown == 'down') {
                $(viewElement).insertAfter(e.target);
            } else {
                $(viewElement).insertBefore(e.target);
            }
        };

        var _initDraggable = function () {
            containerUl.find('li').on({
                dxdragstart: _dragStarted.bind(this),
                dxdragend: function (e) {
                    _dragEnded(e);

                    $(dragElement).remove();
                },
                dxdrag: function (e) {
                    sideUpDown = (parseInt($(dragElement).css('top')) > e.clientY ? 'up' : 'down');

                    $(dragElement).css({
                        'left': e.clientX,
                        'top': e.clientY
                    });
                },
                dxdragenter: _showPreview.bind(this),
                dxdragleave: function () {}
            });
        };

        var _reset = function () {
            setTimeout((function () {
                containerUl = $('ul', container);

                _initDraggable.call(this);
            }).bind(this), 500);
        };

        function customControl(element, options) {
            _super.call(this, element, {});

            config = cause.extend({
                moveInside: false,
                onEnd: null
            }, options || {});
            uniqueId = cause.unique();
            container = $(element).attr('id', uniqueId);
            containerUl = $(element).addClass('dx-sortable').find('ul');

            _initDraggable.call(this);

            this.reset = _reset.bind(this);
        };

        return customControl;
    })(DevExpress.DOMComponent));
};