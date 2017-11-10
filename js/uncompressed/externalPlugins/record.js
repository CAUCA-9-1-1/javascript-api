/** Class for helping with media recording.
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config - Object with all config
 */
cause.objects.record = function (config) {
	this.name = 'record';
	this.config = cause.extend({}, {
		autorecord: false,
        encoding: 'wav' // mp3, ogg, wav
	}, (config || {}));

	/* Initialize the "record" */
	if (!cause.helpIsOn) {
        if (typeof(WebAudioRecorder) == 'object') {
            this.init();
        } else {
            cause.include.js(cause.baseUrlPlugins + 'webAudioRecorderJs/' + cause.version.webAudioRecorderJs + '/WebAudioRecorder.min.js', this.init.bind(this), function () {
                cause.alert(cause.localize('missingPlugins'), 'web-audio-recorder-js');
            });
        }
	}
};

/** Show help when is cause.help('record') is call.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.help = function () {
    cause.log('Aide pour "cause.record":', 'help_title');
    cause.log("\t" +
        'new cause.record(config);' + "\n\n\t" +
        'config.autorecord = Start recording automatically on load, default is "false"' + "\n\t" +
        'config.encoding = Type of recording file (mp3, ogg, wav), default is "wav"', 'help');
};

/** Initialize the recording.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.init = function () {
    if (typeof(navigator) == 'object') {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.URL = window.URL || window.webkitURL;

        if (navigator.getUserMedia) {
            if (['webm'].includes(this.config.encoding)) {
                this.initVideo();
            } else {
                this.initAudio();
            }
        } else {
            cause.alert(cause.localize('errorUserMedia'), cause.localize('error'));
        }
    }
};

/** Initialize the WebAudioRecorder plugins for audio recording and encoding.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.initAudio = function () {
    var audioContext = new AudioContext;
    var mixer = audioContext.createGain();

    if (audioContext.createScriptProcessor == null) {
        audioContext.createScriptProcessor = audioContext.createJavaScriptNode;
    }

    mixer.connect(audioContext.destination);

    this.recorder = new WebAudioRecorder(mixer, {
        workerDir: cause.baseUrlPlugins + 'webAudioRecorderJs/' + cause.version.webAudioRecorderJs + '/',
        encoding: this.config.encoding,
        options: {
            timeLimit: 300 // time in second
        },
        onEncoderLoaded: (function () {
            if (this.config.autorecord) {
                this.start();
            }
        }).bind(this),
        onTimeout: (function () {
            cause.alert(cause.localize('timeoutWebAudioRecorder'), cause.localize('timeout'));
        }).bind(this),
        onComplete: (function (recorder) {
            this.download(blob, recorder.encoding);
        }).bind(this),
        onError: (function () {
            cause.alert(cause.localize('errorWebAudioRecorder'), cause.localize('error'));
        }).bind(this)
    });
};

/** Initiliaze the video recording and encoding.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.initVideo = function () {
    navigator.getUserMedia({
        audio: true,
        video: true
    }, (function (stream) {
        this.download(stream, 'webm');
    }.bind(this)), (function () {
        cause.alert(cause.localize('errorVideoRecorder'), cause.localize('error'));
    }.bind(this)));
};

/** Start the recording.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.start = function () {
    if (this.recorder && !this.recorder.isRecording()) {
        this.recorder.startRecording();
    } else if (this.recorder && this.recorder.isRecording()) {
        cause.log('Recorder already recording', 'error');
    } else {
        cause.log('Recorder is not initialised', 'error');
    }
};

/** Stop the recording.
 *
 * @memberOf cause.objects.record
 */
cause.objects.record.prototype.stop = function () {
    if (this.recorder && this.recorder.isRecording()) {
        this.recorder.finishRecording();
    } else if (this.recorder && !this.recorder.isRecording()) {
        cause.log('Recorder is not recording', 'error');
    } else {
        cause.log('Recorder is not initialised', 'error');
    }
};

/** Download the generated file.
 *
 * @memberOf cause.objects.record
 * @param {Blob} blob - Object of encoded file
 * @param {string} encoding - String of file type
 */
cause.objects.record.prototype.download = function (blob, encoding) {
    var url = window.URL.createObjectURL(blob);

    cause.$('<a>').attr('download', 'record.' + encoding).attr('href', url).get(0).click();
};