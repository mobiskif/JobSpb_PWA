var myMap;
var query;
ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [59.938, 30.3],
        zoom: 10,
        //controls: ['smallMapDefaultSet']
        controls: []
    }, {
        restrictMapArea: [
            [59.738, 29.511],
            [60.086, 30.829]
        ]
    });

    MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #000000; font-weight: bold;">$[properties.iconContent]</div>'
    );

    var searchControl = new ymaps.control.SearchControl({
        options: {
            noSuggestPanel: true
        }
    });

    //var obj = document.querySelector('ymaps[class="ymaps-2-1-76-searchbox__button-cell"]');
    var btn = document.querySelector('button[id="button"]');
    btn.addEventListener('click', function (event) {
        //var txt = document.querySelector('input[id="suggest"]');
        var query = document.getElementById("suggest").value;
        var salary = document.getElementById("salary").value;
        //query = txt.getAttribute("text");
        do_query(query, salary);
    });

    do_query("Токарь", "60000");
}

function addballons(data) {
    $.each(data.items, function (key, val) {
        if (val.address != null) {
            console.log(val.address.lat + "," + val.address.lng);
            var sal;
            if (val.salary.from != null) sal = val.salary.from;
            else if (val.salary.to != null) sal = val.salary.to;
            myMap.geoObjects.add(new ymaps.Placemark([val.address.lat, val.address.lng], {
                    hintContent: '<b>' + val.employer.name + '</b><br/>'
                        + val.name + '<br/>'
                        + val.salary.from + '..' + val.salary.to,
                    iconContent: sal,
                    balloonContent: '<b>' + val.employer.name + '</b><br/>'
                        + '<a href="' + val.alternate_url + '" target="_blank">' + val.name + '</a><br/>'
                        + val.salary.from + '..' + val.salary.to
                        + '</br><a href="https://meet.google.com/hga-tzxn-fgq" target="_blank">HR отдел онлайн</a>'
                        //+ '<br/>' + val.code
                },
                {
                    preset: 'islands#circleDotIcon',
                    iconColor: 'green',
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#imageWithContent',
                    // Своё изображение иконки метки.
                    //iconImageHref: 'images/ball.png',
                    // Размеры метки.
                    iconImageSize: [48, 48],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-24, -24],
                    // Смещение слоя с содержимым относительно слоя с картинкой.
                    iconContentOffset: [8, 10],
                    // Макет содержимого.
                    iconContentLayout: MyIconContentLayout

                }));
        }
    });
}

function addpage(i, q, s) {
    console.log(i);
    $.getJSON("https://api.hh.ru/vacancies?area=2&only_with_salary=true&salary=" + s + "&page=" + i + "&text=" + q, function (data) {
        addballons(data);
    });
}

function do_query(q, s) {
    console.log(q);
    myMap.geoObjects.removeAll();
    $.getJSON("https://api.hh.ru/vacancies?area=2&only_with_salary=true&salary=" + s + "&page=0&text=" + q, function (data) {
        var pags = data.pages;
        console.log(pags);
        addballons(data);
        for (let i = 1; i < pags; i++) addpage(i, q, s);
    });

}

