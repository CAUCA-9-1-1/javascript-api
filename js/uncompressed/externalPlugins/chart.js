/** Class for helping with chart.
 * This class needed "chart.js" or "DevExtreme" to create chart
 *
 * @constructor
 * @memberOf cause.objects
 * @param {object} config: Object with all config
 */
cause.objects.chart = function (config) {
	this.name = 'chart';
	this.chart = null;
	this.config = cause.extend({}, {
		datasets: [{
			data: [0, 1, -2, 2, -3, 3],
			fill: false,
			label: 'Default'
		}],
		height: 400,
		labels: [1, 2, 3, 4, 5],
		options: {
			responsive: false
		},
		selector: '',
		type: 'line',
		width: 400
	}, (config || {}));

	/* Initialize the "chart" */
	if (!cause.helpIsOn) {
		if (typeof(DevExpress) === 'object') {
			this.initDevExtreme();
		} else if (typeof(Chart) === 'function') {
			this.initChartJS();
		} else {
            cause.include.js(cause.baseUrlPlugins + 'chart.js/' + cause.version.chartJS + '/dist/Chart.min.js', this.initChartJS.bind(this), function () {
                cause.alert(cause.localize('missingPlugins'), 'chart.js ' + cause.version.chartJS);
            });
		}
	}
};

/** Show help when is cause.help('chart') is call.
 *
 * @memberOf cause.objects.chart
 */
cause.objects.chart.prototype.help = function () {
	cause.log('Aide pour "cause.chart":', 'help_title');
	cause.log("\t" +
		'new cause.chart(config);' + "\n\n\t" +
		'config.datasets = Array d\'object pour créer le graphique' + "\n\t" +
		"\t" + 'backgroundColor = Array pour chaque couleur sur l\'axe des Y' + "\n\t" +
		"\t" + 'data = Array' + "\n\t" +
		"\t" + 'label = Text de l\'élément pour la légende' + "\n\t" +
		'config.labels = Array d\'élément sur l\'axe des X' + "\n\t" +
		'config.selector = HTML sélecteur' + "\n\t" +
		'config.type = Type de graphique (bar, line, doughnut, pie, radar, polarArea)', 'help');
};

/** Initialize the chart with DevExtreme.
 *
 * @memberOf cause.objects.chart
 */
cause.objects.chart.prototype.initDevExtreme = function () {
	var id = cause.unique();
	var dxType = 'dxChart';
	var config = cause.extend({}, {
		dataSource: this.config.datasets.data,
		series: this.config.labels
	});

	if (this.config.type === 'pie' || this.config.type === 'doughnut') {
		dxType = 'dxPieChart';
	} else if (this.config.type === 'polarArea' || this.config.type === 'radar') {
		dxType = 'dxPolarChart';
	}

	this.tag = cause.$('<div id="' + id + '" height="' + this.config.height + '" width="' + this.config.width + '">').appendTo(this.config.selector);
	this.chart = $('#' + id)[dxType](config);
};

/** Initialize the chart with chart.js
 *
 * @memberOf cause.objects.chart
 */
cause.objects.chart.prototype.initChartJS = function () {
	var id = cause.unique();
	var config = cause.extend({}, {
		data: {
			labels: this.config.labels,
			datasets: this.config.datasets
		},
		options: this.config.options,
		type: this.config.type
	});

	this.tag = cause.$('<canvas id="' + id + '" height="' + this.config.height + '" width="' + this.config.width + '">').appendTo(this.config.selector);
	this.chart = new Chart(document.getElementById(id), config);
};
