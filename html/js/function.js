myApp.resizeImage = {
	original: {},
	sizes: {
		icons: {
            'android-ldpi-36x36': [36, 36],
            'android-mdpi-48x48': [48, 48],
            'android-hdpi-72x72': [72, 72],
            'android-xhdpi-96x96': [96, 96],
            'android-xxhdpi-144x144': [144, 144],
            'android-xxxhdpi-192x192': [192, 192],
            'android-market-512x512': [512, 512],
            'ios-itunes-(1x)-512x512': [512, 512],
            'ios-itunes-(2x)-1024x1024': [1024, 1024],
            'ios-docs-64x64': [64, 64],
            'ios-docs-320x320': [320, 320],
            'ios-docs-640x640': [640, 640],
            'ios-ipad-spotlight-48x48': [48, 48],
            'ios-ipad-72x72': [72, 72],
            'ios-ipad-spotlight-(2x)-96x96': [96, 96],
            'ios-ipad3-144x144': [144, 144],
            'ios-iphone-settings-29x29': [29, 29],
            'ios-phone-57x57': [57, 57],
            'ios-iphone4-settings-58x58': [58, 58],
            'ios-phone4-114x114': [114, 114],
		},
		splashscreen: {
            'android-land-ldpi-320x200': [320, 200],
            'android-port-ldpi-200x320': [200, 320],
            'android-land-mdpi-480x320': [480, 320],
            'android-land-mdpi-320x480': [320, 480],
            'android-land-hdpi-800x480': [800, 480],
            'android-port-hdpi-480x800': [480, 800],
            'android-land-xhdpi-1280x720': [1280, 720],
            'android-port-xhdpi-720x1280': [720, 1280],
            'android-land-xxhdpi-1600x960': [1600, 960],
            'android-port-xxhdpi-960x1600': [960, 1600],
            'android-land-xxxhdpi-1920x1280': [1920, 1280],
            'android-port-xxxhdpi-1280x1920': [1280, 1920],
            'ios-ipad-land-(1x)-1024x768': [1024, 768],
            'ios-ipad-port-(1x)-768x1024': [768, 1024],
            'ios-ipad-land-(2x)-2048x1536': [2048, 1536],
            'ios-ipad-port-(2x)-1536x2048': [1536, 2048],
            'ios-phone-land-(1x)-480x320': [480, 320],
            'ios-phone-port-(1x)-320x480': [320, 480],
            'ios-phone-land-(2x)-640x960': [960, 640],
            'ios-phone-port-(2x)-640x960': [640, 960],
            'ios-phone5-land-(2x)-1136x640': [1136, 640],
            'ios-phone5-port-(2x)-640x1136': [640, 1136],
            'ios-phone6-land-(2x)-1334x750': [1334, 750],
            'ios-phone6-port-(2x)-750x1334': [750, 1334],
            'ios-phone6+-land-(3x)-2208x1242': [2208, 1242],
            'ios-phone6+-port-(3x)-1242x2208': [1242, 2208],
		}
	},

	init: function () {
		$('#btnResizeImage').dxButton({
			text: 'Resize image',
			onClick: function () {
				$('#resizeImage').css('display', 'block');
			}
		});
		$('#fileResize').dxButton({
			text: 'Télécharger les images diminués',
			onClick: this.resize.bind(this)
		});

		$('#showImage').on('load', (function() {
			this.original.width = $('#showImage').width();
			this.original.height = $('#showImage').height();

			$('#fileStat').html('Originale : ' + this.original.width + ' X ' + this.original.height + ' pixels');
			$('#showImage').css('width', '100%');
			$('#showImage').css('display', 'block');
		}).bind(this));

		$('#fileUploader').dxFileUploader({
			selectButtonText: 'Sélectionner votre image',
			labelText: 'Déplacer votre image ici',
			multiple: false,
			accept: 'image/*',
			uploadMode: 'useForm',
			onValueChanged: this.selectImage
		})
	},

	selectImage: function (e) {
		$('#showImage').css('display', 'none');
		$('#showImage').attr('width', 'auto');
		$('#showImage').attr('src', window.URL.createObjectURL(e.value[0]));
	},

	calculRatio: function (width, height) {
		if (this.original.width > this.original.height) {
			var h = width * this.original.height / this.original.width;

			return [width, h, 0, (height - h) / 2];
		} else {
			var w = height * this.original.width / this.original.height;

			return [w, height, (width - w) / 2, 0];
		}
	},

	resize: function () {
		for (var name in this.sizes.icons) {
			if (this.sizes.icons.hasOwnProperty(name)) {
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				var ratio = this.calculRatio(this.sizes.icons[name][0], this.sizes.icons[name][1]);

				canvas.width = this.sizes.icons[name][0];
				canvas.height = this.sizes.icons[name][1];

				ctx.beginPath();
				ctx.rect(0, 0, this.sizes.icons[name][0], this.sizes.icons[name][1]);
				ctx.fillStyle = '#ffffff';
				ctx.fill();
				ctx.drawImage($('#showImage').get(0), 0, 0, this.original.width, this.original.height, ratio[2], ratio[3], ratio[0], ratio[1]);

				$('<a>').attr('href', canvas.toDataURL()).attr('download', name + '.png').get(0).click();
			}
		}
	}
};

myApp.function = function () {
	// Return the view object
    return {
    	viewShown: (function () {
    		$('#menutop').hide();
			$('.floatPanel h3').on('click', function () {
				$('#resizeImage').css('display', 'none');
			});

			myApp.resizeImage.init();
    	}).bind(this)
	};
};
