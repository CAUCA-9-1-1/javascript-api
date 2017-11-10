/** Class for helping with Rabbit MQ.
 * This class needed "stomp.js".
 *
 * @constructor
 * @memberOf cause.objects
 * @param {string} host - URL of server
 * @param {string} user - Username
 * @param {string} password - User password
 * @param {string} onConnect - Callback function after connection
 * @param {string} onDisconnect - Callback function after disconnection
 * @param {string} vhost - Virtual host to connect
 */
cause.objects.rabbitMQ = function (host, user, password, onConnect, onDisconnect, vhost) {
	this.name = 'rabbitMQ';
	this.isConnected = false;
	this.client = null;
	this.onConnect = null;
	this.onDisconnect = null;
	this.host = host;
	this.user = user;
	this.password = password;
	this.subkey = [];
	this.useSocket = ('WebSocket' in window || 'MozWebSocket' in window);

	if (typeof(onConnect) === 'function') {
		this.onConnect = onConnect;

		if (typeof(onDisconnect) === 'function') {
			this.onDisconnect = onDisconnect;
			this.vhost = vhost;
		} else {
			this.vhost = onDisconnect;
		}
	} else {
		this.vhost = onConnect;
	}

	/* Initialize the addons "stomp" */
	if (!this.configAreValid()) {
		return null;
	}

	if (typeof(Stomp) === 'object') {
		this.init();
	} else {
		var file = (cause.baseUrl == '//stdev.cauca.ca/cause/' ? 'stomp.js' : 'stomp.min.js');

		cause.include.js(cause.baseUrl + 'js/addons/' + file, this.init.bind(this), function () {
			cause.alert(cause.localize('missingAddons'), 'stomp.min.js');
		});
	}
};

/** Show help when is cause.help('rabbitMQ') is call.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.help = function () {
	cause.log('Aide pour "cause.rabbitMQ":', 'help_title');
	cause.log("\t" +
		'new cause.rabbitMQ(host, user, password, [onConnect], [onDisconnect], [vhost]);' + "\n\n\t" +
		'host = URL du serveur Rabbit MQ' + "\n\t" +
		'user = Nom d\'utilisateur du Rabbit MQ' + "\n\t" +
		'password = Mot de passe du Rabbit MQ' + "\n\t" +
		'onConnect = Fonction à exécuter à la connexion' + "\n\t" +
		'onDisconnect = Fonction à exécuter à la déconnexion' + "\n\t" +
		'vhost = Vhost du Rabbit MQ', 'help');
};

cause.objects.rabbitMQ.prototype.configAreValid = function () {
	if (cause.helpIsOn || !this.host) {
		return false;
	}

	if (!this.user || !this.password) {
		cause.log('You need to pass the host, user and password', 'error');
		return false;
	}

	if (!this.useSocket) {
		cause.log('Use need a browser who support WebSocket', 'error');
		return false;
	}

	return true;
};

/** Callback for StompJS and/or WebSocket is connect.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} type - StompJS or WebSocket
 * @param {object} e - Event object
 */
cause.objects.rabbitMQ.prototype.connect = function (type) {
	if (type === 'stompjs' && typeof(this.onConnect) === 'function') {
		this.isConnected = true;
		this.onConnect();
	} else {
		cause.log(type + ' is connected');
	}
};

/** Callback for StompJS and/or WebSocket is disconnect.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} type - StompJS or WebSocket
 * @param {object} e - Event object
 */
cause.objects.rabbitMQ.prototype.disconnect = function (type) {
	if (type === 'websocket' && typeof(this.onDisconnect) === 'function') {
		this.isConnected = false;
		this.onDisconnect();
	} else {
		cause.log(type + ' is disconnected');
	}
};

/** Subscribe to a exchange.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} routing_key - /exchange/"exchange name"/"routing key"
 * @param {function} callback - Function to execute when subscribe is complete
 * @param {objects} headers - Object with some specific headers
 * @param {string} headers.id - ID of consumer tag (sub-?)
 * @param {boolean} headers.durable - True if durable (default = False)
 * @param {boolean} headers.auto-delete - True if auto delete (default = False)
 */
cause.objects.rabbitMQ.prototype.subscribe = function (routing_key, callback, headers) {
	if (typeof(callback) === 'function') {
		headers = (headers || {});
	} else {
		headers = (callback || {});
		callback = function () {};
	}

	this.subkey.push(this.client.subscribe(routing_key, callback, headers));
};

/** Callback for when StompJS and/or WebSocket generate an error.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {string} type - StompJS or WebSocket
 * @param {object} e - Event object
 */
cause.objects.rabbitMQ.prototype.error = function (type, e) {
	cause.log(type + ' has an error', 'error');
	cause.log(e);

	this.close();
};

/** Close the Rabbit MQ connection.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.close = function () {
	for (var i = 0, j = this.subkey.length; i < j; i++) {
		this.client.unsubscribe(this.subkey[i]);
	}

	this.client.disconnect(this.disconnect.bind(this, 'stompjs'));

	if (this.ws.readyState === this.ws.OPEN) {
		this.ws.close();
	}
};

/** Send message on Rabbit MQ queue.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.send = function (queue_name, message) {
	this.client.send(queue_name, {
		'content-type': 'text/plain'
	}, message);
};

/** Change the heartbeat.
 *
 * @memberOf cause.objects.rabbitMQ
 * @param {integer} outgoing -  Outgoing heartbeat in milliseconds
 * @param {integer} incoming - Incoming heartbeat in milliseconds
 */
cause.objects.rabbitMQ.prototype.setHeartbeat = function (outgoing, incoming) {
	if (this.client) {
		this.client.heartbeat.outgoing = outgoing;
		this.client.heartbeat.incoming = (incoming ? incoming : outgoing);
	}
};

/** Initialize the WebSocket and StompJS.
 *
 * @memberOf cause.objects.rabbitMQ
 */
cause.objects.rabbitMQ.prototype.init = function () {
	if (this.useSocket) {
		if (!this.host.includes('://')) {
			this.host = 'wss://' + this.host;
		}
		if (this.host.substr(-1, 1) !== '/') {
			this.host += '/ws/';
		}

		// Initialize the WebSocket
		this.ws = new WebSocket(this.host);
		this.ws.addEventListener('open', this.connect.bind(this, 'websocket'));
		this.ws.addEventListener('close', this.disconnect.bind(this, 'websocket'));
		this.ws.addEventListener('error', this.error.bind(this, 'websocket'));

		// Initialize the StompJS
		this.client = Stomp.over(this.ws);
		this.client.debug = function() {};
		this.client.connect(this.user, this.password, this.connect.bind(this, 'stompjs'), this.error.bind(this, 'stompjs'), (this.vhost ? this.vhost : '/'));
		this.client.heartbeat.outgoing = 30000;
		this.client.heartbeat.incoming = 60000;
	}
};

/** This class is replace by cause.objects.rabbitMQ
 *
 * @class
 * @deprecated
 */
cause.rabbitMQ = cause.objects.rabbitMQ;