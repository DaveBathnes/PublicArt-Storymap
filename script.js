var imageContainerMargin = 70;  // Margin + padding

// This watches for the scrollable container
var scrollPosition = 0;
$('div#contents').scroll(function () {
    scrollPosition = $(this).scrollTop();
});

function initMap() {

    // This creates the Leaflet map with a generic start point, because code at bottom automatically fits bounds to all markers
    var map = L.map('map', {
        center: [0, 0],
        zoom: 5,
        maxZoom: 18,
        scrollWheelZoom: false
    });

    // This displays a base layer map (other options available)
    var lightAll = new L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGlicmFyaWVzaGFja2VkIiwiYSI6IlctaDdxSm8ifQ.bxf1OpyYLiriHsZN33TD2A', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    // This customizes link to view source code; add your own GitHub repository
    map.attributionControl.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-storymap" target="_blank">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

    var markers = [];
    // This loads the GeoJSON map data file from a local folder
    $.getJSON('https://data.bathhacked.org/resource/ku52-eiv3.json', function (data) {
        $.each(data, function (i, art) {
            if (art.location && art.location.coordinates) {

                if (i == 0) map.setView([art.location.coordinates[1], art.location.coordinates[0]], 16);

                var chapter = $('<p></p>', {
                    text: art.title,
                    class: 'chapter-header'
                });

                var image = $('<img>', {
                    src: 'http://www.bathnes.gov.uk/sites/default/files/publicart/fullsize/' + art.reference + '-a.jpg',
                });

                var source = $('<a>', {
                    text: 'Copyright Bath and North East Somerset Council',
                    href: 'http://www.bathnes.gov.uk/publicartcatalogue',
                    target: "_blank",
                    class: 'source'
                });

                var description = $('<p></p>', {
                    text: art.description,
                    class: 'description'
                });

                var container = $('<div></div>', {
                    id: 'container' + i,
                    class: 'image-container'
                });

                var imgHolder = $('<div></div>', {
                    class: 'img-holder'
                });

                var imgLink = $('<a href="' + 'http://www.bathnes.gov.uk/sites/default/files/publicart/fullsize/' + art.reference + '-a.jpg' + '" data-lightbox="image-' + i + '" data-title="' + art.title + '"></a>');
                imgLink.append(image);

                imgHolder.append(imgLink);

                container.append(chapter).append(imgHolder).append(source).append(description);
                $('#contents').append(container);

                var x;
                var areaTop = -100;
                var areaBottom = 0;

                // Calculating total height of blocks above active
                for (x = 1; x < i; x++) {
                    areaTop += $('div#container' + x).height() + imageContainerMargin;
                }

                areaBottom = areaTop + $('div#container' + i).height();

                $('div#contents').scroll(function () {
                    if ($(this).scrollTop() >= areaTop && $(this).scrollTop() < areaBottom) {
                        $('.image-container').removeClass("inFocus").addClass("outFocus");
                        $('div#container' + i).addClass("inFocus").removeClass("outFocus");
                        map.flyTo([art.location.coordinates[1], art.location.coordinates[0]], 18);
                    }
                });

                // Add the marker and make it clickable.
                var marker = L.marker([art.location.coordinates[1], art.location.coordinates[0]]);
                marker.on('click', function () {
                    $("div#contents").animate({ scrollTop: areaTop + "px" });
                });
                markers.push(marker);
            }
        });
        var group = new L.featureGroup(markers).addTo(map);
        $('div#container0').addClass("inFocus");
        $('#contents').append("<div class='space-at-the-bottom'><a href='#space-at-the-top'><i class='fa fa-chevron-up'></i></br><small>Top</small></a></div>");
    });
}

initMap();