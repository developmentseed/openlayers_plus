var OpenLayersWaxZoomOnLoad = function(opts, lon, lat, zoom) {
    if (opts) {
        pt = new OpenLayers.LonLat(lon, lat);
        pt.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
        $(opts).data('map').setCenter(pt, zoom);
    }
}
