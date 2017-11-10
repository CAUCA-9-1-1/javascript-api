myApp.home = function () {
	var clickRun = function () {
		var script = document.getElementById('runCode').value;
		var oldTag = document.getElementById('scriptContainer');
		var newTag = document.createElement('script');

		if (oldTag) {
			oldTag.parentNode.removeChild(oldTag);
		}

		newTag.id = 'scriptContainer';
		newTag.text = script;

		document.body.appendChild(newTag);
	};

	// Return the view object
    return {
    	viewShown: function () {
    		$('#menutop').hide();
			$('#runCode').val(
				'//cause.help();' + "\n" +
				'//cause.help(\'socket\');' + "\n\n" +
				//'var db = new cause.sql(\'test\', \'1.0\', 1000, function(v1, v2) { console.log(v1 + \' -> \' + v2);})' + "\n\n" +
				'var ws = new cause.objects.socket({' +
					'host: \'localhost:3000\',' +
					'onConnect: function () { cause.log(\'is connected\'); ws.send(\'connected\'); },' +
					'onMessage: function () { cause.log(arguments); },' +
					'onDisconnect: function () { cause.log(\'disconnected\'); }' +
				'});'
			);
			$('#clickRun').dxButton({
				text: 'RUN',
				onClick: clickRun.bind(this)
			});
    	}
	};
};