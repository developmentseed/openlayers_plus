/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_scalepoints = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_scalepoints) {
    var styles = data.map.behaviors.openlayers_plus_behavior_scalepoints.styles;
    // Collect vector layers
    var vector_layers = [];
    for (var key in data.openlayers.layers) {
      var layer = data.openlayers.layers[key];
      if (layer.isVector === true) {
        var styleMap = layer.styleMap;
        styleMap.addUniqueValueRules("default", "weight", styles);
        layer.redraw();
        vector_layers.push(layer);
      }
    }
    /**
     * This attempts to fix a problem in IE7 in which points
     * are not displayed until the map is moved. 
     *
     * Since namespaces is filled neither on window.load nor
     * document.ready, and testing it is unsafe, this renders
     * map layers after 500 milliseconds.
     */
    if($.browser.msie) {
      setTimeout(function() {
        $.each(data.openlayers.getLayersByClass('OpenLayers.Layer.Vector'),
        function() {
          this.redraw();
        });
      }, 500);
    }
  }
};
