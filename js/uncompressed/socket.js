/** Class for helping with socket
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object|string} config - Object with all config or URL of server
 * @param {string} config.host - URL of server
 * @param {boolean} config.binary - True to send data in binary
 * @param {function} config.onConnect - Callback function to execute after connection
 * @param {function} config.onMessage - Callback function to execute when receiving a message
 * @param {function} config.onDisconnect - Callback function to execute after disconnection
 */
cause.objects.socket = function (config) {
	this.name = 'socket';
	this.isConnected = false;
	this.ws = null;
	this.host = config;
	this.binary = false;
	this.onConnect = null;
	this.onMessage = null;
	this.onDisconnect = null;

	/* Initialize the "websocket" */
	if (cause.helpIsOn || !config) {
		return null;
	}

	if (typeof (config) === 'object') {
		this.host = (config.host || '');
		this.binary = (config.binary || false);
		this.onConnect = (config.onConnect || null);
		this.onMessage = (config.onMessage || null);
		this.onDisconnect = (config.onDisconnect || null);
	}

	this.init();
};

/** Show help when is cause.help('rabbitMQ') is call
 *
 * @memberOf cause.objects.socket
 */
cause.objects.socket.prototype.help = function () {
	cause.log('Aide pour "cause.socket":', 'help_title');
	cause.log("\t" +
		'new cause.socket(config);' + "\n\n\t" +
		'config.host = URL du serveur websocket' + "\n\t" +
		'config.onConnect = Fonction à exécuter à la connexion' + "\n\t" +
		'config.onMessage = Fonction à exécuter à la réception d\'un message' + "\n\t" +
		'config.onDisconnect = Fonction à exécuter à la déconnexion' + "\n\n\t" +
		'new cause.socket(host, [onConnect, [onMessage, [onDisconnect]]]);' + "\n\n\t" +
		'host = URL du serveur websocket' + "\n\t" +
		'onConnect = Fonction à exécuter à la connexion' + "\n\t" +
		'onMessage = Fonction à exécuter à la réception d\'un message' + "\n\t" +
		'onDisconnect = Fonction à exécuter à la déconnexion', 'help');
};

/** Callback for WebSocket is connect.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.connect = function () {
	if (typeof(this.onConnect) == 'function') {
		this.isConnected = true;
		this.onConnect();
	} else {
		cause.log('is connected');
	}
};

/** Callback for WebSocket receiving a message.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.message = function (e) {
	var message = cause.json.parse(e.data);

	if (typeof(this.onMessage) == 'function') {
		this.onMessage(message);
	} else {
		cause.log('message is receive:' + message);
	}
};

/** Callback for WebSocket is disconnect.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.disconnect = function () {
	if (typeof(this.onDisconnect) == 'function') {
		this.isConnected = false;
		this.onDisconnect();
	} else {
		cause.log('is disconnected');
	}
};

/** Callback for when WebSocket generate an error.
 *
 * @memberOf cause.objects.socket
 * @param {object} e - Event object
 */
cause.objects.socket.prototype.error = function (e) {
	cause.log('Error inside cause.socket');
	cause.log(e);

	this.close();
};

/** Initialize the WebSocket.
 *
 * @memberOf cause.objects.socket
 */
cause.objects.socket.prototype.init = function () {
	var webSocket = (typeof(window) == 'object' ? (window.WebSocket || window.MozWebSocket) : null);

	if (this.host.includes('://')) {
		this.host = 'ws://' + this.host;
	}

	if (webSocket) {
		// Initialize the WebSocket
		this.ws = new webSocket(this.host, 'echo-protocol');
		this.ws.addEventListener('close', this.disconnect.bind(this));
		this.ws.addEventListener('error', this.error.bind(this));
		this.ws.addEventListener('open', this.connect.bind(this));
		this.ws.addEventListener('message', this.message.bind(this));
	}
};

/** Close the websocket connection.
 *
 * @memberOf cause.objects.socket
 */
cause.objects.socket.prototype.close = function () {
	if (this.ws.readyState === this.ws.OPEN) {
		this.ws.close();
	}
};

/** Send data on server.
 *
 * @memberOf cause.objects.socket
 * @param {object|string} data - Data send on server
 * @param {boolean} binary - True to force sending binary data
 */
cause.objects.socket.prototype.send = function (data, binary) {
	if (this.ws.readyState === this.ws.OPEN) {
		this.ws.binaryType = (binary || this.binary ? 'arraybuffer' : 'blob');
		this.ws.send(data);

		if (this.ws.bufferedAmount === 0) {
			// the data is sent
		}
	} else {
		cause.log('could not send, your disconnect');
	}
};