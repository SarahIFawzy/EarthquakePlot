let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

d3.json(queryUrl).then(function (data) {
    console.log(data);


    let myMap = L.map("map", {
        center: [0, 10],
        zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    
    let earthquakes = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            var depth = feature.geometry.coordinates[2];
            var depthColor = `rgba(200, 0, 50, ${depth / 100})`;

            return L.circleMarker(latlng, {
                radius: Math.pow(2, feature.properties.mag) * 1.1,
                fillColor: depthColor,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });
    
    let colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C'];
   
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [0, 10, 20, 50, 100, 200];
  
        let labels = [];
    
        // Add title to the legend
        let legendInfo = "<h4>Earthquake Depths</h4>";
        div.innerHTML = legendInfo;
    
        // Add color labels to the legend
        limits.forEach(function(limit, index) {
            labels.push(
                '<i style="background:' + colors[index] + '"></i> ' +
                limit + (limits[index + 1] ? '&ndash;' + limits[index + 1] + '<br>' : '+')
            );
        });
    
        div.innerHTML += '<div>' + labels.join('') + '</div>';
        return div;
    };
    
    // Add the legend to the map
    legend.addTo(myMap);

});