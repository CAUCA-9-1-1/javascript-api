/** Class to simplify the DevExpress "CustomStore".
 * This class needed "DevExtreme" and "jQuery".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} options - Options to implement on store.
 * url, params, autoload, onLoaded, onUpdate, onInsert, onRemove
 */
cause.objects.store = function (options) {
    this.name = 'store';
    this.data = [];
    this.refresh = true;
    this.options = options || {};
    this.setFilter = '';
    this.setSort = '';

    this.dataSource = new DevExpress.data.CustomStore({
        useDefaultSearch: true,
        load: this.onLoad.bind(this),
        byKey: this.onByKey.bind(this),
        insert: this.onInsert.bind(this),
        remove: this.onRemove.bind(this),
        update: this.onUpdate.bind(this)
    });

    if (this.options.filter) {
        this.setFilter = this.options.filter;
    }
    if (this.options.sort) {
        this.setSort = this.options.sort;
    }

    if (this.options.autoload) {
        this.dataSource.load();
    }
};

/** Show help when is cause.help('store') is call.
 */
cause.objects.store.prototype.help = function () {
    cause.log('Aide pour "cause.store":', 'help_title');
    cause.log("\t" +
        'new cause.store();', 'help');
};

cause.objects.store.prototype.getUrl = function () {
    if (!this.options.params) {
        return (this.options.url || basicUrl);
    } else if (typeof(this.options.params) == 'string') {
        return this.options.url + this.options.params;
    } else {
        var params = [];

        for (var i in this.options.params) {
            if (this.options.params.hasOwnProperty(i)) {
                params.push(i + '=' + this.options.params[i]);
            }
        }

        return this.options.url + ( params.length > 0 ? (this.options.url.includes('?') ? '&' : '?') : '' ) + params.join('&');
    }
};

/** Event executed on load to check if really need to reload the store.
 *
 * @param {object} loadOptions - Parameter for loading of CustomStore
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onLoad = function (loadOptions) {
    var deferred = $.Deferred();
    var basicUrl = (myApp.config && myApp.config.webroot ? myApp.config.webroot : './') + 'ajax/';
    var url = this.getUrl();

    // load data from the remote service
    if (!this.refresh) {
        this.onLoadedAll(deferred, loadOptions, this.data);
    } else {
        cause.ajax({
            url: url,
            method: 'GET',
            headers: (this.options.headers || null),
            success: this.onLoadedAll.bind(this, deferred, loadOptions),
            error: this.onError.bind(this, deferred),
        });
    }

    return deferred.promise();
};

/** Event executed on load by key.
 *
 * @param {string} key - Specific key of store to load
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onByKey = function (key) {
    var deferred = $.Deferred();
    var basicUrl = (myApp.config && myApp.config.webroot ? myApp.config.webroot : './') + 'ajax/';
    var url = this.getUrl();
    var byKey = (this.options.byKey || false);

    if (byKey) {
        cause.ajax({
            url: url + (myApp.config.webservice ? '' : '?id=') + key,
            method: 'GET',
            headers: (this.options.headers || null),
            success: this.onLoadedByKey.bind(this, deferred),
            error: this.onError.bind(this, deferred),
        });
    } else if (this.options.key) {
        return this.find(this.options.key, key);
    } else {
        return key;
    }

    return deferred.promise();
};

/** Event executed on inserting new element.
 *
 * @param {object} values - Object of new element
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onInsert = function (values) {
    var deferred = $.Deferred();

    if (typeof(this.options.onInsert) == 'function') {
        if (this.options.onInsert(deferred, values)) {
            this.refresh = true;
        }
    } else {
        deferred.resolve(false);
        cause.log('Vous devez définir l\'option onInsert au "store"!', 'error');
    }

    return deferred.promise();
};

/** Event executed on deleting an element.
 *
 * @param {object} values - Object of element to remove
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onRemove = function (values) {
    var deferred = $.Deferred();

    if (typeof(this.options.onRemove) == 'function' ) {
        if (this.options.onRemove(deferred, values)) {
            this.refresh = true;
        }
    } else {
        deferred.resolve(false);
        cause.log('Vous devez définir l\'option onRemove au "store"!', 'error');
    }

    return deferred.promise();
};

/** Event executed on updating an element.
 *
 * @param {string} key - Key of element to update
 * @param {object} values - Object of element to update
 * @returns {object} Callback queue
 */
cause.objects.store.prototype.onUpdate = function (key, values) {
    var deferred = $.Deferred();

    if (typeof(this.options.onUpdate) == 'function') {
        if (this.options.onUpdate(deferred, key, values)) {
            this.refresh = true;
        }
    } else {
        deferred.resolve(false);
        cause.log('Vous devez définir l\'option onUpdate au "store"!', 'error');
    }

    return deferred.promise();
};

cause.objects.store.prototype.validateData = function (data) {
    if (typeof(data.login) != 'undefined' && data.login === false) {
        cause.log('needToLogin', 'error');
    } else if (data.error) {
        cause.log(data.error, 'error');
    } else if (typeof(data) == 'object' && typeof(data.length) == 'number') {
        this.data = data;
    } else if (typeof(data) == 'object' && typeof(data.success) == 'boolean') {
        if (this.options.root && typeof(data[this.options.root]) == 'object') {
            this.data = data[this.options.root];
        } else if (typeof(data.result) == 'object') {
            this.data = data.result;
        }
    }
};

cause.objects.store.prototype.setQuery = function (loadOptions) {
    var query = DevExpress.data.query(this.data);

    // Set a filter on data
    var filter = (loadOptions.filter || this.setFilter);
    if (filter) {
        if (typeof(filter.columnIndex) !== 'undefined' || typeof(filter[0].columnIndex) !== 'undefined') {
            query = query.filter(filter);
        } else if (typeof(filter[0]) == 'object') {
            query = query.filter(filter);
        } else {
            query = query.filter.call(this, filter[0], filter[1], filter[2]);
        }
    }

    // Set a sort on data
    var sort = (loadOptions.sort || this.setSort);
    if (sort) {
        for (var i=0, j=(sort.length || 0); i<j; i++) {
            if (sort[i].selector) {
                query = query.sortBy(sort[i].selector, sort[i].desc);
            } else {
                query = query.sortBy(sort[i]);
            }
        }
    }

    return query;
};

cause.objects.store.prototype.onError = function (deferred) {
    deferred.resolve(false);

    if (typeof(this.options.onError) == 'function') {
        this.options.onError();
    }
};

/** Event executed after loading.
 *
 * @param {object} deferred - Callback queue
 * @param {object} loadOptions - Parameter for loading of CustomStore
 * @param {object} data - Loaded data
 */
cause.objects.store.prototype.onLoadedAll = function (deferred, loadOptions, data) {
    this.data = [];
    this.refresh = false;

    this.validateData(data);

    var query = this.setQuery(loadOptions);
    var total = query.toArray().length;

    if (loadOptions.take || loadOptions.skip) {
        query = query.slice(loadOptions.skip, loadOptions.take);
    }

    if (loadOptions.requireTotalCount === true) {
        deferred.resolve(query.toArray(), {
            totalCount: total
        });
    } else {
        deferred.resolve(query.toArray());
    }

    if (typeof(this.options.onLoaded) == 'function') {
        this.options.onLoaded(this.data, query.toArray());
    }
};

/** Event executed after key loading.
 *
 * @param {object} deferred - Callback queue
 * @param {object} data - Loaded data
 */
cause.objects.store.prototype.onLoadedByKey = function (deferred, data) {
    cause.log(data);
    deferred.resolve(data);
};

/** Apply sort on store.
 *
 * @param {mixed} * - Every parameters are pass to sort dataSource
 */
cause.objects.store.prototype.sort = function () {
    this.setSort = arguments;
    this.dataSource.load({
        sort: arguments
    });
};

/** Apply filter on store.
 *
 * @param {mixed} * - Every parameters are pass to filter dataSource
 */
cause.objects.store.prototype.filter = function () {
    this.setFilter = arguments;
    this.dataSource.load({
        filter: arguments
    });
};

/** Find an element with a key who had a specific value.
 *
 * @param {string} key - Object key to search
 * @param {object} value - Object value to find
 * @returns {object} Object if exist
 */
cause.objects.store.prototype.find = function (key, value) {
    for (var i=0,j=this.data.length; i<j; i++) {
        if (this.data[i] && this.data[i][key] === value) {
            return this.data[i];
        }
    }

    return false;
};

/** Load the store.
 *
 * @param {object} opts - Parameter to add on URL
 */
cause.objects.store.prototype.load = function (opts) {
    this.options.params = opts;

    if (this.dataSource) {
        this.dataSource.load();
    }
};

/** Force to reload the store.
 *
 * @param {object} opts - Parameter to add on URL
 */
cause.objects.store.prototype.reload = function (opts) {
    this.refresh = true;
    this.load(opts);
};

/** Remove an specific element of store.
 *
 * @param {array} keys - Every key to remove
 */
cause.objects.store.prototype.remove = function (keys) {
    this.onRemove(keys);
};

/** This class is replace by cause.objects.store
 *
 * @class
 * @deprecated
 */
cause.store = cause.objects.store;