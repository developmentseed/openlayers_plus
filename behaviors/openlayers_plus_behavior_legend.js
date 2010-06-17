/**
 * Implementation of Drupal behavior.
 */
Drupal.behaviors.openlayers_plus_behavior_legend = function(context) {
  Drupal.OpenLayersPlusLegend.attach(context);
};

Drupal.OpenLayersPlusLegend = {};

Drupal.OpenLayersPlusLegend.attach = function(context) {
  var data = $(context).data('openlayers');
  if (data && data.map.behaviors.openlayers_plus_behavior_legend) {
    var layer, i;
    for (i in data.openlayers.layers) {
      layer = data.openlayers.layers[i];
      if (data.map.behaviors.openlayers_plus_behavior_legend[layer.drupalID]) {
        if (!$('div.openlayers-legends', context).size()) {
          $(context).append("<div class='openlayers-legends'></div>");
        }
        layer.events.register('visibilitychanged', layer, Drupal.OpenLayersPlusLegend.setLegend);

        // Trigger the setLegend() method at attach time. We don't know whether
        // our behavior is being called after the map has already been drawn.
        Drupal.OpenLayersPlusLegend.setLegend(layer);
      }
    }
  }
};

Drupal.OpenLayersPlusLegend.setLegend = function(layer) {
  // The layer param may vary based on the context from which we are called.
  layer = layer.object ? layer.object : layer;

  var name = layer.drupalID;
  var map = $(layer.map.div);
  var data = map.data('openlayers');
  var legend = data.map.behaviors.openlayers_plus_behavior_legend[name];
  var legends = $('div.openlayers-legends', map);
  if (layer.visibility && $('#openlayers-legend-'+ name, legends).size() === 0) {
    legends.append(legend);
  }
  else if (!layer.visibility) {
    $('#openlayers-legend-'+name, legends).remove();
  }
};
