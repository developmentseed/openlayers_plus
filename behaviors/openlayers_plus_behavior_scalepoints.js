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
  }
};
