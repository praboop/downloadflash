// detect if naturalWidth property is supported
// getting it is much faster then getComputedStyle()
var supportsNatural = ("naturalWidth" in (new Image())),
	imagePath = 'image.jpg',
	interval,
	hasSize,
	onHasSize = function () {
		if (hasSize) return;

		var naturalWidth = supportsNatural ? img[0].naturalWidth : img.width();
		var naturalHeight = supportsNatural ? img[0].naturalHeight : img.height();

		clearInterval(interval);
		hasSize = true;
	},
	onLoaded = function () {
		onHasSize();
	},
	onError = function () {
		onHasSize();
	},
	checkSize = function () {

		if (supportsNatural) {
			if (img[0].naturalWidth > 0) {
				onHasSize();
			}
		} else {
			// some browsers will return height of an empty image about 20-40px
			// just to be sure we check for 50
			if (img.width() > 50) {
				onHasSize();
			}
		}

	},
	img = $('<img/>')
		.on('load', onLoaded)
		.on('error', onError)
		.attr('src', imagePath)
		.appendTo(someContainer);

interval = setInterval(checkSize, 100);
checkSize();