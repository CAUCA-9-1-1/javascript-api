/**
 * @copyright CAUSE 2016
 * @author CAUSE
 * @version 1.0
 */
"use strict";

/** Defined the DevExtreme application variable name.
 *
 * @namespace
 */
var myApp = {};

/** Defined the labels variable for every available language.
 *
 * @namespace
 */
var causeAvailableLanguage = {};

/** Main file to define the class "cause".
 * Execute the following command to minimized all file of "/js/uncompressed/".
 * Go inside the "StaticWebContent" folder and run "./compress".
 *
 * @namespace
 * @property {string} baseUrl - Basic URL for the library
 * @property {boolean} debug - True to access to mode debug
 * @property {array} escapeKeys - Keyboard key that we always accept
 * @property {boolean} helpIsOn - True when object is call by help function
 * @property {object} languages - Language specification
 * @property {array} languages.available - All posible language
 * @property {string} languages.select - Selected language
 * @property {array} languages.user - Navigator language
 * @property {string} name - Library name
 * @property {integer} next - Next value for unique ID.
 * @property {Date} time - Time when "cause" is created
 * @property {object} version - Version of used externalPlugins or element
 * @property {string|float|integer} version.cause - Library version
 * @property {string|float|integer} version.js - Detected javascript version
 */
var cause = {
	acceptOldBrowser: {},
    baseUrl: './static/cause-web-content/',
	baseUrlPlugins: '/static/plugins/',
	debug: false,
	escapeKeys: [
		8 /* Backspace */, 9 /* Tabs */, 13 /* Enter */,
		35 /* End */, 36 /* Home */, 46 /* Delete */,
		37 /* Arrow left */, 38 /* Arrow top */, 39 /* Arrow right */, 40 /* Arrow bottom */
	],
	helpIsOn: false,
	languages: {
		available: ['fr', 'en'],
		select: 'fr',
		user: []
	},
	name: 'CAUSE',
	next: 0,
	time: (new Date()),
	version: {
		/* Tag each version of the library here */
		cause: '1.0.0',

		/* Could be redefined if it's included inside HTML */
        cldrjs: '0.4.8',
		devExtreme: '17.1.8',
		jQuery: '3.2.1',
		knockout: '3.4.0',			// Use DevExtreme version

		/* Automatically detected */
		js: '',							// JavaScript version

		/* Plugins version */
        chartJS: '2.1.6',				// Chart generator
        ckeditor: '4.5.11',				// Text editor
        codeMirror: '5.21.0',			// Text editor
        fontAwesome: '4.7.0',			// Font icon
        googleMaps: '3',				// Maps
        jPlayer: '2.9.2',				// Video player
		jsZip: '3.1.2',					// Zip generator
		html2canvas: '0.5.0',			// Image generator
		pdfjs: '1.6.210',				// PDF viewer
        psdjs: '3.1.0',					// PSD viewer
		recordRTC: '5.4.0',				// Audio recording
		tinymce: '4.5.1',				// Text editor
		webAudioRecorderJs: '0.1.1',	// Audio recording
		webodf: '0.5.9',				// Text viewer
        wodoTextEditor: '0.5.9'			// Text editor
	},

	/** Object with all custom create class
	 *
	 * @namespace
	 */
	objects: {},

	/** Executed on a window error.
	 *
	 * @param {object} e - jQuery or browser event
	 */
	error: function (e) {
		if (!e) {
			return null;
		}

		var error = {
			message: (e.originalEvent ? e.originalEvent.message : e.message),
			file: (e.originalEvent ? e.originalEvent.filename : e.filename),
			line: (e.originalEvent ? e.originalEvent.lineno : e.lineno),
			column: (e.originalEvent ? e.originalEvent.colno : e.colno),
			callstack: (this.getFirefoxCallstack(e.originalEvent) || [])
		};

		this.log(error.message + "\n" + 'Line ' + error.line + ' in file ' + error.file, 'error');
	},

	getFirefoxCallstack: function (event) {
		if (!(event && event.stack)) {
			return null;
		}

		var callstack = [];
		var lines = event.stack.split('\n');
		for (var i = 0, j = lines.length; i < j; i++) {
			if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
				callstack.push(lines[i]);
			}
		}

		return callstack;
	},

	/** Redirect the user because is browser is too old.
	 * Actually is call when: jQuery 2 or higher can't be loaded,
	 * MSIE needed to be more then 9,
	 * Gecko needed to be 40 or more,
	 * Webkit needed to be 536 or more.
	 */
	needUpdate: function () {
		if (!cause.helpIsOn) {
			location.href = location.protocol + cause.baseUrl + 'html/browser.html';
        }
	}
};