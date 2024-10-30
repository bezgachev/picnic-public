const maps = (geo) => {
	ymaps.ready(function () {
		let myMap = new ymaps.Map('map', {
				center: geo,
				zoom: 13,
				controls: ['zoomControl']
			}, {
				searchControlProvider: 'yandex#search'
			}),
	
			// Создаём макет содержимого.
			MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
				'<div class="map__title">$[properties.iconContent]</div>'
			),
	
			myPlacemark = new ymaps.Placemark(geo, {
				iconContent: '',
				balloonContent: '',
				balloonLayout: "default#imageWithContent",
			},
			{
				// Опции.
				// Необходимо указать данный тип макета.
				iconLayout: 'default#imageWithContent',
				// Своё изображение иконки метки.
				iconImageHref: '/assets/img/contacts-map.svg',
				// Размеры метки.
				iconImageSize: [30, 30],
				// Смещение левого верхнего угла иконки относительно
				// её "ножки" (точки привязки).
				iconImageOffset: [-14, -14],
				// Смещение слоя с содержимым относительно слоя с картинкой.
				iconContentOffset: [60, 5],
				// Макет содержимого.
				iconContentLayout: MyIconContentLayout
			});
		myMap.geoObjects.add(myPlacemark);

	});
}

export default maps;